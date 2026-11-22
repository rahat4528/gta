export type ClassificationLevel =
  | 'UNCLASSIFIED'
  | 'RESTRICTED'
  | 'CONFIDENTIAL'
  | 'SECRET'
  | 'TOP SECRET // SPECIAL ACCESS';

export type CardType =
  | 'mission_summary'
  | 'key_findings'
  | 'risk_assessment'
  | 'priority_level'
  | 'recommended_actions'
  | 'supporting_data'
  | 'execution_status'
  | 'fallback_error';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type PriorityLevel = 'P1 - CRITICAL' | 'P2 - HIGH' | 'P3 - ELEVATED' | 'P4 - ROUTINE';
export type ToolStatus = 'pending' | 'running' | 'completed' | 'failed' | 'denied';

// Specific card data types
export interface MissionSummaryData {
  title: string;
  objective: string;
  classification: ClassificationLevel;
  commander: string;
  timestamp: string;
  overview: string;
  sector: string;
  threatAssessment: string;
}

export interface KeyFindingItem {
  id: string;
  title: string;
  description: string;
  category: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  impact: string;
}

export interface KeyFindingsData {
  findings: KeyFindingItem[];
  overallConfidence: number; // 0 - 100
  summaryStatement: string;
}

export interface RiskItem {
  id: string;
  threat: string;
  level: RiskLevel;
  probability: number; // 0 - 100
  mitigation: string;
  escalationProtocol: string;
}

export interface RiskAssessmentData {
  risks: RiskItem[];
  compositeRiskScore: number; // 0 - 100
  containmentStatus: 'CONTAINED' | 'MONITORED' | 'ESCALATING' | 'BREACH';
}

export interface PriorityData {
  level: PriorityLevel;
  reason: string;
  responseTimeframe: string;
  authorizationSeal: string;
  escalateToAuthority: string;
}

export interface ActionItem {
  id: string;
  order: number;
  step: string;
  assignee: string;
  deadline: string;
  riskFactor: 'LOW' | 'MEDIUM' | 'HIGH';
  completed?: boolean;
}

export interface RecommendedActionsData {
  actions: ActionItem[];
  primaryObjective: string;
  operationalWindow: string;
}

export interface TelemetryMetric {
  label: string;
  value: string | number;
  unit?: string;
  change?: string;
  status: 'nominal' | 'warning' | 'critical';
}

export interface SupportingData {
  metrics: TelemetryMetric[];
  telemetryNodes: string[];
  sourceCitations: string[];
  rawSensorFeed?: string;
}

export interface ExecutionStatusData {
  phase: string;
  progressPercentage: number;
  authorizedBy: string;
  verificationCode: string;
  currentCheckpoint: string;
  estimatedCompletion: string;
}

export interface FallbackErrorData {
  rawContent: string;
  errorMessage: string;
  schemaIssues?: string[];
  recoveredAt: string;
}

export interface IntelligenceCard {
  id: string;
  type: CardType;
  title: string;
  timestamp: string;
  confidenceScore?: number;
  sourceTool?: string;
  status?: 'verified' | 'provisional' | 'simulated' | 'error';
  data:
    | MissionSummaryData
    | KeyFindingsData
    | RiskAssessmentData
    | PriorityData
    | RecommendedActionsData
    | SupportingData
    | ExecutionStatusData
    | FallbackErrorData;
}

export interface ToolExecutionRecord {
  toolCallId: string;
  toolName: string;
  status: ToolStatus;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  timestamp: string;
  durationMs?: number;
}

export interface MissionMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  cards?: IntelligenceCard[];
  toolCalls?: ToolExecutionRecord[];
  createdAt: string;
  isStreaming?: boolean;
}

export interface MissionDossier {
  id: string;
  title: string;
  codename: string;
  classification: ClassificationLevel;
  createdAt: string;
  updatedAt: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'CRITICAL' | 'STANDBY';
  tags: string[];
  messages: MissionMessage[];
  pinnedCards: IntelligenceCard[];
}

export interface MissionTemplate {
  id: string;
  title: string;
  codename: string;
  classification: ClassificationLevel;
  prompt: string;
  description: string;
  suggestedTools: string[];
  tags: string[];
}
