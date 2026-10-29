FROM ubuntu:22.04

# Install basic certificates required for networking
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the server file sitting in the same folder
COPY server.x86_64 /app/server.x86_64

# Give executable permissions
RUN chmod +x /app/server.x86_64

# Start the Godot dedicated server in headless mode
CMD ["/app/server.x86_64", "--headless"]