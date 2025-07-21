# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the backend application's code
COPY . .

# Generate Prisma client if needed
RUN npx prisma generate --schema=./prisma/schema.prisma || echo "No Prisma schema found"

# Make port 3001 available to the world outside this container
EXPOSE 3001

# Define the command to run the app in development mode
CMD [ "npm", "run", "dev" ]
