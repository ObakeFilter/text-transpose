export type Mode = "lines" | "table";
export type InputSeparator = "auto" | "tab" | "comma" | "semicolon" | "pipe" | "space";
export type OutputSeparator = "same" | "tab" | "comma" | "semicolon" | "pipe" | "space";
type Kind = Exclude<InputSeparator, "auto">;

export const SEPARATORS: Record<Kind, string> = {
  tab: "\t",
  comma: ",",
  semicolon: ";",
  pipe: "|",
  space: " ",
};

export interface TransposeResult {
  text: string;
  rows: number;
  cols: number;
  detected: Kind;
}

export function detectSeparator(text: string): Kind {
  if (text.includes("\t")) return "tab";
  if (text.includes(",")) return "comma";
  if (text.includes(";")) return "semicolon";
  if (text.includes("|")) return "pipe";
  // No separator found: splitting on a tab leaves every line as a single cell.
  return "tab";
}

function splitLine(line: string, kind: Kind): string[] {
  if (kind === "space") {
    const trimmed = line.trim();
    return trimmed === "" ? [""] : trimmed.split(/\s+/);
  }
  return line.split(SEPARATORS[kind]);
}

/**
 * "table" (default): columns become rows and rows become columns; short rows are
 * padded with empty cells. Text with no separator is treated as a single column.
 * "lines": every line becomes one cell of a single row (newline -> separator), and
 * lines are never split further.
 */
export function transpose(
  text: string,
  mode: Mode,
  input: InputSeparator = "auto",
  output: OutputSeparator = "same",
): TransposeResult {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  while (lines.length && lines[lines.length - 1] === "") lines.pop();

  const fallback: Kind = input === "auto" ? "tab" : input;
  if (lines.length === 0) return { text: "", rows: 0, cols: 0, detected: fallback };

  if (mode === "lines") {
    const kind: Kind = output === "same" ? "tab" : output;
    return { text: lines.join(SEPARATORS[kind]), rows: lines.length, cols: 1, detected: kind };
  }

  const detected: Kind = input === "auto" ? detectSeparator(text) : input;
  const outKind: Kind = output === "same" ? detected : output;
  const grid = lines.map((line) => splitLine(line, detected));
  const width = Math.max(...grid.map((row) => row.length));
  const rows: string[] = [];
  for (let c = 0; c < width; c++) {
    rows.push(grid.map((row) => (c < row.length ? row[c] : "")).join(SEPARATORS[outKind]));
  }
  return { text: rows.join("\n"), rows: grid.length, cols: width, detected };
}
