'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/cn';

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
}

export default function MarkdownRenderer({ content, isStreaming, className }: MarkdownRendererProps) {
  return (
    <div className={cn('text-[15px] leading-[1.75] text-[#ececec]', isStreaming && 'stream-cursor', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // ── Paragraphs ──────────────────────────────────────────────────────
          p: ({ children }) => (
            <p className="mb-3 last:mb-0 leading-[1.75]">{children}</p>
          ),

          // ── Headings ────────────────────────────────────────────────────────
          h1: ({ children }) => (
            <h1 className="text-[20px] font-bold mb-3 mt-5 first:mt-0 text-[#ececec] border-b border-[#1e3025] pb-1">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-[17px] font-semibold mb-2 mt-4 first:mt-0 text-[#ececec]">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-[15px] font-semibold mb-2 mt-3 first:mt-0 text-[#d4d4d4]">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-[14px] font-semibold mb-1 mt-2 first:mt-0 text-[#c0c0c0]">{children}</h4>
          ),

          // ── Bold / Italic ────────────────────────────────────────────────────
          strong: ({ children }) => (
            <strong className="font-semibold text-[#ececec]">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[#d4d4d4]">{children}</em>
          ),

          // ── Lists ────────────────────────────────────────────────────────────
          ul: ({ children }) => (
            <ul className="mb-3 pl-5 list-disc space-y-1 last:mb-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 pl-5 list-decimal space-y-1 last:mb-0">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-[1.65] pl-0.5">{children}</li>
          ),

          // ── Code blocks ──────────────────────────────────────────────────────
          pre: ({ children }) => (
            <div className="my-3 rounded-lg border border-[#1e3025] overflow-hidden">
              <pre className="p-3 bg-[#0d1710] overflow-x-auto text-[13px] font-mono leading-relaxed whitespace-pre">
                {children}
              </pre>
            </div>
          ),
          // Handles both inline and block code.
          // Block code: multiline OR has a language className.
          // Inline code: single line, no language class.
          code: ({ node, children, className: langClass, ...props }: any) => {
            const isBlock = langClass?.startsWith('language-') ||
              (node?.position?.start?.line !== node?.position?.end?.line);
            if (isBlock) {
              return (
                <code className={cn('text-[#a8d8a8]', langClass)} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code
                className="px-[5px] py-[2px] rounded text-[13px] font-mono bg-[#0d1710] border border-[#1e3025] text-[#a8d8a8]"
                {...props}
              >
                {children}
              </code>
            );
          },

          // ── Tables ───────────────────────────────────────────────────────────
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-lg border border-[#2d4035]">
              <table className="min-w-full text-[13px] border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#152219]">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody>{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-[#1e3025] last:border-0">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left text-[11px] font-semibold text-[#8e8e8e] uppercase tracking-wide whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-[#d4d4d4]">{children}</td>
          ),

          // ── Blockquote ───────────────────────────────────────────────────────
          blockquote: ({ children }) => (
            <blockquote className="my-3 pl-3 border-l-2 border-[#3d5548] text-[#8e8e8e] italic">
              {children}
            </blockquote>
          ),

          // ── Horizontal rule ──────────────────────────────────────────────────
          hr: () => <hr className="my-4 border-[#1e3025]" />,

          // ── Links ────────────────────────────────────────────────────────────
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6c8cff] underline underline-offset-2 hover:text-[#5a7aee] transition-colors"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
