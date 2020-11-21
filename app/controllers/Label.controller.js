const db = require("../models");
const Label = db.labels
const passport = require("passport")

const validateId = (req, res) => {
    if (!req.params.id) {
        return res.status(200).json({
            success: false,
            message: "The content body can not be empty."
        });
    }
}

exports.create = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        // Validate request
        if (!req.body.name || !req.body.project) {
            return res.status(200).json({
                success: false,
                message: "The content body can not be empty."
            });
        }

        // Create a label
        const id = mongoose.Types.ObjectId();
        const label = new Label({
            _id: id,
            name: req.body.name,
            project: req.body.project
        });
        try {
            await label.save()
            return res.status(200).json({ success: true, id: label._id });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while creating the label."
            });
        }
    })(req, res, next);
}

// Retrieve all labels involving a particular user
exports.findAll = (req, res) => {
    Label.find().then(data => { return res.status(200).json({ success: true, data: data }); })
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while retrieving labels."
            });
        });
}

// Retrieve a single label with id
exports.findOne = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        // Validate request
        validateId(req, res);
        Label.find({ _id: req.params.id }).then(data => {
            return res.status(200).json({ success: true, data: data });
        }).catch(err => {
            return res.status(500).json({
                message: err || "Some error occurred while retrieving labels."
            });
        });
    })(req, res, next);
}

// Retrieve all labels in a particular project
exports.findByProject = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        validateId(req, res);
        Label.find({ project: req.params.id }).then(data => {
            return res.status(200).json({ success: true, data: data });
        }).catch(err => {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while retrieving labels."
            });
        });
    })(req, res, next);
}

exports.update = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        // Validate request
        if (!req.body.name) {
            res.status(200).json({
                message: "The content body can not be empty."
            });
        }
        validateId(req, res);
        Label.findByIdAndUpdate(req.params.id).then(data => {
            return res.status(200).json({ success: true });
        }).catch(err => {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while retrieving labels."
            });
        });
    })(req, res, next);
}


// Delete all label
exports.deleteAll = (req, res) => {
    Label.deleteMany()
        .then(() => {
            return res.status(200).json({ success: true });
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while deleting label. "
            });
        });
}


// Retrieve all labels involving a particular user
exports.delete = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        // Validate request
        validateId(req, res);
        Label.findByIdAndDelete(req.params.id)
            .then(data => {
                return res.status(200).json({ success: true });
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err || "Some error occurred while deleting label."
                });
            });
    })(req, res, next);
}


