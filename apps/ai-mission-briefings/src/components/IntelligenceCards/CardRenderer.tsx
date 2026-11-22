'use client';

import { IntelligenceCard } from '../../types';
import { MissionSummaryCard } from './MissionSummaryCard';
import { KeyFindingsCard } from './KeyFindingsCard';
import { RiskAssessmentCard } from './RiskAssessmentCard';
import { PriorityLevelCard } from './PriorityLevelCard';
import { RecommendedActionsCard } from './RecommendedActionsCard';
import { SupportingDataCard } from './SupportingDataCard';
import { ExecutionStatusCard } from './ExecutionStatusCard';
import { FallbackCard } from './FallbackCard';

export function CardRenderer({ card }: { card: IntelligenceCard }) {
  switch (card.type) {
    case 'mission_summary':
      return <MissionSummaryCard card={card} />;
    case 'key_findings':
      return <KeyFindingsCard card={card} />;
    case 'risk_assessment':
      return <RiskAssessmentCard card={card} />;
    case 'priority_level':
      return <PriorityLevelCard card={card} />;
    case 'recommended_actions':
      return <RecommendedActionsCard card={card} />;
    case 'supporting_data':
      return <SupportingDataCard card={card} />;
    case 'execution_status':
      return <ExecutionStatusCard card={card} />;
    case 'fallback_error':
    default:
      return <FallbackCard card={card} />;
  }
}
