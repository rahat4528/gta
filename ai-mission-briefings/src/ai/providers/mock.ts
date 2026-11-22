import { AllowedToolName } from '../tools';
import { IntelligenceCard, ToolExecutionRecord } from '../../types';

export interface StreamChunk {
  type: 'token' | 'tool_start' | 'tool_end' | 'card' | 'error' | 'done';
  content?: string;
  record?: ToolExecutionRecord;
  card?: IntelligenceCard;
  error?: string;
}

interface MockScenario {
  intro: string[];
  toolsToCall: Array<{
    toolName: AllowedToolName;
    input: Record<string, any>;
  }>;
  analysisTokens: string[];
  cards: IntelligenceCard[];
}

export function generateMockScenario(prompt: string): MockScenario {
  const lower = prompt.toLowerCase();
  const timestamp = new Date().toISOString();

  // 1. Orbital scenario
  if (lower.includes('orbit') || lower.includes('satellit') || lower.includes('astra')) {
    return {
      intro: [
        'AURA-9 INITIATING TACTICAL STREAM...\n',
        'CLEARANCE: TOP SECRET // NOFORN\n',
        'OBJECTIVE: Orbital Telemetry & Drift Analysis\n\n',
        'Engaging orbital sensors and querying regional ground telemetry nodes...\n',
      ],
      toolsToCall: [
        {
          toolName: 'satellite_reconnaissance',
          input: {
            targetCoordinates: 'EQUATORIAL ORBIT-LEO-4',
            sensorType: 'OPTICAL',
            resolutionMeters: 0.35,
          },
        },
        {
          toolName: 'scan_threat_intelligence',
          input: {
            targetVector: 'ORBITAL-DEFENSE',
            scanDepth: 'DEEP',
            lookbackHours: 48,
          },
        },
      ],
      analysisTokens: [
        '\n[ANALYSIS SYNTHESIS]\n',
        'Orbital imagery confirms station-keeping anomaly on node SIGMA-4. ',
        'Thermal variance of +342.6K detected on attitude thruster assembly. ',
        'Correlating signal interception indicates targeted RF uplink jamming by actor APT-44. ',
        'Station-keeping drift exceeds nominal tolerance by 2.4 milliradians.\n\n',
        'Generating prioritized mission intelligence cards for command review...\n',
      ],
      cards: [
        {
          id: `card-summary-${Date.now()}`,
          type: 'mission_summary',
          title: 'Orbital Anomaly: SIGMA-4 Drift',
          timestamp,
          status: 'verified',
          confidenceScore: 96,
          data: {
            title: 'Orbital Node SIGMA-4 Jamming & Drift',
            objective: 'Quarantine RF uplink jamming and execute defensive thruster burn',
            classification: 'TOP SECRET // SPECIAL ACCESS',
            commander: 'Col. Vance (Space Defense HQ)',
            timestamp,
            overview:
              'SIGMA-4 experienced uncommanded attitude deviation during equatorial pass. Optical telemetry confirms foreign transponder beacon interference.',
            sector: 'ORBITAL QUADRANT 4 (LEO)',
            threatAssessment: 'Active RF disruption by adversary APT-44',
          },
        },
        {
          id: `card-findings-${Date.now()}`,
          type: 'key_findings',
          title: 'Verified Sensor Findings',
          timestamp,
          status: 'verified',
          confidenceScore: 94,
          data: {
            overallConfidence: 94,
            summaryStatement: 'Multiple sensor arrays confirm deliberate uplink degradation.',
            findings: [
              {
                id: 'kf-1',
                title: 'RF Ground Ingress Jamming',
                description: 'Beacon node 198.51.100.84 injecting telemetry desync packets into receiver buffer.',
                category: 'Electronic Warfare',
                confidence: 'HIGH',
                impact: 'Loss of telemetry handshake on ground passes',
              },
              {
                id: 'kf-2',
                title: 'Attitude Thruster Thermal Spike',
                description: 'Thermal IR readings indicate auxiliary propellant valve remains locked at 14% open.',
                category: 'Propulsion Hardware',
                confidence: 'HIGH',
                impact: 'Accelerated fuel depletion and orbital decay risk',
              },
            ],
          },
        },
        {
          id: `card-priority-${Date.now()}`,
          type: 'priority_level',
          title: 'Mission Priority Determination',
          timestamp,
          status: 'verified',
          confidenceScore: 98,
          data: {
            level: 'P1 - CRITICAL',
            reason: 'Station-keeping drift threatens adjacent constellation orbital corridors within 90 minutes.',
            responseTimeframe: '< 20 Minutes to command burn window',
            authorizationSeal: 'AURA-AUTH-0x89EF01',
            escalateToAuthority: 'Orbital Maneuver Directorate',
          },
        },
        {
          id: `card-actions-${Date.now()}`,
          type: 'recommended_actions',
          title: 'Tactical Directives',
          timestamp,
          status: 'verified',
          confidenceScore: 95,
          data: {
            primaryObjective: 'Execute station-keeping counter-burn and rotate encryption ciphers',
            operationalWindow: '45 Minutes',
            actions: [
              {
                id: 'act-1',
                order: 1,
                step: 'Switch SIGMA-4 uplink receiver to hardwired frequency-hopping mode Alpha-7.',
                assignee: 'Space Operations Signals Lead',
                deadline: 'T+5 Minutes',
                riskFactor: 'LOW',
                completed: false,
              },
              {
                id: 'act-2',
                order: 2,
                step: 'Authorize 12-second retrograde RCS burn to halt eastward drift trajectory.',
                assignee: 'Orbital Flight Controller',
                deadline: 'T+18 Minutes',
                riskFactor: 'HIGH',
                completed: false,
              },
              {
                id: 'act-3',
                order: 3,
                step: 'Quarantine ground IP beacon 198.51.100.84 at international uplink gateways.',
                assignee: 'Cyber Defense Taskforce',
                deadline: 'T+30 Minutes',
                riskFactor: 'MEDIUM',
                completed: false,
              },
            ],
          },
        },
      ],
    };
  }

  // 2. Cyber Core Infiltration scenario
  if (lower.includes('cyber') || lower.includes('breach') || lower.includes('scada') || lower.includes('cipher')) {
    return {
      intro: [
        'AURA-9 INITIATING CYBER INCIDENT STREAM...\n',
        'CLEARANCE: SECRET // SPECIAL AUDIT\n',
        'OBJECTIVE: Critical Infrastructure SCADA Infiltration Analysis\n\n',
        'Triggering automated deep threat intelligence scan and asset audit...\n',
      ],
      toolsToCall: [
        {
          toolName: 'scan_threat_intelligence',
          input: {
            targetVector: 'CYBER-CORE',
            scanDepth: 'AGGRESSIVE',
            lookbackHours: 24,
          },
        },
        {
          toolName: 'assess_resource_readiness',
          input: {
            baseId: 'BASE-PACIFIC-CYBER',
            assetTypes: ['cyber_units', 'sigint_radars'],
            minReadinessLevel: 80,
          },
        },
      ],
      analysisTokens: [
        '\n[INCIDENT SYNTHESIS]\n',
        'Ingress vector confirmed: rogue SSH certificate injection on regional transmission gateway. ',
        'Threat actor SILVER-PHANTOM identified executing memory dumps on node substation-04. ',
        'Exfiltration tunnel 203.0.113.19 blocked at router perimeter. ',
        '12 cyber defense operators stationed and prepared for hot-isolation protocol.\n\n',
        'Compiling defense dossier and action items...\n',
      ],
      cards: [
        {
          id: `card-summary-${Date.now()}`,
          type: 'mission_summary',
          title: 'Infrastructure Breach: Substation SCADA',
          timestamp,
          status: 'verified',
          confidenceScore: 92,
          data: {
            title: 'SCADA Core Gateway Intrusion',
            objective: 'Isolate breached substation controller and scrub compromised certificates',
            classification: 'SECRET',
            commander: 'Director Kowalski (Infrastructure Protection)',
            timestamp,
            overview:
              'SILVER-PHANTOM established persistent command-and-control connection across regional grid backbone.',
            sector: 'SECTOR-7 (NORTH ENERGY GRID)',
            threatAssessment: 'Active credential harvesting and lateral probing',
          },
        },
        {
          id: `card-priority-${Date.now()}`,
          type: 'priority_level',
          title: 'Grid Severity Level',
          timestamp,
          status: 'verified',
          confidenceScore: 95,
          data: {
            level: 'P2 - HIGH',
            reason: 'Attacker holds elevated credentials on secondary distribution bus.',
            responseTimeframe: '< 45 Minutes before scheduled telemetry sync',
            authorizationSeal: 'GRID-CYBER-SEAL-88',
            escalateToAuthority: 'Energy Emergency Response Council',
          },
        },
        {
          id: `card-actions-${Date.now()}`,
          type: 'recommended_actions',
          title: 'Countermeasure Procedures',
          timestamp,
          status: 'verified',
          confidenceScore: 96,
          data: {
            primaryObjective: 'Isolate compromised gateway and revoke root signing certs',
            operationalWindow: '1 Hour',
            actions: [
              {
                id: 'act-1',
                order: 1,
                step: 'Sever WAN links on Substation-04; fall back to air-gapped optical link.',
                assignee: 'Field Operations Unit Delta',
                deadline: 'Immediate',
                riskFactor: 'MEDIUM',
                completed: false,
              },
              {
                id: 'act-2',
                order: 2,
                step: 'Rotate all SSH keys and Kerberos ticket-granting tokens across the grid cluster.',
                assignee: 'Identity & Access Lead',
                deadline: 'T+30 Minutes',
                riskFactor: 'LOW',
                completed: false,
              },
            ],
          },
        },
      ],
    };
  }

  // 3. Default Tactical Reconnaissance scenario
  return {
    intro: [
      'AURA-9 COMMAND INTELLIGENCE INITIALIZED...\n',
      'CLEARANCE: CONFIDENTIAL\n',
      `DIRECTIVE: ${prompt.slice(0, 75)}...\n\n`,
      'Deploying telemetry diagnostics and tactical asset verification...\n',
    ],
    toolsToCall: [
      {
        toolName: 'analyze_telemetry_anomalies',
        input: {
          systemCluster: 'CLUSTER-CORE-PRIMARY',
          windowHours: 12,
          sensitivity: 'HIGH',
        },
      },
      {
        toolName: 'assess_resource_readiness',
        input: {
          baseId: 'STAGING-OUTPOST-ECHO',
          assetTypes: ['drones', 'interceptors'],
          minReadinessLevel: 75,
        },
      },
    ],
    analysisTokens: [
      '\n[TACTICAL SUMMARY]\n',
      'Telemetry sweeps indicate unexpected jitter anomalies on primary sensor channels. ',
      'Field assets have been verified at 89% composite readiness with interceptors on scramble alert. ',
      'No critical hull or network breach detected in immediate 5km perimeter.\n\n',
      'Generating situational awareness cards...\n',
    ],
    cards: [
      {
        id: `card-summary-${Date.now()}`,
        type: 'mission_summary',
        title: 'Tactical Reconnaissance Assessment',
        timestamp,
        status: 'verified',
        confidenceScore: 88,
        data: {
          title: 'Perimeter & Signal Diagnostics',
          objective: 'Maintain active perimeter awareness and audit telemetry fluctuations',
          classification: 'CONFIDENTIAL',
          commander: 'Tactical Duty Officer',
          timestamp,
          overview: 'Continuous signal surveillance conducted across local operational theater.',
          sector: 'OUTPOST ECHO PERIMETER',
          threatAssessment: 'Intermittent signal drift observed; monitoring ongoing',
        },
      },
      {
        id: `card-priority-${Date.now()}`,
        type: 'priority_level',
        title: 'Operational Readiness Level',
        timestamp,
        status: 'verified',
        confidenceScore: 90,
        data: {
          level: 'P3 - ELEVATED',
          reason: 'Precautionary heightened alert due to sensor jitter.',
          responseTimeframe: '< 2 Hours',
          authorizationSeal: 'OPS-ECHO-VERIFY-04',
          escalateToAuthority: 'Regional Theater Command',
        },
      },
      {
        id: `card-actions-${Date.now()}`,
        type: 'recommended_actions',
        title: 'Standing Standard Operating Procedures',
        timestamp,
        status: 'verified',
        confidenceScore: 92,
        data: {
          primaryObjective: 'Re-calibrate telemetry nodes and maintain interceptor readiness',
          operationalWindow: '4 Hours',
          actions: [
            {
              id: 'act-1',
              order: 1,
              step: 'Perform diagnostic loopback test on primary antenna arrays.',
              assignee: 'Avionics Technician',
              deadline: 'T+45 Minutes',
              riskFactor: 'LOW',
              completed: false,
            },
            {
              id: 'act-2',
              order: 2,
              step: 'Verify drone fleet battery cycles and sensor calibration.',
              assignee: 'Drone Operations Specialist',
              deadline: 'T+90 Minutes',
              riskFactor: 'LOW',
              completed: false,
            },
          ],
        },
      },
    ],
  };
}
