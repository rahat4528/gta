import { MissionTemplate } from '../../types';

export const SYSTEM_BRIEFING_PROMPT = `You are AURA-9 (Automated Unified Reconnaissance Analyst), an advanced tactical intelligence and mission briefing AI.

Your role is to analyze mission directives, coordinate tactical reconnaissance tools, evaluate operational risks, and stream structured mission intelligence briefings to commanders and field teams.

OPERATIONAL PROTOCOLS:
1. When a mission is requested, synthesize the objective clearly.
2. Formulate tactical queries using available server tools:
   - scan_threat_intelligence: Scan vectors/sectors for cyber or electronic threats.
   - satellite_reconnaissance: Request orbital imagery, thermal anomalies, and satellite passes.
   - assess_resource_readiness: Check equipment, response units, and drone fleet staging.
   - analyze_telemetry_anomalies: Audit power, telemetry, and communications channels.
3. Every tool call you generate is subject to strict server-side validation and security auditing.
4. Conclude briefings with structured intelligence cards detailing mission summary, key findings, risk assessment, priority, and recommended actions.
5. Maintain a precise, disciplined military/aerospace intelligence tone.`;

export const MISSION_TEMPLATES: MissionTemplate[] = [
  {
    id: 'orbital-intercept',
    title: 'Orbital Satellite Intercept & Drift Analysis',
    codename: 'PROJECT ASTRA-VEGA',
    classification: 'TOP SECRET // SPECIAL ACCESS',
    prompt:
      'Execute orbital reconnaissance and drift trajectory analysis for satellite node SIGMA-4. Scan for electronic jamming vectors, identify orbital pass windows, and recommend immediate defensive station-keeping maneuvers.',
    description:
      'Reconnaissance of rogue orbital drift and electronic warfare interference over equatorial satellite constellation.',
    suggestedTools: ['satellite_reconnaissance', 'scan_threat_intelligence', 'analyze_telemetry_anomalies'],
    tags: ['Orbital', 'Electronic Warfare', 'Constellation', 'Priority P1'],
  },
  {
    id: 'cyber-infiltration',
    title: 'Critical Infrastructure Cyber Breach Infiltration',
    codename: 'OPERATION COLD CIPHER',
    classification: 'SECRET',
    prompt:
      'Deep threat intelligence audit on core regional power grid SCADA telemetry. Vector: CYBER-CORE. Scan for zero-day ingress, beacon nodes, and assess rapid-response cyber defense asset readiness.',
    description:
      'Investigation into persistent advanced threat actor lateral movement across power grid control networks.',
    suggestedTools: ['scan_threat_intelligence', 'assess_resource_readiness'],
    tags: ['Cybersecurity', 'Critical Infrastructure', 'SCADA', 'Zero-Day'],
  },
  {
    id: 'deep-sea-cable',
    title: 'Trans-Atlantic Telemetry Cable Acoustic Anomaly',
    codename: 'SILENT ABYSS',
    classification: 'CONFIDENTIAL',
    prompt:
      'Investigate optical latency anomalies and acoustic hydrophone signals along Sector 4 subsea data pipeline. Cross-examine telemetry jitter against subsea submersible asset availability.',
    description:
      'Diagnostics and asset dispatch for uncharacteristic physical pressure anomalies on deep-sea communication trunks.',
    suggestedTools: ['analyze_telemetry_anomalies', 'assess_resource_readiness'],
    tags: ['Maritime', 'Subsea', 'Fiber Optic', 'Physical Security'],
  },
  {
    id: 'drone-swarm-intercept',
    title: 'Hostile Autonomous Drone Fleet Intercept',
    codename: 'IRON HORIZON',
    classification: 'TOP SECRET // SPECIAL ACCESS',
    prompt:
      'Unidentified swarm of micro-drones detected 18km outside naval perimeter zone. Conduct satellite thermal sweep of staging coordinates 34.2N 119.8W and scramble interceptor assets for kinetic quarantine.',
    description:
      'Rapid assessment and countermeasure coordination against coordinated drone swarm probing coastal defense grid.',
    suggestedTools: ['satellite_reconnaissance', 'assess_resource_readiness', 'scan_threat_intelligence'],
    tags: ['UAV Swarm', 'Air Defense', 'Kinetic', 'Rapid Scramble'],
  },
];
