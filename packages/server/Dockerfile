FROM node:9.3.0-slim
WORKDIR /app
RUN npm install sqlite3 --save
COPY pkg/server-linux .
RUN ls
CMD ./server-linux
ENV PORT=4000
EXPOSE $PORT
CMD ./server-linux
