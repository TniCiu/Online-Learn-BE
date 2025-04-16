FROM node:18 as build-container-temp

WORKDIR /app

COPY . .
#COPY . /app
RUN npm install
RUN npm run build
FROM nginx:alpine

COPY --from=build-container-temp /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


