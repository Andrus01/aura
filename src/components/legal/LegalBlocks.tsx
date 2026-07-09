import Link from "next/link";
import type { ReactNode } from "react";

export type Block =
  | { h2: string }
  | { h3: string }
  | { p: string }
  | { ul: string[] }
  | { ol: string[] }
  | { table: { head: string[]; rows: string[][] } };

type Vars = Record<string, string>;

/** Replace {token} placeholders from vars. */
function fill(text: string, vars: Vars): string {
  return text.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

/** Parse **bold** and [label](href) into React nodes. */
export function renderInline(raw: string, vars: Vars): ReactNode[] {
  const text = fill(raw, vars);
  const nodes: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      nodes.push(<strong key={key++}>{m[1]}</strong>);
    } else {
      const label = m[2];
      const href = m[3];
      if (href.startsWith("/")) {
        nodes.push(
          <Link key={key++} href={href}>
            {label}
          </Link>
        );
      } else {
        const external = href.startsWith("http");
        nodes.push(
          <a
            key={key++}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {label}
          </a>
        );
      }
    }
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export default function LegalBlocks({
  blocks,
  vars,
}: {
  blocks: Block[];
  vars: Vars;
}) {
  return (
    <>
      {blocks.map((b, i) => {
        if ("h2" in b) return <h2 key={i}>{b.h2}</h2>;
        if ("h3" in b) return <h3 key={i}>{b.h3}</h3>;
        if ("p" in b) return <p key={i}>{renderInline(b.p, vars)}</p>;
        if ("ul" in b)
          return (
            <ul key={i}>
              {b.ul.map((li, j) => (
                <li key={j}>{renderInline(li, vars)}</li>
              ))}
            </ul>
          );
        if ("ol" in b)
          return (
            <ol key={i}>
              {b.ol.map((li, j) => (
                <li key={j}>{renderInline(li, vars)}</li>
              ))}
            </ol>
          );
        if ("table" in b)
          return (
            <table key={i}>
              <thead>
                <tr>
                  {b.table.head.map((h, j) => (
                    <th key={j}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.table.rows.map((row, j) => (
                  <tr key={j}>
                    {row.map((cell, k) => (
                      <td key={k}>{renderInline(cell, vars)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        return null;
      })}
    </>
  );
}
