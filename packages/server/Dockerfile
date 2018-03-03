FROM node:9.7.1-slim@sha256:877dd26ae910a04b9d4a1c1e55866a68cc0a7e55de92459876d0d2c5bd2b514b
WORKDIR /app
RUN npm install sqlite3 --save
COPY pkg/server-linux .
RUN ls
CMD ./server-linux
ENV PORT=4000
EXPOSE $PORT
CMD ./server-linux
