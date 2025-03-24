// src/components/PlotDisplay.tsx
import React from 'react';
import styled from 'styled-components';
import Plot from 'react-plotly.js';

const Container = styled.div`
  margin-bottom: 20px;
`;

const PlotContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
`;

interface PlotDisplayProps {
  plots: {
    scatter_plot: any;
    residual_plot: any;
    qq_plot: any;
  };
}

const PlotDisplay: React.FC<PlotDisplayProps> = ({ plots }) => {
  // Function to convert R plotly to JavaScript plotly
  const convertRPlotlyToJS = (rPlotly: any) => {
    if (!rPlotly) return null;
    
    // Create a deep copy to avoid modifying the original
    const plotData = JSON.parse(JSON.stringify(rPlotly));
    
    return {
      data: plotData.data || [],
      layout: plotData.layout || {},
      frames: plotData.frames || [],
      config: {
        responsive: true,
        displayModeBar: true,
        displaylogo: false
      }
    };
  };

  const scatterPlot = convertRPlotlyToJS(plots.scatter_plot);
  const residualPlot = convertRPlotlyToJS(plots.residual_plot);
  const qqPlot = convertRPlotlyToJS(plots.qq_plot);

  return (
    <Container>
      <Title>Data Visualization</Title>
      
      {scatterPlot && (
        <PlotContainer>
          <Plot
            data={scatterPlot.data}
            layout={{
              ...scatterPlot.layout,
              title: 'Scatter Plot with Regression Line',
              autosize: true,
              height: 400,
              margin: { l: 50, r: 50, b: 50, t: 80, pad: 4 }
            }}
            config={scatterPlot.config}
            style={{ width: '100%', height: '100%' }}
          />
        </PlotContainer>
      )}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {residualPlot && (
          <PlotContainer>
            <Plot
              data={residualPlot.data}
              layout={{
                ...residualPlot.layout,
                title: 'Histogram of Residuals',
                autosize: true,
                height: 350,
                margin: { l: 50, r: 50, b: 50, t: 80, pad: 4 }
              }}
              config={residualPlot.config}
              style={{ width: '100%', height: '100%' }}
            />
          </PlotContainer>
        )}
        
        {qqPlot && (
          <PlotContainer>
            <Plot
              data={qqPlot.data}
              layout={{
                ...qqPlot.layout,
                title: 'Q-Q Plot of Residuals',
                autosize: true,
                height: 350,
                margin: { l: 50, r: 50, b: 50, t: 80, pad: 4 }
              }}
              config={qqPlot.config}
              style={{ width: '100%', height: '100%' }}
            />
          </PlotContainer>
        )}
      </div>
    </Container>
  );
};

export default PlotDisplay;
