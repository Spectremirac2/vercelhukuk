/**
 * E-Signature Integration Module
 *
 * Electronic signature support for Turkish legal documents:
 * - e-İmza (Qualified Electronic Signature - NES)
 * - Mobil İmza (Mobile Signature)
 * - e-Mühür (Electronic Seal)
 * - Zaman Damgası (Timestamp)
 *
 * Based on:
 * - 5070 sayılı Elektronik İmza Kanunu
 * - Elektronik İmza Kanununun Uygulanmasına İlişkin Usul ve Esaslar
 * - BTK (Bilgi Teknolojileri ve İletişim Kurumu) düzenlemeleri
 * - eIDAS Regulation (EU compatibility)
 */

export interface SignatureRequest {
  id: string;
  documentId: string;
  documentHash: string;
  hashAlgorithm: HashAlgorithm;
  signatureType: SignatureType;
  signers: Signer[];
  workflow: SignatureWorkflow;
  status: SignatureRequestStatus;
  createdAt: Date;
  expiresAt: Date;
  completedAt?: Date;
  metadata: SignatureMetadata;
}

export interface Signer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  tcKimlik?: string;
  role: SignerRole;
  order: number;
  status: SignerStatus;
  signatureMethod?: SignatureMethod;
  signedAt?: Date;
  ipAddress?: string;
  deviceInfo?: string;
  certificate?: CertificateInfo;
}

export interface CertificateInfo {
  serialNumber: string;
  issuer: string;
  subject: string;
  validFrom: Date;
  validTo: Date;
  isQualified: boolean;
  provider: CertificateProvider;
  publicKey?: string;
}

export interface SignatureWorkflow {
  type: "sirayla" | "paralel" | "karma";
  steps: WorkflowStep[];
  currentStep: number;
  requireAllSignatures: boolean;
  notificationSettings: NotificationSettings;
}

export interface WorkflowStep {
  order: number;
  signerIds: string[];
  deadline?: Date;
  reminderSent: boolean;
  completedAt?: Date;
}

export interface NotificationSettings {
  sendEmail: boolean;
  sendSms: boolean;
  reminderDays: number[];
  language: "tr" | "en";
}

export interface SignatureMetadata {
  documentTitle: string;
  documentType: LegalDocumentType;
  purpose: string;
  legalBasis?: string;
  retentionPeriod: number; // days
  confidentialityLevel: "public" | "internal" | "confidential" | "secret";
}

export interface SignatureResult {
  id: string;
  requestId: string;
  signerId: string;
  signature: string;
  signatureAlgorithm: string;
  timestamp: Date;
  timestampToken?: string;
  certificate: CertificateInfo;
  validationResult: ValidationResult;
  auditTrail: AuditEntry[];
}

export interface ValidationResult {
  isValid: boolean;
  signatureValid: boolean;
  certificateValid: boolean;
  timestampValid: boolean;
  chainValid: boolean;
  notRevoked: boolean;
  errors: ValidationError[];
  warnings: string[];
}

export interface ValidationError {
  code: string;
  message: string;
  severity: "error" | "warning";
}

export interface AuditEntry {
  timestamp: Date;
  action: AuditAction;
  actor: string;
  details: string;
  ipAddress?: string;
}

export type AuditAction =
  | "created"
  | "viewed"
  | "signed"
  | "rejected"
  | "expired"
  | "verified"
  | "downloaded"
  | "revoked";

export type SignatureType =
  | "nes"           // Nitelikli Elektronik İmza (Qualified)
  | "gies"          // Güvenli Elektronik İmza (Advanced)
  | "basit"         // Basit Elektronik İmza (Simple)
  | "mobil"         // Mobil İmza
  | "e_muhur";      // Elektronik Mühür (Seal)

export type SignatureMethod =
  | "akilli_kart"   // Smart card
  | "usb_token"     // USB token
  | "mobil_imza"    // Mobile signature
  | "uzaktan_imza"  // Remote signature
  | "bulut_imza";   // Cloud signature

export type SignerRole =
  | "imzalayan"     // Primary signer
  | "onaylayan"     // Approver
  | "tanik"         // Witness
  | "noter";        // Notary

export type SignerStatus =
  | "bekliyor"      // Waiting
  | "imzaladi"      // Signed
  | "reddetti"      // Rejected
  | "suresi_doldu"; // Expired

export type SignatureRequestStatus =
  | "taslak"        // Draft
  | "aktif"         // Active
  | "tamamlandi"    // Completed
  | "iptal"         // Cancelled
  | "suresi_doldu"; // Expired

export type HashAlgorithm = "SHA-256" | "SHA-384" | "SHA-512";

export type CertificateProvider =
  | "e_guven"
  | "turktrust"
  | "kamusm"
  | "e_tugra"
  | "tursign";

export type LegalDocumentType =
  | "sozlesme"
  | "vekaletname"
  | "beyanname"
  | "dilekce"
  | "protokol"
  | "tutanak"
  | "rapor"
  | "diger";

// Turkish certificate providers
const CERTIFICATE_PROVIDERS: Record<
  CertificateProvider,
  { name: string; website: string; type: "public" | "private" }
> = {
  e_guven: {
    name: "E-Güven",
    website: "https://www.e-guven.com",
    type: "private",
  },
  turktrust: {
    name: "TürkTrust",
    website: "https://www.turktrust.com.tr",
    type: "private",
  },
  kamusm: {
    name: "Kamu SM",
    website: "https://www.kamusm.gov.tr",
    type: "public",
  },
  e_tugra: {
    name: "E-Tuğra",
    website: "https://www.e-tugra.com.tr",
    type: "private",
  },
  tursign: {
    name: "Tursign",
    website: "https://www.tursign.com",
    type: "private",
  },
};

// Signature legal validity requirements
const SIGNATURE_REQUIREMENTS = {
  nes: {
    name: "Nitelikli Elektronik İmza",
    legalEquivalent: "Islak imza ile aynı hukuki geçerlilik",
    requirements: [
      "5070 sayılı Kanun kapsamında nitelikli sertifika",
      "BTK tarafından yetkilendirilmiş ESHS'den alınmış sertifika",
      "Güvenli imza oluşturma aracı (akıllı kart/USB token)",
    ],
    validFor: [
      "Tüm özel hukuk sözleşmeleri",
      "Kamu ihaleleri",
      "UYAP işlemleri",
      "e-Devlet başvuruları",
    ],
    notValidFor: [
      "Resmi şekle bağlı sözleşmeler (taşınmaz satışı - noter şartı)",
      "Vasiyetname",
    ],
  },
  gies: {
    name: "Güvenli Elektronik İmza",
    legalEquivalent: "Delil niteliğinde, sözleşmede aksine hüküm yoksa geçerli",
    requirements: [
      "Kişiye özgü olması",
      "İmzalayanın kimliğini tespit edebilme",
      "İmzalanan verideki değişikliklerin saptanabilmesi",
    ],
    validFor: [
      "Ticari sözleşmeler (taraflar kabul ederse)",
      "İç yazışmalar",
      "Onay süreçleri",
    ],
    notValidFor: ["Resmi şekle bağlı işlemler", "Kamu ihaleleri"],
  },
  basit: {
    name: "Basit Elektronik İmza",
    legalEquivalent: "Sınırlı delil değeri",
    requirements: ["Elektronik veri ile mantıksal bağlantı"],
    validFor: ["Bilgilendirme amaçlı belgeler", "İç süreçler"],
    notValidFor: [
      "Hukuki bağlayıcılık gerektiren belgeler",
      "Ticari sözleşmeler",
    ],
  },
  mobil: {
    name: "Mobil İmza",
    legalEquivalent: "NES ile eşdeğer (nitelikli sertifika ile)",
    requirements: [
      "Mobil operatör SIM kartı",
      "Kişisel PIN kodu",
      "GSM operatörü ile anlaşma",
    ],
    validFor: [
      "Bankacılık işlemleri",
      "e-Devlet işlemleri",
      "Sigorta poliçeleri",
    ],
    notValidFor: ["Resmi şekle bağlı sözleşmeler"],
  },
  e_muhur: {
    name: "Elektronik Mühür",
    legalEquivalent: "Tüzel kişi onayı, şirket kaşesi gibi",
    requirements: [
      "Tüzel kişiye ait nitelikli sertifika",
      "Güvenli mühür oluşturma aracı",
    ],
    validFor: [
      "Şirket belgeleri",
      "Fatura ve irsaliye",
      "Resmi yazışmalar",
    ],
    notValidFor: ["Kişisel imza gerektiren belgeler"],
  },
};

/**
 * Generate unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new signature request
 */
export function createSignatureRequest(
  documentId: string,
  documentHash: string,
  signers: Omit<Signer, "id" | "status">[],
  options: SignatureRequestOptions = {}
): SignatureRequest {
  const {
    signatureType = "nes",
    hashAlgorithm = "SHA-256",
    workflowType = "sirayla",
    expirationDays = 30,
    requireAllSignatures = true,
    metadata,
  } = options;

  const signersWithId: Signer[] = signers.map((s, index) => ({
    ...s,
    id: generateId("signer"),
    status: "bekliyor",
    order: s.order ?? index + 1,
  }));

  const workflow = createWorkflow(signersWithId, workflowType);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expirationDays);

  return {
    id: generateId("sigreq"),
    documentId,
    documentHash,
    hashAlgorithm,
    signatureType,
    signers: signersWithId,
    workflow: {
      ...workflow,
      requireAllSignatures,
      notificationSettings: {
        sendEmail: true,
        sendSms: true,
        reminderDays: [7, 3, 1],
        language: "tr",
      },
    },
    status: "taslak",
    createdAt: new Date(),
    expiresAt,
    metadata: metadata || {
      documentTitle: "Belge",
      documentType: "diger",
      purpose: "İmza",
      retentionPeriod: 3650, // 10 years
      confidentialityLevel: "confidential",
    },
  };
}

export interface SignatureRequestOptions {
  signatureType?: SignatureType;
  hashAlgorithm?: HashAlgorithm;
  workflowType?: "sirayla" | "paralel" | "karma";
  expirationDays?: number;
  requireAllSignatures?: boolean;
  metadata?: SignatureMetadata;
}

/**
 * Create workflow from signers
 */
function createWorkflow(
  signers: Signer[],
  type: "sirayla" | "paralel" | "karma"
): Omit<SignatureWorkflow, "requireAllSignatures" | "notificationSettings"> {
  const steps: WorkflowStep[] = [];

  if (type === "paralel") {
    // All signers in one step
    steps.push({
      order: 1,
      signerIds: signers.map((s) => s.id),
      reminderSent: false,
    });
  } else if (type === "sirayla") {
    // Each signer is a separate step
    for (const signer of signers) {
      steps.push({
        order: signer.order,
        signerIds: [signer.id],
        reminderSent: false,
      });
    }
  } else {
    // Karma - group by order
    const orderGroups = new Map<number, string[]>();
    for (const signer of signers) {
      const existing = orderGroups.get(signer.order) || [];
      existing.push(signer.id);
      orderGroups.set(signer.order, existing);
    }

    const sortedOrders = Array.from(orderGroups.keys()).sort((a, b) => a - b);
    for (const order of sortedOrders) {
      steps.push({
        order,
        signerIds: orderGroups.get(order)!,
        reminderSent: false,
      });
    }
  }

  return {
    type,
    steps,
    currentStep: 0,
  };
}

/**
 * Validate signature request
 */
export function validateSignatureRequest(request: SignatureRequest): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check document hash
  if (!request.documentHash || request.documentHash.length < 32) {
    errors.push("Geçersiz belge hash değeri");
  }

  // Check signers
  if (request.signers.length === 0) {
    errors.push("En az bir imzacı gereklidir");
  }

  // Check for NES requirements
  if (request.signatureType === "nes") {
    for (const signer of request.signers) {
      if (!signer.tcKimlik) {
        warnings.push(`${signer.name} için TC Kimlik numarası eksik`);
      }
    }
  }

  // Check expiration
  if (request.expiresAt < new Date()) {
    errors.push("İmza isteği süresi dolmuş");
  }

  // Check workflow
  if (request.workflow.steps.length === 0) {
    errors.push("İş akışı adımları tanımlanmamış");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Sign document (simulate signature process)
 */
export async function signDocument(
  request: SignatureRequest,
  signerId: string,
  signatureMethod: SignatureMethod,
  certificate: CertificateInfo
): Promise<SignatureResult> {
  const signer = request.signers.find((s) => s.id === signerId);
  if (!signer) {
    throw new Error("İmzacı bulunamadı");
  }

  if (signer.status === "imzaladi") {
    throw new Error("Bu belge zaten imzalanmış");
  }

  // Validate certificate
  const certValidation = validateCertificate(certificate);
  if (!certValidation.isValid) {
    throw new Error(`Sertifika geçersiz: ${certValidation.errors.join(", ")}`);
  }

  // Generate signature (simulated)
  const signature = generateSignature(
    request.documentHash,
    request.hashAlgorithm,
    certificate
  );

  // Create timestamp
  const timestamp = new Date();
  const timestampToken = generateTimestampToken(timestamp);

  // Validate result
  const validationResult = validateSignature(
    signature,
    request.documentHash,
    certificate
  );

  // Create audit entry
  const auditEntry: AuditEntry = {
    timestamp,
    action: "signed",
    actor: signer.name,
    details: `Belge ${signatureMethod} yöntemiyle imzalandı`,
  };

  return {
    id: generateId("sigres"),
    requestId: request.id,
    signerId,
    signature,
    signatureAlgorithm: getSignatureAlgorithm(request.hashAlgorithm),
    timestamp,
    timestampToken,
    certificate,
    validationResult,
    auditTrail: [auditEntry],
  };
}

/**
 * Validate certificate
 */
function validateCertificate(certificate: CertificateInfo): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const now = new Date();

  if (certificate.validFrom > now) {
    errors.push("Sertifika henüz geçerli değil");
  }

  if (certificate.validTo < now) {
    errors.push("Sertifika süresi dolmuş");
  }

  if (!certificate.isQualified) {
    errors.push("Nitelikli sertifika değil");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generate signature (simulated)
 */
function generateSignature(
  documentHash: string,
  algorithm: HashAlgorithm,
  certificate: CertificateInfo
): string {
  // In production, this would use actual cryptographic signing
  const signatureData = `${documentHash}:${certificate.serialNumber}:${Date.now()}`;
  return Buffer.from(signatureData).toString("base64");
}

/**
 * Generate timestamp token (simulated)
 */
function generateTimestampToken(timestamp: Date): string {
  // In production, this would request from a TSA (Time Stamp Authority)
  const tokenData = `TST:${timestamp.toISOString()}:${Math.random().toString(36)}`;
  return Buffer.from(tokenData).toString("base64");
}

/**
 * Get signature algorithm name
 */
function getSignatureAlgorithm(hashAlgorithm: HashAlgorithm): string {
  const algorithms: Record<HashAlgorithm, string> = {
    "SHA-256": "RSA-SHA256",
    "SHA-384": "RSA-SHA384",
    "SHA-512": "RSA-SHA512",
  };
  return algorithms[hashAlgorithm];
}

/**
 * Validate signature
 */
function validateSignature(
  signature: string,
  documentHash: string,
  certificate: CertificateInfo
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  // Simulate validation
  const signatureValid = signature.length > 0;
  const certificateValid = certificate.validTo > new Date();
  const timestampValid = true;
  const chainValid = true;
  const notRevoked = true;

  if (!signatureValid) {
    errors.push({
      code: "SIG_INVALID",
      message: "İmza doğrulanamadı",
      severity: "error",
    });
  }

  if (!certificateValid) {
    errors.push({
      code: "CERT_EXPIRED",
      message: "Sertifika süresi dolmuş",
      severity: "error",
    });
  }

  return {
    isValid: errors.filter((e) => e.severity === "error").length === 0,
    signatureValid,
    certificateValid,
    timestampValid,
    chainValid,
    notRevoked,
    errors,
    warnings,
  };
}

/**
 * Verify signed document
 */
export function verifySignedDocument(
  signatureResult: SignatureResult
): ValidationResult {
  return signatureResult.validationResult;
}

/**
 * Get signature requirements for a document type
 */
export function getSignatureRequirements(
  documentType: LegalDocumentType
): {
  recommendedType: SignatureType;
  reason: string;
  alternatives: SignatureType[];
} {
  const requirements: Record<
    LegalDocumentType,
    {
      recommendedType: SignatureType;
      reason: string;
      alternatives: SignatureType[];
    }
  > = {
    sozlesme: {
      recommendedType: "nes",
      reason: "Sözleşmelerin hukuki geçerliliği için NES önerilir",
      alternatives: ["gies", "mobil"],
    },
    vekaletname: {
      recommendedType: "nes",
      reason: "Vekâletname için nitelikli elektronik imza zorunludur",
      alternatives: [],
    },
    beyanname: {
      recommendedType: "nes",
      reason: "Resmi beyanlar için NES gereklidir",
      alternatives: ["mobil"],
    },
    dilekce: {
      recommendedType: "mobil",
      reason: "Dilekçeler için mobil imza yeterlidir",
      alternatives: ["nes", "gies"],
    },
    protokol: {
      recommendedType: "nes",
      reason: "Protokoller için NES önerilir",
      alternatives: ["gies"],
    },
    tutanak: {
      recommendedType: "gies",
      reason: "Tutanaklar için güvenli e-imza yeterlidir",
      alternatives: ["nes", "basit"],
    },
    rapor: {
      recommendedType: "gies",
      reason: "Raporlar için güvenli e-imza yeterlidir",
      alternatives: ["basit"],
    },
    diger: {
      recommendedType: "gies",
      reason: "Genel belgeler için güvenli e-imza önerilir",
      alternatives: ["basit", "mobil"],
    },
  };

  return requirements[documentType];
}

/**
 * Get certificate providers
 */
export function getCertificateProviders(): Array<{
  id: CertificateProvider;
  name: string;
  website: string;
  type: "public" | "private";
}> {
  return Object.entries(CERTIFICATE_PROVIDERS).map(([id, info]) => ({
    id: id as CertificateProvider,
    ...info,
  }));
}

/**
 * Get signature type info
 */
export function getSignatureTypeInfo(type: SignatureType): {
  name: string;
  legalEquivalent: string;
  requirements: string[];
  validFor: string[];
  notValidFor: string[];
} {
  return SIGNATURE_REQUIREMENTS[type];
}

/**
 * Get all signature types
 */
export function getAllSignatureTypes(): Array<{
  type: SignatureType;
  name: string;
  description: string;
}> {
  return Object.entries(SIGNATURE_REQUIREMENTS).map(([type, info]) => ({
    type: type as SignatureType,
    name: info.name,
    description: info.legalEquivalent,
  }));
}

/**
 * Calculate document hash
 */
export async function calculateDocumentHash(
  content: string | ArrayBuffer,
  algorithm: HashAlgorithm = "SHA-256"
): Promise<string> {
  // In browser/Node.js environment
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const data =
      typeof content === "string" ? new TextEncoder().encode(content) : content;
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Fallback (simulated)
  const str = typeof content === "string" ? content : "binary-content";
  return Buffer.from(str).toString("base64").substring(0, 64);
}

/**
 * Format signature request summary
 */
export function formatSignatureRequestSummary(request: SignatureRequest): string {
  const lines: string[] = [];

  lines.push(`## E-İmza Talebi`);
  lines.push(``);
  lines.push(`**Talep ID:** ${request.id}`);
  lines.push(`**Belge:** ${request.metadata.documentTitle}`);
  lines.push(`**İmza Türü:** ${SIGNATURE_REQUIREMENTS[request.signatureType].name}`);
  lines.push(`**Durum:** ${getRequestStatusName(request.status)}`);
  lines.push(``);

  lines.push(`### İmzacılar`);
  for (const signer of request.signers) {
    const statusIcon = signer.status === "imzaladi" ? "[x]" : signer.status === "reddetti" ? "[-]" : "[ ]";
    lines.push(`${statusIcon} ${signer.name} (${getSignerRoleName(signer.role)})`);
    if (signer.signedAt) {
      lines.push(`    İmza Tarihi: ${signer.signedAt.toLocaleString("tr-TR")}`);
    }
  }
  lines.push(``);

  lines.push(`### İş Akışı`);
  lines.push(`- Tür: ${request.workflow.type === "sirayla" ? "Sıralı" : request.workflow.type === "paralel" ? "Paralel" : "Karma"}`);
  lines.push(`- Mevcut Adım: ${request.workflow.currentStep + 1}/${request.workflow.steps.length}`);
  lines.push(``);

  lines.push(`### Süre Bilgisi`);
  lines.push(`- Oluşturulma: ${request.createdAt.toLocaleString("tr-TR")}`);
  lines.push(`- Son Tarih: ${request.expiresAt.toLocaleString("tr-TR")}`);
  if (request.completedAt) {
    lines.push(`- Tamamlanma: ${request.completedAt.toLocaleString("tr-TR")}`);
  }

  return lines.join("\n");
}

/**
 * Get request status name in Turkish
 */
function getRequestStatusName(status: SignatureRequestStatus): string {
  const names: Record<SignatureRequestStatus, string> = {
    taslak: "Taslak",
    aktif: "Aktif",
    tamamlandi: "Tamamlandı",
    iptal: "İptal Edildi",
    suresi_doldu: "Süresi Doldu",
  };
  return names[status];
}

/**
 * Get signer role name in Turkish
 */
function getSignerRoleName(role: SignerRole): string {
  const names: Record<SignerRole, string> = {
    imzalayan: "İmzalayan",
    onaylayan: "Onaylayan",
    tanik: "Tanık",
    noter: "Noter",
  };
  return names[role];
}

/**
 * Get legal requirements for e-signature use
 */
export function getESignatureLegalRequirements(): {
  laws: Array<{ name: string; number: string; relevance: string }>;
  generalPrinciples: string[];
  courtAcceptance: string;
} {
  return {
    laws: [
      {
        name: "Elektronik İmza Kanunu",
        number: "5070",
        relevance: "E-imzanın hukuki geçerliliğini düzenler",
      },
      {
        name: "Türk Borçlar Kanunu",
        number: "6098",
        relevance: "Sözleşmelerin şekil şartlarını düzenler",
      },
      {
        name: "Hukuk Muhakemeleri Kanunu",
        number: "6100",
        relevance: "E-imzalı belgelerin delil değerini düzenler",
      },
      {
        name: "Elektronik Ticaretin Düzenlenmesi Hakkında Kanun",
        number: "6563",
        relevance: "E-ticaret sözleşmelerinde e-imza kullanımı",
      },
    ],
    generalPrinciples: [
      "NES, ıslak imza ile aynı hukuki sonucu doğurur (5070 s.K. m.5)",
      "Resmi şekle bağlı işlemler için NES tek başına yeterli değildir",
      "E-imzalı belgeler HMK kapsamında kesin delil niteliğindedir",
      "Zaman damgası, imzanın atıldığı anı kesin olarak belirler",
    ],
    courtAcceptance:
      "Türk mahkemeleri, nitelikli elektronik imza ile imzalanmış belgeleri tam geçerli kabul etmektedir. UYAP sistemi üzerinden e-imza ile dava açılabilir ve işlem yapılabilir.",
  };
}
