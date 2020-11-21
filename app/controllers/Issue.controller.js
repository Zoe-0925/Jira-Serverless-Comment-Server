const API = require('@aws-amplify/api')

exports.create = (req, res) => {
    try {
        const updatedAt = await API.post("IssueApi", "/issues/")
        wssSendDt(updatedAt)
        res.send()
    } catch (error) {
        console.error(error)
        res.status(error.status || 500).send({ error: error.message })
    }
}

exports.updateIssueAttribute = (req, res) => {
    try {
        const editable = await API.get("IssueApi", "/issues/object/" + req.body._id + "updatedAt")
        if (!editable) {
            return res.status(500).json({
                error: "It's being edited by another user now."
            })
        }
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

exports.delete = (req, res, next) => {
    
}

exports.deleteAll = async (req, res) => {
    validateId(req, res);
    try {
        await Issue.deleteMany()
        return res.status(200).json({
            success: true
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Could not delete issues. Error: " + err
        })
    }
}

//TODO only the assignee can delete the issue?
//Or all team members can delete it???
//check the authorization

