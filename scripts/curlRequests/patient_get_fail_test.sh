#!/bin/bash

# Check if exactly one argument is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <IP Address>"
    exit 1
fi

URL="http://$1:3000/4_0_0/Patient/badexample"

# Perform the curl request and capture the HTTP status code
response=$(curl -s -o response.log -w "%{http_code}" -X GET "$URL" \
  -H "Content-Type: application/fhir+json" \
  -H "Cache-Control: no-cache" )

# Print the HTTP status code
echo "HTTP Status Code: $response"

# Check if the status code is NOT 200
if [ "$response" -eq 200 ]; then
  echo "Request should not be succeed with status code $response"
  exit 1
fi

echo "Request NOT succeeded with status code $response"
