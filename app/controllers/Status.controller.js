const API = require('@aws-amplify/api')
const wssSendDt = require('../../server')

const checkLastUpdate = async (data) => {
    try {
        const lastUpdatedAt = await API.get("StatusApi", "/status/object/updatedAt" + data._id)
        if (lastUpdatedAt === data.upatedAt) { return true }
        return false
    } catch (err) {
        return false
    }
}


exports.create =async  (req, res) => {

    await API.put("StatusApi", "/status", {
        body: newStatus
    })
}

// Retrieve all statuss involving a particular user
exports.findAll = async (req, res) => {
    Status.find().then(data => { res.status(200).send(data); })
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while retrieving Statuss."
            });
        });
}

// Retrieve a single Status with id
exports.updateIssueOrders =async  (req, res) => {
    try {
        const updatedAt = await API.put("StatusApi", "/status/update/attribute", {
            body: req.body
        })
        wssSendDt(updatedAt, "status", "updateIssueOrders")
        res.send()
    }
    catch (err) {
        return res.status(500).json({
            error: "Could not delete label. Error: " + err
        })
    }


}

// Retrieve all Statuss involving a particular user
exports.delete = async (req, res, next) => {
   
};

