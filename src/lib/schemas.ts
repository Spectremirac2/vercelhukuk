// src/lib/schemas.ts - API Request/Response Validation Schemas
import { z } from "zod";

// Message role validation
export const MessageRoleSchema = z.enum(["user", "assistant"]);

// Single message validation
export const MessageSchema = z.object({
  role: MessageRoleSchema,
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(8000, "Message exceeds 8000 character limit"),
});

// AI Provider validation
export const AIProviderSchema = z.enum(["gemini", "openai"]);

// Chat request validation
export const ChatRequestSchema = z.object({
  conversationId: z.string().optional(),
  messages: z
    .array(MessageSchema)
    .min(1, "At least one message is required")
    .max(100, "Conversation exceeds 100 message limit"),
  strictMode: z.boolean().default(false),
  storeId: z.string().nullable().optional(), // Allow null values from client
  useFiles: z.boolean().default(false),
  // Multi-provider support
  provider: AIProviderSchema.optional(),
  apiKey: z.string().optional(),
  model: z.string().optional(),
});

// File upload validation
export const FileUploadSchema = z.object({
  storeId: z.string().optional(),
});

// Allowed file types
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
] as const;

export const ALLOWED_FILE_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt"] as const;

// File magic numbers for validation
export const FILE_MAGIC_NUMBERS: Record<string, number[]> = {
  "application/pdf": [0x25, 0x50, 0x44, 0x46], // %PDF
  "application/msword": [0xd0, 0xcf, 0x11, 0xe0], // DOC (OLE compound)
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    0x50, 0x4b, 0x03, 0x04,
  ], // DOCX (ZIP)
  // TXT has no magic number
};

// Source schema
export const SourceSchema = z.object({
  title: z.string(),
  uri: z.string().url().or(z.string()), // Allow non-URL URIs for file sources
  isTrusted: z.boolean().optional(),
});

// Chat response schema
export const ChatResponseSchema = z.object({
  assistantText: z.string(),
  sources: z.array(SourceSchema),
  debug: z
    .object({
      groundingMetadata: z.unknown().optional(),
      webSearchQueries: z.array(z.string()).optional(),
      strictModeRejection: z.boolean().optional(),
    })
    .optional(),
});

// Error response schema
export const ErrorResponseSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  details: z.unknown().optional(),
});

// Types derived from schemas
export type Message = z.infer<typeof MessageSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type Source = z.infer<typeof SourceSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// Validation result type
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; issues: z.core.$ZodIssue[] };

// Validation helper
export function validateChatRequest(data: unknown): ValidationResult<ChatRequest> {
  const result = ChatRequestSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const firstIssue = result.error.issues[0];
  return {
    success: false,
    error: firstIssue?.message || "Validation failed",
    issues: result.error.issues,
  };
}

// File validation helper
export function validateFileType(
  file: File,
  buffer: ArrayBuffer
): { valid: true } | { valid: false; reason: string } {
  // Check file extension
  const extension = "." + file.name.split(".").pop()?.toLowerCase();
  if (!ALLOWED_FILE_EXTENSIONS.includes(extension as typeof ALLOWED_FILE_EXTENSIONS[number])) {
    return {
      valid: false,
      reason: `Invalid file extension. Allowed: ${ALLOWED_FILE_EXTENSIONS.join(", ")}`,
    };
  }

  // Check MIME type
  if (!ALLOWED_FILE_TYPES.includes(file.type as typeof ALLOWED_FILE_TYPES[number])) {
    // Allow empty MIME type for some browsers
    if (file.type !== "" && file.type !== "application/octet-stream") {
      return {
        valid: false,
        reason: `Invalid file type: ${file.type}`,
      };
    }
  }

  // Check magic numbers for non-text files
  if (extension !== ".txt") {
    const bytes = new Uint8Array(buffer.slice(0, 4));
    const expectedMimeType = Object.entries(FILE_MAGIC_NUMBERS).find(
      ([, magic]) => magic.every((byte, i) => bytes[i] === byte)
    )?.[0];

    if (!expectedMimeType) {
      return {
        valid: false,
        reason: "File content does not match expected format",
      };
    }
  }

  return { valid: true };
}
