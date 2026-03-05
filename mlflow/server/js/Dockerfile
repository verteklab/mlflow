FROM node:18-bullseye AS builder

WORKDIR /app

ARG YARN_VERSION=4.12.0

COPY package.json yarn.lock .yarnrc.yml ./
COPY yarn ./yarn

RUN corepack enable && corepack prepare yarn@${YARN_VERSION} --activate
RUN yarn install --immutable

COPY . .
RUN yarn build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

