# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY apps/backend/package*.json ./

# Install any needed packages
RUN npm install

# Copy the backend application's code
COPY apps/backend/ .

# Copy types directory from project root
COPY types/ ./types/

# Generate Prisma client for Alpine Linux
RUN npx prisma generate

# Make port 3001 available to the world outside this container
EXPOSE 3001

# Define the command to run the app in development mode
CMD [ "npm", "run", "dev" ]
