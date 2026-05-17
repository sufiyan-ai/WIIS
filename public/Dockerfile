FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/

# Copy static files to nginx document root
COPY . /usr/share/nginx/html/

# Expose Cloud Run port
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]