# Use an official PHP runtime
FROM php:8.2-cli

# Set working directory
WORKDIR /app

# Copy all files to the container
COPY . .

# Start the built-in PHP server
CMD ["php", "-S", "0.0.0.0:10000"]
