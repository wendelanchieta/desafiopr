#Utiliza uma imagem leve otimizada para ecossistemas JavaScript/React
FROM node:20-alpine

#Define o diretório de trabalho dentro do contêiner
WORKDIR /app

#Copia os arquivos de dependência primeiro (otimiza o cache do Docker)
COPY package*.json ./

# Instala as dependências
RUN npm install

#Copia o restante do código da aplicação
COPY . .

#O comando padrão para iniciar o servidor de desenvolvimento do Webpack
CMD ["npm", "start"]