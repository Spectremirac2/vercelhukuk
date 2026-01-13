"use client";

import React, { useState, useMemo } from "react";
import {
  getTemplates,
  getTemplatesByCategory,
  getTemplateById,
  getCategories,
  generateDocument,
  validateField,
  exportDocument,
  type DocumentTemplate,
  type DocumentCategory,
  type GeneratedDocument,
  type TemplateField,
} from "@/lib/document-templates";

export function DocumentTemplatePanel() {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | "all">("all");
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = useMemo(() => getCategories(), []);
  const templates = useMemo(() => {
    if (selectedCategory === "all") return getTemplates();
    return getTemplatesByCategory(selectedCategory);
  }, [selectedCategory]);

  const handleSelectTemplate = (templateId: string) => {
    const template = getTemplateById(templateId);
    setSelectedTemplate(template);
    setFieldValues({});
    setGeneratedDoc(null);
    setErrors({});
  };

  const handleFieldChange = (key: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [key]: value }));

    // Validate field
    if (selectedTemplate) {
      const field = [...selectedTemplate.requiredFields, ...selectedTemplate.optionalFields]
        .find(f => f.key === key);
      if (field) {
        const validation = validateField(field, value);
        if (!validation.valid) {
          setErrors(prev => ({ ...prev, [key]: validation.error || "" }));
        } else {
          setErrors(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
          });
        }
      }
    }
  };

  const handleGenerate = () => {
    if (!selectedTemplate) return;

    const doc = generateDocument(selectedTemplate.id, fieldValues);
    setGeneratedDoc(doc);
  };

  const handleCopy = async () => {
    if (!generatedDoc) return;
    await navigator.clipboard.writeText(generatedDoc.content);
    alert("Belge panoya kopyalandı!");
  };

  const handleDownload = () => {
    if (!generatedDoc) return;

    const html = exportDocument(generatedDoc, "html");
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedDoc.title.replace(/\s+/g, "_")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderField = (field: TemplateField) => {
    const value = fieldValues[field.key] || "";
    const error = errors[field.key];

    const baseInputClass = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      error ? "border-red-500" : "border-gray-300"
    }`;

    return (
      <div key={field.key} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field.label}
          {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {field.type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={baseInputClass}
          />
        ) : field.type === "select" ? (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className={baseInputClass}
          >
            <option value="">Seçiniz...</option>
            {field.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : field.type === "date" ? (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className={baseInputClass}
          />
        ) : field.type === "currency" ? (
          <div className="relative">
            <input
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder || "0.00"}
              className={`${baseInputClass} pr-12`}
            />
            <span className="absolute right-3 top-2 text-gray-500">TL</span>
          </div>
        ) : (
          <input
            type={field.type === "number" ? "number" : "text"}
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClass}
          />
        )}

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Belge Şablonları
      </h2>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
        {/* Template List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Şablon Seçin</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {templates.map(template => (
              <div
                key={template.id}
                onClick={() => handleSelectTemplate(template.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                <p className="text-xs text-gray-500 mt-2">{template.legalBasis}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form or Preview */}
        <div>
          {selectedTemplate && !generatedDoc ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {selectedTemplate.name}
              </h3>

              {selectedTemplate.warnings && selectedTemplate.warnings.length > 0 && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Dikkat</h4>
                  <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                    {selectedTemplate.warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
                <div className="max-h-[400px] overflow-y-auto pr-2">
                  <h4 className="font-medium text-gray-700 mb-3">Zorunlu Alanlar</h4>
                  {selectedTemplate.requiredFields.map(renderField)}

                  {selectedTemplate.optionalFields.length > 0 && (
                    <>
                      <h4 className="font-medium text-gray-700 mb-3 mt-6">
                        İsteğe Bağlı Alanlar
                      </h4>
                      {selectedTemplate.optionalFields.map(renderField)}
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Belge Oluştur
                </button>
              </form>
            </div>
          ) : generatedDoc ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{generatedDoc.title}</h3>
                <button
                  onClick={() => setGeneratedDoc(null)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Düzenle
                </button>
              </div>

              {generatedDoc.warnings.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {generatedDoc.warnings.map((w, i) => (
                      <li key={i}>⚠️ {w}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-gray-50 border rounded-lg p-4 max-h-[400px] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                  {generatedDoc.content}
                </pre>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleCopy}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Kopyala
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  İndir (HTML)
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-gray-500">
              <p>Bir şablon seçin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentTemplatePanel;
