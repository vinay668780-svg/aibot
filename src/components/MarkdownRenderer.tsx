import React from 'react';

interface Props {
  content: string;
}

export function MarkdownRenderer({ content }: Props) {
  if (!content) return null;

  // Split content by lines
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  const renderInline = (text: string) => {
    // Process bold (**text**)
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-zinc-900 dark:text-zinc-100">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={i} className="text-zinc-600 dark:text-zinc-400 italic">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const flushTable = (key: number) => {
    if (tableRows.length === 0) return null;
    const header = tableRows[0];
    const rows = tableRows.slice(1);
    tableRows = [];
    inTable = false;

    return (
      <div key={`table-${key}`} className="my-3 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
          <thead className="bg-zinc-50 dark:bg-zinc-800/60 font-semibold text-zinc-800 dark:text-zinc-200">
            <tr>
              {header.map((col, idx) => (
                <th key={idx} className="px-3 py-2 text-left">
                  {renderInline(col.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                    {renderInline(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Markdown Table detection
    if (line.includes('|')) {
      const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (cells.length > 0) {
        // Skip separator row like |---|---|
        if (cells.every(c => /^[\s-:]+$/.test(c))) {
          continue;
        }
        inTable = true;
        tableRows.push(cells);
        continue;
      }
    } else if (inTable) {
      elements.push(flushTable(i));
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-2.5 mb-1 flex items-center gap-1.5">
          {renderInline(line.slice(4))}
        </h3>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-3 mb-1.5">
          {renderInline(line.slice(3))}
        </h2>
      );
      continue;
    }
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 mt-3 mb-1.5">
          {renderInline(line.slice(2))}
        </h1>
      );
      continue;
    }

    // Lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={i} className="flex items-start gap-2 my-1 text-zinc-800 dark:text-zinc-200">
          <span className="text-indigo-500 font-bold leading-relaxed shrink-0">•</span>
          <span className="flex-1 leading-relaxed">{renderInline(line.slice(2))}</span>
        </div>
      );
      continue;
    }

    // Numbered lists (1. , 2. )
    const numberedMatch = line.match(/^(\d+)\.\s(.*)/);
    if (numberedMatch) {
      elements.push(
        <div key={i} className="flex items-start gap-2 my-1 text-zinc-800 dark:text-zinc-200">
          <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs shrink-0 mt-0.5">
            {numberedMatch[1]}.
          </span>
          <span className="flex-1 leading-relaxed">{renderInline(numberedMatch[2])}</span>
        </div>
      );
      continue;
    }

    // Dividers
    if (line.trim() === '---') {
      elements.push(<hr key={i} className="my-2.5 border-zinc-200 dark:border-zinc-800" />);
      continue;
    }

    // Empty lines
    if (!line.trim()) {
      elements.push(<div key={i} className="h-1.5" />);
      continue;
    }

    // Standard paragraphs
    elements.push(
      <p key={i} className="my-1 text-zinc-800 dark:text-zinc-200 leading-relaxed">
        {renderInline(line)}
      </p>
    );
  }

  if (inTable && tableRows.length > 0) {
    elements.push(flushTable(lines.length));
  }

  return <div className="space-y-0.5">{elements}</div>;
}
