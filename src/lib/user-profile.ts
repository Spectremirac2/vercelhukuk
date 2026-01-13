/**
 * User Profile & Personalization System
 * Features:
 * - User preferences management
 * - Legal specialization tracking
 * - Search history and favorites
 * - Personalized recommendations
 */

export interface UserProfile {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  // Basic info
  displayName?: string;
  role: UserRole;

  // Legal preferences
  preferences: UserPreferences;

  // Usage statistics
  stats: UserStats;

  // Saved items
  savedCases: SavedCase[];
  savedLegislation: SavedLegislation[];
  searchHistory: SearchHistoryItem[];

  // Personalization data
  interests: LegalInterest[];
  recentTopics: string[];
}

export type UserRole = "lawyer" | "student" | "researcher" | "professional" | "citizen";

export interface UserPreferences {
  // Display
  theme: "light" | "dark" | "system";
  language: "tr" | "en";
  fontSize: "small" | "medium" | "large";

  // Search & Research
  strictMode: boolean;
  defaultSearchMode: "web" | "file" | "hybrid";
  preferredCourts: string[];
  preferredLawAreas: LawArea[];

  // Citations
  citationStyle: "turkish" | "academic" | "simple";
  autoExpandSources: boolean;

  // Notifications
  emailNotifications: boolean;
  deadlineReminders: boolean;

  // AI behavior
  responseLength: "concise" | "detailed" | "comprehensive";
  includeAlternativeViews: boolean;
  showConfidenceScores: boolean;
}

export interface UserStats {
  totalQueries: number;
  totalConversations: number;
  documentsAnalyzed: number;
  casesViewed: number;
  averageSessionDuration: number;
  lastActive: Date;
  joinDate: Date;
}

export interface SavedCase {
  id: string;
  caseId: string;
  court: string;
  caseNumber: string;
  title: string;
  savedAt: Date;
  notes?: string;
  tags?: string[];
  folder?: string;
}

export interface SavedLegislation {
  id: string;
  lawNumber: string;
  lawName: string;
  article?: string;
  savedAt: Date;
  notes?: string;
  tags?: string[];
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  resultCount: number;
  filters?: Record<string, unknown>;
  clicked?: string[];
}

export interface LegalInterest {
  area: LawArea;
  weight: number; // 0-1, how much the user is interested
  lastActivity: Date;
  queryCount: number;
}

export type LawArea =
  | "is_hukuku"          // İş Hukuku
  | "ceza_hukuku"        // Ceza Hukuku
  | "ticaret_hukuku"     // Ticaret Hukuku
  | "idare_hukuku"       // İdare Hukuku
  | "aile_hukuku"        // Aile Hukuku
  | "miras_hukuku"       // Miras Hukuku
  | "borclar_hukuku"     // Borçlar Hukuku
  | "icra_iflas"         // İcra İflas Hukuku
  | "vergi_hukuku"       // Vergi Hukuku
  | "sosyal_guvenlik"    // Sosyal Güvenlik Hukuku
  | "tuketici_hukuku"    // Tüketici Hukuku
  | "rekabet_hukuku"     // Rekabet Hukuku
  | "fikri_mulkiyet"     // Fikri Mülkiyet
  | "veri_koruma"        // Kişisel Veri Koruma
  | "gayrimenkul"        // Gayrimenkul Hukuku
  | "anayasa_hukuku"     // Anayasa Hukuku
  | "diger";             // Diğer

export const LAW_AREA_LABELS: Record<LawArea, string> = {
  is_hukuku: "İş Hukuku",
  ceza_hukuku: "Ceza Hukuku",
  ticaret_hukuku: "Ticaret Hukuku",
  idare_hukuku: "İdare Hukuku",
  aile_hukuku: "Aile Hukuku",
  miras_hukuku: "Miras Hukuku",
  borclar_hukuku: "Borçlar Hukuku",
  icra_iflas: "İcra İflas Hukuku",
  vergi_hukuku: "Vergi Hukuku",
  sosyal_guvenlik: "Sosyal Güvenlik Hukuku",
  tuketici_hukuku: "Tüketici Hukuku",
  rekabet_hukuku: "Rekabet Hukuku",
  fikri_mulkiyet: "Fikri Mülkiyet",
  veri_koruma: "Kişisel Veri Koruma",
  gayrimenkul: "Gayrimenkul Hukuku",
  anayasa_hukuku: "Anayasa Hukuku",
  diger: "Diğer",
};

// Topic detection patterns for personalization
const TOPIC_PATTERNS: Array<{ area: LawArea; patterns: RegExp[] }> = [
  {
    area: "is_hukuku",
    patterns: [/iş\s*(hukuk|kanun|sözleşme)/gi, /işçi|işveren|kıdem|ihbar/gi, /fesih|tazminat/gi],
  },
  {
    area: "ceza_hukuku",
    patterns: [/ceza\s*(hukuk|kanun|dava)/gi, /suç|sanık|müdafi/gi, /hapis|para\s*cezası/gi],
  },
  {
    area: "ticaret_hukuku",
    patterns: [/ticaret\s*(hukuk|kanun)/gi, /şirket|ortaklık|anonim/gi, /iflas|konkordato/gi],
  },
  {
    area: "idare_hukuku",
    patterns: [/idare\s*(hukuk|mahkeme)/gi, /iptal\s*davası|tam\s*yargı/gi, /idari\s*işlem/gi],
  },
  {
    area: "aile_hukuku",
    patterns: [/aile\s*(hukuk|mahkeme)/gi, /boşanma|velayet|nafaka/gi, /evlilik|nişan/gi],
  },
  {
    area: "miras_hukuku",
    patterns: [/miras|tereke|vasiyet/gi, /mirasçı|saklı\s*pay/gi],
  },
  {
    area: "vergi_hukuku",
    patterns: [/vergi|kdv|gelir\s*vergisi/gi, /matrah|beyan/gi, /vergi\s*cezası/gi],
  },
  {
    area: "veri_koruma",
    patterns: [/kişisel\s*veri|kvkk|gdpr/gi, /açık\s*rıza|veri\s*sorumlusu/gi],
  },
  {
    area: "gayrimenkul",
    patterns: [/taşınmaz|gayrimenkul|tapu/gi, /kat\s*mülkiyet|ipotek/gi],
  },
];

/**
 * User Profile Manager
 */
class UserProfileManager {
  private profiles: Map<string, UserProfile> = new Map();

  /**
   * Get or create user profile
   */
  getOrCreateProfile(userId: string): UserProfile {
    let profile = this.profiles.get(userId);

    if (!profile) {
      profile = this.createDefaultProfile(userId);
      this.profiles.set(userId, profile);
    }

    return profile;
  }

  /**
   * Create default profile
   */
  private createDefaultProfile(userId: string): UserProfile {
    const now = new Date();
    return {
      id: userId,
      createdAt: now,
      updatedAt: now,
      role: "citizen",
      preferences: {
        theme: "system",
        language: "tr",
        fontSize: "medium",
        strictMode: false,
        defaultSearchMode: "web",
        preferredCourts: [],
        preferredLawAreas: [],
        citationStyle: "turkish",
        autoExpandSources: true,
        emailNotifications: false,
        deadlineReminders: true,
        responseLength: "detailed",
        includeAlternativeViews: true,
        showConfidenceScores: true,
      },
      stats: {
        totalQueries: 0,
        totalConversations: 0,
        documentsAnalyzed: 0,
        casesViewed: 0,
        averageSessionDuration: 0,
        lastActive: now,
        joinDate: now,
      },
      savedCases: [],
      savedLegislation: [],
      searchHistory: [],
      interests: [],
      recentTopics: [],
    };
  }

  /**
   * Update user preferences
   */
  updatePreferences(userId: string, updates: Partial<UserPreferences>): UserProfile {
    const profile = this.getOrCreateProfile(userId);
    profile.preferences = { ...profile.preferences, ...updates };
    profile.updatedAt = new Date();
    return profile;
  }

  /**
   * Record a query for personalization
   */
  recordQuery(userId: string, query: string, resultCount: number): void {
    const profile = this.getOrCreateProfile(userId);

    // Add to search history
    profile.searchHistory.unshift({
      id: `search_${Date.now()}`,
      query,
      timestamp: new Date(),
      resultCount,
    });

    // Keep only last 100 searches
    profile.searchHistory = profile.searchHistory.slice(0, 100);

    // Update stats
    profile.stats.totalQueries++;
    profile.stats.lastActive = new Date();

    // Detect and update interests
    this.updateInterests(profile, query);

    // Update recent topics
    const detectedTopics = this.detectTopics(query);
    profile.recentTopics = [...new Set([...detectedTopics, ...profile.recentTopics])].slice(0, 20);

    profile.updatedAt = new Date();
  }

  /**
   * Update user interests based on query
   */
  private updateInterests(profile: UserProfile, query: string): void {
    const detectedAreas = this.detectLawAreas(query);

    for (const area of detectedAreas) {
      const existingInterest = profile.interests.find(i => i.area === area);

      if (existingInterest) {
        existingInterest.queryCount++;
        existingInterest.weight = Math.min(1, existingInterest.weight + 0.05);
        existingInterest.lastActivity = new Date();
      } else {
        profile.interests.push({
          area,
          weight: 0.1,
          lastActivity: new Date(),
          queryCount: 1,
        });
      }
    }

    // Decay weights for inactive interests
    const now = Date.now();
    for (const interest of profile.interests) {
      const daysSinceActivity = (now - interest.lastActivity.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceActivity > 7) {
        interest.weight = Math.max(0.01, interest.weight - 0.01);
      }
    }

    // Sort by weight
    profile.interests.sort((a, b) => b.weight - a.weight);
  }

  /**
   * Detect law areas from query
   */
  detectLawAreas(query: string): LawArea[] {
    const detected: LawArea[] = [];

    for (const { area, patterns } of TOPIC_PATTERNS) {
      for (const pattern of patterns) {
        if (pattern.test(query)) {
          detected.push(area);
          break;
        }
      }
    }

    return detected;
  }

  /**
   * Detect specific topics from query
   */
  private detectTopics(query: string): string[] {
    const topics: string[] = [];
    const queryLower = query.toLowerCase();

    // Common legal topics
    const topicKeywords: Record<string, string[]> = {
      "Kıdem Tazminatı": ["kıdem", "tazminat", "fesih"],
      "Boşanma": ["boşanma", "velayet", "nafaka"],
      "KDV İadesi": ["kdv", "iade", "vergi"],
      "KVKK": ["kvkk", "kişisel veri", "gdpr"],
      "İş Kazası": ["iş kazası", "tazminat", "isg"],
      "Miras": ["miras", "tereke", "vasiyet"],
      "Kira Hukuku": ["kira", "tahliye", "kiracı"],
      "Tüketici Hakları": ["tüketici", "ayıplı mal", "iade"],
    };

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(kw => queryLower.includes(kw))) {
        topics.push(topic);
      }
    }

    return topics;
  }

  /**
   * Get personalized recommendations
   */
  getRecommendations(userId: string): {
    suggestedTopics: string[];
    relatedLaws: string[];
    suggestedSearches: string[];
  } {
    const profile = this.getOrCreateProfile(userId);

    // Get top interests
    const topInterests = profile.interests.slice(0, 3);

    // Generate suggestions based on interests
    const suggestedTopics = topInterests.map(i => LAW_AREA_LABELS[i.area]);

    // Related laws based on interests
    const relatedLaws: string[] = [];
    for (const interest of topInterests) {
      const laws = this.getLawsForArea(interest.area);
      relatedLaws.push(...laws);
    }

    // Suggested searches based on recent topics
    const suggestedSearches = profile.recentTopics.slice(0, 5).map(topic => {
      return `${topic} güncel içtihat`;
    });

    return {
      suggestedTopics,
      relatedLaws: [...new Set(relatedLaws)].slice(0, 5),
      suggestedSearches,
    };
  }

  /**
   * Get laws for a specific area
   */
  private getLawsForArea(area: LawArea): string[] {
    const lawsByArea: Record<LawArea, string[]> = {
      is_hukuku: ["4857 sayılı İş Kanunu", "6356 sayılı Sendikalar Kanunu"],
      ceza_hukuku: ["5237 sayılı TCK", "5271 sayılı CMK"],
      ticaret_hukuku: ["6102 sayılı TTK", "6098 sayılı TBK"],
      idare_hukuku: ["2577 sayılı İYUK"],
      aile_hukuku: ["4721 sayılı TMK"],
      miras_hukuku: ["4721 sayılı TMK"],
      borclar_hukuku: ["6098 sayılı TBK"],
      icra_iflas: ["2004 sayılı İİK"],
      vergi_hukuku: ["213 sayılı VUK", "3065 sayılı KDVK"],
      sosyal_guvenlik: ["5510 sayılı SSGSS"],
      tuketici_hukuku: ["6502 sayılı TKHK"],
      rekabet_hukuku: ["4054 sayılı Rekabet Kanunu"],
      fikri_mulkiyet: ["5846 sayılı FSEK"],
      veri_koruma: ["6698 sayılı KVKK"],
      gayrimenkul: ["4721 sayılı TMK", "634 sayılı Kat Mülkiyeti Kanunu"],
      anayasa_hukuku: ["2709 sayılı Anayasa"],
      diger: [],
    };

    return lawsByArea[area] || [];
  }

  /**
   * Save a case to user's collection
   */
  saveCase(userId: string, caseData: Omit<SavedCase, "id" | "savedAt">): SavedCase {
    const profile = this.getOrCreateProfile(userId);

    const savedCase: SavedCase = {
      ...caseData,
      id: `case_${Date.now()}`,
      savedAt: new Date(),
    };

    profile.savedCases.unshift(savedCase);
    profile.updatedAt = new Date();

    return savedCase;
  }

  /**
   * Save legislation to user's collection
   */
  saveLegislation(
    userId: string,
    lawData: Omit<SavedLegislation, "id" | "savedAt">
  ): SavedLegislation {
    const profile = this.getOrCreateProfile(userId);

    const savedLaw: SavedLegislation = {
      ...lawData,
      id: `law_${Date.now()}`,
      savedAt: new Date(),
    };

    profile.savedLegislation.unshift(savedLaw);
    profile.updatedAt = new Date();

    return savedLaw;
  }

  /**
   * Get personalized system prompt
   */
  getPersonalizedSystemPrompt(userId: string): string {
    const profile = this.getOrCreateProfile(userId);
    const parts: string[] = [
      "Sen Türk hukuku konusunda uzmanlaşmış bir AI asistanısın.",
    ];

    // Add role-specific context
    switch (profile.role) {
      case "lawyer":
        parts.push("Kullanıcı bir avukat, teknik ve detaylı yanıtlar ver.");
        break;
      case "student":
        parts.push("Kullanıcı bir hukuk öğrencisi, açıklayıcı ve öğretici ol.");
        break;
      case "researcher":
        parts.push("Kullanıcı bir araştırmacı, akademik kaynaklara da değin.");
        break;
    }

    // Add preferred law areas
    if (profile.preferences.preferredLawAreas.length > 0) {
      const areas = profile.preferences.preferredLawAreas.map(a => LAW_AREA_LABELS[a]).join(", ");
      parts.push(`Kullanıcının ilgilendiği alanlar: ${areas}.`);
    }

    // Add response length preference
    switch (profile.preferences.responseLength) {
      case "concise":
        parts.push("Yanıtları kısa ve öz tut.");
        break;
      case "comprehensive":
        parts.push("Detaylı ve kapsamlı yanıtlar ver, tüm yönleri ele al.");
        break;
    }

    return parts.join(" ");
  }
}

// Singleton instance
export const userProfileManager = new UserProfileManager();

/**
 * Helper to get user ID from request (placeholder)
 */
export function getUserIdFromRequest(): string {
  // In production, extract from auth token/session
  return "default_user";
}
