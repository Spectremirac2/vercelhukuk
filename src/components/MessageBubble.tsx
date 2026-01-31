"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/utils/cn";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const roleLabel = role === "user" ? "Siz" : "Asistan";
  
  return (
    <article
      className={cn(
        "flex w-full mb-6",
        role === "user" ? "justify-end" : "justify-start"
      )}
      role="article"
      aria-label={`${roleLabel} mesajı`}
    >
      <div
        className={cn(
          "max-w-[85%] px-5 py-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
          role === "user"
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm"
        )}
      >
        {role === "user" ? (
          <div>{content}</div>
        ) : (
          <div className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                ul: (props) => (
                  <ul className="list-disc pl-5 my-2 space-y-1" {...props} />
                ),
                ol: (props) => (
                  <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />
                ),
                h1: (props) => (
                  <h1
                    className="text-lg font-bold my-2 text-gray-900 dark:text-gray-100"
                    {...props}
                  />
                ),
                h2: (props) => (
                  <h2
                    className="text-md font-bold my-2 text-gray-900 dark:text-gray-100"
                    {...props}
                  />
                ),
                h3: (props) => (
                  <h3
                    className="text-sm font-bold my-1 text-gray-900 dark:text-gray-100"
                    {...props}
                  />
                ),
                p: (props) => <p className="my-2" {...props} />,
                a: (props) => (
                  <a
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
                strong: (props) => (
                  <strong className="font-semibold" {...props} />
                ),
                blockquote: (props) => (
                  <blockquote
                    className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 my-2"
                    {...props}
                  />
                ),
                code: ({ className, children, ...props }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code
                        className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code
                      className={cn(
                        "block bg-gray-100 dark:bg-gray-700 p-3 rounded-lg my-2 text-sm font-mono overflow-x-auto",
                        className
                      )}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                pre: (props) => (
                  <pre
                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg my-2 overflow-x-auto"
                    {...props}
                  />
                ),
                table: (props) => (
                  <div className="overflow-x-auto my-2">
                    <table
                      className="min-w-full border border-gray-200 dark:border-gray-600 rounded-lg"
                      {...props}
                    />
                  </div>
                ),
                th: (props) => (
                  <th
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 text-left font-medium"
                    {...props}
                  />
                ),
                td: (props) => (
                  <td
                    className="px-3 py-2 border-b border-gray-200 dark:border-gray-700"
                    {...props}
                  />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </article>
  );
}
