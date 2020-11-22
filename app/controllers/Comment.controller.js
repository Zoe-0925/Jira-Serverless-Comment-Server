const API = require('@aws-amplify/api')
const wssSendDt = require('../../server')
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    useTLS: true,
});

const checkLastUpdate = async (data) => {
    try {
        const lastUpdatedAt = await API.get("CommentApi", "/comments/object/" + data._id + "/updatedAt")
        if (lastUpdatedAt === data.upatedAt) { return true }
        return false
    } catch (err) {
        return false
    }
}

exports.create = async (req, res) => {
    try {
        const updatedAt = await API.post("CommentApi", "/comments/", { body: req.body })
        wssSendDt(updatedAt)
        res.send()
    } catch (error) {
        console.error(error)
        res.status(error.status || 500).send({ error: error })
    }
}

exports.updateDescription = async (req, res) => {
    try {
        const updateIsValid = checkLastUpdate(req.body)
        if (!updateIsValid) { return res.status(500).send({ error: "The resource is being updated by another user." }) }
        const updatedAt = await API.put("CommentApi", "/comments/description", { body: req.body })
        wssSendDt(updatedAt)
        res.send()
    } catch (error) {
        console.error(error)
        res.status(error.status || 500).send({ error: error })
    }
}

exports.delete = async (req, res) => {
    try {
        const updateIsValid = checkLastUpdate(req.body)
        if (!updateIsValid) { return res.status(500).send({ error: "The resource is being updated by another user." }) }
        const updatedAt = await API.del("CommentApi", "/comments/" + req.body._id)
        wssSendDt(updatedAt)
        res.send()
    } catch (error) {
        console.error(error)
        res.status(error.status || 500).send({ error: error })
    }
}

// Delete all Comment
exports.deleteAll = async (req, res) => {

}


// Retrieve all Comments involving a particular user
exports.delete = async (req, res, next) => {

}

exports.deleteByIssue = async (req, res, next) => {

}