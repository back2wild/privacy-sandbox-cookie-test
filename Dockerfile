FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY \
  .npmrc \
  package.json \
  package-lock.json \
  /app/
RUN npm install

COPY src/ /app/src/

CMD npm run start

EXPOSE 8080
