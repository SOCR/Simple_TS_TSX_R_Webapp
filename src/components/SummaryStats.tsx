// src/components/SummaryStats.tsx
import React from 'react';
import styled from 'styled-components';
import { SummaryStatistics } from '../types/types';

const Container = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
`;

const StatItem = styled.div`
  background-color: white;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StatLabel = styled.div`
  font-size: 0.85em;
  color: #666;
  margin-bottom: 5px;
`;

const StatValue = styled.div`
  font-size: 1.2em;
  font-weight: 500;
  color: #333;
`;

const CorrelationValue = styled(StatValue)<{ value: number }>`
  color: ${props => {
    const absValue = Math.abs(props.value);
    if (absValue > 0.7) return '#2e7d32'; // Strong correlation - green
    if (absValue > 0.3) return '#f57c00'; // Moderate correlation - orange
    return '#c62828'; // Weak correlation - red
  }};
`;

interface SummaryStatsProps {
  stats: SummaryStatistics;
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ stats }) => {
  return (
    <Container>
      <Title>Summary Statistics</Title>
      <StatsGrid>
        <StatItem>
          <StatLabel>Mean of X</StatLabel>
          <StatValue>{stats.x_mean.toFixed(4)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Mean of Y</StatLabel>
          <StatValue>{stats.y_mean.toFixed(4)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Median of X</StatLabel>
          <StatValue>{stats.x_median.toFixed(4)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Median of Y</StatLabel>
          <StatValue>{stats.y_median.toFixed(4)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Standard Deviation of X</StatLabel>
          <StatValue>{stats.x_sd.toFixed(4)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Standard Deviation of Y</StatLabel>
          <StatValue>{stats.y_sd.toFixed(4)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Correlation Coefficient</StatLabel>
          <CorrelationValue value={stats.correlation}>
            {stats.correlation.toFixed(4)}
          </CorrelationValue>
        </StatItem>
      </StatsGrid>
    </Container>
  );
};

export default SummaryStats;
