# User node base image
FROM node:14.17.0-alpine3.13

# Set the working directory
WORKDIR /usr/app/

# Copy the package.json file
COPY package.json .

# Install the dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Expose the port
EXPOSE 3000

# Run the app when the container starts by defining the entrypoint
ENTRYPOINT ["node", "app.js"]

# Optional: Define the CMD to provide default arguments.
CMD ["--port", "3000"]