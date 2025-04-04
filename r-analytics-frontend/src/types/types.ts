// src/types/types.ts

export interface DataPoint {
  x: number;
  y: number;
}

export interface DataSet {
  x: number[];
  y: number[];
}

export interface SummaryStatistics {
  x_mean: number;
  y_mean: number;
  x_median: number;
  y_median: number;
  x_sd: number;
  y_sd: number;
  correlation: number;
}

export interface ModelCoefficients {
  intercept: number;
  slope: number;
}

export interface ModelResults {
  formula: string;
  coefficients: ModelCoefficients;
  r_squared: number;
  adj_r_squared: number;
  p_value: number;
  residual_std_error: number;
}

export interface AnalysisResults {
  summary_stats: SummaryStatistics;
  model_results: ModelResults;
  plots: {
    scatter_plot: any;  // Plotly.Figure data from R
    residual_plot: any; // Plotly.Figure data from R
    qq_plot: any;       // Plotly.Figure data from R
  };
}
