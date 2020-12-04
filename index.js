
const http = require('http')
const express = require('express')
let app = express()
const cors = require('cors')
const { handleReceivedClientMessage,
  stringToJson, addClient, removeClient, autoId, pubsubSend } = require('./src/pubsub')
const bodyParser = require('body-parser')
const WebSocket = require('ws');
const Subscription = require('./src/subscription')
let clients = new Map()
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

wss.on('connection', (ws) => {
  const id = autoId()
  const client = {
    id: id,
    ws: ws,
    subscriptions: [],
  }
  const subscription = new Subscription()

  // add new client to the map
  clients = addClient(client, clients)

  // listen when receive message from client
  ws.on('message',
    (message) => handleReceivedClientMessage(id, message, clients))

  ws.on('close', () => {
    console.log('Client is disconnected')
    // Find user subscriptions and remove
    const userSubscriptions = subscription.getSubscriptions(
      (sub) => sub.clientId === id)
    userSubscriptions.forEach((sub) => {
      subscription.remove(sub.id)
    })
    // now let remove client
    clients = clients.remove(id)
  })
});

