# Install necessary packages if not already installed
# install.packages(c("plumber", "jsonlite"))

library(plumber)
library(jsonlite)

#* @apiTitle R Statistics API
#* @apiDescription A simple API for calculating basic statistics from a list of numbers

#* @filter cors
cors <- function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type")
  
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list())
  }
  
  plumber::forward()
}

#* Check if the API is running
#* @get /
function() {
  list(status = "R Statistics API is running")
}

#* Calculate basic statistics for a list of numbers
#* @post /stats
function(req) {
  # Parse the JSON string into an R object
  data <- tryCatch({
    jsonlite::fromJSON(req$postBody)
  }, error = function(e) {
    return(list(error = "Failed to parse JSON input"))
  })
  
  # Check if the data structure is as expected
  if (!is.list(data) || is.null(data$numbers)) {
    return(list(error = "Invalid input format. Expected JSON with 'numbers' array."))
  }
  
  # Extract the numbers array
  nums <- tryCatch({
    as.numeric(unlist(data$numbers))
  }, error = function(e) {
    return(list(error = "Invalid input. Please provide an array of numbers."))
  })
  
  # Check if there are any NAs (which would indicate parsing errors)
  if (any(is.na(nums))) {
    return(list(error = "Invalid input. Some values could not be converted to numbers."))
  }
  
  # Check if we have any numbers to process
  if (length(nums) == 0) {
    return(list(error = "No numbers provided."))
  }
  
  # Calculate mode (most common value)
  get_mode <- function(v) {
    uniq_v <- unique(v)
    uniq_v[which.max(tabulate(match(v, uniq_v)))]
  }
  
  # Calculate statistics
  result <- list(
    mean = mean(nums),
    median = median(nums),
    mode = as.numeric(get_mode(nums)),
    min = min(nums),
    max = max(nums),
    range = max(nums) - min(nums),
    std_dev = sd(nums),
    variance = var(nums),
    sum = sum(nums),
    count = length(nums)
  )
  
  # Add debug info
  print("Returning result:")
  print(result)
  
  return(result)
}

# Run the API (uncomment to run from command line)
# To start the API server, run this in R console:
# plumber::plumb("stats_backend_api_endpoint.R")$run(port=8000)
