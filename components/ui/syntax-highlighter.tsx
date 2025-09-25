'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  // Use a theme that matches your site's design
  const codeTheme = {
    ...oneDark,
    'pre[class*="language-"]': {
      ...oneDark['pre[class*="language-"]'],
      background: 'hsl(var(--muted))',
      border: '1px solid hsl(var(--border))',
    },
    'code[class*="language-"]': {
      ...oneDark['code[class*="language-"]'],
      background: 'transparent',
    }
  };

  return (
    <div className="my-4">
      <SyntaxHighlighter
        language={language}
        style={codeTheme}
        customStyle={{
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          margin: 0,
        }}
        showLineNumbers={code.split('\n').length > 5}
        wrapLines={true}
        wrapLongLines={true}
        PreTag={({ children, ...props }) => (
          <pre {...props} className="!m-0">
            {children}
          </pre>
        )}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
