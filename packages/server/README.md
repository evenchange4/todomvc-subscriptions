# Server

## Developer Guide
### Development
```cmd
$ npm run dev
```

### Usage
```cmd
# Option 1: Nodejs
$ npm run build
$ PORT=4000 PROXY_PORT=4001 APOLLO_ENGINE_KEY={key} npm start

# Option 2: Binary
$ npm install sqlite3 --save
$ npm run pkg
$ PORT=4000 PROXY_PORT=4001 APOLLO_ENGINE_KEY={key} ./server

# Option 3: Docker
$ docker build -t todomvc-server .
$ docker run --rm -it \
  -p 4001:4001 \
  -e "PORT=4000" \
  -e "PROXY_PORT=4001" \
  -e "APOLLO_ENGINE_KEY={key}"
  todomvc-server
```

### Deploy to Now.sh
```cmd
# deploy
$ npm run pkg

$ now switch todomvc
$ now deploy
$ now alias
$ now scale todomvc-server.now.sh 1 1
$ now rm --yes --safe todomvc-server
```
