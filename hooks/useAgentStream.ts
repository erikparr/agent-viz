"use client";

import { useState, useCallback, useRef } from "react";
import type { AgentRun, AgentStep } from "@/lib/types";

export function useAgentStream() {
  var [run, setRun] = useState<AgentRun | null>(null);
  var abortRef = useRef<AbortController | null>(null);

  var startRun = useCallback((query: string) => {
    // Abort any existing run
    if (abortRef.current) abortRef.current.abort();

    var id = crypto.randomUUID();
    setRun({ id, query, status: "running", steps: [] });

    var controller = new AbortController();
    abortRef.current = controller;

    fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
      signal: controller.signal,
    })
      .then(async (res) => {
        var reader = res.body?.getReader();
        if (!reader) return;

        var decoder = new TextDecoder();
        var buffer = "";

        while (true) {
          var { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          var lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (var line of lines) {
            if (line.startsWith("data: ")) {
              var data = line.slice(6);
              if (data === "[DONE]") {
                setRun((prev) =>
                  prev ? { ...prev, status: "completed" } : null
                );
                return;
              }
              try {
                var step = JSON.parse(data) as AgentStep;
                setRun((prev) =>
                  prev
                    ? { ...prev, steps: [...prev.steps, step] }
                    : null
                );
              } catch (e) {
                console.warn("Failed to parse SSE event:", data);
              }
            }
          }
        }

        setRun((prev) =>
          prev && prev.status === "running"
            ? { ...prev, status: "completed" }
            : prev
        );
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setRun((prev) =>
            prev
              ? { ...prev, status: "error", error: err.message }
              : null
          );
        }
      });
  }, []);

  var reset = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setRun(null);
  }, []);

  return { run, startRun, reset };
}
