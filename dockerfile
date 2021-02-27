FROM node:12.18.2 AS build-app 

WORKDIR /app

COPY package.json .

COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build

FROM node:12.18.2

WORKDIR /app

COPY package.json .

COPY yarn.lock .

RUN yarn --prod

COPY protos /app/protos

COPY --from=build-app /app/dist /app/dist

EXPOSE 5000

ENTRYPOINT [ "node", "dist/main" ]
