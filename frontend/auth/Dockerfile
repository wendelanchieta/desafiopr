FROM node:20-alpine

WORKDIR /app

# Otimização de camadas do Docker
COPY package*.json ./
RUN npm install

COPY . .

# Garante que o webpack-dev-server suba para o Module Federation
CMD ["npm", "start"]