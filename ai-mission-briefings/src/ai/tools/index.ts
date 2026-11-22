import {
  ScanThreatIntelInputSchema,
  SatelliteReconInputSchema,
  AssessResourceInputSchema,
  AnalyzeTelemetryInputSchema,
} from '../schemas';
import { ToolExecutionRecord, IntelligenceCard } from '../../types';

// Server allowlist of approved tools - strict security enforcement
export const ALLOWED_TOOLS = [
  'scan_threat_intelligence',
  'satellite_reconnaissance',
  'assess_resource_readiness',
  'analyze_telemetry_anomalies',
] as const;

export type AllowedToolName = (typeof ALLOWED_TOOLS)[number];

export function isAllowedTool(toolName: string): toolName is AllowedToolName {
  return (ALLOWED_TOOLS as readonly string[]).includes(toolName);
}

/**
 * Server Tool 1: Threat Intelligence Scan
 */
async function runScanThreatIntel(inputRaw: unknown) {
  const input = ScanThreatIntelInputSchema.parse(inputRaw);

  const vectors: Record<string, any> = {
    'ORBITAL-DEFENSE': {
      threatActor: 'APT-44 (Vostok Eclipse)',
      vulnerabilities: ['CVE-2026-4192 (Ground Station RF Desync)', 'CVE-2026-8812 (Telemetry Buffer Overrun)'],
      signatureMatches: 14,
      compromiseLevel: 'ELEVATED',
      indicatorsOfCompromise: ['198.51.100.84 (Beacon Node)', 'sat-relay-c2.net (Command Server)'],
    },
    'CYBER-CORE': {
      threatActor: 'SILVER-PHANTOM',
      vulnerabilities: ['CVE-2026-1104 (Zero-Day Ingress)', 'CVE-2026-9023 (Firmware Tampering)'],
      signatureMatches: 29,
      compromiseLevel: 'CRITICAL',
      indicatorsOfCompromise: ['203.0.113.19 (Exfiltration Tunnel)', 'ghost-rat.io (Backdoor Target)'],
    },
  };

  const matched = vectors[input.targetVector.toUpperCase()] || {
    threatActor: `Unknown Cluster (${input.targetVector})`,
    vulnerabilities: ['CVE-2026-3021 (Telemetry Ingestion Glitch)'],
    signatureMatches: 8,
    compromiseLevel: input.scanDepth === 'AGGRESSIVE' ? 'HIGH' : 'MEDIUM',
    indicatorsOfCompromise: ['192.0.2.144 (Signal Intercept)'],
  };

  return {
    targetVector: input.targetVector,
    scanDepth: input.scanDepth,
    lookbackHours: input.lookbackHours,
    threatActor: matched.threatActor,
    compromiseLevel: matched.compromiseLevel,
    signatureMatches: matched.signatureMatches,
    vulnerabilities: matched.vulnerabilities,
    indicatorsOfCompromise: matched.indicatorsOfCompromise,
    confidencePercent: 94,
    scanCompletedAt: new Date().toISOString(),
  };
}

/**
 * Server Tool 2: Satellite Reconnaissance
 */
async function runSatelliteRecon(inputRaw: unknown) {
  const input = SatelliteReconInputSchema.parse(inputRaw);

  return {
    targetCoordinates: input.targetCoordinates,
    sensorType: input.sensorType,
    resolutionMeters: input.resolutionMeters,
    satelliteId: 'KH-12 ORBITAL-RECON-7',
    orbitPassTime: 'T+14 Minutes (Zenith elevation 78°)',
    thermalAnomaliesDetected: true,
    infraredSignatureTempKelvin: 342.6,
    surfaceDeviationDetected: true,
    cloudCoverPercent: 12,
    imageryStatus: 'HIGH_FIDELITY_ACQUIRED',
    groundTelemetryHash: '0x88F2C74A9B01E',
  };
}

/**
 * Server Tool 3: Assess Resource Readiness
 */
async function runAssessResources(inputRaw: unknown) {
  const input = AssessResourceInputSchema.parse(inputRaw);

  const assetDatabase: Record<string, any> = {
    drones: { ready: 18, total: 20, status: 'AIRBORNE_READY', fuelLevel: 94 },
    interceptors: { ready: 4, total: 4, status: 'SCRAMBLE_ALERT', fuelLevel: 100 },
    cyber_units: { ready: 12, total: 12, status: 'ACTIVE_DEFENSE', loadCapacity: 45 },
    sigint_radars: { ready: 6, total: 6, status: 'NOMINAL_TRACKING', uptimeHours: 340 },
  };

  const evaluatedAssets = input.assetTypes.map((type) => {
    const key = type.toLowerCase().replace(/\s+/g, '_');
    return {
      type,
      data: assetDatabase[key] || { ready: 8, total: 10, status: 'OPERATIONAL', readinessPercent: 80 },
    };
  });

  return {
    baseId: input.baseId,
    minReadinessRequired: input.minReadinessLevel,
    compositeReadinessScore: 89,
    deploymentClearance: 'AUTHORIZED',
    evaluatedAssets,
    nextShiftHandoff: 'T+4 Hours',
  };
}

/**
 * Server Tool 4: Analyze Telemetry Anomalies
 */
async function runAnalyzeTelemetry(inputRaw: unknown) {
  const input = AnalyzeTelemetryInputSchema.parse(inputRaw);

  return {
    systemCluster: input.systemCluster,
    windowHours: input.windowHours,
    sensitivity: input.sensitivity,
    anomaliesFound: 3,
    deviationStandardDeviations: 3.4,
    metrics: [
      { label: 'Packet Throughput Jitter', value: '14.2 ms', deviation: '+220%', status: 'warning' },
      { label: 'Ground Bus Voltage', value: '48.1 V', deviation: '-4.2%', status: 'nominal' },
      { label: 'Crypto Key Rotation Drift', value: '118 ms', deviation: '+410%', status: 'critical' },
    ],
    recommendedAction: 'Execute immediate key revocation on Cluster-Node-7.',
  };
}

/**
 * Main Server Dispatcher with Allowlist & Zod Validation
 */
export async function executeServerTool(
  toolCallId: string,
  toolName: string,
  input: unknown
): Promise<{
  record: ToolExecutionRecord;
  suggestedCard?: IntelligenceCard;
}> {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // 1. Strict Allowlist Enforcement
  if (!isAllowedTool(toolName)) {
    const errorMsg = `ACCESS DENIED: Tool "${toolName}" is not in the server allowlist.`;
    return {
      record: {
        toolCallId,
        toolName,
        status: 'denied',
        input: typeof input === 'object' && input !== null ? (input as Record<string, unknown>) : { raw: input },
        error: errorMsg,
        timestamp,
        durationMs: Date.now() - start,
      },
    };
  }

  try {
    let output: Record<string, any>;

    switch (toolName) {
      case 'scan_threat_intelligence':
        output = await runScanThreatIntel(input);
        break;
      case 'satellite_reconnaissance':
        output = await runSatelliteRecon(input);
        break;
      case 'assess_resource_readiness':
        output = await runAssessResources(input);
        break;
      case 'analyze_telemetry_anomalies':
        output = await runAnalyzeTelemetry(input);
        break;
    }

    const durationMs = Date.now() - start;

    // Convert tool output into a corresponding Intelligence Card
    const suggestedCard = convertToolOutputToCard(toolName, output);

    return {
      record: {
        toolCallId,
        toolName,
        status: 'completed',
        input: typeof input === 'object' && input !== null ? (input as Record<string, unknown>) : { raw: input },
        output,
        timestamp,
        durationMs,
      },
      suggestedCard,
    };
  } catch (err: unknown) {
    const durationMs = Date.now() - start;
    const errorMsg = err instanceof Error ? err.message : 'Tool execution failed';

    return {
      record: {
        toolCallId,
        toolName,
        status: 'failed',
        input: typeof input === 'object' && input !== null ? (input as Record<string, unknown>) : { raw: input },
        error: errorMsg,
        timestamp,
        durationMs,
      },
    };
  }
}

/**
 * Automatically maps structured tool outputs into Intelligence Cards
 */
function convertToolOutputToCard(toolName: AllowedToolName, output: Record<string, any>): IntelligenceCard {
  const id = `card-tool-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const timestamp = new Date().toISOString();

  switch (toolName) {
    case 'scan_threat_intelligence':
      return {
        id,
        type: 'risk_assessment',
        title: `Threat Intel: Vector ${output.targetVector}`,
        timestamp,
        confidenceScore: output.confidencePercent,
        sourceTool: toolName,
        status: 'verified',
        data: {
          compositeRiskScore: output.compromiseLevel === 'CRITICAL' ? 92 : 75,
          containmentStatus: output.compromiseLevel === 'CRITICAL' ? 'ESCALATING' : 'MONITORED',
          risks: output.vulnerabilities.map((v: string, i: number) => ({
            id: `risk-tool-${i}`,
            threat: `${output.threatActor}: ${v}`,
            level: output.compromiseLevel === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
            probability: 88,
            mitigation: `Isolate ingress ports for ${output.indicatorsOfCompromise[0] || 'vector'}`,
            escalationProtocol: 'Deploy countermeasures and alert Cyber Command.',
          })),
        },
      };

    case 'satellite_reconnaissance':
      return {
        id,
        type: 'supporting_data',
        title: `Orbital Recon Telemetry: ${output.targetCoordinates}`,
        timestamp,
        confidenceScore: 98,
        sourceTool: toolName,
        status: 'verified',
        data: {
          metrics: [
            { label: 'Sensor Resolution', value: `${output.resolutionMeters}m`, unit: 'GSD', status: 'nominal' },
            { label: 'Thermal Anomaly Temp', value: `${output.infraredSignatureTempKelvin}K`, status: output.infraredSignatureTempKelvin > 330 ? 'warning' : 'nominal' },
            { label: 'Next Orbit Window', value: output.orbitPassTime, status: 'nominal' },
            { label: 'Cloud Obscuration', value: `${output.cloudCoverPercent}%`, status: 'nominal' },
          ],
          telemetryNodes: [output.satelliteId, 'GEO-STATION-EAST', 'NORAD-FEED-8'],
          sourceCitations: ['KH-12 Optical Payload', 'Thermal IR Spectrum Analyzer'],
          rawSensorFeed: `SIG_HASH=${output.groundTelemetryHash} // ACQ_STATUS=${output.imageryStatus}`,
        },
      };

    case 'assess_resource_readiness':
      return {
        id,
        type: 'execution_status',
        title: `Resource Readiness: ${output.baseId}`,
        timestamp,
        confidenceScore: output.compositeReadinessScore,
        sourceTool: toolName,
        status: 'verified',
        data: {
          phase: `Readiness Check (${output.deploymentClearance})`,
          progressPercentage: output.compositeReadinessScore,
          authorizedBy: 'Tactical Deployment Center',
          verificationCode: `AUTH-RES-${output.baseId}`,
          currentCheckpoint: 'Assets Staged at Perimeter Alpha',
          estimatedCompletion: output.nextShiftHandoff,
        },
      };

    case 'analyze_telemetry_anomalies':
      return {
        id,
        type: 'key_findings',
        title: `Telemetry Diagnostics: ${output.systemCluster}`,
        timestamp,
        confidenceScore: 91,
        sourceTool: toolName,
        status: 'verified',
        data: {
          overallConfidence: 91,
          summaryStatement: output.recommendedAction,
          findings: output.metrics.map((m: any, i: number) => ({
            id: `tf-${i}`,
            title: `${m.label} Deviation`,
            description: `Current reading: ${m.value} with unexpected anomaly drift of ${m.deviation}.`,
            category: 'System Diagnostics',
            confidence: 'HIGH',
            impact: m.status === 'critical' ? 'High potential for system disruption' : 'Moderate variance',
          })),
        },
      };
  }
}
