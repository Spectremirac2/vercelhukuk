/**
 * Conversation Memory System
 * Implements multi-turn context tracking with semantic summarization
 *
 * Features:
 * - Conversation history persistence
 * - Automatic summarization for long histories
 * - Context window management
 * - Session management
 */

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: {
    sources?: Array<{ title: string; uri: string }>;
    verificationScore?: number;
    tokens?: number;
  };
}

export interface ConversationSummary {
  mainTopics: string[];
  keyEntities: string[];
  conclusions: string[];
  lastUpdated: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  summary?: ConversationSummary;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    totalTokens?: number;
    messageCount: number;
    legalTopics?: string[];
  };
}

export interface UserSession {
  userId: string;
  conversations: Map<string, Conversation>;
  activeConversationId?: string;
  preferences: {
    strictMode: boolean;
    preferredLawAreas: string[];
    language: string;
  };
  createdAt: Date;
  lastActiveAt: Date;
}

// Configuration
const MAX_CONTEXT_MESSAGES = 10; // Max messages to include in context
const MAX_CONTEXT_TOKENS = 4000; // Approximate token limit
const SUMMARIZE_THRESHOLD = 20; // Summarize after this many messages
const AVG_CHARS_PER_TOKEN = 4; // Rough estimate for Turkish

/**
 * In-memory conversation store (can be replaced with Redis/DB)
 */
class ConversationStore {
  private conversations: Map<string, Conversation> = new Map();
  private sessions: Map<string, UserSession> = new Map();

  // Conversation CRUD
  createConversation(id: string, title?: string): Conversation {
    const conversation: Conversation = {
      id,
      title: title || `Sohbet ${new Date().toLocaleDateString("tr-TR")}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        messageCount: 0,
      },
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  getConversation(id: string): Conversation | undefined {
    return this.conversations.get(id);
  }

  getOrCreateConversation(id: string): Conversation {
    return this.getConversation(id) || this.createConversation(id);
  }

  updateConversation(id: string, updates: Partial<Conversation>): void {
    const conversation = this.conversations.get(id);
    if (conversation) {
      Object.assign(conversation, updates, { updatedAt: new Date() });
    }
  }

  deleteConversation(id: string): boolean {
    return this.conversations.delete(id);
  }

  listConversations(limit = 50): Conversation[] {
    return Array.from(this.conversations.values())
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit);
  }

  // Message operations
  addMessage(conversationId: string, message: Omit<Message, "id" | "timestamp">): Message {
    const conversation = this.getOrCreateConversation(conversationId);

    const fullMessage: Message = {
      ...message,
      id: generateMessageId(),
      timestamp: new Date(),
    };

    conversation.messages.push(fullMessage);
    conversation.updatedAt = new Date();
    if (conversation.metadata) {
      conversation.metadata.messageCount = conversation.messages.length;
    }

    return fullMessage;
  }

  getMessages(conversationId: string): Message[] {
    return this.conversations.get(conversationId)?.messages || [];
  }

  // Session management
  getOrCreateSession(userId: string): UserSession {
    let session = this.sessions.get(userId);
    if (!session) {
      session = {
        userId,
        conversations: new Map(),
        preferences: {
          strictMode: false,
          preferredLawAreas: [],
          language: "tr",
        },
        createdAt: new Date(),
        lastActiveAt: new Date(),
      };
      this.sessions.set(userId, session);
    }
    session.lastActiveAt = new Date();
    return session;
  }
}

// Singleton store instance
export const conversationStore = new ConversationStore();

/**
 * Generate unique message ID
 */
function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Estimate token count (rough approximation)
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / AVG_CHARS_PER_TOKEN);
}

/**
 * Build context for LLM from conversation history
 * Implements sliding window with summarization
 */
export function buildContext(
  conversation: Conversation,
  options: {
    maxMessages?: number;
    maxTokens?: number;
    includeSummary?: boolean;
  } = {}
): { messages: Message[]; summary?: string; tokenCount: number } {
  const {
    maxMessages = MAX_CONTEXT_MESSAGES,
    maxTokens = MAX_CONTEXT_TOKENS,
    includeSummary = true,
  } = options;

  const allMessages = conversation.messages;
  const contextMessages: Message[] = [];
  let tokenCount = 0;

  // Start from most recent and work backwards
  for (let i = allMessages.length - 1; i >= 0; i--) {
    const message = allMessages[i];
    const messageTokens = estimateTokens(message.content);

    if (
      contextMessages.length >= maxMessages ||
      tokenCount + messageTokens > maxTokens
    ) {
      break;
    }

    contextMessages.unshift(message);
    tokenCount += messageTokens;
  }

  // Include summary if available and there are older messages
  let summaryText: string | undefined;
  if (includeSummary && conversation.summary && contextMessages.length < allMessages.length) {
    summaryText = formatSummaryForContext(conversation.summary);
    tokenCount += estimateTokens(summaryText);
  }

  return {
    messages: contextMessages,
    summary: summaryText,
    tokenCount,
  };
}

/**
 * Format summary for inclusion in context
 */
function formatSummaryForContext(summary: ConversationSummary): string {
  const parts: string[] = ["[Önceki Konuşma Özeti]"];

  if (summary.mainTopics.length > 0) {
    parts.push(`Konular: ${summary.mainTopics.join(", ")}`);
  }

  if (summary.keyEntities.length > 0) {
    parts.push(`Önemli Referanslar: ${summary.keyEntities.join(", ")}`);
  }

  if (summary.conclusions.length > 0) {
    parts.push(`Önceki Sonuçlar: ${summary.conclusions.join("; ")}`);
  }

  return parts.join("\n");
}

/**
 * Generate conversation summary using simple extraction
 * (In production, this would use an LLM)
 */
export function generateSummary(messages: Message[]): ConversationSummary {
  const mainTopics: Set<string> = new Set();
  const keyEntities: Set<string> = new Set();
  const conclusions: string[] = [];

  // Legal topic patterns
  const topicPatterns: Array<{ pattern: RegExp; topic: string }> = [
    { pattern: /iş\s*(hukuk|kanun|sözleşme)/gi, topic: "İş Hukuku" },
    { pattern: /ceza\s*(hukuk|kanun|dava)/gi, topic: "Ceza Hukuku" },
    { pattern: /ticaret\s*(hukuk|kanun)/gi, topic: "Ticaret Hukuku" },
    { pattern: /idare\s*(hukuk|mahkeme)/gi, topic: "İdare Hukuku" },
    { pattern: /aile\s*(hukuk|mahkeme)|boşanma|velayet/gi, topic: "Aile Hukuku" },
    { pattern: /miras|tereke|vasiyet/gi, topic: "Miras Hukuku" },
    { pattern: /kişisel\s*veri|kvkk|gdpr/gi, topic: "Veri Koruma Hukuku" },
    { pattern: /vergi|kdv|gelir\s*vergisi/gi, topic: "Vergi Hukuku" },
    { pattern: /sözleşme|borç|tazminat/gi, topic: "Borçlar Hukuku" },
    { pattern: /taşınmaz|gayrimenkul|tapu/gi, topic: "Gayrimenkul Hukuku" },
  ];

  // Entity patterns
  const entityPatterns = [
    /\d{4,5}\s*sayılı\s*(?:Kanun|[A-ZÇĞİÖŞÜ]+)/gi,
    /madde\s*\d+/gi,
    /Yargıtay\s*\d+\.\s*(?:Hukuk|Ceza)\s*Dairesi/gi,
    /\d{4}\/\d+\s*[EK]\.?/gi,
  ];

  for (const message of messages) {
    const content = message.content;

    // Extract topics
    for (const { pattern, topic } of topicPatterns) {
      if (pattern.test(content)) {
        mainTopics.add(topic);
      }
    }

    // Extract entities
    for (const pattern of entityPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(m => keyEntities.add(m.trim()));
      }
    }

    // Extract conclusions from assistant messages
    if (message.role === "assistant") {
      // Look for conclusion patterns
      const conclusionPatterns = [
        /sonuç\s*olarak[^.]+\./gi,
        /özetle[^.]+\./gi,
        /(?:bu\s*nedenle|dolayısıyla)[^.]+\./gi,
      ];

      for (const pattern of conclusionPatterns) {
        const matches = content.match(pattern);
        if (matches && matches.length > 0) {
          conclusions.push(matches[0].trim());
        }
      }
    }
  }

  return {
    mainTopics: Array.from(mainTopics).slice(0, 5),
    keyEntities: Array.from(keyEntities).slice(0, 10),
    conclusions: conclusions.slice(0, 3),
    lastUpdated: new Date(),
  };
}

/**
 * Check if conversation needs summarization
 */
export function needsSummarization(conversation: Conversation): boolean {
  return (
    conversation.messages.length >= SUMMARIZE_THRESHOLD &&
    (!conversation.summary ||
      conversation.messages.length - (conversation.metadata?.messageCount || 0) >= 10)
  );
}

/**
 * Update conversation summary if needed
 */
export function updateSummaryIfNeeded(conversationId: string): void {
  const conversation = conversationStore.getConversation(conversationId);
  if (!conversation) return;

  if (needsSummarization(conversation)) {
    const summary = generateSummary(conversation.messages);
    conversationStore.updateConversation(conversationId, { summary });
  }
}

/**
 * Format messages for API request
 */
export function formatMessagesForAPI(
  messages: Message[]
): Array<{ role: string; content: string }> {
  return messages.map(m => ({
    role: m.role,
    content: m.content,
  }));
}

/**
 * Get context-aware system prompt
 */
export function getContextAwareSystemPrompt(conversation: Conversation): string {
  const basePrompt = `Sen Türk hukuku konusunda uzmanlaşmış bir AI asistanısın. Yanıtlarını her zaman doğrulanabilir kaynaklara dayandır ve referans göster.`;

  if (!conversation.summary) return basePrompt;

  const topics = conversation.summary.mainTopics;
  if (topics.length > 0) {
    return `${basePrompt}\n\nBu konuşma şu alanlara odaklanıyor: ${topics.join(", ")}. Yanıtlarını bu bağlamda ver.`;
  }

  return basePrompt;
}

/**
 * Search conversation history
 */
export function searchConversations(
  query: string,
  options: { limit?: number; conversationIds?: string[] } = {}
): Array<{ conversation: Conversation; relevantMessages: Message[] }> {
  const { limit = 10, conversationIds } = options;
  const results: Array<{ conversation: Conversation; relevantMessages: Message[] }> = [];
  const queryLower = query.toLowerCase();

  const conversationsToSearch = conversationIds
    ? conversationIds
        .map(id => conversationStore.getConversation(id))
        .filter((c): c is Conversation => c !== undefined)
    : conversationStore.listConversations(100);

  for (const conversation of conversationsToSearch) {
    const relevantMessages = conversation.messages.filter(m =>
      m.content.toLowerCase().includes(queryLower)
    );

    if (relevantMessages.length > 0) {
      results.push({
        conversation,
        relevantMessages: relevantMessages.slice(0, 5),
      });
    }

    if (results.length >= limit) break;
  }

  return results;
}

/**
 * Export conversation to various formats
 */
export function exportConversation(
  conversationId: string,
  format: "json" | "markdown" | "text"
): string {
  const conversation = conversationStore.getConversation(conversationId);
  if (!conversation) return "";

  switch (format) {
    case "json":
      return JSON.stringify(conversation, null, 2);

    case "markdown":
      return formatConversationAsMarkdown(conversation);

    case "text":
      return formatConversationAsText(conversation);

    default:
      return "";
  }
}

function formatConversationAsMarkdown(conversation: Conversation): string {
  const lines: string[] = [
    `# ${conversation.title}`,
    `*Oluşturulma: ${conversation.createdAt.toLocaleDateString("tr-TR")}*`,
    "",
  ];

  if (conversation.summary) {
    lines.push("## Özet");
    lines.push(`**Konular:** ${conversation.summary.mainTopics.join(", ")}`);
    lines.push("");
  }

  lines.push("## Mesajlar");
  lines.push("");

  for (const message of conversation.messages) {
    const role = message.role === "user" ? "**Kullanıcı**" : "**Asistan**";
    const time = message.timestamp.toLocaleTimeString("tr-TR");
    lines.push(`### ${role} (${time})`);
    lines.push(message.content);
    lines.push("");
  }

  return lines.join("\n");
}

function formatConversationAsText(conversation: Conversation): string {
  const lines: string[] = [
    conversation.title,
    `Tarih: ${conversation.createdAt.toLocaleDateString("tr-TR")}`,
    "─".repeat(50),
    "",
  ];

  for (const message of conversation.messages) {
    const role = message.role === "user" ? "Kullanıcı" : "Asistan";
    lines.push(`[${role}]`);
    lines.push(message.content);
    lines.push("");
  }

  return lines.join("\n");
}
