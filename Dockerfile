# syntax=docker/dockerfile:1
################ build stage 🏗️ ################
FROM node:22-alpine AS builder
WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}


# 1️⃣  devDependencies を含めてインストール
COPY package.json package-lock.json* ./
RUN npm ci   # ← --omit=dev を外す

# 2️⃣  アプリコードをコピーしてビルド
COPY . .

# 依存インストール後
RUN npx prisma generate

RUN npm run build

# 3️⃣  ビルド完了後に devDependencies を削る
RUN npm prune --omit=dev


################ runtime stage 🚀 ##############
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

# 1️⃣ Prisma 関連ファイルをコピー
COPY --from=builder /app/prisma ./prisma

# 2️⃣ prisma CLI だけ prod にインストール
#    （--omit=optional で engine に不要な optional deps を切る）
RUN npm install --no-save prisma@^6 --omit=optional

# 3️⃣ アプリ本体をコピー
# COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static 

# 4️⃣ 起動時に migrate → アプリを立ち上げる
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]

