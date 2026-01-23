import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type CraftInlineMarkdownProps = {
  markdown: string;
};

const HIGHLIGHT_RE = /<highlight\s+color="([^"]+)"\s*>([\s\S]*?)<\/highlight>/gi;

function highlightClass(colorRaw: string | undefined) {
  const color = (colorRaw ?? '').toLowerCase().trim();

  // Craft gradient highlights (observed: gradient-purple/yellow/brown/red)
  if (color.startsWith('gradient-')) {
    switch (color) {
      case 'gradient-blue':
        return 'inline-block align-baseline bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 text-transparent bg-clip-text';
      case 'gradient-purple':
        return 'inline-block align-baseline bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 text-transparent bg-clip-text';
      case 'gradient-yellow':
        return 'inline-block align-baseline bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 text-transparent bg-clip-text';
      case 'gradient-brown':
        return 'inline-block align-baseline bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 text-transparent bg-clip-text';
      case 'gradient-red':
        return 'inline-block align-baseline bg-gradient-to-r from-rose-400 via-red-500 to-orange-400 text-transparent bg-clip-text';
      default:
        return 'inline-block align-baseline bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 text-transparent bg-clip-text';
    }
  }

  // Non-gradient highlight colors: render as Craft-like highlight pill (keep only horizontal padding).
  switch (color) {
    case 'yellow':
      return 'inline-block align-baseline rounded px-1 bg-yellow-500/25 text-yellow-100';
    case 'orange':
      return 'inline-block align-baseline rounded px-1 bg-orange-500/25 text-orange-100';
    case 'red':
      return 'inline-block align-baseline rounded px-1 bg-red-500/25 text-red-100';
    case 'green':
      return 'inline-block align-baseline rounded px-1 bg-emerald-500/25 text-emerald-100';
    case 'blue':
      return 'inline-block align-baseline rounded px-1 bg-sky-500/25 text-sky-100';
    case 'purple':
      return 'inline-block align-baseline rounded px-1 bg-violet-500/25 text-violet-100';
    case 'mint':
      return 'inline-block align-baseline rounded px-1 bg-emerald-500/25 text-emerald-100';
    case 'gray':
      return 'inline-block align-baseline rounded px-1 bg-white/10 text-gray-100';
    default:
      return 'inline-block align-baseline rounded px-1 bg-white/10 text-gray-100';
  }
}

function InlineMarkdown({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      // Craft sometimes emits HTML tags like <caption>...</caption>. We handle known tags
      // at a higher level; otherwise ignore raw HTML for safety and consistency.
      skipHtml
      // We render "inline" inside existing wrappers, so avoid generating <p>.
      components={{
        p: ({ children }) => <>{children}</>,
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 text-gray-100 hover:text-white"
          >
            {children}
          </a>
        ),
        strong: ({ children }) => <strong className="font-semibold text-gray-100">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        code: ({ children }) => (
          <code className="rounded bg-white/5 px-1 py-0.5 text-[0.9em] text-gray-100">{children}</code>
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}

export function CraftInlineMarkdown({ markdown }: CraftInlineMarkdownProps) {
  if (!markdown) return null;

  const parts: React.ReactNode[] = [];
  let hasOutput = false;
  let pendingSpace = false;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const emitInline = (text: string, key: string) => {
    if (!text) return;

    const hasLeadingWs = /^\s+/.test(text);
    const hasTrailingWs = /\s+$/.test(text);
    const core = text.trim();

    if (hasLeadingWs) pendingSpace = true;

    if (core.length > 0) {
      if (pendingSpace && hasOutput) {
        parts.push(' ');
      }
      pendingSpace = false;
      parts.push(<InlineMarkdown key={key} markdown={core} />);
      hasOutput = true;
    }

    if (hasTrailingWs) pendingSpace = true;
  };

  // Reset regex state for safety (global regex)
  HIGHLIGHT_RE.lastIndex = 0;

  while ((match = HIGHLIGHT_RE.exec(markdown)) !== null) {
    const full = match[0] ?? '';
    const color = match[1];
    const inner = match[2] ?? '';
    const start = match.index ?? 0;

    if (start > lastIndex) {
      emitInline(markdown.slice(lastIndex, start), `t-${lastIndex}`);
    }

    if (pendingSpace && hasOutput) {
      parts.push(' ');
      pendingSpace = false;
    }

    parts.push(
      <span key={`h-${start}`} className={highlightClass(color)}>
        <InlineMarkdown markdown={inner} />
      </span>
    );
    hasOutput = true;

    lastIndex = start + full.length;
  }

  if (lastIndex < markdown.length) {
    emitInline(markdown.slice(lastIndex), `t-${lastIndex}`);
  }

  return <>{parts}</>;
}

