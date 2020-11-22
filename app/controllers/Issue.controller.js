const API = require('@aws-amplify/api')


const checkLastUpdate = async (data) => {
    try {
        const lastUpdatedAt = await API.get("IssueApi", "/issues/object/" + data._id + "/updatedAt")
        if (lastUpdatedAt === data.upatedAt) { return true }
        return false
    } catch (err) {
        return false
    }
}

exports.create = async (req, res) => {
    try {
        const isUpdateValid = checkLastUpdate(req.body)
        if (!isUpdateValid) { res.status(500).send({ error: "The resource is being updated by another user." }) }
        const updatedAt = await API.post("IssueApi", "/issues/", { body: req.body })
        wssSendDt(updatedAt)
        res.send()
    } catch (error) {
        console.error(error)
        res.status(error.status || 500).send({ error: error })
    }
}

exports.updateIssueAttribute = async (req, res) => {
    try {
        const isUpdateValid = checkLastUpdate(req.body)
        if (!isUpdateValid) { res.status(500).send({ error: "The resource is being updated by another user." }) }
        const updatedAt = await API.put("IssueApi", "/issues/update/attribute", {
            body: req.body
        })
        wssSendDt(updatedAt)
        res.send()
    } catch (error) {
        console.error(error)
        res.status(error.status || 500).send({ error: error.message })
    }
}

exports.delete = async (req, res) => {
    try {
        const isUpdateValid = checkLastUpdate(req.body)
        if (!isUpdateValid) { res.status(500).send({ error: "The resource is being updated by another user." }) }
        const updatedAt = await API.del("IssueApi", "/issues/object/" + req.param.issueId)
        wssSendDt(updatedAt)
        res.send()
    }
    catch (err) {
        return res.status(500).json({
            error: "Could not delete issues. Error: " + err
        })
    }
}

exports.deleteByProject = async (projectId) => {
    try {
        const isUpdateValid = checkLastUpdate(req.body)
        if (!isUpdateValid) { res.status(500).send({ error: "The resource is being updated by another user." }) }
    
        const updatedAt = await API.del("IssueApi", "/issues/project/" + projectId)
        wssSendDt(updatedAt)
        res.send()
    }
    catch (err) {
        return res.status(500).json({
            error: "Could not delete issues. Error: " + err
        })
    }
}

//TODO
//Needs check...
exports.removeLabelFromIssues = async (req, res) => {
    try {
        const isUpdateValid = checkLastUpdate(req.body)
        if (!isUpdateValid) { res.status(500).send({ error: "The resource is being updated by another user." }) }
    
        req.body.tasksToUpdate.forEach(issueId => {
            API.put("IssueApi", "/issues/update/attribute", {
                body: {
                    _id: issueId,
                    attribute: "label",
                    value: req.body.tasksToUpdate.labels.filter(item => item !== labelId)
                }
            }).then(updatedAt => {
                wssSendDt(updatedAt)
                res.send()
            })
        });
    }
    catch (err) {
        return res.status(500).json({
            error: "Could not delete issues. Error: " + err
        })
    }
}
