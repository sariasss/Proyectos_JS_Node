FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Eliminar node_modules antes de copiar el código
RUN rm -rf node_modules

COPY . .

RUN npm install  

EXPOSE 3000

CMD ["npm", "run", "dev"]
