# GrayRain/SOCR R-Webapp Demo using R-Plumber & React Integration

This project demonstrates how to connect a `React` `TypeScript` frontend with an `R` 
backend using `Plumber API`. The application allows users to generate random data
in the frontend, send it to `R` for analysis, and display the results returned from `R`.

## Implementation Overview

### R Plumber API (Backend)

The `R` backend provides a REST API endpoint `/analyze` that:
1. Receives JSON data containing x and y values from the React frontend
2. Calculates summary statistics (means, medians, standard deviations, correlation)
3. Fits a linear regression model to the data
4. Generates three interactive Plotly visualizations:
   - Scatter plot with regression line
   - Histogram of residuals
   - Q-Q plot for residual normality assessment
5. Returns all results as a structured JSON object

### React/TypeScript Frontend

The React frontend consists of several components:

1. **DataGenerator**: Allows users to:
   - Specify sample size, correlation strength, and noise level
   - Generate random correlated data
   - Send the data to R for analysis

2. **SummaryStats**: Displays basic statistical measures returned from R
   - Color-codes correlation values based on strength

3. **ModelResults**: Shows linear regression results
   - Displays the model equation
   - Presents model statistics in a formatted table
   - Indicates statistical significance with appropriate markers

4. **PlotDisplay**: Renders the three Plotly visualizations returned from R
   - Converts R Plotly objects to JavaScript Plotly format
   - Displays interactive graphs with hover information

5. **AnalysisResults**: Combines all result components into a unified display

### How It Works

1. The user creates simulated data with the DataGenerator component
2. When "Analyze with R" is clicked, the data is sent to the R Plumber API
3. R processes the data and returns analysis results
4. The React application renders the results in an elegant, interactive interface

### Development and Deployment Notes

- Both systems are completely separate but connected via REST API
- The R backend can be deployed on any server that supports R
- The React frontend can be deployed on standard web hosting
- CORS is enabled in the R API to allow cross-origin requests during development

This implementation demonstrates the strategy of using R-Plumber API as a backend 
for a React application, leveraging the strengths of both ecosystems: `R`'s statistical
capabilities and React's interactive UI features.

## Project Structure

The project consists of two main parts:

1. **R Plumber API Backend**: Processes data and performs statistical analysis
2. **React/TypeScript Frontend**: Provides the user interface and visualization

## Setup Instructions

### 1. Set Up the R Backend

#### Prerequisites
- R installed on your system
- Required R packages: plumber, dplyr, ggplot2, plotly, jsonlite, tibble

#### Install R Dependencies
Open R console and run:

```r
install.packages(c("plumber", "dplyr", "ggplot2", "plotly", "jsonlite", "tibble"))
```

#### Run the R Plumber API
1. Save the `app.R` file to your system
2. Navigate to the directory where you saved the file
3. Start the R Plumber API:

```r
Rscript -e "library(plumber); pr <- plumb('app.R'); pr$run(host='0.0.0.0', port=8000)"
```

The `R` API will start on port 8000.

### 2. Set Up the React Frontend

#### Prerequisites
- Node.js and npm installed on your system

#### Installation

```bash
# Clone the repository or create a new project
cd r-analytics-frontend

# Install dependencies
npm install
```

#### Running the Frontend

```bash
npm start
```

The React application will start on http://localhost:3000 and connect to the R Plumber API running on port 8000.

## Using the Application

1. Use the Data Generator to specify sample size, correlation strength, and noise level
2. Click "Generate Data" to create a random dataset with the specified parameters
3. Click "Analyze with R" to send the data to the R backend
4. The R backend will:
   - Calculate summary statistics
   - Fit a linear model
   - Generate plots (scatter plot with regression line, residual histogram, Q-Q plot)
5. The frontend will display all results returned from R

## Technology Stack

### Frontend
- React with TypeScript
- Styled-components for styling
- Plotly.js for visualizations
- Axios for API requests

### Backend
- R programming language
- Plumber for REST API
- dplyr and other tidyverse packages for data manipulation
- plotly for creating interactive visualizations

## Extending the Application

- Add more complex statistical models (multiple regression, ANOVA, etc.)
- Integrate more advanced visualizations
- Add file upload capabilities for custom datasets
- Implement user authentication
- Deploy to production with proper security measures

## References
 - [SOCR](https://socr.umich.edu)
 - [GrayRain](https://gray-rain.com)

