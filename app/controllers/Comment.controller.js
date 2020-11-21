const API = require('@aws-amplify/api')
const wssSendDt = require('../../server')
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    useTLS: true,
});

const checkLastUpdate = (data) => {
    try {
        const lastUpdatedAt = await API.get("CommentApi", "/comments/object/" + data._id + "/updatedAt")
        if (lastUpdatedAt === data.upatedAt) { return true }
        return false
    } catch (err) {
        return false
    }
}

exports.create = (req, res) => {

}

exports.updateDescription = (req, res, next) => {

}

// Delete all Comment
exports.deleteAll = (req, res) => {

}


// Retrieve all Comments involving a particular user
exports.delete = (req, res, next) => {

}

exports.deleteByIssue = (req, res, next) => {

}