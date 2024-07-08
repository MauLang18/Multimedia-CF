FROM node:20-alpine3.16 as dev-deps
WORKDIR /app
COPY package.json package.json
RUN npm install --force

FROM node:20-alpine3.16 as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM nginx:1.23.3
EXPOSE 80
COPY --from=builder /app/demo/ /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]