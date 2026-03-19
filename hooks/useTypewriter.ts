"use client";

import { useState, useEffect, useRef } from "react";

export function useTypewriter(text: string, speed: number = 20) {
  var [displayed, setDisplayed] = useState("");
  var [done, setDone] = useState(false);
  var indexRef = useRef(0);
  var textRef = useRef(text);

  useEffect(() => {
    // If text changed, reset
    if (textRef.current !== text) {
      textRef.current = text;
      indexRef.current = 0;
      setDisplayed("");
      setDone(false);
    }

    if (indexRef.current >= text.length) {
      setDone(true);
      return;
    }

    var timer = setInterval(() => {
      indexRef.current++;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        setDone(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayed, done };
}

export function useTypewriterLines(lines: string[], speed: number = 15) {
  var [state, setState] = useState({ lineIndex: 0, charIndex: 0 });
  var [displayedLines, setDisplayedLines] = useState<string[]>([]);
  var [done, setDone] = useState(false);
  var linesRef = useRef(lines);
  var hasStarted = useRef(false);

  useEffect(() => {
    // Reset if lines change
    var linesChanged = lines.length !== linesRef.current.length ||
      lines.some((l, i) => l !== linesRef.current[i]);

    if (linesChanged || !hasStarted.current) {
      linesRef.current = lines;
      hasStarted.current = true;
      setState({ lineIndex: 0, charIndex: 0 });
      setDisplayedLines([]);
      setDone(false);
    }
  }, [lines]);

  useEffect(() => {
    if (done) return;
    var { lineIndex, charIndex } = state;

    if (lineIndex >= lines.length) {
      setDone(true);
      return;
    }

    var currentLine = lines[lineIndex];

    if (charIndex >= currentLine.length) {
      // Move to next line
      setState({ lineIndex: lineIndex + 1, charIndex: 0 });
      return;
    }

    var timer = setTimeout(() => {
      setDisplayedLines((prev) => {
        var next = [...prev];
        next[lineIndex] = currentLine.slice(0, charIndex + 1);
        return next;
      });
      setState({ lineIndex, charIndex: charIndex + 1 });
    }, speed);

    return () => clearTimeout(timer);
  }, [state, lines, speed, done]);

  return { displayedLines, done };
}
