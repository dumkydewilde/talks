// Dependency-free syntax highlighting for slide-sized snippets. Good enough for
// Python, SQL (with jinja), and plain logs. Used directly as <CodeBlock language="sql">
// or indirectly via fenced code blocks in MDX (see mdx-components).

import * as React from "react";

type Token = { kind: string; text: string };

const PY_KEYWORDS = new Set([
  "def","return","while","for","if","elif","else","in","not","and","or","is",
  "import","from","as","class","try","except","finally","with","pass","break",
  "continue","lambda","True","False","None","yield","raise","global","nonlocal",
]);
const PY_BUILTINS = new Set([
  "len","range","print","list","dict","tuple","set","int","str","float","bool",
  "json","loads","dumps","enumerate","map","filter","zip","open","type",
]);

function tokenizePython(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === "#") { const end = src.indexOf("\n", i); const stop = end === -1 ? src.length : end; tokens.push({ kind: "com", text: src.slice(i, stop) }); i = stop; continue; }
    if (c === '"' || c === "'") { const q = c; let j = i + 1; while (j < src.length && src[j] !== q) { if (src[j] === "\\") j++; j++; } tokens.push({ kind: "str", text: src.slice(i, j + 1) }); i = j + 1; continue; }
    if (/[0-9]/.test(c)) { let j = i; while (j < src.length && /[0-9.]/.test(src[j])) j++; tokens.push({ kind: "num", text: src.slice(i, j) }); i = j; continue; }
    if (/[A-Za-z_]/.test(c)) { let j = i; while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++; const word = src.slice(i, j); let kind = "id"; if (PY_KEYWORDS.has(word)) kind = "kw"; else if (PY_BUILTINS.has(word)) kind = "bi"; else if (src[j] === "(") kind = "fn"; tokens.push({ kind, text: word }); i = j; continue; }
    tokens.push({ kind: "punct", text: c }); i++;
  }
  return tokens;
}

const SQL_KEYWORDS = new Set([
  "SELECT","FROM","WHERE","GROUP","BY","ORDER","HAVING","LIMIT","JOIN","LEFT",
  "RIGHT","INNER","OUTER","ON","AS","AND","OR","NOT","NULL","IS","IN","CASE",
  "WHEN","THEN","ELSE","END","INSERT","INTO","UPDATE","SET","DELETE","CREATE",
  "TABLE","VIEW","ALTER","DROP","COMMENT","COLUMN","WITH","UNION","ALL","DISTINCT",
  "CAST","INT","BIGINT","FLOAT","TEXT","VARCHAR","BOOLEAN","DATE","TIMESTAMP",
]);

function tokenizeSql(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === "-" && src[i + 1] === "-") { const end = src.indexOf("\n", i); const stop = end === -1 ? src.length : end; tokens.push({ kind: "com", text: src.slice(i, stop) }); i = stop; continue; }
    if (c === "'") { let j = i + 1; while (j < src.length && src[j] !== "'") { if (src[j] === "\\") j++; j++; } tokens.push({ kind: "str", text: src.slice(i, j + 1) }); i = j + 1; continue; }
    if (c === "{" && src[i + 1] === "{") { const end = src.indexOf("}}", i); const stop = end === -1 ? src.length : end + 2; tokens.push({ kind: "jinja", text: src.slice(i, stop) }); i = stop; continue; }
    if (/[0-9]/.test(c)) { let j = i; while (j < src.length && /[0-9.,]/.test(src[j])) j++; tokens.push({ kind: "num", text: src.slice(i, j) }); i = j; continue; }
    if (/[A-Za-z_]/.test(c)) { let j = i; while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++; const word = src.slice(i, j); const upper = word.toUpperCase(); let kind = "id"; if (SQL_KEYWORDS.has(upper)) kind = "kw"; else if (src[j] === "(") kind = "fn"; tokens.push({ kind, text: word }); i = j; continue; }
    tokens.push({ kind: "punct", text: c }); i++;
  }
  return tokens;
}

const TOKEN_STYLES: Record<string, React.CSSProperties> = {
  kw: { color: "#D63B6A" },
  fn: { color: "#0E7F73" },
  bi: { color: "#9560BD" },
  str: { color: "#16AA98" },
  num: { color: "#B66400" },
  com: { color: "#888888", fontStyle: "italic" },
  jinja: { color: "#B66400" },
  id: { color: "var(--ink)" },
  punct: { color: "var(--ink)" },
};

export type CodeLanguage = "python" | "sql" | "log";

// `log` is a transcript, not source: render inline markdown (**bold**, `code`)
// while preserving whitespace, so prompts like "> **User**:" come out formatted.
function renderLogMarkdown(src: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|`([^`]+)`/g;
  let last = 0, m: RegExpExecArray | null, key = 0;
  while ((m = re.exec(src))) {
    if (m.index > last) nodes.push(src.slice(last, m.index));
    if (m[1] !== undefined) nodes.push(<strong key={key++}>{m[1]}</strong>);
    else nodes.push(<span key={key++} style={{ color: "#16AA98" }}>{m[2]}</span>);
    last = re.lastIndex;
  }
  if (last < src.length) nodes.push(src.slice(last));
  return nodes;
}

export function CodeBlock({ language = "log", code, children }: { language?: CodeLanguage; code?: string; children?: string }) {
  const src = (code ?? (typeof children === "string" ? children : "")).replace(/\n$/, "");
  const tokens = language === "python" ? tokenizePython(src) : language === "sql" ? tokenizeSql(src) : null;
  if (!tokens) return <div className="chrome-body chrome-body--code">{renderLogMarkdown(src)}</div>;
  return (
    <div className="chrome-body chrome-body--code">
      {tokens.map((t, i) => <span key={i} style={TOKEN_STYLES[t.kind]}>{t.text}</span>)}
    </div>
  );
}
