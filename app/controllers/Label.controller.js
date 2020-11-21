const API = require('@aws-amplify/api')
const wssSendDt = require('../../server')

const checkLastUpdate = (data) => {
    try {
        const lastUpdatedAt = await API.get("LabelApi", "/labels/object/updatedAt" + data._id)
        if (lastUpdatedAt === data.upatedAt) { return true }
        return false
    } catch (err) {
        return false
    }
}


exports.create = (req, res) => {
    try {
        const updatedAt = await API.post("LabelApi", "/labels", {
            body: req.body
        })
        wssSendDt(updatedAt, "label", "create")
        res.send()
    }
    catch (err) {
        return res.status(500).json({
            error: "Could not delete label. Error: " + err
        })
    }
}

// Delete all label
exports.deleteLabelByProject = (req, res) => {
    try {
        const updatedAt = await API.del("LabelApi", "/labels/project/" + req.params.projectId)
        wssSendDt(updatedAt, "label", "delete")
        res.send()
    }
    catch (err) {
        return res.status(500).json({
            error: "Could not delete label. Error: " + err
        })
    }
}


// Retrieve all labels involving a particular user
exports.delete = (req, res) => {
    try {
        const updatedAt = await API.del("LabelApi", "/labels/" + req.params.id)
        wssSendDt(updatedAt, "label", "delete")
        res.send()
    }
    catch (err) {
        return res.status(500).json({
            error: "Could not delete label. Error: " + err
        })
    }
}


