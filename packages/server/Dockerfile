FROM node:9.3.0-slim@sha256:53f2bca8c48b8bc59c92f59cc62abb2a7b23c3125634c0a3a639b3cba26a21a3
WORKDIR /app
RUN npm install sqlite3 --save
COPY pkg/server-linux .
RUN ls
CMD ./server-linux
ENV PORT=4000
EXPOSE $PORT
CMD ./server-linux
