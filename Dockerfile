# Usa la imagen oficial de Node.js
FROM node:16-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos package*.json para la instalación de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Instalar NestJS CLI globalmente para poder usar el comando 'nest'
RUN npm install -g @nestjs/cli

# Copiar el resto de los archivos del proyecto al contenedor
COPY . .

# Ejecutar el build de la aplicación NestJS
RUN npm run build

# Exponer el puerto en el que la aplicación correrá
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start:prod"]
