
const http = require('http')
const express = require('express')
let app = express()
const cors = require('cors')
const PubSub = require('./src/pubsub')
const bodyParser = require('body-parser')
const WebSocket = require('ws');

var webSocketsServerPort = process.env.PORT || 8080;
const INDEX = '/index.html';

app.use(bodyParser.json())
app.use(cors({
  exposedHeaders: '*',
}))
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res) => res.sendFile(INDEX, { root: __dirname }))

const server = http.createServer(app)

//HTTP server
server.listen(webSocketsServerPort, () => {
  console.log((new Date()) + " Server is listening on port "
    + webSocketsServerPort);
})

//web socket server
const wss = new WebSocket.Server({ server });

//Initial PubSub Server
const pubSubServer = new PubSub({ wss: wss })
app.pubsub = pubSubServer


wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

