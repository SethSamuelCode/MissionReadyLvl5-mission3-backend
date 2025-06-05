FROM node:lts-alpine AS build 

COPY ./frontEnd2/mock-interview /app

WORKDIR /app

RUN npm ci 
RUN npm run build 

# ENTRYPOINT [ "npm","run", "start" ]

FROM nginx:alpine 

COPY --from=build /app/build /usr/share/nginx/html 

EXPOSE 80
# Start Container
CMD ["nginx", "-g", "daemon off;"]