FROM node:4
WORKDIR /app
EXPOSE 8126
EXPOSE 8125/udp
ADD . /app
RUN npm install
CMD npm start
