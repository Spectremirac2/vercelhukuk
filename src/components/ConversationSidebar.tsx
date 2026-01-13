"use client";

import React, { useState, useMemo } from "react";
import {
  MessageSquare,
  Plus,
  Search,
  Trash2,
  Edit2,
  Check,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Pin,
  Archive,
  Download,
  Star,
} from "lucide-react";
import { cn } from "@/utils/cn";

export interface ConversationItem {
  id: string;
  title: string;
  preview: string;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
  isPinned?: boolean;
  isArchived?: boolean;
  isFavorite?: boolean;
  folder?: string;
  topics?: string[];
}

interface ConversationSidebarProps {
  conversations: ConversationItem[];
  activeConversationId?: string;
  isCollapsed?: boolean;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onTogglePin?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onArchive?: (id: string) => void;
  onExport?: (id: string) => void;
  onToggleCollapse?: () => void;
}

type FilterType = "all" | "pinned" | "favorites" | "archived";
type SortType = "recent" | "oldest" | "name";

export function ConversationSidebar({
  conversations,
  activeConversationId,
  isCollapsed = false,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  onTogglePin,
  onToggleFavorite,
  onArchive,
  onExport,
  onToggleCollapse,
}: ConversationSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy] = useState<SortType>("recent"); // setSortBy removed - not used yet
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Filter and sort conversations
  const filteredConversations = useMemo(() => {
    let filtered = [...conversations];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.preview.toLowerCase().includes(query) ||
          c.topics?.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Apply filter
    switch (filter) {
      case "pinned":
        filtered = filtered.filter((c) => c.isPinned);
        break;
      case "favorites":
        filtered = filtered.filter((c) => c.isFavorite);
        break;
      case "archived":
        filtered = filtered.filter((c) => c.isArchived);
        break;
      default:
        filtered = filtered.filter((c) => !c.isArchived);
    }

    // Apply sort
    switch (sortBy) {
      case "oldest":
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title, "tr"));
        break;
      default:
        filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }

    // Always show pinned first (except when filtering by pinned)
    if (filter !== "pinned") {
      filtered.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });
    }

    return filtered;
  }, [conversations, searchQuery, filter, sortBy]);

  // Group by date
  const groupedConversations = useMemo(() => {
    const groups: { label: string; items: ConversationItem[] }[] = [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const todayItems: ConversationItem[] = [];
    const yesterdayItems: ConversationItem[] = [];
    const weekItems: ConversationItem[] = [];
    const monthItems: ConversationItem[] = [];
    const olderItems: ConversationItem[] = [];

    for (const conv of filteredConversations) {
      const date = new Date(conv.updatedAt);
      if (date >= today) {
        todayItems.push(conv);
      } else if (date >= yesterday) {
        yesterdayItems.push(conv);
      } else if (date >= weekAgo) {
        weekItems.push(conv);
      } else if (date >= monthAgo) {
        monthItems.push(conv);
      } else {
        olderItems.push(conv);
      }
    }

    if (todayItems.length > 0) groups.push({ label: "Bugün", items: todayItems });
    if (yesterdayItems.length > 0) groups.push({ label: "Dün", items: yesterdayItems });
    if (weekItems.length > 0) groups.push({ label: "Bu Hafta", items: weekItems });
    if (monthItems.length > 0) groups.push({ label: "Bu Ay", items: monthItems });
    if (olderItems.length > 0) groups.push({ label: "Daha Eski", items: olderItems });

    return groups;
  }, [filteredConversations]);

  const startEditing = (conv: ConversationItem) => {
    setEditingId(conv.id);
    setEditTitle(conv.title);
    setMenuOpenId(null);
  };

  const saveEdit = () => {
    if (editingId && editTitle.trim()) {
      onRenameConversation(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 1) return "Az önce";
    if (minutes < 60) return `${minutes} dk önce`;
    if (hours < 24) return `${hours} sa önce`;
    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
  };

  // Collapsed view
  if (isCollapsed) {
    return (
      <div className="w-16 h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg mb-4"
        >
          <ChevronRight size={20} />
        </button>

        <button
          onClick={onNewConversation}
          className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors mb-4"
          title="Yeni Sohbet"
        >
          <Plus size={20} />
        </button>

        <div className="flex-1 overflow-y-auto w-full px-2 space-y-2">
          {conversations.slice(0, 10).map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={cn(
                "w-full p-2 rounded-lg flex items-center justify-center transition-colors",
                activeConversationId === conv.id
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                  : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
              title={conv.title}
            >
              <MessageSquare size={18} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare size={18} />
            Sohbetler
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={onNewConversation}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Yeni Sohbet"
            >
              <Plus size={16} />
            </button>
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
              >
                <ChevronLeft size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Sohbetlerde ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
          {[
            { value: "all", label: "Tümü" },
            { value: "pinned", label: "Sabitler", icon: Pin },
            { value: "favorites", label: "Favoriler", icon: Star },
            { value: "archived", label: "Arşiv", icon: Archive },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as FilterType)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1",
                filter === f.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
              )}
            >
              {f.icon && <f.icon size={12} />}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {groupedConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {searchQuery ? "Sonuç bulunamadı" : "Henüz sohbet yok"}
            </p>
          </div>
        ) : (
          groupedConversations.map((group) => (
            <div key={group.label}>
              <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky top-0 bg-gray-50 dark:bg-gray-800">
                {group.label}
              </div>
              {group.items.map((conv) => (
                <ConversationItemRow
                  key={conv.id}
                  conversation={conv}
                  isActive={activeConversationId === conv.id}
                  isEditing={editingId === conv.id}
                  editTitle={editTitle}
                  menuOpen={menuOpenId === conv.id}
                  onSelect={() => onSelectConversation(conv.id)}
                  onEditTitleChange={setEditTitle}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  onStartEdit={() => startEditing(conv)}
                  onDelete={() => onDeleteConversation(conv.id)}
                  onToggleMenu={() =>
                    setMenuOpenId(menuOpenId === conv.id ? null : conv.id)
                  }
                  onCloseMenu={() => setMenuOpenId(null)}
                  onTogglePin={onTogglePin ? () => onTogglePin(conv.id) : undefined}
                  onToggleFavorite={
                    onToggleFavorite ? () => onToggleFavorite(conv.id) : undefined
                  }
                  onArchive={onArchive ? () => onArchive(conv.id) : undefined}
                  onExport={onExport ? () => onExport(conv.id) : undefined}
                  formatTime={formatTime}
                />
              ))}
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex justify-between">
          <span>{conversations.filter((c) => !c.isArchived).length} sohbet</span>
          <span>{conversations.reduce((acc, c) => acc + c.messageCount, 0)} mesaj</span>
        </div>
      </div>
    </div>
  );
}

// Conversation Item Row Component
interface ConversationItemRowProps {
  conversation: ConversationItem;
  isActive: boolean;
  isEditing: boolean;
  editTitle: string;
  menuOpen: boolean;
  onSelect: () => void;
  onEditTitleChange: (title: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onTogglePin?: () => void;
  onToggleFavorite?: () => void;
  onArchive?: () => void;
  onExport?: () => void;
  formatTime: (date: Date) => string;
}

function ConversationItemRow({
  conversation,
  isActive,
  isEditing,
  editTitle,
  menuOpen,
  onSelect,
  onEditTitleChange,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onDelete,
  onToggleMenu,
  onCloseMenu,
  onTogglePin,
  onToggleFavorite,
  onArchive,
  onExport,
  formatTime,
}: ConversationItemRowProps) {
  return (
    <div
      className={cn(
        "group px-3 py-2 mx-2 rounded-lg cursor-pointer transition-colors relative",
        isActive
          ? "bg-blue-100 dark:bg-blue-900/30"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      )}
      onClick={!isEditing ? onSelect : undefined}
    >
      <div className="flex items-start gap-2">
        {/* Icon */}
        <div
          className={cn(
            "mt-1 shrink-0",
            isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400"
          )}
        >
          {conversation.isPinned && <Pin size={14} className="text-orange-500" />}
          {conversation.isFavorite && !conversation.isPinned && (
            <Star size={14} className="text-yellow-500" />
          )}
          {!conversation.isPinned && !conversation.isFavorite && (
            <MessageSquare size={14} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => onEditTitleChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSaveEdit();
                  if (e.key === "Escape") onCancelEdit();
                }}
                className="flex-1 px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSaveEdit();
                }}
                className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
              >
                <Check size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancelEdit();
                }}
                className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <>
              <div
                className={cn(
                  "text-sm font-medium truncate",
                  isActive
                    ? "text-blue-900 dark:text-blue-100"
                    : "text-gray-900 dark:text-white"
                )}
              >
                {conversation.title}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {conversation.preview}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 dark:text-gray-500">
                <Clock size={10} />
                <span>{formatTime(conversation.updatedAt)}</span>
                <span>•</span>
                <span>{conversation.messageCount} mesaj</span>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        {!isEditing && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMenu();
              }}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              <MoreVertical size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onCloseMenu} />
          <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartEdit();
              }}
              className="w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <Edit2 size={14} />
              Yeniden Adlandır
            </button>
            {onTogglePin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin();
                  onCloseMenu();
                }}
                className="w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Pin size={14} />
                {conversation.isPinned ? "Sabitlemeyi Kaldır" : "Sabitle"}
              </button>
            )}
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                  onCloseMenu();
                }}
                className="w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Star size={14} />
                {conversation.isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
              </button>
            )}
            {onExport && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExport();
                  onCloseMenu();
                }}
                className="w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Download size={14} />
                Dışa Aktar
              </button>
            )}
            {onArchive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive();
                  onCloseMenu();
                }}
                className="w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Archive size={14} />
                {conversation.isArchived ? "Arşivden Çıkar" : "Arşivle"}
              </button>
            )}
            <hr className="my-1 border-gray-200 dark:border-gray-700" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                onCloseMenu();
              }}
              className="w-full px-3 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
            >
              <Trash2 size={14} />
              Sil
            </button>
          </div>
        </>
      )}
    </div>
  );
}
