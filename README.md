<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
Report Traffic Light API
Instrucciones de Instalación
Clona el repositorio:
bash
Copiar código
git clone <url-del-repositorio>
Dockerización de la aplicación
Prepara tu aplicación:

Asegúrate de que tu aplicación esté correctamente configurada (puedes probarla en tu entorno local con npm run start:dev).
Crea el archivo Dockerfile: Si aún no lo tienes, crea un archivo Dockerfile en la raíz de tu proyecto con el siguiente contenido:

dockerfile
Copiar código
# Usamos una imagen base de Node.js
FROM node:16-alpine

# Definimos el directorio de trabajo
WORKDIR /app

# Copiamos el archivo package.json y package-lock.json
COPY package*.json ./

# Instalamos las dependencias del proyecto
RUN npm install --production

# Instalamos NestJS CLI de forma global para poder ejecutar el comando 'nest build'
RUN npm install -g @nestjs/cli

# Copiamos el resto de los archivos de la aplicación
COPY . .

# Construimos la aplicación
RUN npm run build

# Exponemos el puerto 3000 para el contenedor
EXPOSE 3000

# Ejecutamos el comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]
Crear archivo .dockerignore: Asegúrate de que tienes un archivo .dockerignore similar al siguiente, para evitar que se copien archivos innecesarios en la imagen Docker:

bash
Copiar código
node_modules
dist
*.log
Construir la imagen Docker: Desde el directorio raíz de tu proyecto, ejecuta el siguiente comando en tu terminal para construir la imagen Docker:

bash
Copiar código
docker build -t traffic-light-api .
Esto generará la imagen Docker de tu aplicación.

Ejecutar el contenedor Docker: Una vez que se haya creado la imagen, puedes ejecutar tu aplicación dentro de un contenedor Docker con el siguiente comando:

bash
Copiar código
docker run -p 3000:3000 traffic-light-api
Esto mapeará el puerto 3000 del contenedor al puerto 3000 de tu máquina local.

Verificar que la aplicación está corriendo: Abre tu navegador y visita http://localhost:3000 para asegurarte de que la aplicación está funcionando dentro del contenedor Docker.

Compile and run the project
bash
Copiar código
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
Run tests
bash
Copiar código
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
Deployment
When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the deployment documentation for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out Mau, our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

bash
Copiar código
$ npm install -g mau
$ mau deploy
With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

Resources
Check out a few resources that may come in handy when working with NestJS:

Visit the NestJS Documentation to learn more about the framework.
For questions and support, please visit our Discord channel.
To dive deeper and get more hands-on experience, check out our official video courses.
Deploy your application to AWS with the help of NestJS Mau in just a few clicks.
Visualize your application graph and interact with the NestJS application in real-time using NestJS Devtools.
Need help with your project (part-time to full-time)? Check out our official enterprise support.
To stay in the loop and get updates, follow us on X and LinkedIn.
Looking for a job, or have a job to offer? Check out our official Jobs board.
Support
Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please read more here.

Stay in touch
Author - Kamil Myśliwiec
Website - https://nestjs.com
Twitter - @nestframework
License
Nest is MIT licensed.

markdown
Copiar código

### Pasos a seguir:
1. **Crea tu Dockerfile**.
2. **Asegúrate de que tienes un archivo `.dockerignore`**.
3. **Construye la imagen Docker** con `docker build -t traffic-light-api .`.
4. **Ejecuta el contenedor Docker** con `docker run -p 3000:3000 traffic-light-api`.
5. **Verifica que tu aplicación está funcionando** en `http://localhost:3000
