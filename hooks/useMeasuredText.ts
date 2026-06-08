"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { prepare, layout } from "@chenglou/pretext";

interface Options {
  whiteSpace?: "normal" | "pre-wrap";
  wordBreak?: "normal" | "keep-all";
  letterSpacing?: number;
}

// Measures wrapped text height without DOM reflow. Reads font/lineHeight from
// the element's own computed style so it stays in sync with CSS automatically.
export function useMeasuredText(text: string, options?: Options) {
  var ref = useRef<HTMLElement | null>(null);
  var [width, setWidth] = useState(0);
  var [font, setFont] = useState("");
  var [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    var el = ref.current;
    if (!el) return;
    var node = el;

    var cs = getComputedStyle(node);
    var fontStr = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    var lh = parseFloat(cs.lineHeight);
    if (!Number.isFinite(lh)) lh = parseFloat(cs.fontSize) * 1.5;
    setFont(fontStr);
    setLineHeight(lh);
    setWidth(node.getBoundingClientRect().width);

    var ro = new ResizeObserver((entries) => {
      var w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  var prepared = useMemo(() => {
    if (!text || !font) return null;
    try {
      return prepare(text, font, options);
    } catch {
      return null;
    }
  }, [text, font, options?.whiteSpace, options?.wordBreak, options?.letterSpacing]);

  var measurement = useMemo(() => {
    if (!prepared || width <= 0 || lineHeight <= 0) return null;
    return layout(prepared, width, lineHeight);
  }, [prepared, width, lineHeight]);

  return {
    ref,
    width,
    height: measurement?.height ?? null,
    lineCount: measurement?.lineCount ?? null,
  };
}
