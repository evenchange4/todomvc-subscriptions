FROM node:9.3.0-slim@sha256:eaab505be9cc24c7eacefa986c5c6c3b0f82a3084d2dcb6140166a8c23a2fc98
WORKDIR /app
RUN npm install sqlite3 --save
COPY pkg/server-linux .
RUN ls
CMD ./server-linux
ENV PORT=4000
EXPOSE $PORT
CMD ./server-linux
