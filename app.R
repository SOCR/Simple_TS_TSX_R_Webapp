# app.R - Main R Plumber API file
library(plumber)
library(dplyr)
library(ggplot2)
library(plotly)
library(jsonlite)
library(tibble)

#* @apiTitle R Analytics API
#* @apiDescription API for performing statistical analysis on data from the React frontend

#* Enable CORS globally
#* @filter cors
cors <- function(req, res) {
  allowed_origin <- "http://localhost:3000"
  # Set the exact allowed frontend URL

  res$setHeader("Access-Control-Allow-Origin", allowed_origin)
  res$setHeader("Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  # Needed for withCredentials: true
  res$setHeader("Access-Control-Allow-Credentials", "true")

  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list(message = "CORS preflight successful"))
  }

  plumber::forward()
}

#* Analyze data sent from React frontend
#* @post /analyze
#* @serializer json
function(req) {
  # Parse JSON req
  parsed_data <- fromJSON(req$postBody)
  # Convert to data frame
  df <- tibble(
    x = parsed_data$x,
    y = parsed_data$y
  )

  # Basic summary statistics
  summary_stats <- list(
    x_mean = unbox(mean(df$x)),
    y_mean = unbox(mean(df$y)),
    x_median = unbox(median(df$x)),
    y_median = unbox(median(df$y)),
    x_sd = unbox(sd(df$x)),
    y_sd = unbox(sd(df$y)),
    correlation = unbox(cor(df$x, df$y))
  )

  # Fit linear model
  model <- lm(y ~ x, data = df)
  model_summary <- summary(model)

  # Extract model details
  model_results <- list(
    formula = "y ~ x",
    coefficients = list(
      intercept = unbox(model$coefficients[1]),
      slope = unbox(model$coefficients[2])
    ),
    r_squared = unbox(model_summary$r.squared),
    adj_r_squared = unbox(model_summary$adj.r.squared),
    p_value = unbox(model_summary$coefficients[2, 4]),
    residual_std_error = unbox(model_summary$sigma)
  )

  # Generate scatter plot with regression line using plotly
  scatter_plot <- plot_ly(df, x = ~x) %>%
    add_markers(y = ~y, name = "Data Points", marker = list(color = "blue")) %>%
    add_lines(y = ~predict(model),
              name = "Regression Line",
              line = list(color = "red")) %>%
    layout(
      title = "Scatter Plot with Regression Line",
      xaxis = list(title = "X Value"),
      yaxis = list(title = "Y Value")
    )

  # Generate histogram for residuals
  residuals <- residuals(model)
  residual_plot <- plot_ly(x = residuals,
                           type = "histogram",
                           nbinsx = 20,
                           marker = list(color = "green")) %>%
    layout(
      title = "Histogram of Residuals",
      xaxis = list(title = "Residual Value"),
      yaxis = list(title = "Frequency")
    )

  # Generate QQ plot for residuals
  qq_data <- qqnorm(residuals, plot.it = FALSE)
  qq_plot <- plot_ly() %>%
    add_markers(x = qq_data$x,
                y = qq_data$y,
                marker = list(color = "purple")) %>%
    layout(
      title = "Q-Q Plot of Residuals",
      xaxis = list(title = "Theoretical Quantiles"),
      yaxis = list(title = "Sample Quantiles")
    )


  qq_plot_json <- plotly_json(qq_plot, jsonedit = FALSE)
  scatter_plot_json <- plotly_json(scatter_plot, jsonedit = FALSE)
  residual_plot_json <- plotly_json(residual_plot, jsonedit = FALSE)
  # Return results as JSON
  # print(summary_stats)
  # print(model_results)
  # print(scatter_plot)
  # print(qq_plot)
  # print(residual_plot)
  return(list(
    summary_stats = summary_stats,
    model_results = model_results,
    plots = list(
      scatter_plot = scatter_plot_json,
      residual_plot = residual_plot_json,
      qq_plot = qq_plot_json
    )
  ))
}

process_csv_with_metadata <- function(text) {
  # Find where the actual CSV content begins
  csv_start <- grep("^[^-].*,[^,]*$", strsplit(text, "\n")[[1]])
  # Get the first index that contains CSV data (not metadata)
  start_index <- min(csv_start)

  # Split by newlines and take only the CSV content
  lines <- strsplit(text, "\n")[[1]]
  csv_content <- lines[start_index:length(lines)]

  # Join back together
  clean_csv <- paste(csv_content, collapse = "\n")

  # Return the clean CSV content
  return(clean_csv)
}

#* Upload a dataset file and process it
#* @post /upload-dataset
#* @serializer json
function(req, res) {
  # make uploads directory if it doesn't exist
  upload_dir <- "uploads"
  if (!dir.exists(upload_dir)) {
    dir.create(upload_dir)
  }

  # get request body
  file_info <- req$postBody

  # readlines from the request body
  post_text <- paste(readLines(textConnection(file_info)), collapse = "\n")

  # process to eliminate metadata
  lines <- strsplit(post_text, "\n")[[1]]
  boundary_line <- lines[1]
  content_type_index <- grep("Content-Type:", lines)
  if (length(content_type_index) > 0) {
    csv_start_index <- content_type_index[1] + 2

    csv_end_index <- length(lines)
    boundary_end_indices <- grep(boundary_line, lines)
    if (length(boundary_end_indices) > 1) {
      boundary_end_index <- boundary_end_indices[2] - 1
      if (!is.na(boundary_end_index) && boundary_end_index > csv_start_index) {
        csv_end_index <- boundary_end_index
      }
    }

    csv_content <- paste(lines[csv_start_index:csv_end_index], collapse = "\n")

    # gen unique filename
    timestamp <- format(Sys.time(), "%Y%m%d%H%M%S")
    filename <- paste0(upload_dir, "/dataset_", timestamp, ".csv")
    # write the CSV content to a file in uploads directory
    writeLines(csv_content, filename)
  }

  tryCatch({
    data <- read.csv(filename, stringsAsFactors = FALSE)

    data_info <- list(
      success = TRUE,
      filename = basename(filename),
      rows = nrow(data),
      columns = ncol(data),
      column_names = names(data),
      preview = head(data, 5),
      data_types = sapply(data, class)
    )


    return(data_info)

  }, error = function(e) {
    res$status <- 400
    return(list(
      success = FALSE,
      message = paste("Error processing file:", e$message)
    ))
  })
}



#* Get information about a specific dataset
#* @param filename The name of the dataset file
#* @get /dataset-info
#* @serializer json
function(filename) {
  if (grepl("\\.\\.", filename) || !grepl("\\.csv$", filename)) {
    return(list(
      success = FALSE,
      message = "Invalid filename"
    ))
  }

  filepath <- file.path("uploads", filename)

  if (!file.exists(filepath)) {
    return(list(
      success = FALSE,
      message = "File not found"
    ))
  }

  # read the dataset
  tryCatch({
    data <- read.csv(filepath, stringsAsFactors = FALSE)

    return(list(
      success = TRUE,
      filename = filename,
      rows = nrow(data),
      columns = ncol(data),
      column_names = names(data),
      preview = head(data, 5),
      data_types = sapply(data, class)
    ))

  }, error = function(e) {
    return(list(
      success = FALSE,
      message = paste("Error reading file:", e$message)
    ))
  })
}




#* Get list of available datasets
#* @get /datasets
#* @serializer json
function() {
  # list files in the uploads directory
  upload_dir <- "uploads"
  if (!dir.exists(upload_dir)) {
    dir.create(upload_dir)
    return(list(datasets = character(0)))
  }

  files <- list.files(upload_dir, pattern = "*.csv$", full.names = FALSE)

  return(list(datasets = files))
}



#* Get list of available datasets
#* @get /datasets
#* @serializer json
function() {
  upload_dir <- "uploads"
  if (!dir.exists(upload_dir)) {
    dir.create(upload_dir)
    return(list(datasets = character(0)))
  }

  files <- list.files(upload_dir, pattern = "*.csv$", full.names = FALSE)

  # Return the list of available datasets
  return(list(datasets = files))
}
