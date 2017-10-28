FROM node:4
WORKDIR /app
ADD . /app
RUN npm install
CMD npm start
