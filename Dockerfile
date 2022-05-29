from node:16-alpine as builder

WORKDIR /app
COPY . .

RUN npm ci --prefer-offline --no-audit && \
    npm run build


from node:16-alpine

WORKDIR /app
COPY --from=builder /app/.output .

EXPOSE 3000

CMD [ "node", "./server/index.mjs" ]
