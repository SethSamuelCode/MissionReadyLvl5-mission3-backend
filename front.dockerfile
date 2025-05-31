FROM nginx:alpine
COPY ./frontend /usr/share/nginx/html
EXPOSE 80
# Start Container
CMD ["nginx", "-g", "daemon off;"]