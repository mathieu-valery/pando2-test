FROM node:lts-buster

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN yarn install

EXPOSE 3001
CMD ["yarn", "start"]