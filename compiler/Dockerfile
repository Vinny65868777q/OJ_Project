#  base image 
FROM node:22-alpine

# workdir 
WORKDIR /app

RUN apk update && apk add --no-cache g++ python3 openjdk17-jdk

# ---- copy source ----
COPY . .

# install dependencies
RUN npm install


# ---- expose & run ----
EXPOSE 8081
CMD ["node", "index.js"]

 