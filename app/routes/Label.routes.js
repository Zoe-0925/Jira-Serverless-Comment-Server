module.exports = app => {
    const labels = require("../controllers/Label.controller.js");
    var router = require("express").Router();

    // Create a new label
    router.post("/", labels.create);

    // Update a label with id
    router.put("/:id", labels.update);

    // Delete a label with id
    router.delete("/:id", labels.delete);

    // Delete all label
    router.delete("/all", labels.deleteAll);

    app.use('/api/labels', router);
}