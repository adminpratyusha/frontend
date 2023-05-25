FROM nginx:1.21.0-alpine

WORKDIR /app


# Copy the build files to the Nginx web server director
COPY . .
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Start the Nginx web server
CMD ["nginx", "-g", "daemon off;"]