FROM node:18
WORKDIR /app
COPY package*.json ./
RUN apt-get update && apt-get install -y postgresql-client
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "run", "dev"]
