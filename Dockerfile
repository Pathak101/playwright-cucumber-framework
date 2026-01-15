# ✅ Official Playwright image with browsers + OS deps
FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /app

# Copy dependency files first (better caching)
COPY package*.json ./

# Install node dependencies
RUN npm ci

# Copy project source
COPY . .

# Default command
CMD ["npm", "run", "test"]
