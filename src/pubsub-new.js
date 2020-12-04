var _ = require('lodash');
const { uuid } = require('uuidv4')
const controller = require("./controller.js")

/**
 * Handle add subscription
 * @param topic
 * @param clientId = subscriber
 * @param subscription
 */
export function handleAddSubscription(topic, clientId, subscription) {
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
export function handleUnsubscribe(topic, clientId, subscription) {

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
export function handlePublishMessage(topic, message, subscription, clients) {
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
export function handleReceivedClientMessage(clientId, message, clients) {
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
            case 'create':
                result = controller(payload.body, payload.api, payload.url)
                break
            case 'updateAttribute':
                result = controller(payload.body, payload.api, payload.url)
                break
            case 'delete':
                result = controller(payload.body, payload.api, payload.url)
                break
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
export function stringToJson(message) {
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
export function addClient(client, clients) {
    if (!client.id) {
        client.id = autoId()
    }
    clients = clients.set(client.id, client)
    return clients
}

/**
 * Generate an ID
 * @returns {*}
 */
export function autoId() {
    return uuid()
}

/**
 * Send to client message
 * @param message
 */
export function pubsubSend(clientId, message, clients) {
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



