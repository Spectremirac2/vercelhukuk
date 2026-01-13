"use client";

import React, { useState, useMemo } from "react";
import {
  createCase,
  getAllCases,
  addEvent,
  updateEvent,
  deleteEvent,
  getTimelineView,
  getCaseStatistics,
  getUpcomingDeadlines,
  getOverdueTasks,
  getEventTypes,
  getEventTypeInfo,
  getCaseStatusName,
  createSampleCase,
  type LegalCase,
  type EventType,
  type TimelineView,
} from "@/lib/case-timeline";

// Initialize cases lazily
const getInitialCases = (): LegalCase[] => {
  if (typeof window === 'undefined') return [];
  const allCases = getAllCases();
  if (allCases.length === 0) {
    createSampleCase();
    return getAllCases();
  }
  return allCases;
};

export function CaseTimelinePanel() {
  const [cases, setCases] = useState<LegalCase[]>(getInitialCases);
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [timelineView, setTimelineView] = useState<TimelineView | null>(null);
  const [showNewCaseForm, setShowNewCaseForm] = useState(false);
  const [showNewEventForm, setShowNewEventForm] = useState(false);

  // Form states
  const [newCaseTitle, setNewCaseTitle] = useState("");
  const [newCaseType, setNewCaseType] = useState("");
  const [newCasePlaintiff, setNewCasePlaintiff] = useState("");
  const [newCaseDefendant, setNewCaseDefendant] = useState("");

  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventType, setNewEventType] = useState<EventType>("diger");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventDeadline, setNewEventDeadline] = useState("");

  const eventTypes = useMemo(() => getEventTypes(), []);
  const upcomingDeadlines = useMemo(() => getUpcomingDeadlines(14), []);
  const overdueTasks = useMemo(() => getOverdueTasks(), []);

  const handleSelectCase = (caseItem: LegalCase) => {
    setSelectedCase(caseItem);
    const view = getTimelineView(caseItem.id);
    setTimelineView(view);
  };

  const handleCreateCase = () => {
    if (!newCaseTitle || !newCaseType || !newCasePlaintiff || !newCaseDefendant) return;

    const newCase = createCase({
      title: newCaseTitle,
      caseType: newCaseType,
      status: "açık",
      parties: {
        plaintiff: newCasePlaintiff,
        defendant: newCaseDefendant,
      },
      startDate: new Date(),
    });

    setCases(getAllCases());
    handleSelectCase(newCase);
    setShowNewCaseForm(false);
    setNewCaseTitle("");
    setNewCaseType("");
    setNewCasePlaintiff("");
    setNewCaseDefendant("");
  };

  const handleAddEvent = () => {
    if (!selectedCase || !newEventTitle || !newEventDate) return;

    addEvent(selectedCase.id, {
      eventType: newEventType,
      title: newEventTitle,
      date: new Date(newEventDate),
      deadline: newEventDeadline ? new Date(newEventDeadline) : undefined,
      completed: false,
    });

    setCases(getAllCases());
    const updatedCase = getAllCases().find(c => c.id === selectedCase.id);
    if (updatedCase) {
      handleSelectCase(updatedCase);
    }
    setShowNewEventForm(false);
    setNewEventTitle("");
    setNewEventType("diger");
    setNewEventDate("");
    setNewEventDeadline("");
  };

  const handleToggleEventComplete = (eventId: string, completed: boolean) => {
    if (!selectedCase) return;

    updateEvent(selectedCase.id, eventId, { completed: !completed });

    setCases(getAllCases());
    const updatedCase = getAllCases().find(c => c.id === selectedCase.id);
    if (updatedCase) {
      handleSelectCase(updatedCase);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    if (!selectedCase) return;
    if (!confirm("Bu etkinliği silmek istediğinizden emin misiniz?")) return;

    deleteEvent(selectedCase.id, eventId);

    setCases(getAllCases());
    const updatedCase = getAllCases().find(c => c.id === selectedCase.id);
    if (updatedCase) {
      handleSelectCase(updatedCase);
    }
  };

  const stats = selectedCase ? getCaseStatistics(selectedCase.id) : null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Dava Takibi
      </h2>

      {/* Alerts */}
      {(overdueTasks.length > 0 || upcomingDeadlines.length > 0) && (
        <div className="mb-6 space-y-3">
          {overdueTasks.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">
                Gecikmiş Görevler ({overdueTasks.length})
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                {overdueTasks.slice(0, 3).map(({ case: c, event }) => (
                  <li key={event.id}>
                    <span className="font-medium">{c.title}:</span> {event.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {upcomingDeadlines.length > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">
                Yaklaşan Süreler ({upcomingDeadlines.length})
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {upcomingDeadlines.slice(0, 3).map(({ case: c, event, daysRemaining }) => (
                  <li key={event.id}>
                    <span className="font-medium">{c.title}:</span> {event.title}
                    <span className="text-yellow-600 ml-1">({daysRemaining} gün)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Davalar</h3>
            <button
              onClick={() => setShowNewCaseForm(true)}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
            >
              + Yeni Dava
            </button>
          </div>

          {/* New Case Form */}
          {showNewCaseForm && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={newCaseTitle}
                onChange={(e) => setNewCaseTitle(e.target.value)}
                placeholder="Dava Başlığı"
                className="w-full px-3 py-2 border rounded mb-2"
              />
              <input
                type="text"
                value={newCaseType}
                onChange={(e) => setNewCaseType(e.target.value)}
                placeholder="Dava Türü"
                className="w-full px-3 py-2 border rounded mb-2"
              />
              <input
                type="text"
                value={newCasePlaintiff}
                onChange={(e) => setNewCasePlaintiff(e.target.value)}
                placeholder="Davacı"
                className="w-full px-3 py-2 border rounded mb-2"
              />
              <input
                type="text"
                value={newCaseDefendant}
                onChange={(e) => setNewCaseDefendant(e.target.value)}
                placeholder="Davalı"
                className="w-full px-3 py-2 border rounded mb-2"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateCase}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Oluştur
                </button>
                <button
                  onClick={() => setShowNewCaseForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  İptal
                </button>
              </div>
            </div>
          )}

          {/* Case List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {cases.map(caseItem => (
              <div
                key={caseItem.id}
                onClick={() => handleSelectCase(caseItem)}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedCase?.id === caseItem.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <h4 className="font-medium text-gray-900 text-sm">{caseItem.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    caseItem.status === "açık" ? "bg-green-100 text-green-700" :
                    caseItem.status === "kapalı" ? "bg-gray-100 text-gray-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {getCaseStatusName(caseItem.status)}
                  </span>
                  <span className="text-xs text-gray-500">{caseItem.caseType}</span>
                </div>
              </div>
            ))}

            {cases.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Henüz dava bulunmuyor
              </p>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-2">
          {selectedCase && timelineView ? (
            <div>
              {/* Case Header */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedCase.title}
                    </h3>
                    {selectedCase.caseNumber && (
                      <p className="text-sm text-gray-600">{selectedCase.caseNumber}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedCase.parties.plaintiff} vs {selectedCase.parties.defendant}
                    </p>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    selectedCase.status === "açık" ? "bg-green-100 text-green-700" :
                    selectedCase.status === "kapalı" ? "bg-gray-100 text-gray-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {getCaseStatusName(selectedCase.status)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>İlerleme</span>
                    <span>%{timelineView.progress}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${timelineView.progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                {stats && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{stats.totalEvents}</p>
                      <p className="text-xs text-gray-500">Toplam</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{stats.completedEvents}</p>
                      <p className="text-xs text-gray-500">Tamamlanan</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-yellow-600">{stats.pendingDeadlines}</p>
                      <p className="text-xs text-gray-500">Bekleyen</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-red-600">{stats.overdueTasks}</p>
                      <p className="text-xs text-gray-500">Gecikmiş</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Add Event Button */}
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-800">Zaman Çizelgesi</h4>
                <button
                  onClick={() => setShowNewEventForm(true)}
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                >
                  + Etkinlik Ekle
                </button>
              </div>

              {/* New Event Form */}
              {showNewEventForm && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="Etkinlik Başlığı"
                    className="w-full px-3 py-2 border rounded mb-2"
                  />
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as EventType)}
                    className="w-full px-3 py-2 border rounded mb-2"
                  >
                    {eventTypes.map(et => (
                      <option key={et.id} value={et.id}>{et.icon} {et.name}</option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="text-xs text-gray-600">Tarih</label>
                      <input
                        type="date"
                        value={newEventDate}
                        onChange={(e) => setNewEventDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Son Tarih (Opsiyonel)</label>
                      <input
                        type="date"
                        value={newEventDeadline}
                        onChange={(e) => setNewEventDeadline(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddEvent}
                      className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                      Ekle
                    </button>
                    <button
                      onClick={() => setShowNewEventForm(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              )}

              {/* Timeline Events */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {timelineView.events.map((event, index) => {
                  const typeInfo = getEventTypeInfo(event.eventType);
                  const isOverdue = event.deadline && new Date(event.deadline) < new Date() && !event.completed;

                  return (
                    <div
                      key={event.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        event.completed ? "bg-gray-50 border-gray-200" :
                        isOverdue ? "bg-red-50 border-red-200" :
                        "bg-white border-gray-200"
                      }`}
                    >
                      {/* Timeline Line */}
                      <div className="flex flex-col items-center">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                          style={{ backgroundColor: typeInfo.color + "20", color: typeInfo.color }}
                        >
                          {typeInfo.icon}
                        </div>
                        {index < timelineView.events.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className={`font-medium ${event.completed ? "text-gray-500 line-through" : "text-gray-900"}`}>
                              {event.title}
                            </h5>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(event.date).toLocaleDateString("tr-TR")}
                              {event.deadline && (
                                <span className={isOverdue ? "text-red-600 ml-2" : "text-yellow-600 ml-2"}>
                                  (Son: {new Date(event.deadline).toLocaleDateString("tr-TR")})
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleEventComplete(event.id, event.completed)}
                              className={`text-xs px-2 py-1 rounded ${
                                event.completed
                                  ? "bg-gray-200 text-gray-600"
                                  : "bg-green-100 text-green-700 hover:bg-green-200"
                              }`}
                            >
                              {event.completed ? "Geri Al" : "Tamamla"}
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {timelineView.events.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    Henüz etkinlik bulunmuyor
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-gray-500">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>Zaman çizelgesini görüntülemek için bir dava seçin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CaseTimelinePanel;
