# Base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Set environment variable
ENV NODE_ENV=production

# Copy package.json and package-lock.json (for layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose backend port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
