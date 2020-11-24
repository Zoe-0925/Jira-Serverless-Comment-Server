var _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const Subscription = require('./subscription')
const controller = require("./controller.js")

export default class PubSub {

    constructor(ctx) {
        this.wss = ctx.wss

        this.clients = new Map()
        this.subscription = new Subscription()

        this.load = this.load.bind(this)
        this.handleReceivedClientMessage = this.handleReceivedClientMessage.bind(
            this)
        this.handleAddSubscription = this.handleAddSubscription.bind(this)
        this.handleUnsubscribe = this.handleUnsubscribe.bind(this)
        this.handlePublishMessage = this.handlePublishMessage.bind(this)
        this.removeClient = this.removeClient.bind(this)

        this.load()
    }

    load() {
        const wss = this.wss
        wss.on('connection', (ws) => {
            console.log((new Date()) + ' Connection accepted.');

            const id = this.autoId()

            const client = {
                id: id,
                ws: ws,
                subscriptions: [],
            }

            // add new client to the map
            this.addClient(client)

            // listen when receive message from client
            ws.on('message',
                (message) => this.handleReceivedClientMessage(id, message))

            ws.on('close', () => {
                console.log('Client is disconnected')
                // Find user subscriptions and remove
                const userSubscriptions = this.subscription.getSubscriptions(
                    (sub) => sub.clientId === id)
                userSubscriptions.forEach((sub) => {
                    this.subscription.remove(sub.id)
                })
                // now let remove client
                this.removeClient(id)
            })
        })
    }

    /**
     * Handle add subscription
     * @param topic
     * @param clientId = subscriber
     */
    handleAddSubscription(topic, clientId) {
        const client = this.getClient(clientId)
        if (client) {
            const subscriptionId = this.subscription.add(topic, clientId)
            client.subscriptions.push(subscriptionId)
            this.addClient(client)
        }

    }

    /**
     * Handle unsubscribe topic
     * @param topic
     * @param clientId
     */
    handleUnsubscribe(topic, clientId) {

        const client = this.getClient(clientId)

        let clientSubscriptions = _.get(client, 'subscriptions', [])

        const userSubscriptions = this.subscription.getSubscriptions(
            (s) => s.clientId === clientId && s.type === 'ws')

        userSubscriptions.forEach((sub) => {

            clientSubscriptions = clientSubscriptions.filter((id) => id !== sub.id)

            // now let remove subscriptions
            this.subscription.remove(sub.id)

        })

        // let update client subscriptions
        if (client) {
            client.subscriptions = clientSubscriptions
            this.addClient(client)
        }

    }

    /**
     * Handle publish a message to a topic
     * @param topic
     * @param message
     * @param from
     * @isBroadcast = false that mean send all, if true, send all not me
     */
    handlePublishMessage(topic, message) {
        let subscriptions = this.subscription.getSubscriptions(
            (subs) => subs.topic === topic)
        // now let send to all subscribers in the topic with exactly message from publisher
        subscriptions.forEach((subscription) => {
            const clientId = subscription.clientId
            this.send(clientId, {
                action: 'publish',
                payload: {
                    topic: topic,
                    message: message,
                },
            })
        })
    }

    /**
     * Handle receive client message
     * @param clientId
     * @param message
     */
    handleReceivedClientMessage(clientId, message) {
        if (typeof message === 'string') {

            message = this.stringToJson(message)
            let payload = _.get(message, 'payload')
            let result
            const action = _.get(message, 'action', '')
            switch (action) {
                case 'subscribe':
                    const topic = _.get(message, 'payload.body.project', null)
                    if (topic) {
                        this.handleAddSubscription(topic, clientId)
                    }
                    break
                case 'unsubscribe':
                    const unsubscribeTopic = _.get(message, 'payload.body.project')
                    if (unsubscribeTopic) {
                        this.handleUnsubscribe(unsubscribeTopic, clientId)
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
                this.handlePublishMessage(payload.body.project, result)
            }
        }
    }

    /**
     * Convert string of message to JSON
     * @param message
     * @returns {*}
     */
    stringToJson(message) {
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
     */
    addClient(client) {
        if (!client.id) {
            client.id = this.autoId()
        }
        this.clients = this.clients.set(client.id, client)
    }

    /**
     * Remove a client after disconnecting
     * @param id
     */
    removeClient(id) {
        this.clients = this.clients.remove(id)
    }

    /**
     * Get a client connection
     * @param id
     * @returns {V | undefined}
     */
    getClient(id) {
        return this.clients.get(id)
    }

    /**
     * Generate an ID
     * @returns {*}
     */
    autoId() {
        return uuidv4()
    }

    /**
     * Send to client message
     * @param message
     */
    send(clientId, message) {
        const client = this.getClient(clientId)
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

}