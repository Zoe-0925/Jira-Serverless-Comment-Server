module.exports = (app) => {
    const comments = require("../controllers/Comment.controller.js");
    var router = require("express").Router();

    // Create a new Comment (Commenttype: Epic, Task or Subtask)
    router.post("/", comments.create);

    // Update a comment with id
    router.put("/:id", comments.update);

    // Delete a comment with id
    router.delete("/:id", comments.delete);

    // Delete all comments
    router.delete("/all", comments.deleteAll);

    // Delete all comments of an issue
    router.delete("/issue/:id", comments.deleteByIssue);

    app.use('/api/comments', router);
}