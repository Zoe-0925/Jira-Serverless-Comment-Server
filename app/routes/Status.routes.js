module.exports = app => {
    const status = require("../controllers/Status.controller.js");
    var router = require("express").Router();

    // Create a new status
    router.post("/", status.create);

    // Update a status with id
    router.put("/:id", status.update);

    // Update the order of issues within a status record
    router.put("/:id/issueOrders", status.updateIssueOrders);

    // Update the order of issues within 2 status record
    router.put("/issueOrders", status.moveIssueOrders);

    // Delete a status with id
    router.delete("/:id", status.delete);

    // Delete all status
    router.delete("/all", status.deleteAll);

    app.use('/api/status', router);
}