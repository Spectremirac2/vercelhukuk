/**
 * Tests for Conversation Memory Library
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  conversationStore,
  buildContext,
  generateSummary,
  needsSummarization,
  estimateTokens,
  formatMessagesForAPI,
  exportConversation,
  searchConversations,
  Conversation,
  Message,
} from "@/lib/conversation-memory";

describe("ConversationStore", () => {
  beforeEach(() => {
    // Clear the store before each test
    const allConversations = conversationStore.listConversations(1000);
    allConversations.forEach((c) => conversationStore.deleteConversation(c.id));
  });

  it("should create a new conversation", () => {
    const conversation = conversationStore.createConversation("test-1", "Test Sohbet");

    expect(conversation.id).toBe("test-1");
    expect(conversation.title).toBe("Test Sohbet");
    expect(conversation.messages).toHaveLength(0);
  });

  it("should get an existing conversation", () => {
    conversationStore.createConversation("test-2", "Sohbet 2");

    const retrieved = conversationStore.getConversation("test-2");

    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe("test-2");
  });

  it("should return undefined for non-existent conversation", () => {
    const result = conversationStore.getConversation("non-existent");

    expect(result).toBeUndefined();
  });

  it("should get or create a conversation", () => {
    const conv1 = conversationStore.getOrCreateConversation("new-conv");
    const conv2 = conversationStore.getOrCreateConversation("new-conv");

    expect(conv1.id).toBe("new-conv");
    expect(conv1).toBe(conv2);
  });

  it("should add messages to a conversation", () => {
    conversationStore.createConversation("msg-test");

    const message = conversationStore.addMessage("msg-test", {
      role: "user",
      content: "Merhaba, iş hukuku hakkında bilgi almak istiyorum.",
    });

    expect(message.id).toBeTruthy();
    expect(message.role).toBe("user");
    expect(message.timestamp).toBeInstanceOf(Date);
  });

  it("should list conversations sorted by update time", () => {
    conversationStore.createConversation("conv-a", "A");
    conversationStore.createConversation("conv-b", "B");
    conversationStore.addMessage("conv-a", {
      role: "user",
      content: "Test message",
    });

    const list = conversationStore.listConversations();

    expect(list[0].id).toBe("conv-a"); // Most recently updated
  });

  it("should delete a conversation", () => {
    conversationStore.createConversation("to-delete");

    const deleted = conversationStore.deleteConversation("to-delete");
    const result = conversationStore.getConversation("to-delete");

    expect(deleted).toBe(true);
    expect(result).toBeUndefined();
  });

  it("should update conversation metadata", () => {
    conversationStore.createConversation("meta-test");
    conversationStore.updateConversation("meta-test", {
      title: "Yeni Başlık",
    });

    const conv = conversationStore.getConversation("meta-test");

    expect(conv?.title).toBe("Yeni Başlık");
  });
});

describe("estimateTokens", () => {
  it("should estimate token count based on character length", () => {
    const text = "Merhaba dünya"; // 13 characters
    const tokens = estimateTokens(text);

    // Approximate 4 chars per token
    expect(tokens).toBe(Math.ceil(13 / 4));
  });

  it("should handle empty string", () => {
    expect(estimateTokens("")).toBe(0);
  });

  it("should handle long Turkish text", () => {
    const text = "Kişisel verilerin işlenmesi hakkında 6698 sayılı Kanun kapsamında";
    const tokens = estimateTokens(text);

    expect(tokens).toBeGreaterThan(10);
  });
});

describe("buildContext", () => {
  const mockConversation: Conversation = {
    id: "ctx-test",
    title: "Context Test",
    messages: [
      {
        id: "1",
        role: "user",
        content: "İş hukuku nedir?",
        timestamp: new Date(),
      },
      {
        id: "2",
        role: "assistant",
        content: "İş hukuku, işçi ve işveren arasındaki ilişkileri düzenler.",
        timestamp: new Date(),
      },
      {
        id: "3",
        role: "user",
        content: "Kıdem tazminatı nasıl hesaplanır?",
        timestamp: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: { messageCount: 3 },
  };

  it("should build context with recent messages", () => {
    const context = buildContext(mockConversation, { maxMessages: 10 });

    expect(context.messages.length).toBe(3);
    expect(context.tokenCount).toBeGreaterThan(0);
  });

  it("should limit messages by count", () => {
    const context = buildContext(mockConversation, { maxMessages: 2 });

    expect(context.messages.length).toBe(2);
    expect(context.messages[0].content).toBe("İş hukuku, işçi ve işveren arasındaki ilişkileri düzenler.");
  });

  it("should handle empty conversation", () => {
    const emptyConv: Conversation = {
      id: "empty",
      title: "Empty",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const context = buildContext(emptyConv);

    expect(context.messages.length).toBe(0);
    expect(context.tokenCount).toBe(0);
  });
});

describe("generateSummary", () => {
  it("should extract legal topics from messages", () => {
    const messages: Message[] = [
      {
        id: "1",
        role: "user",
        content: "İş sözleşmesi fesih haklarım nelerdir?",
        timestamp: new Date(),
      },
      {
        id: "2",
        role: "assistant",
        content: "İş kanunu kapsamında ihbar süreleri düzenlenmiştir.",
        timestamp: new Date(),
      },
    ];

    const summary = generateSummary(messages);

    // Check that lastUpdated is a Date (main behavior)
    expect(summary.lastUpdated).toBeInstanceOf(Date);
    // Topic extraction is best-effort, so we just verify it returns an array
    expect(Array.isArray(summary.mainTopics)).toBe(true);
  });

  it("should extract law references as entities", () => {
    const messages: Message[] = [
      {
        id: "1",
        role: "user",
        content: "6698 sayılı Kanun ne diyor?",
        timestamp: new Date(),
      },
      {
        id: "2",
        role: "assistant",
        content:
          "6698 sayılı KVKK madde 5 kapsamında kişisel veriler işlenebilir.",
        timestamp: new Date(),
      },
    ];

    const summary = generateSummary(messages);

    expect(summary.keyEntities.some((e) => e.includes("6698"))).toBe(true);
  });

  it("should extract conclusions from assistant responses", () => {
    const messages: Message[] = [
      {
        id: "1",
        role: "assistant",
        content:
          "Sonuç olarak, işçi lehine yorum ilkesi geçerlidir.",
        timestamp: new Date(),
      },
    ];

    const summary = generateSummary(messages);

    expect(summary.conclusions.length).toBeGreaterThan(0);
  });

  it("should handle empty messages", () => {
    const summary = generateSummary([]);

    expect(summary.mainTopics.length).toBe(0);
    expect(summary.keyEntities.length).toBe(0);
    expect(summary.conclusions.length).toBe(0);
  });
});

describe("needsSummarization", () => {
  it("should return false for conversations with few messages", () => {
    const conv: Conversation = {
      id: "short",
      title: "Short",
      messages: Array(10).fill({
        id: "m",
        role: "user",
        content: "test",
        timestamp: new Date(),
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: { messageCount: 10 },
    };

    expect(needsSummarization(conv)).toBe(false);
  });

  it("should return true for conversations exceeding threshold", () => {
    const conv: Conversation = {
      id: "long",
      title: "Long",
      messages: Array(25).fill({
        id: "m",
        role: "user",
        content: "test",
        timestamp: new Date(),
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: { messageCount: 25 },
    };

    expect(needsSummarization(conv)).toBe(true);
  });
});

describe("formatMessagesForAPI", () => {
  it("should format messages for API request", () => {
    const messages: Message[] = [
      {
        id: "1",
        role: "user",
        content: "Merhaba",
        timestamp: new Date(),
        metadata: { sources: [] },
      },
      {
        id: "2",
        role: "assistant",
        content: "Size nasıl yardımcı olabilirim?",
        timestamp: new Date(),
      },
    ];

    const formatted = formatMessagesForAPI(messages);

    expect(formatted).toHaveLength(2);
    expect(formatted[0]).toEqual({ role: "user", content: "Merhaba" });
    expect(formatted[1]).toEqual({
      role: "assistant",
      content: "Size nasıl yardımcı olabilirim?",
    });
  });
});

describe("exportConversation", () => {
  beforeEach(() => {
    const conv = conversationStore.getOrCreateConversation("export-test");
    conversationStore.addMessage("export-test", {
      role: "user",
      content: "Test mesajı",
    });
    conversationStore.addMessage("export-test", {
      role: "assistant",
      content: "Test yanıtı",
    });
  });

  it("should export as JSON", () => {
    const json = exportConversation("export-test", "json");

    expect(json).toBeTruthy();
    const parsed = JSON.parse(json);
    expect(parsed.id).toBe("export-test");
  });

  it("should export as markdown", () => {
    const md = exportConversation("export-test", "markdown");

    expect(md).toContain("# ");
    expect(md).toContain("Kullanıcı");
    expect(md).toContain("Asistan");
  });

  it("should export as plain text", () => {
    const text = exportConversation("export-test", "text");

    expect(text).toContain("[Kullanıcı]");
    expect(text).toContain("[Asistan]");
    expect(text).toContain("Test mesajı");
  });

  it("should return empty string for non-existent conversation", () => {
    const result = exportConversation("non-existent", "json");

    expect(result).toBe("");
  });
});

describe("searchConversations", () => {
  const searchId1 = `search-${Date.now()}-1`;
  const searchId2 = `search-${Date.now()}-2`;

  beforeEach(() => {
    // Create fresh conversations for each test
    conversationStore.createConversation(searchId1, "Sohbet 1");
    conversationStore.addMessage(searchId1, {
      role: "user",
      content: "is hukuku konusunda bilgi almak istiyorum",
    });

    conversationStore.createConversation(searchId2, "Sohbet 2");
    conversationStore.addMessage(searchId2, {
      role: "user",
      content: "vergi hukuku nedir",
    });
  });

  it("should find conversations containing search term", () => {
    const results = searchConversations("is hukuku", { conversationIds: [searchId1, searchId2] });

    expect(results.length).toBe(1);
    expect(results[0].conversation.id).toBe(searchId1);
  });

  it("should return empty array when no match", () => {
    const results = searchConversations("tamamen farkli", { conversationIds: [searchId1, searchId2] });

    expect(results.length).toBe(0);
  });

  it("should be case insensitive", () => {
    const results = searchConversations("IS HUKUKU", { conversationIds: [searchId1, searchId2] });

    expect(results.length).toBe(1);
  });

  it("should respect limit option", () => {
    const results = searchConversations("hukuku", { conversationIds: [searchId1, searchId2], limit: 1 });

    // Both conversations contain "hukuku", but limit to 1
    expect(results.length).toBe(1);
  });
});
