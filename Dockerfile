FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# docker logout

# docker build -t dolphindatabase/visiona-front:latest .

# docker login 

# docker push dolphindatabase/visiona-front:latest

# docker run -p 80:80 dolphindatabase/visiona-front:latest