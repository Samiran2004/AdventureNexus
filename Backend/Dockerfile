# Build Stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package management files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript project
RUN npm run build

# Production Stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy package management files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Create logs directory if needed (as seen in codebase)
RUN mkdir -p logs

# Expose the port the app runs on
# Render will automatically inject the PORT environment variable
EXPOSE 5000

# Start the application
CMD ["node", "dist/app.js"]
