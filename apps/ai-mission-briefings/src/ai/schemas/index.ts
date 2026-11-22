import { z } from 'zod';
import {
  CardType,
  IntelligenceCard,
} from '../../types';

export const ClassificationSchema = z.enum([
  'UNCLASSIFIED',
  'RESTRICTED',
  'CONFIDENTIAL',
  'SECRET',
  'TOP SECRET // SPECIAL ACCESS',
]);

export const RiskLevelSchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
export const PriorityLevelSchema = z.enum([
  'P1 - CRITICAL',
  'P2 - HIGH',
  'P3 - ELEVATED',
  'P4 - ROUTINE',
]);

// 1. Mission Summary Schema
export const MissionSummarySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  objective: z.string().min(1, 'Objective is required'),
  classification: ClassificationSchema.default('SECRET'),
  commander: z.string().default('Lead Tactical Analyst'),
  timestamp: z.string().default(() => new Date().toISOString()),
  overview: z.string().min(1, 'Overview is required'),
  sector: z.string().default('GLOBAL OPERATIONAL THEATER'),
  threatAssessment: z.string().default('Active surveillance required'),
});

// 2. Key Findings Schema
export const KeyFindingItemSchema = z.object({
  id: z.string().default(() => `kf-${Math.random().toString(36).slice(2, 7)}`),
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().default('Intelligence Signal'),
  confidence: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('HIGH'),
  impact: z.string().default('Direct impact on tactical perimeter'),
});

export const KeyFindingsSchema = z.object({
  findings: z.array(KeyFindingItemSchema).min(1, 'At least one finding required'),
  overallConfidence: z.number().min(0).max(100).default(85),
  summaryStatement: z.string().default('Synthesized from multi-spectral signals and verified telemetry.'),
});

// 3. Risk Assessment Schema
export const RiskItemSchema = z.object({
  id: z.string().default(() => `risk-${Math.random().toString(36).slice(2, 7)}`),
  threat: z.string().min(1),
  level: RiskLevelSchema,
  probability: z.number().min(0).max(100).default(50),
  mitigation: z.string().min(1),
  escalationProtocol: z.string().default('Notify Sector Commander within 15 minutes.'),
});

export const RiskAssessmentSchema = z.object({
  risks: z.array(RiskItemSchema).min(1),
  compositeRiskScore: z.number().min(0).max(100).default(65),
  containmentStatus: z.enum(['CONTAINED', 'MONITORED', 'ESCALATING', 'BREACH']).default('MONITORED'),
});

// 4. Priority Level Schema
export const PrioritySchema = z.object({
  level: PriorityLevelSchema,
  reason: z.string().min(1),
  responseTimeframe: z.string().default('Immediate response (< 30 minutes)'),
  authorizationSeal: z.string().default('SIGINT-AUTH-ALPHA-9'),
  escalateToAuthority: z.string().default('Strategic Operations Command'),
});

// 5. Recommended Actions Schema
export const ActionItemSchema = z.object({
  id: z.string().default(() => `act-${Math.random().toString(36).slice(2, 7)}`),
  order: z.number().int().default(1),
  step: z.string().min(1),
  assignee: z.string().default('Rapid Response Unit'),
  deadline: z.string().default('T+2 Hours'),
  riskFactor: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  completed: z.boolean().default(false),
});

export const RecommendedActionsSchema = z.object({
  actions: z.array(ActionItemSchema).min(1),
  primaryObjective: z.string().default('Neutralize vulnerability and secure theater'),
  operationalWindow: z.string().default('4 Hours from directive authorization'),
});

// 6. Supporting Data Schema
export const TelemetryMetricSchema = z.object({
  label: z.string().min(1),
  value: z.union([z.string(), z.number()]),
  unit: z.string().optional(),
  change: z.string().optional(),
  status: z.enum(['nominal', 'warning', 'critical']).default('nominal'),
});

export const SupportingDataSchema = z.object({
  metrics: z.array(TelemetryMetricSchema).min(1),
  telemetryNodes: z.array(z.string()).default([]),
  sourceCitations: z.array(z.string()).default([]),
  rawSensorFeed: z.string().optional(),
});

// 7. Execution Status Schema
export const ExecutionStatusSchema = z.object({
  phase: z.string().min(1),
  progressPercentage: z.number().min(0).max(100).default(25),
  authorizedBy: z.string().default('HQ Command Operations'),
  verificationCode: z.string().default('0x9F41E8-VERIFIED'),
  currentCheckpoint: z.string().min(1),
  estimatedCompletion: z.string().default('T+6 Hours'),
});

// Tool Call Input Schemas (Server Allowlist & Input Validation)
export const ScanThreatIntelInputSchema = z.object({
  targetVector: z.string().min(2, 'Target vector or sector required'),
  scanDepth: z.enum(['SURFACE', 'DEEP', 'AGGRESSIVE']).default('DEEP'),
  lookbackHours: z.number().min(1).max(72).default(24),
});

export const SatelliteReconInputSchema = z.object({
  targetCoordinates: z.string().min(3, 'Target coordinates or zone required'),
  sensorType: z.enum(['OPTICAL', 'RADAR', 'INFRARED']).default('OPTICAL'),
  resolutionMeters: z.number().min(0.1).max(10).default(0.5),
});

export const AssessResourceInputSchema = z.object({
  baseId: z.string().min(2, 'Base ID or deployment outpost required'),
  assetTypes: z.array(z.string()).min(1, 'At least one asset type required'),
  minReadinessLevel: z.number().min(0).max(100).default(70),
});

export const AnalyzeTelemetryInputSchema = z.object({
  systemCluster: z.string().min(2, 'System cluster identifier required'),
  windowHours: z.number().min(1).max(168).default(12),
  sensitivity: z.enum(['LOW', 'NORMAL', 'HIGH']).default('HIGH'),
});

// Discriminated Schema for Safe Card Parsing
export function safeParseCard(raw: unknown): {
  success: true;
  card: IntelligenceCard;
} | {
  success: false;
  fallback: IntelligenceCard;
  error: string;
} {
  const cardId = `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const nowStr = new Date().toISOString();

  if (!raw || typeof raw !== 'object') {
    return {
      success: false,
      error: 'Malformed intelligence card: payload is not a valid JSON object.',
      fallback: {
        id: cardId,
        type: 'fallback_error',
        title: 'Malformed Intelligence Stream',
        timestamp: nowStr,
        status: 'error',
        data: {
          rawContent: String(raw),
          errorMessage: 'Payload failed fundamental object verification.',
          recoveredAt: nowStr,
        },
      },
    };
  }

  const obj = raw as Record<string, unknown>;
  const cardType = (obj.type as CardType) || 'fallback_error';
  const cardTitle = typeof obj.title === 'string' ? obj.title : 'Intelligence Card';

  try {
    let validatedData: any;

    switch (cardType) {
      case 'mission_summary':
        validatedData = MissionSummarySchema.parse(obj.data || obj);
        break;
      case 'key_findings':
        validatedData = KeyFindingsSchema.parse(obj.data || obj);
        break;
      case 'risk_assessment':
        validatedData = RiskAssessmentSchema.parse(obj.data || obj);
        break;
      case 'priority_level':
        validatedData = PrioritySchema.parse(obj.data || obj);
        break;
      case 'recommended_actions':
        validatedData = RecommendedActionsSchema.parse(obj.data || obj);
        break;
      case 'supporting_data':
        validatedData = SupportingDataSchema.parse(obj.data || obj);
        break;
      case 'execution_status':
        validatedData = ExecutionStatusSchema.parse(obj.data || obj);
        break;
      default:
        throw new Error(`Unrecognized card type: "${cardType}"`);
    }

    return {
      success: true,
      card: {
        id: typeof obj.id === 'string' ? obj.id : cardId,
        type: cardType,
        title: cardTitle,
        timestamp: typeof obj.timestamp === 'string' ? obj.timestamp : nowStr,
        confidenceScore: typeof obj.confidenceScore === 'number' ? obj.confidenceScore : 90,
        sourceTool: typeof obj.sourceTool === 'string' ? obj.sourceTool : undefined,
        status: 'verified',
        data: validatedData,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown validation error';
    return {
      success: false,
      error: errorMsg,
      fallback: {
        id: cardId,
        type: 'fallback_error',
        title: `Schema Validation Anomaly: ${cardTitle}`,
        timestamp: nowStr,
        status: 'error',
        data: {
          rawContent: JSON.stringify(raw, null, 2),
          errorMessage: errorMsg,
          schemaIssues: err instanceof z.ZodError ? err.errors.map((e) => `${e.path.join('.')}: ${e.message}`) : [errorMsg],
          recoveredAt: nowStr,
        },
      },
    };
  }
}
