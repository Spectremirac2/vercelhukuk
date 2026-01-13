// src/lib/export.ts - Conversation export utilities

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Source {
  title: string;
  uri: string;
  isTrusted?: boolean;
}

interface ExportOptions {
  messages: Message[];
  sources?: Source[];
  format: "markdown" | "json" | "txt";
  includeTimestamp?: boolean;
  includeSources?: boolean;
}

/**
 * Export conversation to various formats
 */
export function exportConversation(options: ExportOptions): string {
  const {
    messages,
    sources = [],
    format,
    includeTimestamp = true,
    includeSources = true,
  } = options;

  switch (format) {
    case "markdown":
      return exportToMarkdown(messages, sources, includeTimestamp, includeSources);
    case "json":
      return exportToJson(messages, sources, includeTimestamp);
    case "txt":
      return exportToPlainText(messages, sources, includeTimestamp, includeSources);
    default:
      throw new Error(`Unknown export format: ${format}`);
  }
}

/**
 * Export to Markdown format
 */
function exportToMarkdown(
  messages: Message[],
  sources: Source[],
  includeTimestamp: boolean,
  includeSources: boolean
): string {
  const lines: string[] = [];

  // Header
  lines.push("# Hukuk AI Chat - Sohbet Kaydı");
  lines.push("");

  if (includeTimestamp) {
    lines.push(`**Tarih:** ${formatDate(new Date())}`);
    lines.push("");
  }

  lines.push("---");
  lines.push("");

  // Messages
  for (const msg of messages) {
    if (msg.role === "user") {
      lines.push("## Soru");
      lines.push("");
      lines.push(msg.content);
    } else {
      lines.push("## Yanıt");
      lines.push("");
      lines.push(msg.content);
    }
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  // Sources
  if (includeSources && sources.length > 0) {
    lines.push("## Kaynaklar");
    lines.push("");
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      const trustBadge = source.isTrusted ? " ✓ Resmi" : "";
      lines.push(`${i + 1}. [${source.title}](${source.uri})${trustBadge}`);
    }
    lines.push("");
  }

  // Footer
  lines.push("---");
  lines.push("");
  lines.push(
    "*Bu kayıt Hukuk AI Chat uygulaması tarafından oluşturulmuştur. Hukuki tavsiye niteliği taşımaz.*"
  );

  return lines.join("\n");
}

/**
 * Export to JSON format
 */
function exportToJson(
  messages: Message[],
  sources: Source[],
  includeTimestamp: boolean
): string {
  const data = {
    exportedAt: includeTimestamp ? new Date().toISOString() : undefined,
    application: "Hukuk AI Chat",
    version: "1.0",
    conversation: messages.map((msg, index) => ({
      index,
      role: msg.role,
      content: msg.content,
    })),
    sources: sources.map((s, index) => ({
      index: index + 1,
      title: s.title,
      uri: s.uri,
      isTrusted: s.isTrusted,
    })),
    disclaimer: "Bu kayıt hukuki tavsiye niteliği taşımaz.",
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Export to plain text format
 */
function exportToPlainText(
  messages: Message[],
  sources: Source[],
  includeTimestamp: boolean,
  includeSources: boolean
): string {
  const lines: string[] = [];

  lines.push("HUKUK AI CHAT - SOHBET KAYDI");
  lines.push("=".repeat(40));
  lines.push("");

  if (includeTimestamp) {
    lines.push(`Tarih: ${formatDate(new Date())}`);
    lines.push("");
  }

  for (const msg of messages) {
    if (msg.role === "user") {
      lines.push("SORU:");
      lines.push("-".repeat(20));
    } else {
      lines.push("YANIT:");
      lines.push("-".repeat(20));
    }
    lines.push(msg.content);
    lines.push("");
  }

  if (includeSources && sources.length > 0) {
    lines.push("KAYNAKLAR:");
    lines.push("-".repeat(20));
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      const trust = source.isTrusted ? " (Resmi)" : "";
      lines.push(`[${i + 1}] ${source.title}${trust}`);
      lines.push(`    ${source.uri}`);
    }
    lines.push("");
  }

  lines.push("=".repeat(40));
  lines.push("Bu kayıt hukuki tavsiye niteliği taşımaz.");

  return lines.join("\n");
}

/**
 * Format date in Turkish locale
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Download exported content as file
 */
export function downloadExport(
  content: string,
  format: "markdown" | "json" | "txt"
): void {
  const mimeTypes = {
    markdown: "text/markdown",
    json: "application/json",
    txt: "text/plain",
  };

  const extensions = {
    markdown: "md",
    json: "json",
    txt: "txt",
  };

  const blob = new Blob([content], { type: mimeTypes[format] });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hukuk-chat-${Date.now()}.${extensions[format]}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(content: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}
