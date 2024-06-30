# Use the rootless NGINX image
FROM nginxinc/nginx-unprivileged:stable

# Set the working directory
WORKDIR /app

# Copy the source files into the container
COPY src/ /app

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 8080
EXPOSE 8080

# Run NGINX
CMD ["nginx", "-g", "daemon off;"]
