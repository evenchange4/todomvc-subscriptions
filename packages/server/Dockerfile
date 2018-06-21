FROM node:9.11.2-slim@sha256:dd849c3cb5428423131923a2705846f257ffe71e129135bde299daf22ed295ab
WORKDIR /app
RUN npm install sqlite3 --save
COPY pkg/server-linux .
RUN ls
CMD ./server-linux
ENV PORT=4000
EXPOSE $PORT
CMD ./server-linux
