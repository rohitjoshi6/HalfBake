FROM node:20

WORKDIR /app

# deps first (better layer caching)
COPY package*.json ./
RUN npm install

# app files
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# prisma client + build
RUN npx prisma generate
RUN npm run build

EXPOSE 8080
CMD ["node", "dist/index.js"]
