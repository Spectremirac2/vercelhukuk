"use client";

import React, { useState, useMemo } from "react";
import {
  getDocumentTemplates,
  getTemplateById,
  getTemplatesByCategory,
  getTemplateCategories,
  searchTemplates,
  generateDocument,
  exportDocument,
  validateVariables,
  type DocumentTemplate,
  type DocumentTemplateType,
  type GeneratedDocument,
  type DocumentVariable,
} from "@/lib/document-generator";

export function DocumentGeneratorTool() {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [variables, setVariables] = useState<Record<string, string | number | boolean>>({});
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<"select" | "fill" | "preview">("select");

  const categories = useMemo(() => getTemplateCategories(), []);
  const allTemplates = useMemo(() => getDocumentTemplates(), []);

  const filteredTemplates = useMemo(() => {
    let templates = allTemplates;

    if (selectedCategory !== "all") {
      templates = templates.filter((t) => t.category === selectedCategory);
    }

    if (searchQuery) {
      templates = searchTemplates(searchQuery);
    }

    return templates;
  }, [allTemplates, selectedCategory, searchQuery]);

  const handleSelectTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setVariables({});
    setGeneratedDoc(null);
    setErrors([]);
    setCurrentStep("fill");
  };

  const handleVariableChange = (name: string, value: string | number | boolean) => {
    setVariables((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = () => {
    if (!selectedTemplate) return;

    const validation = validateVariables(selectedTemplate, variables);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    const doc = generateDocument(selectedTemplate.id, variables);
    if (doc) {
      setGeneratedDoc(doc);
      setCurrentStep("preview");
    }
  };

  const handleExport = (format: "txt" | "html" | "markdown") => {
    if (!generatedDoc) return;

    const content = exportDocument(generatedDoc, format);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedDoc.templateName.replace(/\s+/g, "_")}.${format === "html" ? "html" : format === "markdown" ? "md" : "txt"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = () => {
    if (generatedDoc) {
      navigator.clipboard.writeText(generatedDoc.content);
    }
  };

  const groupedVariables = useMemo(() => {
    if (!selectedTemplate) return new Map<string, DocumentVariable[]>();

    const groups = new Map<string, DocumentVariable[]>();
    for (const variable of selectedTemplate.variables) {
      const section = variable.section || "Genel";
      if (!groups.has(section)) {
        groups.set(section, []);
      }
      groups.get(section)!.push(variable);
    }
    return groups;
  }, [selectedTemplate]);

  const getCategoryIcon = (cat: string): string => {
    const icons: Record<string, string> = {
      is_hukuku: "👷",
      ticaret_hukuku: "🏢",
      borçlar_hukuku: "📜",
      kvkk: "🔒",
      genel: "📋",
    };
    return icons[cat] || "📄";
  };

  return (
    <div className="h-full flex flex-col bg-[var(--background)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">Belge Oluşturucu</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Hukuki belge şablonları</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2">
          {["select", "fill", "preview"].map((step, index) => (
            <React.Fragment key={step}>
              <button
                onClick={() => {
                  if (step === "select") {
                    setCurrentStep("select");
                    setSelectedTemplate(null);
                    setGeneratedDoc(null);
                  } else if (step === "fill" && selectedTemplate) {
                    setCurrentStep("fill");
                    setGeneratedDoc(null);
                  } else if (step === "preview" && generatedDoc) {
                    setCurrentStep("preview");
                  }
                }}
                disabled={
                  (step === "fill" && !selectedTemplate) ||
                  (step === "preview" && !generatedDoc)
                }
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  currentStep === step
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--input-background)] text-[var(--muted-foreground)] disabled:opacity-50"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                  {index + 1}
                </span>
                {step === "select" && "Şablon Seç"}
                {step === "fill" && "Bilgi Gir"}
                {step === "preview" && "Önizle"}
              </button>
              {index < 2 && (
                <div className="w-8 h-0.5 bg-[var(--border-color)]" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Step 1: Template Selection */}
        {currentStep === "select" && (
          <div className="space-y-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Şablon ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--input-background)] border border-[var(--border-color)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  selectedCategory === "all"
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--input-background)] text-[var(--foreground)] hover:bg-[var(--border-color)]"
                }`}
              >
                Tümü
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
                    selectedCategory === cat.id
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--input-background)] text-[var(--foreground)] hover:bg-[var(--border-color)]"
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                  <span className="opacity-75">({cat.count})</span>
                </button>
              ))}
            </div>

            {/* Templates Grid */}
            <div className="grid gap-3">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="p-4 rounded-xl bg-[var(--card-background)] border border-[var(--border-color)] cursor-pointer hover:border-[var(--primary)] transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getCategoryIcon(template.category)}</span>
                      <h3 className="font-semibold text-[var(--foreground)]">{template.name}</h3>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--input-background)] text-[var(--muted-foreground)]">
                      v{template.version}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-3">{template.description}</p>
                  <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                    <span>📋 {template.variables.length} alan</span>
                    <span>•</span>
                    <span>📅 {template.lastUpdated}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.legalBasis.slice(0, 2).map((basis, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      >
                        {basis}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Fill Variables */}
        {currentStep === "fill" && selectedTemplate && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[var(--card-background)] border border-[var(--border-color)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{getCategoryIcon(selectedTemplate.category)}</span>
                <h3 className="font-semibold text-[var(--foreground)]">{selectedTemplate.name}</h3>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">{selectedTemplate.description}</p>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">Eksik veya Hatalı Alanlar</h4>
                <ul className="text-sm text-red-600 dark:text-red-300 list-disc list-inside">
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Variable Groups */}
            {Array.from(groupedVariables.entries()).map(([section, vars]) => (
              <div key={section} className="space-y-3">
                <h4 className="text-sm font-semibold text-[var(--foreground)] border-b border-[var(--border-color)] pb-2">
                  {section}
                </h4>
                <div className="grid gap-4">
                  {vars.map((variable) => (
                    <div key={variable.name}>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                        {variable.label}
                        {variable.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {variable.helpText && (
                        <p className="text-xs text-[var(--muted-foreground)] mb-1">{variable.helpText}</p>
                      )}

                      {variable.type === "text" && (
                        <input
                          type="text"
                          value={(variables[variable.name] as string) || ""}
                          onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                          placeholder={variable.placeholder}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--input-background)] border border-[var(--border-color)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                      )}

                      {variable.type === "multiline" && (
                        <textarea
                          value={(variables[variable.name] as string) || ""}
                          onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                          placeholder={variable.placeholder}
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--input-background)] border border-[var(--border-color)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                        />
                      )}

                      {variable.type === "number" && (
                        <input
                          type="number"
                          value={(variables[variable.name] as number) || (typeof variable.defaultValue === "number" ? variable.defaultValue : "")}
                          onChange={(e) => handleVariableChange(variable.name, parseFloat(e.target.value) || 0)}
                          min={variable.validation?.min}
                          max={variable.validation?.max}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--input-background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                      )}

                      {variable.type === "currency" && (
                        <div className="relative">
                          <input
                            type="number"
                            value={(variables[variable.name] as number) || ""}
                            onChange={(e) => handleVariableChange(variable.name, parseFloat(e.target.value) || 0)}
                            min={variable.validation?.min}
                            className="w-full px-3 py-2 pr-12 rounded-lg bg-[var(--input-background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">₺</span>
                        </div>
                      )}

                      {variable.type === "date" && (
                        <input
                          type="date"
                          value={(variables[variable.name] as string) || ""}
                          onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--input-background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                      )}

                      {variable.type === "select" && variable.options && (
                        <select
                          value={(variables[variable.name] as string) || variable.defaultValue || ""}
                          onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--input-background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                          <option value="">Seçiniz...</option>
                          {variable.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {variable.type === "boolean" && (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(variables[variable.name] as boolean) ?? variable.defaultValue ?? false}
                            onChange={(e) => handleVariableChange(variable.name, e.target.checked)}
                            className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--primary)] focus:ring-[var(--primary)]"
                          />
                          <span className="text-sm text-[var(--foreground)]">Evet</span>
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleGenerate}
              className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity"
            >
              Belgeyi Oluştur
            </button>
          </div>
        )}

        {/* Step 3: Preview */}
        {currentStep === "preview" && generatedDoc && (
          <div className="space-y-4">
            {/* Warnings & Suggestions */}
            {(generatedDoc.warnings.length > 0 || generatedDoc.suggestions.length > 0) && (
              <div className="space-y-2">
                {generatedDoc.warnings.map((warning, i) => (
                  <div key={i} className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <span className="text-sm text-yellow-700 dark:text-yellow-400">⚠️ {warning}</span>
                  </div>
                ))}
                {generatedDoc.suggestions.map((suggestion, i) => (
                  <div key={i} className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <span className="text-sm text-blue-700 dark:text-blue-400">💡 {suggestion}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Meta Info */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-[var(--card-background)] border border-[var(--border-color)] text-center">
                <div className="text-lg font-bold text-[var(--foreground)]">{generatedDoc.wordCount}</div>
                <div className="text-xs text-[var(--muted-foreground)]">Kelime</div>
              </div>
              <div className="p-2 rounded-lg bg-[var(--card-background)] border border-[var(--border-color)] text-center">
                <div className="text-lg font-bold text-[var(--foreground)]">{generatedDoc.estimatedPages}</div>
                <div className="text-xs text-[var(--muted-foreground)]">Sayfa</div>
              </div>
              <div className="p-2 rounded-lg bg-[var(--card-background)] border border-[var(--border-color)] text-center">
                <div className="text-lg font-bold text-[var(--foreground)]">{generatedDoc.legalReferences.length}</div>
                <div className="text-xs text-[var(--muted-foreground)]">Referans</div>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleCopyToClipboard}
                className="flex-1 py-2 rounded-lg bg-[var(--card-background)] border border-[var(--border-color)] text-[var(--foreground)] text-sm font-medium hover:bg-[var(--input-background)] transition-all flex items-center justify-center gap-2"
              >
                📋 Kopyala
              </button>
              <button
                onClick={() => handleExport("txt")}
                className="flex-1 py-2 rounded-lg bg-[var(--card-background)] border border-[var(--border-color)] text-[var(--foreground)] text-sm font-medium hover:bg-[var(--input-background)] transition-all"
              >
                📄 TXT
              </button>
              <button
                onClick={() => handleExport("html")}
                className="flex-1 py-2 rounded-lg bg-[var(--card-background)] border border-[var(--border-color)] text-[var(--foreground)] text-sm font-medium hover:bg-[var(--input-background)] transition-all"
              >
                🌐 HTML
              </button>
              <button
                onClick={() => handleExport("markdown")}
                className="flex-1 py-2 rounded-lg bg-[var(--card-background)] border border-[var(--border-color)] text-[var(--foreground)] text-sm font-medium hover:bg-[var(--input-background)] transition-all"
              >
                📝 MD
              </button>
            </div>

            {/* Document Preview */}
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-[var(--border-color)] max-h-[500px] overflow-auto">
              <pre className="text-sm text-[var(--foreground)] whitespace-pre-wrap font-mono leading-relaxed">
                {generatedDoc.content}
              </pre>
            </div>

            {/* Legal References */}
            <div className="p-4 rounded-xl bg-[var(--card-background)] border border-[var(--border-color)]">
              <h4 className="text-sm font-semibold text-[var(--muted-foreground)] mb-2">Yasal Dayanaklar</h4>
              <div className="flex flex-wrap gap-2">
                {generatedDoc.legalReferences.map((ref, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  >
                    {ref}
                  </span>
                ))}
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => {
                setCurrentStep("fill");
                setGeneratedDoc(null);
              }}
              className="w-full py-2 rounded-lg border border-[var(--border-color)] text-[var(--foreground)] text-sm font-medium hover:bg-[var(--input-background)] transition-all"
            >
              ← Düzenle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
