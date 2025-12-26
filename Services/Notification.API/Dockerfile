FROM node:20-alpine

# Create app directory
WORKDIR /app

COPY Services/Notification.API/package*.json ./
RUN npm ci --only=production

COPY Services/Notification.API/ .

EXPOSE 5004

CMD ["node", "app.js"]
