const { v4: uuidv4 } = require('uuid')
const Immutable = require('immutable');

class Subscription {

    constructor() {

        this.subscriptions = Immutable.Map()
    }

    /**
     * Return subsciption
     * @param id
     */
    get(id) {
        return this.subscriptions.get(id)
    }

    /**
     * Add new subscription
     * @param topic
     * @param clientId
     * @param type
     * @returns {*}
     */
    add(topic, clientId, type = 'ws') {
        // need to find subscription with same type = 'ws'

        const findSubscriptionWithClientId = this.subscriptions.find(
            (sub) => sub.clientId === clientId && sub.type === type && sub.topic === topic)

        if (findSubscriptionWithClientId) {
            // exist and no need add more subscription
            return findSubscriptionWithClientId.id
        }
        const subscription = {
            id: this.autoId(),
            topic: topic,
            clientId: clientId,
            type: type, // email, phone
        }

        console.log('New subscriber via add method:', subscription)
        this.subscriptions = this.subscriptions.set(id, subscription)
        return id
    }

    /**
     * Remove a subsciption
     * @param id
     */
    remove(id) {

        this.subscriptions = this.subscriptions.remove(id)
    }

    /**
     * Clear all subscription
     */
    clear() {

        this.subscriptions = this.subscriptions.clear()
    }

    /**
     * Get Subscriptions
     * @param predicate
     * @returns {any}
     */
    getSubscriptions(predicate = null) {
        return predicate
            ? this.subscriptions.filter(predicate)
            : this.subscriptions
    }

    /**
     * Generate new ID
     * @returns {*}
     */
    autoId() {
        return uuidv4()
    }
}

module.exports = Subscription