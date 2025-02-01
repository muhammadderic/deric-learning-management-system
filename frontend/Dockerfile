# ---- Development Stage ----
FROM node:24

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose Vite default port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev"]
