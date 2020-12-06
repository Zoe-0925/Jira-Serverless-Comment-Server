
const http = require('http')
const express = require('express')
let app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const WebSocket = require('ws');
const Subscription = require('./src/subscription')
const { v4: uuidv4 } = require('uuid');
var webSocketsServerPort = process.env.PORT || 8080;
const INDEX = '/index.html';
const { Map } = require('immutable');
let clients = new Map()

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



/**
 * Handle add subscription
 * @param topic
 * @param clientId = subscriber
 * @param subscription
 */
function handleAddSubscription(topic, clientId, subscription) {
  const client = getClient(clientId)
  if (client) {

    //TODO
    //check if this is correct
    const subscriptionId = subscription.add(topic, clientId)
    client.subscriptions.push(subscriptionId)
    addClient(client)
  }
}

/**
* Handle unsubscribe topic
* @param topic
* @param clientId
*/
function handleUnsubscribe(topic, clientId, subscription) {

  const client = getClient(clientId)

  let clientSubscriptions = _.get(client, 'subscriptions', [])

  const userSubscriptions = subscription.getSubscriptions(
    (s) => s.clientId === clientId && s.type === 'ws')

  userSubscriptions.forEach((sub) => {

    clientSubscriptions = clientSubscriptions.filter((id) => id !== sub.id)

    // now let remove subscriptions
    subscription.remove(sub.id)

  })

  // let update client subscriptions
  if (client) {
    client.subscriptions = clientSubscriptions
    addClient(client)
  }

}

/**
* Handle publish a message to a topic
* @param topic
* @param message
* @param from
* @isBroadcast = false that mean send all, if true, send all not me
*/
function handlePublishMessage(topic, message, subscription, clients) {
  let subscriptions = subscription.getSubscriptions(
    (subs) => subs.topic === topic)
  // now let send to all subscribers in the topic with exactly message from publisher
  subscriptions.forEach((subscription) => {
    const clientId = subscription.clientId
    pubsubsend(clientId, {
      action: 'publish',
      payload: {
        topic: topic,
        message: message,
      },
      clients
    })
  })
}

/**
* Handle receive client message
* @param clientId
* @param message
*/
function handleReceivedClientMessage(clientId, message, clients) {
  if (typeof message === 'string') {

    //TODO
    //Check if the loadash function is still available 
    message = stringToJson(message)
    let payload = _.get(message, 'payload')
    let result
    const action = _.get(message, 'action', '')
    switch (action) {
      case 'subscribe':
        const topic = _.get(message, 'payload.body.project', null)
        if (topic) {
          handleAddSubscription(topic, clientId)
        }
        break
      case 'unsubscribe':
        const unsubscribeTopic = _.get(message, 'payload.body.project')
        if (unsubscribeTopic) {
          handleUnsubscribe(unsubscribeTopic, clientId)
        }
        break
      /** 
  case 'create':
      result = controller(payload.body, payload.api, payload.url)
      break
  case 'updateAttribute':
      result = controller(payload.body, payload.api, payload.url)
      break
  case 'delete':
      result = controller(payload.body, payload.api, payload.url)
      break
      */
      default:
        break
    }
    if (result) {
      handlePublishMessage(payload.body.project, result, clients)
    }
  }
}

/**
* Convert string of message to JSON
* @param message
* @returns {*}
*/
function stringToJson(message) {
  try {
    message = JSON.parse(message)
  } catch (e) {
    console.log(e)
  }
  return message
}

/**
* Add new client connection to the map
* @param client
* @param clients
*/
function addClient(client) {
  if (!client.id) {
    client.id = autoId()
  }
  clients = clients.set(client.id, client)
}



/**
* Send to client message
* @param message
*/
function pubsubSend(clientId, message) {
  const client = clients.get(clientId)
  if (!client) {
    return
  }
  const ws = client.ws
  try {
    message = JSON.stringify(message)
  }
  catch (err) {
    console.log('An error convert object message to string', err)
  }
  ws.send(message)
}




//Initial PubSub Server

wss.on('connection', (ws) => {
  const id = uuidv4()
  const client = {
    id: id,
    ws: ws,
    subscriptions: [],
  }
  const subscription = new Subscription()
  console.log("client", client)

  //TODO
  //bug

  // add new client to the map
  // addClient(client, clients)

  // listen when receive message from client
  ws.on('message',
    (message) => handleReceivedClientMessage(id, message))

  ws.on('close', () => {
    console.log('Client is disconnected')
    // Find user subscriptions and remove

    /**
    const userSubscriptions = subscription.getSubscriptions(
      (sub) => sub.clientId === id)
    userSubscriptions.forEach((sub) => {
      subscription.remove(sub.id)
    })
    // now let remove client
    clients.remove(id)
    */
  })
});
