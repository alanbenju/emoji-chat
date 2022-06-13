FROM node:14.17.3-alpine3.14

RUN mkdir api
ADD . /api
WORKDIR /api

COPY . . 

RUN npm install

CMD ["npm","run","start"]