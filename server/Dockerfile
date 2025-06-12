FROM node:20-alpine

# install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# create applogs directory
RUN mkdir -p /app/applogs

# Copy package.json and package-lock.json
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .


# Expose the port the app runs on
EXPOSE 8000

# Start the application in dev mode
CMD ["pnpm", "run", "start:dev"]
