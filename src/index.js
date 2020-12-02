
const http = require('http')
const express = require('express')
let app = express()
app.server = http.createServer(app)
const cors = require('cors')
const PubSub = require('./pubsub')
var webSocketsServerPort = 8080;
const bodyParser = require('body-parser')
const WebSocket = require('ws');

app.use(bodyParser.json())
app.use(cors({
  exposedHeaders: '*',
}))
app.use(bodyParser.urlencoded({ extended: true }))

//web socket server
const wss = new WebSocket.Server({ port: 8000 });

//Initial PubSub Server
const pubSubServer = new PubSub({ wss: wss })
app.pubsub = pubSubServer

//HTTP server
app.server.listen(webSocketsServerPort, () => {
  console.log((new Date()) + " Server is listening on port "
    + webSocketsServerPort);
})


/**
//TODO
//This method is no longer applicable
exports.wssSendDt = (dt, tableName, operation) => {
  const wssMessage = JSON.stringify({ dt: dt, table: tableName, operation: operation })
  wss.clients.forEach((ws) => ws.send(wssMessage))
}
*/