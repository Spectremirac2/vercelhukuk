"use client";

import React, { useState } from "react";
import {
  calculateFees,
  calculateIcraFees,
  getCaseTypes,
  getCaseTypeName,
  formatCurrency,
  isExemptFromFees,
  getFeeExemptions,
  calculateTotalCostEstimate,
  type CaseType,
  type FeeCalculation,
} from "@/lib/court-fees";

export function CourtFeeCalculatorPanel() {
  const [caseType, setCaseType] = useState<CaseType>("hukuk_genel");
  const [claimAmount, setClaimAmount] = useState<string>("");
  const [includeTemyiz, setIncludeTemyiz] = useState(false);
  const [includeKesif, setIncludeKesif] = useState(false);
  const [includeBilirkisi, setIncludeBilirkisi] = useState(false);
  const [tanıkSayısı, setTanıkSayısı] = useState<string>("0");
  const [calculation, setCalculation] = useState<FeeCalculation | null>(null);
  const [showIcra, setShowIcra] = useState(false);
  const [showExemptions, setShowExemptions] = useState(false);

  const caseTypes = getCaseTypes();
  const exemptions = getFeeExemptions();

  const handleCalculate = () => {
    const amount = parseFloat(claimAmount) || 0;

    if (caseType === "icra") {
      setShowIcra(true);
      const result = calculateIcraFees(amount, {
        includeHaciz: true,
        includeSatış: true,
      });
      setCalculation(result);
    } else {
      setShowIcra(false);
      const result = calculateFees(caseType, amount, {
        includeTemyiz,
        includeTebligat: 4,
        includeKeşif: includeKesif,
        includeBilirkişi: includeBilirkisi,
        tanıkSayısı: parseInt(tanıkSayısı) || 0,
      });
      setCalculation(result);
    }
  };

  const totalEstimate = calculation
    ? calculateTotalCostEstimate(caseType, parseFloat(claimAmount) || 0, {
        istinafOlasiligi: includeTemyiz,
      })
    : null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Harç ve Masraf Hesaplayıcı
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div>
          <div className="space-y-4">
            {/* Case Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dava Türü
              </label>
              <select
                value={caseType}
                onChange={(e) => setCaseType(e.target.value as CaseType)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {caseTypes.map(ct => (
                  <option key={ct.id} value={ct.id}>{ct.name}</option>
                ))}
              </select>
              {isExemptFromFees(caseType) && (
                <p className="mt-1 text-sm text-green-600">
                  Bu dava türü harçtan muaftır
                </p>
              )}
            </div>

            {/* Claim Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dava Değeri (TL)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-12"
                />
                <span className="absolute right-4 top-2 text-gray-500">TL</span>
              </div>
            </div>

            {/* Options */}
            {caseType !== "icra" && (
              <div className="space-y-3 pt-2">
                <h4 className="font-medium text-gray-700">Ek Masraflar</h4>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTemyiz}
                    onChange={(e) => setIncludeTemyiz(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">İstinaf/Temyiz harcı dahil et</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeKesif}
                    onChange={(e) => setIncludeKesif(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Keşif masrafı dahil et</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeBilirkisi}
                    onChange={(e) => setIncludeBilirkisi(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Bilirkişi ücreti dahil et</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Tanık sayısı:</span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={tanıkSayısı}
                    onChange={(e) => setTanıkSayısı(e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleCalculate}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-4"
            >
              Hesapla
            </button>

            {/* Exemptions Info */}
            <div className="mt-4">
              <button
                onClick={() => setShowExemptions(!showExemptions)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showExemptions ? "Muafiyetleri Gizle" : "Muafiyetleri Göster"}
              </button>

              {showExemptions && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Harç Muafiyetleri</h4>
                  <ul className="text-sm text-green-700 space-y-2">
                    {exemptions.map((ex, i) => (
                      <li key={i}>
                        <span className="font-medium">{ex.description}</span>
                        <span className="text-xs block text-green-600">{ex.legalBasis}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          {calculation ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {getCaseTypeName(calculation.caseType)} Masrafları
              </h3>

              {/* Fee Breakdown */}
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">
                        Kalem
                      </th>
                      <th className="text-right px-4 py-2 text-sm font-medium text-gray-700">
                        Tutar
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculation.fees.map((fee, i) => (
                      <tr key={i} className="border-t border-gray-200">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">{fee.name}</p>
                          {fee.description && (
                            <p className="text-xs text-gray-500">{fee.description}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-medium text-gray-900">
                            {formatCurrency(fee.amount)}
                          </span>
                          {fee.isPercentage && (
                            <span className="text-xs text-gray-500 block">
                              %{fee.percentage?.toFixed(2)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-blue-50">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-blue-900">
                        Toplam
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-blue-900 text-lg">
                        {formatCurrency(calculation.totalFees)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Notes */}
              {calculation.notes.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {calculation.notes.map((note, i) => (
                      <li key={i}>• {note}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Total Cost Estimate */}
              {totalEstimate && (
                <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <h4 className="font-medium text-indigo-900 mb-3">
                    Tahmini Toplam Maliyet
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Harçlar:</span>
                      <span className="font-medium">{formatCurrency(totalEstimate.harclar)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Masraflar:</span>
                      <span className="font-medium">{formatCurrency(totalEstimate.masraflar)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Avukat Ücreti (tahmini):</span>
                      <span className="font-medium">{formatCurrency(totalEstimate.avukatUcreti)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-indigo-200">
                      <span className="font-semibold text-indigo-900">TOPLAM:</span>
                      <span className="font-bold text-indigo-900">
                        {formatCurrency(totalEstimate.toplam)}
                      </span>
                    </div>
                    <div className="pt-2 text-xs text-indigo-600">
                      Tahmini süre: {totalEstimate.sure}
                    </div>
                  </div>
                </div>
              )}

              {/* Legal Basis */}
              <p className="mt-4 text-xs text-gray-500 text-center">
                Yasal Dayanak: {calculation.legalBasis}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-gray-500">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p>Hesaplama yapmak için formu doldurun</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-3 bg-gray-100 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          Bu hesaplama tahmini olup, gerçek harç ve masraflar farklılık gösterebilir.
          Güncel harç tarifeleri için Harçlar Kanunu ve yıllık tebliğlere başvurunuz.
          Hesaplamalar 2024-2025 harç tarifelerine göre yapılmıştır.
        </p>
      </div>
    </div>
  );
}

export default CourtFeeCalculatorPanel;
