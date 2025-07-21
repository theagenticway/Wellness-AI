# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the application's code
COPY . .

# Build the application
RUN npm run build

# Make port 4173 available to the world outside this container
EXPOSE 4173

# Define the command to run the app
CMD [ "npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173" ]
