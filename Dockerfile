ARG BASE_IMAGE=node:16-alpine

FROM $BASE_IMAGE AS deps

RUN apk add python3

RUN npm i -g node-gyp

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build project
FROM $BASE_IMAGE AS builder

WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN yarn build && yarn install --production --ignore-scripts --prefer-offline --silent

# Run project
FROM $BASE_IMAGE AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/shard.js ./shard.js

CMD ["yarn", "start:shard"]