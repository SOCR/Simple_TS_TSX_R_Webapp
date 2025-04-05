# R Statistics Backend

This is a simple statistics API built with R's Plumber package. It provides endpoints for calculating various statistics from a list of numbers.

## Installation

### Method 1: Using RStudio (Recommended)

Using RStudio provides an integrated environment for R development.

1. **Install R and RStudio**
   
   Download and install R from [CRAN](https://cran.r-project.org/)
   
   Download and install RStudio from [RStudio's website](https://www.rstudio.com/products/rstudio/download/)

2. **Install required packages**

   Open RStudio and run the following commands in the console:

   ```r
   install.packages(c("plumber", "jsonlite"))
   ```

### Method 2: Using R directly

If you prefer not to use RStudio, you can install R and the necessary packages directly.

1. **Install R**

   Download and install from [CRAN](https://cran.r-project.org/)

2. **Install required packages**

   Open R and run:

   ```r
   install.packages(c("plumber", "jsonlite"))
   ```

## Running the Application

1. **Start the Plumber API server**

   Using RStudio:
   - Open the `stats_backend_api_endpoint.R` file in RStudio
   - Run the following command in the R console:
     ```r
     plumber::plumb("stats_backend_api_endpoint.R")$run(port=8080)
     ```

   Using R directly:
   - Navigate to the directory containing `stats_backend_api_endpoint.R`
   - Start R and run:
     ```r
     library(plumber)
     plumb("stats_backend_api_endpoint.R")$run(port=8080)
     ```

   This will start the server on http://localhost:8080

2. **Test the API**

   You can test the API using curl, Postman, or any HTTP client.

## API Endpoints

- `GET /` - Health check endpoint
- `POST /stats` - Calculates statistics for a list of numbers
  - Request body: JSON object with a `numbers` array

## Example Request

```json
{
  "numbers": [1, 2, 3, 4, 5, 5]
}
```

## Example Response

```json
{
  "mean": 3.3333,
  "median": 3.5,
  "mode": 5,
  "min": 1,
  "max": 5,
  "range": 4,
  "std_dev": 1.6330,
  "variance": 2.6667,
  "sum": 20,
  "count": 6
}
```

## Available Statistics

The API calculates the following statistics:
- Mean (average)
- Median (middle value)
- Mode (most frequent value)
- Minimum value
- Maximum value
- Range (max - min)
- Standard deviation
- Variance
- Sum of all values
- Count of numbers
