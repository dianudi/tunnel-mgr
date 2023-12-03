FROM node:lts-alpine

LABEL author="dianudi"
LABEL version="1.0.0"
LABEL description="Localtunnel multi tunnel manager."
RUN apk add --update --no-cache sqlite && rm -rf /var/cache/apk/*
WORKDIR /app
COPY . .

RUN yarn && yarn cache clean
RUN yarn build
RUN yarn knex migrate:latest --env production
RUN rm -r /app/src
RUN yarn --production && yarn cache clean


VOLUME [ "/app/database", '/app/logs' ]
EXPOSE 3000

CMD [ "yarn",  "start" ]