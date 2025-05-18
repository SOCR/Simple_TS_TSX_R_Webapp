#* @apiTitle Data Reconstruction Evaluation API
#* @apiDescription API for running and managing data reconstruction evaluation tasks

library(plumber)
library(ggplot2)

# Global task tracking
tasks <- list(
  running = character(0),
  stopped = character(0)
)

# Helper functions
parse_cpu_memory <- function(cpu_memory) {
  parts <- unlist(strsplit(cpu_memory, " / "))
  cpu_str <- gsub(" CPU", "", parts[1])
  cpu <- as.integer(cpu_str)
  memory_str <- gsub(" MB", "", parts[2])
  memory <- as.integer(memory_str)
  
  return(list(cpu = cpu, memory = memory))
}

#* Get task status
#* @get /get_tasks
#* @response 200 A list of running and stopped tasks
function() {
  return(tasks)
}

#* List running and stopped tasks
#* @get /tasks
#* @response 200 A list of running and stopped tasks
function() {
  # For now, return empty lists since we're not using AWS ECS
  list(
    running = character(0),
    stopped = character(0)
  )
}


#* @get /test
#* @response 200 Test API
function() {
  "test"
}

#* Register and run a new DRE task
#* @post /tasks
#* @param original_file The original file name
#* @param obfuscated_files List of obfuscated file names
#* @param replications Number of replications
#* @param choose_targets Whether to choose targets randomly ("random") or specified ("specified")
#* @param targets List of target indices (if choose_targets is "specified")
#* @param choose_features Whether to choose features randomly ("random") or specified ("specified")
#* @param complexity List of complexity values (if choose_features is "random")
#* @param features List of feature names (if choose_features is "specified")
#* @param radius List of radius values
#* @param output_prefix Prefix for output files
#* @param cpu_memory CPU and memory specification (e.g. "2 CPU / 4096 MB")
#* @param username Username for file access
#* @response 200 Task registration and execution details
function(original_file, obfuscated_files, replications, choose_targets, targets = NULL,
         choose_features, complexity = NULL, features = NULL, radius, output_prefix,
         cpu_memory, username) {

  print("Starting task with parameters:")
  print(paste("original_file:", original_file))
  print(paste("obfuscated_files:", paste(obfuscated_files, collapse=", ")))
  print(paste("replications:", replications))
  print(paste("choose_targets:", choose_targets))
  print(paste("targets:", if(is.null(targets)) "NULL" else targets))
  print(paste("choose_features:", choose_features))
  print(paste("complexity:", if(is.null(complexity)) "NULL" else complexity))
  print(paste("features:", if(is.null(features)) "NULL" else paste(features, collapse=", ")))
  print(paste("radius:", radius))
  print(paste("output_prefix:", output_prefix))
  print(paste("cpu_memory:", cpu_memory))
  print(paste("username:", username))

  # Add task to running list
  task_id <- paste0(output_prefix, "_", username)
  tasks$running <<- c(tasks$running, task_id)
  
  tryCatch({
    # Parse CPU and memory
    parsed <- parse_cpu_memory(cpu_memory)
    cpu <- parsed$cpu
    memory <- parsed$memory
    
    # Create output directory if it doesn't exist
    output_dir <- file.path("..", "output", username, output_prefix)
    print(paste("Creating output directory:", output_dir))
    dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)
    
    # Read input files
    original_file_path <- file.path("..", "data", username, original_file)
    print(paste("Reading original file:", original_file_path))
    if (!file.exists(original_file_path)) {
      stop(paste("Original file not found:", original_file_path))
    }
    original_data <- read.csv(original_file_path)
    
    print("Reading obfuscated files:")
    obfuscated_data_list <- lapply(obfuscated_files, function(f) {
      file_path <- file.path("..", "data", username, f)
      print(paste("Reading:", file_path))
      if (!file.exists(file_path)) {
        stop(paste("Obfuscated file not found:", file_path))
      }
      read.csv(file_path)
    })
    
    # Parse parameters
    replications <- as.numeric(replications)
    radius_values <- as.numeric(radius)
    complexity_values <- if (choose_features == "random") {
      as.numeric(complexity)
    } else {
      length(features)
    }
    
    # Initialize results storage
    scores_data <- data.frame()
    complexity_data <- data.frame()
    radius_data <- data.frame()
    distance_tables <- list()
    x_targets <- list()
    p_sets <- complexity_values
    deltas <- radius_values
    
    # Process each obfuscated file
    for (file_idx in seq_along(obfuscated_files)) {
      obfuscated_data <- obfuscated_data_list[[file_idx]]
      
      # For each complexity value
      for (p_idx in seq_along(p_sets)) {
        p <- p_sets[p_idx]
        
        # For each radius value
        for (r_idx in seq_along(deltas)) {
          r <- deltas[r_idx]
          
          # Select features
          if (choose_features == "random") {
            selected_features <- sample(colnames(original_data), p)
          } else {
            selected_features <- features
          }
          
          # Select targets
          print(targets)
          if (choose_targets == "random") {
            targets <- sample(seq_len(nrow(original_data)), replications)
          } else {
            targets <- as.numeric(unlist(strsplit(targets, " ")))
          }
          
          # Store targets for later use
          x_targets[[length(x_targets) + 1]] <- targets
          
          # Calculate distances and scores
          distances <- matrix(0, nrow = replications, ncol = nrow(original_data))
          for (i in seq_len(replications)) {
            target <- targets[i]
            # Convert to numeric vector
            target_data <- as.numeric(unlist(original_data[target, selected_features]))
            
            # Debug print for target data
            print(paste("Target data type:", class(target_data)))
            print(paste("Target data structure:", str(target_data)))
            
            for (j in seq_len(nrow(obfuscated_data))) {
              # Convert to numeric vector
              obfuscated_row <- as.numeric(unlist(obfuscated_data[j, selected_features]))
              
              # Debug print for obfuscated data
              # print(paste("Obfuscated data type:", class(obfuscated_row)))
              # print(paste("Obfuscated data structure:", str(obfuscated_row)))
              
              # Ensure both are numeric
              if (!is.numeric(target_data) || !is.numeric(obfuscated_row)) {
                stop(paste("Non-numeric data found. Target data type:", class(target_data), 
                          "Obfuscated data type:", class(obfuscated_row)))
              }
              
              dist <- sqrt(sum((target_data - obfuscated_row)^2))
              distances[i, j] <- dist
            }
          }
          
          # Calculate scores
          scores <- numeric(replications)
          for (i in seq_len(replications)) {
            target_dist <- distances[i, targets[i]]
            if (!is.numeric(target_dist)) {
              stop(paste("Non-numeric target distance found:", target_dist))
            }
            scores[i] <- mean(distances[i,] <= target_dist)
          }
          
          # Store results
          scores_data <- rbind(scores_data, data.frame(
            file = obfuscated_files[file_idx],
            complexity = p,
            radius = r,
            score = mean(scores)
          ))
          
          complexity_data <- rbind(complexity_data, data.frame(
            file = obfuscated_files[file_idx],
            complexity = p,
            radius = r,
            score = mean(scores)
          ))
          
          radius_data <- rbind(radius_data, data.frame(
            file = obfuscated_files[file_idx],
            complexity = p,
            radius = r,
            score = mean(scores)
          ))
          
          # Store distance table
          key <- paste(obfuscated_files[file_idx], targets[1], p, r)
          distance_tables[[key]] <- data.frame(
            Casej = seq_len(nrow(obfuscated_data)),
            Distance_Perc = distances[1,] / max(distances[1,])
          )
        }
      }
    }
    
    # Save results
    write.csv(scores_data, file.path(output_dir, paste0(output_prefix, "_DRG_Scores_file.csv")), row.names = FALSE)
    write.csv(complexity_data, file.path(output_dir, paste0(output_prefix, "_DRG_Scores_complexity.csv")), row.names = FALSE)
    write.csv(radius_data, file.path(output_dir, paste0(output_prefix, "_DRG_Scores_radius.csv")), row.names = FALSE)
    
    # Save additional data
    saveRDS(x_targets, file.path(output_dir, paste0(output_prefix, "_x_targets.rds")))
    saveRDS(p_sets, file.path(output_dir, paste0(output_prefix, "_p_sets.rds")))
    saveRDS(deltas, file.path(output_dir, paste0(output_prefix, "_deltas.rds")))
    saveRDS(distance_tables, file.path(output_dir, paste0(output_prefix, "_distance_table.rds")))
    
    # Generate and save plots
    # Scores plot
    png(file.path(output_dir, paste0(output_prefix, "_DRG_Scores_file_plot.png")))
    print(ggplot(scores_data, aes(x = file, y = score)) +
      geom_bar(stat = "identity") +
      theme_minimal() +
      labs(title = "Scores by File", x = "File", y = "Score"))
    dev.off()
    
    # Complexity plot
    png(file.path(output_dir, paste0(output_prefix, "_DRG_Scores_complexity_plot.png")))
    print(ggplot(complexity_data, aes(x = complexity, y = score)) +
      geom_line() +
      theme_minimal() +
      labs(title = "Scores by Complexity", x = "Complexity", y = "Score"))
    dev.off()
    
    # Radius plot
    png(file.path(output_dir, paste0(output_prefix, "_DRG_Scores_radius_plot.png")))
    print(ggplot(radius_data, aes(x = radius, y = score)) +
      geom_line() +
      theme_minimal() +
      labs(title = "Scores by Radius", x = "Radius", y = "Score"))
    dev.off()
    
    # Move task from running to stopped
    tasks$running <<- setdiff(tasks$running, task_id)
    tasks$stopped <<- c(tasks$stopped, task_id)
    
    list(
      status = "Task completed successfully",
      output_dir = output_dir
    )
  }, error = function(e) {
    # Move task from running to stopped on error
    tasks$running <<- setdiff(tasks$running, task_id)
    tasks$stopped <<- c(tasks$stopped, task_id)
    stop(e)
  })
}

#* Get task results
#* @get /tasks/<task_id>/results
#* @param task_id The task ID (output prefix)
#* @param username Username for file access
#* @response 200 Task results including scores and plots
function(task_id, username) {
  output_dir <- file.path("..", "output", username, task_id)
  
  # Read result files
  scores_data <- read.csv(file.path(output_dir, paste0(task_id, "_DRG_Scores_file.csv")))
  complexity_data <- read.csv(file.path(output_dir, paste0(task_id, "_DRG_Scores_complexity.csv")))
  radius_data <- read.csv(file.path(output_dir, paste0(task_id, "_DRG_Scores_radius.csv")))
  
  # Read plot files and convert to base64
  plot_files <- c(
    "scores" = paste0(task_id, "_DRG_Scores_file_plot.png"),
    "complexity" = paste0(task_id, "_DRG_Scores_complexity_plot.png"),
    "radius" = paste0(task_id, "_DRG_Scores_radius_plot.png")
  )
  
  plots <- lapply(plot_files, function(plot_file) {
    plot_path <- file.path(output_dir, plot_file)
    if (file.exists(plot_path)) {
      plot_data <- readBin(plot_path, "raw", file.size(plot_path))
      base64enc::base64encode(plot_data)
    } else {
      NULL
    }
  })
  
  list(
    scores = scores_data,
    complexity = complexity_data,
    radius = radius_data,
    plots = plots
  )
}

#* List available files in user's directory
#* @get /files
#* @param username Username for file access
#* @response 200 List of available files
function(username) {
  tryCatch({
    # Create data directory if it doesn't exist
    data_dir <- file.path("..", "data", username)
    if (!dir.exists(data_dir)) {
      dir.create(data_dir, recursive = TRUE, showWarnings = FALSE)
      return(list())
    }
    
    # List files in the user's directory
    files <- list.files(data_dir, pattern = "\\.csv$", full.names = FALSE)
    if (length(files) == 0) {
      return(list())
    }
    
    # Get file information
    file_info <- lapply(files, function(f) {
      file_path <- file.path(data_dir, f)
      list(
        Name = f,
        Size = file.size(file_path)
      )
    })
    
    return(file_info)
  }, error = function(e) {
    # Log the error
    print(paste("Error in /files endpoint:", e$message))
    # Return empty list on error
    return(list())
  })
} 