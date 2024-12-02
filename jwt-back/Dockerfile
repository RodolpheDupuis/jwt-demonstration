# Use Node.js as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the package.json file and install its dependencies
COPY package.json .
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on
EXPOSE 5001

# Start the server
CMD ["npm", "start"]