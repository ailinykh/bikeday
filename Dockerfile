FROM node:14

WORKDIR /app
COPY . .

RUN yarn install

EXPOSE 8000

CMD [ "yarn", "start" ]
