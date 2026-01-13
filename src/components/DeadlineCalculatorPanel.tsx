"use client";

import React, { useState, useMemo } from "react";
import {
  getDeadlineTypes,
  getDeadlinesByCategory,
  getDeadlineCategories,
  calculateDeadline,
  searchDeadlines,
  formatDateTR,
  formatRemainingTime,
  type DeadlineType,
  type DeadlineCategory,
  type DeadlineCalculation,
} from "@/lib/deadline-calculator";

export function DeadlineCalculatorPanel() {
  const [selectedCategory, setSelectedCategory] = useState<DeadlineCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeadline, setSelectedDeadline] = useState<DeadlineType | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [calculation, setCalculation] = useState<DeadlineCalculation | null>(null);

  const categories = useMemo(() => getDeadlineCategories(), []);

  const deadlines = useMemo(() => {
    let results: DeadlineType[];

    if (searchQuery.trim()) {
      results = searchDeadlines(searchQuery);
    } else if (selectedCategory === "all") {
      results = getDeadlineTypes();
    } else {
      results = getDeadlinesByCategory(selectedCategory);
    }

    return results;
  }, [selectedCategory, searchQuery]);

  const handleSelectDeadline = (deadline: DeadlineType) => {
    setSelectedDeadline(deadline);
    setCalculation(null);
    // Set default start date to today
    if (!startDate) {
      setStartDate(new Date().toISOString().split("T")[0]);
    }
  };

  const handleCalculate = () => {
    if (!selectedDeadline || !startDate) return;

    const result = calculateDeadline(selectedDeadline.id, new Date(startDate));
    setCalculation(result);
  };

  const getDurationText = (deadline: DeadlineType): string => {
    const unitNames: Record<string, string> = {
      day: "gün",
      week: "hafta",
      month: "ay",
      year: "yıl",
    };
    return `${deadline.baseDuration} ${unitNames[deadline.durationUnit]}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Süre Hesaplayıcı
      </h2>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Süre ara... (örn: zamanaşımı, temyiz, itiraz)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tümü
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deadline List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Süre Türü Seçin</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {deadlines.map(deadline => (
              <div
                key={deadline.id}
                onClick={() => handleSelectDeadline(deadline)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedDeadline?.id === deadline.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900">{deadline.name}</h4>
                  <span className="text-sm font-semibold text-blue-600">
                    {getDurationText(deadline)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{deadline.description}</p>
                <p className="text-xs text-gray-500 mt-2">{deadline.legalBasis}</p>
              </div>
            ))}

            {deadlines.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                Arama sonucu bulunamadı
              </p>
            )}
          </div>
        </div>

        {/* Calculator */}
        <div>
          {selectedDeadline ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">Hesaplama</h3>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900">{selectedDeadline.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{selectedDeadline.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-600">
                    {getDurationText(selectedDeadline)}
                  </span>
                  {selectedDeadline.isWorkingDays && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                      İş günü
                    </span>
                  )}
                </div>
              </div>

              {selectedDeadline.notes && selectedDeadline.notes.length > 0 && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <ul className="text-sm text-amber-700 space-y-1">
                    {selectedDeadline.notes.map((note, i) => (
                      <li key={i}>• {note}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleCalculate}
                disabled={!startDate}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Hesapla
              </button>

              {calculation && (
                <div className="mt-6">
                  <div className={`p-4 rounded-lg ${
                    calculation.isExpired
                      ? "bg-red-50 border border-red-200"
                      : calculation.remainingDays <= 7
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-green-50 border border-green-200"
                  }`}>
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600">Son Tarih</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatDateTR(calculation.endDate)}
                      </p>
                      <p className={`text-lg font-semibold mt-2 ${
                        calculation.isExpired
                          ? "text-red-600"
                          : calculation.remainingDays <= 7
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}>
                        {calculation.isExpired
                          ? "SÜRE DOLMUŞ!"
                          : formatRemainingTime(calculation.remainingDays)}
                      </p>
                    </div>

                    <div className="border-t pt-3 mt-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Başlangıç</p>
                          <p className="font-medium">{formatDateTR(calculation.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Bitiş</p>
                          <p className="font-medium">{formatDateTR(calculation.endDate)}</p>
                        </div>
                      </div>
                    </div>

                    {calculation.warnings.length > 0 && (
                      <div className="mt-4 pt-3 border-t">
                        {calculation.warnings.map((warning, i) => (
                          <p key={i} className={`text-sm ${
                            warning.startsWith("⚠️") ? "text-red-600 font-medium" : "text-gray-600"
                          }`}>
                            {warning}
                          </p>
                        ))}
                      </div>
                    )}

                    {calculation.holidays.length > 0 && (
                      <div className="mt-3 text-xs text-gray-500">
                        <p>Bu dönemde {calculation.holidays.length} resmi tatil bulunmaktadır.</p>
                      </div>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-gray-500 text-center">
                    Yasal Dayanak: {calculation.deadline.legalBasis}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-gray-500">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>Hesaplamak için bir süre türü seçin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeadlineCalculatorPanel;
