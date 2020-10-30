FROM node:12.13.0

COPY package.json .
RUN yarn
COPY . .

CMD ["yarn", "start:prod"]
