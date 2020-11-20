module.exports = app => {
    const issues = require("../controllers/Issue.controller.js");
    var router = require("express").Router();

    // Create a new issue (Issuetype: Epic, Task or Subtask)
    router.post("/", issues.create);

    // Create a new issue with customsed issue type
    router.post("/", issues.createCustomIssue);

    // Update a issue with id
    router.put("/:id", issues.update);

    // Update a issue's flag with id
    router.put("/:id/flag", issues.toggleFlag);

    // Delete a issue with id
    router.delete("/:id", issues.delete);

    // Delete all issue
    router.delete("/all", issues.deleteAll);

    app.use('/api/issues', router);
}