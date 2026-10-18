"use client";

import { useMemo, useRef, useState } from "react";
import {
  transpose,
  type InputSeparator,
  type Mode,
  type OutputSeparator,
} from "../lib/transpose";

const SAMPLES: Record<Mode, string> = {
  lines: "John Smith\nJane Doe\nAvi Cohen\nDana Levi",
  table:
    "Month\tRevenue\tCosts\tProfit\nJul\t12400\t9100\t3300\nAug\t13950\t9800\t4150\nSep\t15200\t10250\t4950",
};

export default function Home() {
  const [mode, setMode] = useState<Mode>("table");
  const [input, setInput] = useState(SAMPLES.table);
  const [inSep, setInSep] = useState<InputSeparator>("auto");
  const [outSep, setOutSep] = useState<OutputSeparator>("same");
  const [status, setStatus] = useState("");
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const result = useMemo(
    () => transpose(input, mode, inSep, outSep),
    [input, mode, inSep, outSep],
  );

  function changeMode(next: Mode) {
    setMode(next);
    setInput(SAMPLES[next]);
    setStatus("");
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(result.text);
      setStatus("Copied.");
    } catch {
      outputRef.current?.select();
      setStatus("Output selected. Press Ctrl+C or ⌘C to copy.");
    }
  }

  return (
    <main className="tt-main">
      <header>
        <h1>Text Transpose</h1>
        <p className="tt-sub">
          Paste columns of text and get rows: a table is flipped so its columns become rows, and a
          list with one item per line becomes a single row ready for a spreadsheet.
        </p>
      </header>

      <section>
        <label className="tt-label" htmlFor="input">
          <span>Input</span>
          <span className="tt-dims">
            {result.rows ? `${result.rows} rows × ${result.cols} columns` : ""}
          </span>
        </label>
        <textarea
          id="input"
          className="tt-textarea"
          spellCheck={false}
          placeholder="Paste text here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </section>

      <div className="tt-controls">
        <div className="tt-field">
          <label htmlFor="mode">Mode</label>
          <select id="mode" value={mode} onChange={(e) => changeMode(e.target.value as Mode)}>
            <option value="table">Columns to rows</option>
            <option value="lines">Lines to one row (keep spaces)</option>
          </select>
        </div>
        {mode === "table" && (
          <div className="tt-field">
            <label htmlFor="delim">Columns are separated by</label>
            <select
              id="delim"
              value={inSep}
              onChange={(e) => setInSep(e.target.value as InputSeparator)}
            >
              <option value="auto">Auto-detect</option>
              <option value="tab">Tab</option>
              <option value="comma">Comma</option>
              <option value="semicolon">Semicolon</option>
              <option value="pipe">Pipe</option>
              <option value="space">Whitespace</option>
            </select>
          </div>
        )}
        <div className="tt-field">
          <label htmlFor="outdelim">Output separator</label>
          <select
            id="outdelim"
            value={outSep}
            onChange={(e) => setOutSep(e.target.value as OutputSeparator)}
          >
            <option value="same">{mode === "lines" ? "Tab" : "Same as input"}</option>
            {mode === "table" && <option value="tab">Tab</option>}
            <option value="comma">Comma</option>
            <option value="semicolon">Semicolon</option>
            <option value="pipe">Pipe</option>
            <option value="space">Space</option>
          </select>
        </div>
        <div className="tt-spacer" />
        <button type="button" onClick={() => changeMode(mode)}>
          Load example
        </button>
        <button type="button" className="tt-primary" onClick={copy}>
          Copy output
        </button>
      </div>

      <section>
        <label className="tt-label" htmlFor="output">
          <span>Transposed</span>
          <span className="tt-dims">
            {result.rows ? `${result.cols} rows × ${result.rows} columns` : ""}
          </span>
        </label>
        <textarea
          id="output"
          ref={outputRef}
          className="tt-textarea"
          readOnly
          spellCheck={false}
          value={result.text}
        />
        <div className="tt-status" role="status" aria-live="polite">
          {status || (mode === "table" && inSep === "auto" && result.rows
            ? result.detected === "tab" && !input.includes("\t")
              ? "No separator found: each line is one cell."
              : `Detected separator: ${result.detected === "space" ? "whitespace" : result.detected}`
            : "")}
        </div>
      </section>
    </main>
  );
}
