const app = require('express')()
app.server = require('http').createServer(app)
const cors = require('cors')
const PubSub = require('./pubsub')
var webSocketsServerPort = 1337;
const bodyParser = require('body-parser')
const WebSocketServer = require('ws');

app.use(bodyParser.json())
app.use(cors({
  exposedHeaders: '*',
}))
app.use(bodyParser.urlencoded({ extended: true }))

//Initial PubSub Server
const pubSubServer = new PubSub({ wss: wss })
app.pubsub = pubSubServer

//web socket server
const wss = new WebSocketServer({
  httpServer: app.server
});

//HTTP server
app.server.listen(webSocketsServerPort, () => {
  console.log((new Date()) + " Server is listening on port "
    + webSocketsServerPort);
})


//TODO
//This method is no longer applicable
exports.wssSendDt = (dt, tableName, operation) => {
  const wssMessage = JSON.stringify({ dt: dt, table: tableName, operation: operation })
  wss.clients.forEach((ws) => ws.send(wssMessage))
}
