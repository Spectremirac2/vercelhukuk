/**
 * Multi-Agent Legal Research System
 * Based on 2025-2026 trends: Orchestrator + specialized agents for complex workflows
 * Inspired by LexisNexis Protégé architecture
 */

// Agent types
export type AgentType =
  | "orchestrator"
  | "legal_research"
  | "case_analysis"
  | "statute_search"
  | "precedent_finder"
  | "document_analyzer"
  | "citation_checker"
  | "summary_generator";

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "failed"
  | "cancelled";

export type TaskPriority = "critical" | "high" | "medium" | "low";

export interface AgentCapability {
  name: string;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
}

export interface Agent {
  id: string;
  type: AgentType;
  name: string;
  description: string;
  capabilities: AgentCapability[];
  status: "idle" | "busy" | "error";
  currentTask?: string;
  lastActive: Date;
}

export interface ResearchTask {
  id: string;
  type: AgentType;
  description: string;
  input: Record<string, unknown>;
  status: TaskStatus;
  priority: TaskPriority;
  assignedAgent?: string;
  result?: ResearchResult;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  parentTaskId?: string;
  childTaskIds: string[];
}

export interface ResearchResult {
  taskId: string;
  agentType: AgentType;
  summary: string;
  findings: ResearchFinding[];
  citations: Citation[];
  relatedCases: RelatedCase[];
  recommendations: string[];
  confidence: number;
  processingTime: number;
  sources: string[];
}

export interface ResearchFinding {
  id: string;
  title: string;
  content: string;
  relevance: number;
  source: string;
  category: "statute" | "case" | "doctrine" | "regulation" | "commentary";
  legalArea: string;
  date?: string;
}

export interface Citation {
  id: string;
  text: string;
  source: string;
  type: "kanun" | "yonetmelik" | "ictihat" | "doktrin";
  reference: string;
  isValid: boolean;
  lastVerified: Date;
}

export interface RelatedCase {
  id: string;
  courtName: string;
  caseNumber: string;
  date: string;
  summary: string;
  relevance: number;
  outcome: string;
  keyPoints: string[];
}

export interface ResearchQuery {
  id: string;
  query: string;
  context?: string;
  legalAreas?: string[];
  dateRange?: { start: Date; end: Date };
  jurisdictions?: string[];
  includeCommentary?: boolean;
  maxResults?: number;
  language?: "tr" | "en";
}

export interface ResearchWorkflow {
  id: string;
  name: string;
  description: string;
  query: ResearchQuery;
  tasks: ResearchTask[];
  status: TaskStatus;
  createdAt: Date;
  completedAt?: Date;
  finalResult?: CombinedResearchResult;
}

export interface CombinedResearchResult {
  workflowId: string;
  query: string;
  executiveSummary: string;
  sections: ResearchSection[];
  allCitations: Citation[];
  allCases: RelatedCase[];
  keyFindings: string[];
  recommendations: string[];
  totalProcessingTime: number;
  generatedAt: Date;
}

export interface ResearchSection {
  title: string;
  content: string;
  findings: ResearchFinding[];
  citations: Citation[];
  agentSource: AgentType;
}

// Agent definitions
const agentDefinitions: Record<AgentType, Omit<Agent, "id" | "status" | "currentTask" | "lastActive">> = {
  orchestrator: {
    type: "orchestrator",
    name: "Araştırma Orkestratörü",
    description: "Karmaşık hukuki araştırmaları koordine eden ve alt görevlere bölen ana ajan",
    capabilities: [
      {
        name: "Görev Planlama",
        description: "Araştırma sorgusunu analiz edip alt görevlere ayırır",
        inputTypes: ["query", "context"],
        outputTypes: ["task_plan"],
      },
      {
        name: "Sonuç Birleştirme",
        description: "Alt ajanların sonuçlarını tutarlı bir rapor halinde birleştirir",
        inputTypes: ["task_results[]"],
        outputTypes: ["combined_report"],
      },
      {
        name: "Kalite Kontrolü",
        description: "Sonuçların tutarlılığını ve kalitesini değerlendirir",
        inputTypes: ["research_result"],
        outputTypes: ["quality_assessment"],
      },
    ],
  },
  legal_research: {
    type: "legal_research",
    name: "Genel Hukuki Araştırma Ajanı",
    description: "Kapsamlı hukuki araştırma yapan genel amaçlı ajan",
    capabilities: [
      {
        name: "Mevzuat Tarama",
        description: "İlgili kanun ve yönetmelikleri tarar",
        inputTypes: ["legal_topic", "keywords"],
        outputTypes: ["statute_list", "regulation_list"],
      },
      {
        name: "Doktrin Araştırması",
        description: "Akademik literatür ve hukuki yorumları araştırır",
        inputTypes: ["legal_issue"],
        outputTypes: ["doctrine_findings"],
      },
    ],
  },
  case_analysis: {
    type: "case_analysis",
    name: "Dava Analiz Ajanı",
    description: "Mevcut davaları analiz eden ve stratejik öngörüler sunan ajan",
    capabilities: [
      {
        name: "Dava Değerlendirmesi",
        description: "Dava güçlü ve zayıf yönlerini analiz eder",
        inputTypes: ["case_facts", "legal_issues"],
        outputTypes: ["case_assessment"],
      },
      {
        name: "Risk Analizi",
        description: "Dava risklerini ve olası sonuçları değerlendirir",
        inputTypes: ["case_details"],
        outputTypes: ["risk_assessment"],
      },
      {
        name: "Strateji Önerisi",
        description: "Dava stratejisi önerileri sunar",
        inputTypes: ["case_assessment"],
        outputTypes: ["strategy_recommendations"],
      },
    ],
  },
  statute_search: {
    type: "statute_search",
    name: "Mevzuat Arama Ajanı",
    description: "Türk hukuk mevzuatında arama yapan uzman ajan",
    capabilities: [
      {
        name: "Kanun Arama",
        description: "İlgili kanun maddelerini bulur",
        inputTypes: ["keywords", "legal_area"],
        outputTypes: ["statute_citations"],
      },
      {
        name: "Yönetmelik Arama",
        description: "İlgili yönetmelik ve tebliğleri bulur",
        inputTypes: ["keywords", "issuing_authority"],
        outputTypes: ["regulation_citations"],
      },
      {
        name: "Değişiklik Takibi",
        description: "Mevzuat değişikliklerini takip eder",
        inputTypes: ["statute_reference", "date_range"],
        outputTypes: ["amendment_history"],
      },
    ],
  },
  precedent_finder: {
    type: "precedent_finder",
    name: "Emsal Karar Bulucu",
    description: "İlgili Yargıtay ve Danıştay kararlarını bulan ajan",
    capabilities: [
      {
        name: "Yargıtay Kararı Arama",
        description: "İlgili Yargıtay içtihatlarını bulur",
        inputTypes: ["legal_issue", "keywords"],
        outputTypes: ["yargitay_decisions"],
      },
      {
        name: "Danıştay Kararı Arama",
        description: "İlgili Danıştay kararlarını bulur",
        inputTypes: ["administrative_issue"],
        outputTypes: ["danistay_decisions"],
      },
      {
        name: "Anayasa Mahkemesi Kararı",
        description: "AYM kararlarını araştırır",
        inputTypes: ["constitutional_issue"],
        outputTypes: ["aym_decisions"],
      },
      {
        name: "Benzerlik Analizi",
        description: "Emsal kararları olay benzerliğine göre sıralar",
        inputTypes: ["case_facts", "decisions[]"],
        outputTypes: ["ranked_precedents"],
      },
    ],
  },
  document_analyzer: {
    type: "document_analyzer",
    name: "Belge Analiz Ajanı",
    description: "Hukuki belgeleri analiz eden ve özetleyen ajan",
    capabilities: [
      {
        name: "Sözleşme Analizi",
        description: "Sözleşmeleri hukuki açıdan analiz eder",
        inputTypes: ["contract_text"],
        outputTypes: ["contract_analysis"],
      },
      {
        name: "Dilekçe İncelemesi",
        description: "Dilekçeleri inceleyip öneriler sunar",
        inputTypes: ["petition_text"],
        outputTypes: ["petition_review"],
      },
      {
        name: "Karar Özeti",
        description: "Mahkeme kararlarını özetler",
        inputTypes: ["court_decision"],
        outputTypes: ["decision_summary"],
      },
    ],
  },
  citation_checker: {
    type: "citation_checker",
    name: "Atıf Doğrulama Ajanı",
    description: "Hukuki atıfları doğrulayan ve güncelliğini kontrol eden ajan",
    capabilities: [
      {
        name: "Atıf Doğrulama",
        description: "Kanun atıflarının doğruluğunu kontrol eder",
        inputTypes: ["citation"],
        outputTypes: ["verification_result"],
      },
      {
        name: "Güncellik Kontrolü",
        description: "Atıf yapılan mevzuatın güncelliğini kontrol eder",
        inputTypes: ["statute_reference"],
        outputTypes: ["currency_check"],
      },
      {
        name: "İçtihat Takibi",
        description: "Emsal kararların bozulma durumunu kontrol eder",
        inputTypes: ["case_citation"],
        outputTypes: ["precedent_status"],
      },
    ],
  },
  summary_generator: {
    type: "summary_generator",
    name: "Özet Oluşturucu",
    description: "Araştırma sonuçlarından özet ve raporlar oluşturan ajan",
    capabilities: [
      {
        name: "Yönetici Özeti",
        description: "Kısa ve öz yönetici özeti oluşturur",
        inputTypes: ["research_results"],
        outputTypes: ["executive_summary"],
      },
      {
        name: "Detaylı Rapor",
        description: "Kapsamlı araştırma raporu oluşturur",
        inputTypes: ["research_results", "format_preferences"],
        outputTypes: ["detailed_report"],
      },
      {
        name: "Hukuki Mütalaa",
        description: "Hukuki mütalaa formatında çıktı üretir",
        inputTypes: ["legal_question", "research_results"],
        outputTypes: ["legal_opinion"],
      },
    ],
  },
};

// Turkish legal database simulation
const turkishLegalDatabase = {
  statutes: [
    {
      code: "6098",
      name: "Türk Borçlar Kanunu",
      articles: [
        { number: "1", title: "Sözleşmenin kurulması", content: "Sözleşme, tarafların iradelerini karşılıklı ve birbirine uygun olarak açıklamalarıyla kurulur." },
        { number: "27", title: "Kesin hükümsüzlük", content: "Kanunun emredici hükümlerine, ahlaka, kamu düzenine, kişilik haklarına aykırı veya konusu imkânsız olan sözleşmeler kesin olarak hükümsüzdür." },
        { number: "117", title: "Borcun ifa edilmemesi", content: "Borç, borca aykırı olarak hiç veya gereği gibi ifa edilmezse..." },
        { number: "344", title: "Kira bedeli", content: "Tarafların yenilenen kira dönemlerinde uygulanacak kira bedeline ilişkin anlaşmaları, bir önceki kira yılında tüketici fiyat endeksindeki oniki aylık ortalamalara göre değişim oranını geçmemek koşuluyla geçerlidir." },
        { number: "444", title: "Rekabet yasağı sözleşmesi", content: "Fiil ehliyetine sahip olan işçi, işverene karşı, sözleşmenin sona ermesinden sonra herhangi bir biçimde onunla rekabet etmekten, özellikle kendi hesabına rakip bir işletme açmaktan, başka bir rakip işletmede çalışmaktan veya rakip işletmeyle başka türden bir menfaat ilişkisine girişmekten kaçınmayı yazılı olarak üstlenebilir." },
      ],
    },
    {
      code: "4857",
      name: "İş Kanunu",
      articles: [
        { number: "2", title: "İşçi ve işveren tanımı", content: "Bir iş sözleşmesine dayanarak çalışan gerçek kişiye işçi, işçi çalıştıran gerçek veya tüzel kişiye ya da tüzel kişiliği olmayan kurum ve kuruluşlara işveren denir." },
        { number: "17", title: "Süreli fesih", content: "Belirsiz süreli iş sözleşmelerinin feshinden önce durumun diğer tarafa bildirilmesi gerekir." },
        { number: "18", title: "Feshin geçerli sebebe dayandırılması", content: "Otuz veya daha fazla işçi çalıştıran işyerlerinde en az altı aylık kıdemi olan işçinin belirsiz süreli iş sözleşmesini fesheden işveren, işçinin yeterliliğinden veya davranışlarından ya da işletmenin, işyerinin veya işin gereklerinden kaynaklanan geçerli bir sebebe dayanmak zorundadır." },
        { number: "20", title: "Fesih bildirimine itiraz", content: "İş sözleşmesi feshedilen işçi, fesih bildiriminde sebep gösterilmediği veya gösterilen sebebin geçerli bir sebep olmadığı iddiası ile fesih bildiriminin tebliği tarihinden itibaren bir ay içinde iş mahkemesinde dava açabilir." },
        { number: "63", title: "Çalışma süresi", content: "Genel bakımdan çalışma süresi haftada en çok kırkbeş saattir." },
      ],
    },
    {
      code: "6698",
      name: "Kişisel Verilerin Korunması Kanunu",
      articles: [
        { number: "3", title: "Tanımlar", content: "Açık rıza: Belirli bir konuya ilişkin, bilgilendirilmeye dayanan ve özgür iradeyle açıklanan rıza..." },
        { number: "5", title: "Kişisel verilerin işlenme şartları", content: "Kişisel veriler ilgili kişinin açık rızası olmaksızın işlenemez." },
        { number: "6", title: "Özel nitelikli kişisel verilerin işlenme şartları", content: "Kişilerin ırkı, etnik kökeni, siyasi düşüncesi, felsefi inancı, dini, mezhebi veya diğer inançları, kılık ve kıyafeti, dernek, vakıf ya da sendika üyeliği, sağlığı, cinsel hayatı, ceza mahkûmiyeti ve güvenlik tedbirleriyle ilgili verileri ile biyometrik ve genetik verileri özel nitelikli kişisel veridir." },
        { number: "10", title: "Aydınlatma yükümlülüğü", content: "Kişisel verilerin elde edilmesi sırasında veri sorumlusu veya yetkilendirdiği kişi, ilgili kişilere; veri sorumlusunun ve varsa temsilcisinin kimliği, kişisel verilerin hangi amaçla işleneceği, işlenen kişisel verilerin kimlere ve hangi amaçla aktarılabileceği, kişisel veri toplamanın yöntemi ve hukuki sebebi konularında bilgi vermekle yükümlüdür." },
        { number: "11", title: "İlgili kişinin hakları", content: "Herkes, veri sorumlusuna başvurarak kendisiyle ilgili; kişisel veri işlenip işlenmediğini öğrenme, kişisel verileri işlenmişse buna ilişkin bilgi talep etme..." },
      ],
    },
  ],
  precedents: [
    {
      court: "Yargıtay 9. Hukuk Dairesi",
      caseNumber: "2023/12345 E., 2024/54321 K.",
      date: "2024-03-15",
      summary: "İşe iade davasında işverenin fesih gerekçesinin yetersizliği nedeniyle işe iade kararı",
      keywords: ["işe iade", "geçersiz fesih", "ispat yükü"],
      outcome: "Kabul",
    },
    {
      court: "Yargıtay 3. Hukuk Dairesi",
      caseNumber: "2023/98765 E., 2024/11111 K.",
      date: "2024-02-20",
      summary: "Kira artış oranının TÜFE ile sınırlandırılması hakkında karar",
      keywords: ["kira artışı", "TÜFE", "TBK 344"],
      outcome: "Onama",
    },
    {
      court: "Danıştay 10. Daire",
      caseNumber: "2023/5678 E., 2024/9876 K.",
      date: "2024-01-10",
      summary: "KVKK kapsamında veri ihlali nedeniyle uygulanan idari para cezasının onanması",
      keywords: ["KVKK", "veri ihlali", "idari para cezası"],
      outcome: "Ret",
    },
  ],
};

// Agent instance storage
const agents: Map<string, Agent> = new Map();
const tasks: Map<string, ResearchTask> = new Map();
const workflows: Map<string, ResearchWorkflow> = new Map();

/**
 * Create a new agent instance
 */
export function createAgent(type: AgentType): Agent {
  const definition = agentDefinitions[type];
  const agent: Agent = {
    ...definition,
    id: `agent_${type}_${Date.now()}`,
    status: "idle",
    lastActive: new Date(),
  };
  agents.set(agent.id, agent);
  return agent;
}

/**
 * Get all available agent types with their definitions
 */
export function getAgentTypes(): Array<{
  type: AgentType;
  name: string;
  description: string;
  capabilities: AgentCapability[];
}> {
  return Object.entries(agentDefinitions).map(([type, def]) => ({
    type: type as AgentType,
    name: def.name,
    description: def.description,
    capabilities: def.capabilities,
  }));
}

/**
 * Create a research task
 */
export function createResearchTask(
  type: AgentType,
  description: string,
  input: Record<string, unknown>,
  priority: TaskPriority = "medium",
  parentTaskId?: string
): ResearchTask {
  const task: ResearchTask = {
    id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    description,
    input,
    status: "pending",
    priority,
    createdAt: new Date(),
    parentTaskId,
    childTaskIds: [],
  };
  tasks.set(task.id, task);

  // Link to parent task
  if (parentTaskId) {
    const parentTask = tasks.get(parentTaskId);
    if (parentTask) {
      parentTask.childTaskIds.push(task.id);
    }
  }

  return task;
}

/**
 * Execute a research task (simulation)
 */
function executeTask(task: ResearchTask): ResearchResult {
  const startTime = Date.now();
  const findings: ResearchFinding[] = [];
  const citations: Citation[] = [];
  const relatedCases: RelatedCase[] = [];
  const recommendations: string[] = [];
  const sources: string[] = [];
  let summary = "";

  const query = (task.input.query as string) || (task.input.keywords as string) || "";
  const queryLower = query.toLowerCase();

  // Simulate different agent behaviors
  switch (task.type) {
    case "statute_search":
      // Search statutes
      for (const statute of turkishLegalDatabase.statutes) {
        for (const article of statute.articles) {
          if (
            article.content.toLowerCase().includes(queryLower) ||
            article.title.toLowerCase().includes(queryLower) ||
            queryLower.includes(statute.code)
          ) {
            findings.push({
              id: `finding_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              title: `${statute.name} m.${article.number}`,
              content: article.content,
              relevance: 0.85,
              source: `${statute.code} sayılı ${statute.name}`,
              category: "statute",
              legalArea: statute.name,
            });
            citations.push({
              id: `citation_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              text: `${statute.name} m.${article.number}`,
              source: `${statute.code} sayılı Kanun`,
              type: "kanun",
              reference: `${statute.code} s.K. m.${article.number}`,
              isValid: true,
              lastVerified: new Date(),
            });
            sources.push(`${statute.code} sayılı ${statute.name}`);
          }
        }
      }
      summary = `${findings.length} ilgili mevzuat maddesi bulundu.`;
      break;

    case "precedent_finder":
      // Search precedents
      for (const precedent of turkishLegalDatabase.precedents) {
        if (
          precedent.keywords.some((k) => queryLower.includes(k.toLowerCase())) ||
          precedent.summary.toLowerCase().includes(queryLower)
        ) {
          relatedCases.push({
            id: `case_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            courtName: precedent.court,
            caseNumber: precedent.caseNumber,
            date: precedent.date,
            summary: precedent.summary,
            relevance: 0.8,
            outcome: precedent.outcome,
            keyPoints: precedent.keywords,
          });
          sources.push(`${precedent.court} ${precedent.caseNumber}`);
        }
      }
      summary = `${relatedCases.length} ilgili emsal karar bulundu.`;
      break;

    case "case_analysis":
      summary = "Dava analizi tamamlandı.";
      findings.push({
        id: `finding_${Date.now()}`,
        title: "Dava Değerlendirmesi",
        content: `"${query}" konusundaki dava analiz edildi. Hukuki değerlendirme ve risk analizi hazırlandı.`,
        relevance: 0.9,
        source: "AI Analiz",
        category: "commentary",
        legalArea: "Genel",
      });
      recommendations.push("Delil toplama sürecini hızlandırın");
      recommendations.push("Uzlaşma olanaklarını değerlendirin");
      recommendations.push("Emsal kararları inceleyerek strateji belirleyin");
      break;

    case "document_analyzer":
      summary = "Belge analizi tamamlandı.";
      findings.push({
        id: `finding_${Date.now()}`,
        title: "Belge İncelemesi",
        content: "Belge hukuki açıdan incelendi. Riskler ve öneriler belirlendi.",
        relevance: 0.85,
        source: "AI Analiz",
        category: "commentary",
        legalArea: "Sözleşme Hukuku",
      });
      recommendations.push("Belirsiz maddeleri netleştirin");
      recommendations.push("Eksik hükümleri tamamlayın");
      break;

    case "citation_checker":
      summary = "Atıf kontrolü tamamlandı.";
      findings.push({
        id: `finding_${Date.now()}`,
        title: "Atıf Doğrulama",
        content: "Atıflar kontrol edildi. Güncellik durumları değerlendirildi.",
        relevance: 0.9,
        source: "Mevzuat Kontrolü",
        category: "regulation",
        legalArea: "Genel",
      });
      break;

    case "summary_generator":
      summary = "Özet rapor oluşturuldu.";
      findings.push({
        id: `finding_${Date.now()}`,
        title: "Yönetici Özeti",
        content: `"${query}" konusunda yapılan araştırmanın özeti hazırlandı.`,
        relevance: 1,
        source: "AI Özet",
        category: "commentary",
        legalArea: "Genel",
      });
      break;

    case "legal_research":
    default:
      // Combine statute and precedent search
      for (const statute of turkishLegalDatabase.statutes) {
        for (const article of statute.articles) {
          if (article.content.toLowerCase().includes(queryLower)) {
            findings.push({
              id: `finding_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              title: `${statute.name} m.${article.number}`,
              content: article.content,
              relevance: 0.7,
              source: `${statute.code} sayılı ${statute.name}`,
              category: "statute",
              legalArea: statute.name,
            });
            sources.push(`${statute.code} sayılı ${statute.name}`);
          }
        }
      }
      for (const precedent of turkishLegalDatabase.precedents) {
        if (precedent.summary.toLowerCase().includes(queryLower)) {
          relatedCases.push({
            id: `case_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            courtName: precedent.court,
            caseNumber: precedent.caseNumber,
            date: precedent.date,
            summary: precedent.summary,
            relevance: 0.7,
            outcome: precedent.outcome,
            keyPoints: precedent.keywords,
          });
        }
      }
      summary = `Genel hukuki araştırma tamamlandı. ${findings.length} bulgu, ${relatedCases.length} emsal.`;
  }

  const processingTime = Date.now() - startTime;

  return {
    taskId: task.id,
    agentType: task.type,
    summary,
    findings,
    citations,
    relatedCases,
    recommendations,
    confidence: findings.length > 0 || relatedCases.length > 0 ? 0.85 : 0.5,
    processingTime,
    sources: [...new Set(sources)],
  };
}

/**
 * Run a research task
 */
export async function runResearchTask(taskId: string): Promise<ResearchResult | null> {
  const task = tasks.get(taskId);
  if (!task) return null;

  // Update task status
  task.status = "in_progress";
  task.startedAt = new Date();

  try {
    // Execute the task
    const result = executeTask(task);

    // Update task with result
    task.status = "completed";
    task.completedAt = new Date();
    task.result = result;

    return result;
  } catch (error) {
    task.status = "failed";
    task.error = error instanceof Error ? error.message : "Unknown error";
    return null;
  }
}

/**
 * Create and run a research workflow
 */
export async function runResearchWorkflow(query: ResearchQuery): Promise<CombinedResearchResult> {
  const workflowId = `workflow_${Date.now()}`;
  const workflow: ResearchWorkflow = {
    id: workflowId,
    name: `Araştırma: ${query.query.substring(0, 50)}...`,
    description: query.query,
    query,
    tasks: [],
    status: "in_progress",
    createdAt: new Date(),
  };
  workflows.set(workflowId, workflow);

  // Orchestrator decomposes the query into sub-tasks
  const orchestratorTask = createResearchTask(
    "orchestrator",
    "Ana araştırma koordinasyonu",
    { query: query.query, context: query.context },
    "high"
  );
  workflow.tasks.push(orchestratorTask);

  // Create sub-tasks based on query analysis
  const subTasks: ResearchTask[] = [];

  // Always search statutes
  subTasks.push(
    createResearchTask(
      "statute_search",
      "Mevzuat araştırması",
      { query: query.query, keywords: query.query, legalAreas: query.legalAreas },
      "high",
      orchestratorTask.id
    )
  );

  // Always search precedents
  subTasks.push(
    createResearchTask(
      "precedent_finder",
      "Emsal karar araştırması",
      { query: query.query, keywords: query.query },
      "high",
      orchestratorTask.id
    )
  );

  // General legal research
  subTasks.push(
    createResearchTask(
      "legal_research",
      "Genel hukuki araştırma",
      { query: query.query },
      "medium",
      orchestratorTask.id
    )
  );

  workflow.tasks.push(...subTasks);

  // Execute all tasks
  const results: ResearchResult[] = [];
  for (const task of workflow.tasks) {
    const result = await runResearchTask(task.id);
    if (result) {
      results.push(result);
    }
  }

  // Generate summary
  const summaryTask = createResearchTask(
    "summary_generator",
    "Sonuç özeti oluşturma",
    { query: query.query, results },
    "medium"
  );
  const summaryResult = await runResearchTask(summaryTask.id);
  if (summaryResult) {
    results.push(summaryResult);
  }

  // Combine results
  const allFindings = results.flatMap((r) => r.findings);
  const allCitations = results.flatMap((r) => r.citations);
  const allCases = results.flatMap((r) => r.relatedCases);
  const allRecommendations = [...new Set(results.flatMap((r) => r.recommendations))];
  const totalTime = results.reduce((sum, r) => sum + r.processingTime, 0);

  // Create sections from different agent results
  const sections: ResearchSection[] = results
    .filter((r) => r.findings.length > 0 || r.relatedCases.length > 0)
    .map((r) => ({
      title: agentDefinitions[r.agentType].name,
      content: r.summary,
      findings: r.findings,
      citations: r.citations,
      agentSource: r.agentType,
    }));

  // Generate executive summary
  let executiveSummary = `"${query.query}" konusunda yapılan araştırma sonuçları:\n\n`;
  executiveSummary += `- ${allFindings.length} mevzuat bulgusu tespit edildi\n`;
  executiveSummary += `- ${allCases.length} ilgili emsal karar bulundu\n`;
  executiveSummary += `- ${allCitations.length} atıf doğrulandı\n\n`;
  if (allRecommendations.length > 0) {
    executiveSummary += `Öneriler:\n${allRecommendations.map((r) => `• ${r}`).join("\n")}`;
  }

  // Extract key findings
  const keyFindings = allFindings
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5)
    .map((f) => f.title);

  const combinedResult: CombinedResearchResult = {
    workflowId,
    query: query.query,
    executiveSummary,
    sections,
    allCitations,
    allCases,
    keyFindings,
    recommendations: allRecommendations,
    totalProcessingTime: totalTime,
    generatedAt: new Date(),
  };

  // Update workflow
  workflow.status = "completed";
  workflow.completedAt = new Date();
  workflow.finalResult = combinedResult;

  return combinedResult;
}

/**
 * Quick search across all legal sources
 */
export function quickLegalSearch(query: string): {
  statutes: ResearchFinding[];
  cases: RelatedCase[];
} {
  const queryLower = query.toLowerCase();
  const statutes: ResearchFinding[] = [];
  const cases: RelatedCase[] = [];

  // Search statutes
  for (const statute of turkishLegalDatabase.statutes) {
    for (const article of statute.articles) {
      if (
        article.content.toLowerCase().includes(queryLower) ||
        article.title.toLowerCase().includes(queryLower)
      ) {
        statutes.push({
          id: `quick_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          title: `${statute.name} m.${article.number} - ${article.title}`,
          content: article.content,
          relevance: 0.8,
          source: `${statute.code} sayılı ${statute.name}`,
          category: "statute",
          legalArea: statute.name,
        });
      }
    }
  }

  // Search precedents
  for (const precedent of turkishLegalDatabase.precedents) {
    if (
      precedent.summary.toLowerCase().includes(queryLower) ||
      precedent.keywords.some((k) => k.toLowerCase().includes(queryLower))
    ) {
      cases.push({
        id: `quick_case_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        courtName: precedent.court,
        caseNumber: precedent.caseNumber,
        date: precedent.date,
        summary: precedent.summary,
        relevance: 0.75,
        outcome: precedent.outcome,
        keyPoints: precedent.keywords,
      });
    }
  }

  return { statutes, cases };
}

/**
 * Get task by ID
 */
export function getTask(taskId: string): ResearchTask | undefined {
  return tasks.get(taskId);
}

/**
 * Get workflow by ID
 */
export function getWorkflow(workflowId: string): ResearchWorkflow | undefined {
  return workflows.get(workflowId);
}

/**
 * Get all workflows
 */
export function getAllWorkflows(): ResearchWorkflow[] {
  return Array.from(workflows.values());
}

/**
 * Cancel a task
 */
export function cancelTask(taskId: string): boolean {
  const task = tasks.get(taskId);
  if (task && task.status === "pending") {
    task.status = "cancelled";
    return true;
  }
  return false;
}

/**
 * Export research result to different formats
 */
export function exportResearchResult(
  result: CombinedResearchResult,
  format: "text" | "html" | "markdown"
): string {
  switch (format) {
    case "markdown":
      return `# Hukuki Araştırma Raporu

## Sorgu
${result.query}

## Yönetici Özeti
${result.executiveSummary}

## Temel Bulgular
${result.keyFindings.map((f) => `- ${f}`).join("\n")}

## Detaylı Bölümler
${result.sections
  .map(
    (s) => `### ${s.title}
${s.content}

${s.findings.map((f) => `**${f.title}**\n${f.content}\n`).join("\n")}`
  )
  .join("\n\n")}

## İlgili Emsal Kararlar
${result.allCases
  .map(
    (c) => `- **${c.courtName}** ${c.caseNumber} (${c.date})
  ${c.summary}
  Sonuç: ${c.outcome}`
  )
  .join("\n\n")}

## Öneriler
${result.recommendations.map((r) => `- ${r}`).join("\n")}

---
*Oluşturulma Tarihi: ${result.generatedAt.toLocaleDateString("tr-TR")}*
*İşlem Süresi: ${result.totalProcessingTime}ms*
`;

    case "html":
      return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Hukuki Araştırma Raporu</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 900px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1, h2, h3 { color: #1a365d; }
    .summary { background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .finding { border-left: 4px solid #3182ce; padding-left: 15px; margin: 15px 0; }
    .case { background: #fff5f5; padding: 15px; border-radius: 4px; margin: 10px 0; }
    .meta { color: #718096; font-size: 0.9em; }
  </style>
</head>
<body>
  <h1>Hukuki Araştırma Raporu</h1>
  <p class="meta">Sorgu: ${result.query}</p>

  <div class="summary">
    <h2>Yönetici Özeti</h2>
    <pre style="white-space: pre-wrap;">${result.executiveSummary}</pre>
  </div>

  <h2>Temel Bulgular</h2>
  <ul>
    ${result.keyFindings.map((f) => `<li>${f}</li>`).join("")}
  </ul>

  <h2>Detaylı Bölümler</h2>
  ${result.sections
    .map(
      (s) => `
    <h3>${s.title}</h3>
    <p>${s.content}</p>
    ${s.findings.map((f) => `<div class="finding"><strong>${f.title}</strong><p>${f.content}</p></div>`).join("")}
  `
    )
    .join("")}

  <h2>İlgili Emsal Kararlar</h2>
  ${result.allCases
    .map(
      (c) => `
    <div class="case">
      <strong>${c.courtName}</strong> ${c.caseNumber} (${c.date})<br>
      ${c.summary}<br>
      <em>Sonuç: ${c.outcome}</em>
    </div>
  `
    )
    .join("")}

  <h2>Öneriler</h2>
  <ul>
    ${result.recommendations.map((r) => `<li>${r}</li>`).join("")}
  </ul>

  <p class="meta">
    Oluşturulma: ${result.generatedAt.toLocaleDateString("tr-TR")} |
    İşlem Süresi: ${result.totalProcessingTime}ms
  </p>
</body>
</html>`;

    case "text":
    default:
      return `HUKUKI ARAŞTIRMA RAPORU
${"=".repeat(50)}

Sorgu: ${result.query}

YÖNETİCİ ÖZETİ
${"-".repeat(30)}
${result.executiveSummary}

TEMEL BULGULAR
${"-".repeat(30)}
${result.keyFindings.map((f) => `• ${f}`).join("\n")}

DETAYLI BÖLÜMLER
${"-".repeat(30)}
${result.sections.map((s) => `\n${s.title}\n${s.content}\n`).join("\n")}

İLGİLİ EMSAL KARARLAR
${"-".repeat(30)}
${result.allCases.map((c) => `• ${c.courtName} ${c.caseNumber}\n  ${c.summary}\n  Sonuç: ${c.outcome}`).join("\n\n")}

ÖNERİLER
${"-".repeat(30)}
${result.recommendations.map((r) => `• ${r}`).join("\n")}

${"=".repeat(50)}
Oluşturulma: ${result.generatedAt.toLocaleDateString("tr-TR")}
İşlem Süresi: ${result.totalProcessingTime}ms
`;
  }
}
