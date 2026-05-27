// Reusable components for the deck: QR card, syntax-highlighted code blocks,
// and small duck icons for card-row slides. Pure presentation. No state.

import * as React from "react";

/* ── QR card ─────────────────────────────────────────────────────────────── */

export function QrCard({
  src,
  label = "Follow along",
  url,
  compact = false,
  size,
}: {
  src: string;
  label?: string;
  url: string;
  compact?: boolean;
  size?: number | string;
}) {
  return (
    <div className="qr-card" style={{ width: compact ? "min-content" : undefined }}>
      <img
        src={`${import.meta.env.BASE_URL}${src}`}
        alt={`QR code for ${url}`}
        style={size ? { width: size, height: size } : undefined}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div className="eyebrow" style={{ color: "var(--ink)", lineHeight: 1 }}>{label}</div>
        <div className="body-sm" style={{ fontFamily: "var(--mono)", color: "var(--muted)", lineHeight: 1.25 }}>
          {url}
        </div>
      </div>
    </div>
  );
}

/* ── Syntax highlighting ─────────────────────────────────────────────────────
   Two tiny, dependency-free tokenizers. Good enough for slide-sized snippets:
   strings, comments, keywords, numbers, function names. */

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
    // comments
    if (c === "#") {
      const end = src.indexOf("\n", i);
      const stop = end === -1 ? src.length : end;
      tokens.push({ kind: "com", text: src.slice(i, stop) });
      i = stop;
      continue;
    }
    // strings
    if (c === '"' || c === "'") {
      const quote = c;
      let j = i + 1;
      while (j < src.length && src[j] !== quote) {
        if (src[j] === "\\") j++;
        j++;
      }
      tokens.push({ kind: "str", text: src.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    // numbers
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < src.length && /[0-9.]/.test(src[j])) j++;
      tokens.push({ kind: "num", text: src.slice(i, j) });
      i = j;
      continue;
    }
    // identifiers / keywords
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++;
      const word = src.slice(i, j);
      let kind = "id";
      if (PY_KEYWORDS.has(word)) kind = "kw";
      else if (PY_BUILTINS.has(word)) kind = "bi";
      else if (src[j] === "(") kind = "fn";
      tokens.push({ kind, text: word });
      i = j;
      continue;
    }
    // whitespace / punctuation passthrough
    tokens.push({ kind: "punct", text: c });
    i++;
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
    // -- comments
    if (c === "-" && src[i + 1] === "-") {
      const end = src.indexOf("\n", i);
      const stop = end === -1 ? src.length : end;
      tokens.push({ kind: "com", text: src.slice(i, stop) });
      i = stop;
      continue;
    }
    // strings (single quoted)
    if (c === "'") {
      let j = i + 1;
      while (j < src.length && src[j] !== "'") {
        if (src[j] === "\\") j++;
        j++;
      }
      tokens.push({ kind: "str", text: src.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    // jinja {{ ... }}
    if (c === "{" && src[i + 1] === "{") {
      const end = src.indexOf("}}", i);
      const stop = end === -1 ? src.length : end + 2;
      tokens.push({ kind: "jinja", text: src.slice(i, stop) });
      i = stop;
      continue;
    }
    // numbers
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < src.length && /[0-9.,]/.test(src[j])) j++;
      tokens.push({ kind: "num", text: src.slice(i, j) });
      i = j;
      continue;
    }
    // identifiers / keywords
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++;
      const word = src.slice(i, j);
      const upper = word.toUpperCase();
      let kind = "id";
      if (SQL_KEYWORDS.has(upper)) kind = "kw";
      else if (src[j] === "(") kind = "fn";
      tokens.push({ kind, text: word });
      i = j;
      continue;
    }
    tokens.push({ kind: "punct", text: c });
    i++;
  }
  return tokens;
}

const TOKEN_STYLES: Record<string, React.CSSProperties> = {
  kw:    { color: "#D63B6A" },          // keywords - watermelon-ish
  fn:    { color: "#0E7F73" },          // function names - garden
  bi:    { color: "#9560BD" },          // python builtins
  str:   { color: "#16AA98" },          // strings - garden
  num:   { color: "#B66400" },          // numbers - duck/orange
  com:   { color: "#888888", fontStyle: "italic" },
  jinja: { color: "#B66400" },
  id:    { color: "var(--ink)" },
  punct: { color: "var(--ink)" },
};

export function CodeBlock({
  language,
  code,
}: {
  language: "python" | "sql" | "log";
  code: string;
}) {
  const tokens = language === "python"
    ? tokenizePython(code)
    : language === "sql"
      ? tokenizeSql(code)
      : null;

  if (!tokens) {
    return <div className="chrome-body chrome-body--code">{code}</div>;
  }
  return (
    <div className="chrome-body chrome-body--code">
      {tokens.map((t, i) => (
        <span key={i} style={TOKEN_STYLES[t.kind]}>{t.text}</span>
      ))}
    </div>
  );
}

/* ── Duck icons ─────────────────────────────────────────────────────────── */
/* Real MotherDuck design-plugin SVGs, copied into public/duck-icons. */

const DUCK_ICONS: Record<string, string> = {
  extract: "duck-icons/extract.svg",
  correct: "duck-icons/correct.svg",
  observe: "duck-icons/observe.svg",
  compile: "duck-icons/compile.svg",
  wrap:    "duck-icons/wrap.svg",
  evaluate:"duck-icons/evaluate.svg",
  promote: "duck-icons/promote.svg",
  operate: "duck-icons/operate.svg",
  mcp:     "duck-icons/mcp.svg",
  hybrid:  "duck-icons/hybrid.svg",
  perUser: "duck-icons/per-user-db.svg",
  dives:   "duck-icons/dives.svg",
};

export function DuckIcon({ kind, size = 80 }: { kind: string; size?: number }) {
  const src = DUCK_ICONS[kind];
  if (!src) return null;
  return (
    <img
      src={`${import.meta.env.BASE_URL}${src}`}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      style={{ display: "block", width: size, height: size, objectFit: "contain" }}
    />
  );
}
