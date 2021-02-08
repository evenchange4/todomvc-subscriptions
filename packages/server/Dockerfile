FROM node:9.3.0-slim@sha256:9adb5ed2a81c76c78b72d5ffecbbb3af809b33a8707d65d0c229d42e773ed052
WORKDIR /app
RUN npm install sqlite3 --save
COPY pkg/server-linux .
RUN ls
CMD ./server-linux
ENV PORT=4000
EXPOSE $PORT
CMD ./server-linux
