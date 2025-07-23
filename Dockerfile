# base image
FROM node:20-alpine AS base

WORKDIR /app

RUN apk add --no-cache libc6-compat

# install dependencies
FROM base AS deps

COPY package.json package-lock.json ./

RUN npm install

# build app
FROM base AS builder
ARG BASE_API_URL=https://work.1997.pro.vn/api/
ARG NEXT_PUBLIC_BASE_URL=https://work.1997.pro.vn
ARG NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-MHSZKB9B

ENV BASE_API_URL=${BASE_API_URL}
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=${NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY .env.production .env
COPY . .

RUN npm run build

# dev runner
FROM base AS dev

WORKDIR /app

ENV NODE_ENV=development

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# production runner
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/server ./.next/server
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public

USER node
EXPOSE 3000
CMD ["node", "server.js"]
