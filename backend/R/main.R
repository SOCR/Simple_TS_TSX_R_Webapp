# plumber.R
library(plumber)

# Create a root router
pr <- pr()  # create a base router

# Add CORS filter to root
pr$filter("cors", function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res$setHeader("Access-Control-Allow-Credentials", "true")

  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list())
  }

  forward()
})

# Mount your endpoint routers
pr$mount("/calc", plumb("stats_backend_api_endpoint.R"))
# pr$mount("/obfuscator", plumb("obfuscation_backend.R"))
pr$mount("/dre", plumb("DRE_api.R"))

# Run the API
pr$run(port = 8080)