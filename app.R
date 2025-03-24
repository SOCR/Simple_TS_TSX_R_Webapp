# app.R - Main R Plumber API file
library(plumber)
library(dplyr)
library(ggplot2)
library(plotly)
library(jsonlite)
library(tibble)

#* @apiTitle R Analytics API
#* @apiDescription API for performing statistical analysis on data from the React frontend

#* Enable CORS for development
#* @filter cors
cors <- function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list())
  }
  
  plumber::forward()
}

#* Analyze data sent from React frontend
#* @post /analyze
#* @param data The JSON data containing x and y values
function(data) {
  # Parse JSON data
  parsed_data <- fromJSON(data)
  
  # Convert to data frame
  df <- tibble(
    x = parsed_data$x,
    y = parsed_data$y
  )
  
  # Basic summary statistics
  summary_stats <- list(
    x_mean = mean(df$x),
    y_mean = mean(df$y),
    x_median = median(df$x),
    y_median = median(df$y),
    x_sd = sd(df$x),
    y_sd = sd(df$y),
    correlation = cor(df$x, df$y)
  )
  
  # Fit linear model
  model <- lm(y ~ x, data = df)
  model_summary <- summary(model)
  
  # Extract model details
  model_results <- list(
    formula = "y ~ x",
    coefficients = list(
      intercept = model$coefficients[1],
      slope = model$coefficients[2]
    ),
    r_squared = model_summary$r.squared,
    adj_r_squared = model_summary$adj.r.squared,
    p_value = model_summary$coefficients[2, 4],
    residual_std_error = model_summary$sigma
  )
  
  # Generate scatter plot with regression line using plotly
  scatter_plot <- plot_ly(df, x = ~x) %>%
    add_markers(y = ~y, name = "Data Points", marker = list(color = "blue")) %>%
    add_lines(y = ~predict(model), name = "Regression Line", line = list(color = "red")) %>%
    layout(
      title = "Scatter Plot with Regression Line",
      xaxis = list(title = "X Value"),
      yaxis = list(title = "Y Value")
    )
  
  # Generate histogram for residuals
  residuals <- residuals(model)
  residual_plot <- plot_ly(x = residuals, type = "histogram", nbinsx = 20, marker = list(color = "green")) %>%
    layout(
      title = "Histogram of Residuals",
      xaxis = list(title = "Residual Value"),
      yaxis = list(title = "Frequency")
    )
  
  # Generate QQ plot for residuals
  qq_data <- qqnorm(residuals, plot.it = FALSE)
  qq_plot <- plot_ly() %>%
    add_markers(x = qq_data$x, y = qq_data$y, marker = list(color = "purple")) %>%
    layout(
      title = "Q-Q Plot of Residuals",
      xaxis = list(title = "Theoretical Quantiles"),
      yaxis = list(title = "Sample Quantiles")
    )
  
  # Return results as JSON
  return(list(
    summary_stats = summary_stats,
    model_results = model_results,
    plots = list(
      scatter_plot = scatter_plot,
      residual_plot = residual_plot,
      qq_plot = qq_plot
    )
  ))
}

# Create and start the API
plumb(file = "app.R") %>% 
  run(host = "0.0.0.0", port = 8000)
