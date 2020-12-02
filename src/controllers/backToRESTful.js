
//TODO:
//move back to the client
/** 
exports.deleteByProject = async (projectId) => {
    try {
        const isUpdateValid = checkLastUpdate(payload)
        if (!isUpdateValid) { return ({ error: "The resource is being updated by another user." }) }

        return await API.del("IssueApi", "/issues/project/" + projectId)
    }
    catch (err) {
        return { error: err }
    }
}
*/

//TODO
//Needs check...
exports.removeLabelFromIssues = async (payload) => {
    try {
        const isUpdateValid = checkLastUpdate(payload.body)
        if (!isUpdateValid) { return ({ error: "The resource is being updated by another user." }) }

        payload.body.tasksToUpdate.forEach(issueId => {
            API.put("IssueApi", "/issues/update/attribute", {
                body: {
                    _id: issueId,
                    attribute: "label",
                    value: payload.body.tasksToUpdate.labels.filter(item => item !== labelId)
                }
            }).then(updatedAt => {
                wssSendDt(updatedAt)
                res.send()
            })
        });
    }
    catch (err) {
        return { error: err }
    }
}



// TODO
//move back to the restful.
exports.deleteLabelByProject = async (payload) => {
    try {
        const isUpdateValid = checkLastUpdate(req.body)
        if (!isUpdateValid) { res.status(500).send({ error: "The resource is being updated by another user." }) }

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
