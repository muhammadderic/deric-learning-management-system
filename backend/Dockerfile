# Use Node.js image
FROM node:24

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or package.json only)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema first so we can run generate
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the backend code
COPY . .

# Expose backend port (adjust if needed)
EXPOSE 5000

# Start backend in development mode
CMD ["npm", "run", "dev"]
