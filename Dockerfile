# Use Node.js as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Expose ports (these will be overridden by docker-compose.yml)
EXPOSE 8000 8001 8002

# Default command (will be overridden by docker-compose.yml)
CMD ["npm", "run", "start"]