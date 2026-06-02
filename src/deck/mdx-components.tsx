// The component map handed to MDXProvider. It (1) styles raw markdown elements with
// brand classes and (2) exposes the slot + component vocabulary, so slide .mdx files
// never need an import line.

import * as React from "react";
import { Left, Right, Top, Bottom, Center, Block } from "./slots/slots";
import { CodeBlock, type CodeLanguage } from "./components/CodeBlock";
import { Terminal, Chrome } from "./components/Terminal";
import { Image } from "./components/Image";
import { Icon } from "./components/Icon";
import { QR } from "./components/QR";
import { Callout } from "./components/Callout";
import { Stat } from "./components/Stat";
import { Link } from "./components/Link";
import { Rule } from "./components/Rule";
import { Carousel } from "./components/Carousel";

function langOf(className?: string): CodeLanguage {
  const m = /language-(\w+)/.exec(className ?? "");
  const lang = m?.[1];
  return lang === "python" || lang === "sql" ? lang : "log";
}

export const MDX_COMPONENTS = {
  // markdown → brand typography
  h1: (p: any) => <div className="headline-lg" data-anim="fade-up" {...p} />,
  h2: (p: any) => <div className="headline-md" data-anim="fade-up" {...p} />,
  h3: (p: any) => <div className="eyebrow" data-anim="fade-left" {...p} />,
  p: (p: any) => <div className="body-md" data-anim="fade-up" {...p} />,
  ul: (p: any) => <ul data-anim="fade-up" {...p} />,
  a: (p: any) => <a target="_blank" rel="noreferrer" {...p} />,
  hr: () => <Rule />,
  blockquote: (p: any) => <Callout {...p} />,
  // inline vs fenced code
  code: (p: any) => <code className="inline" {...p} />,
  pre: ({ children }: any) => {
    const codeEl = React.Children.toArray(children).find(Boolean) as any;
    const text = typeof codeEl?.props?.children === "string" ? codeEl.props.children : "";
    return <CodeBlock language={langOf(codeEl?.props?.className)} code={text} />;
  },
  // slot vocabulary
  Left, Right, Top, Bottom, Center, Block,
  // component vocabulary
  CodeBlock, Terminal, Chrome, Image, Icon, QR, Callout, Stat, Link, Rule, Carousel,
};
