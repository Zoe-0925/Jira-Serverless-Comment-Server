const db = require("../models");
const Comment = db.comments
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    useTLS: true,
});

const validateId = (req, res) => {
    if (!req.params.id) {
        res.status(200).send({
            message: "The content body can not be empty."
        });
        return;
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
        if (!req.body.author || !req.body.project || !req.body.description || !req.body.issue) {
            res.status(200).send({
                message: "The content body can not be empty."
            });
            return;
        }

        // Create a comment
        const id = mongoose.Types.ObjectId();
        const comment = new Comment({
            _id: id,
            project: req.body.project,
            author: req.body.author,
            description: req.body.description,
            issue: req.body.issue,
        });
        try {
            await comment.save()
            pusher.trigger('comments', 'new-comment', {
                comment: comment,
            });
            return res.status(200).json({
                success: true,
                id: comment._id
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while creating the comment."
            });
        }
    })(req, res, next);
}

// Retrieve all comments involving a particular user
exports.findAll = (req, res) => {
    Comment.find().sort({ 'date': 'ascd' })
        .then(data => {
            return res.status(200).json({
                success: true,
                data: data
            });
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while retrieving Comments."
            });
        });
}

// Retrieve a single Comment with id
exports.findOne = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }

        validateId(req, res);
        Comment.find({ _id: req.params.id }).then(data => {
            return res.status(200).json({
                success: true,
                data: data
            });
        }).catch(err => {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while retrieving Comments."
            });
        });
    })(req, res, next);
}

// Retrieve all Comments in a particular project
exports.findForProject = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }

        validateId(req, res);
        Comment.find({ project: req.params.id }).sort({ 'date': 'ascd' })
            .then(data => {
                return res.status(200).json({
                    success: true,
                    data: data
                });
            }).catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err || "Some error occurred while retrieving Comments."
                });
            });
    })(req, res, next);
}

// Retrieve all Comments in a particular project
exports.findForIssue = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }

        validateId(req, res);
        Comment.find({ issue: req.params.id }).sort({ 'date': 'ascd' })
            .then(data => {
                return res.status(200).json({
                    success: true,
                    data: data
                });
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err || "Some error occurred while retrieving Comments."
                });
            });
    })(req, res, next);
}

exports.findChildren = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }

        validateId(req, res);
        Comment.find({ parent: req.params.id }).sort({ 'date': 'ascd' })
            .then(data => {
                return res.status(200).json({
                    success: true,
                    data: data
                });
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err || "Some error occurred while retrieving Comments."
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

        validateId(req, res);
        Comment.findByIdAndUpdate(req.params.id).then(data => {
            return res.status(200).json({
                success: true,
            });
        }).catch(err => {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while retrieving Comments."
            });
        });
    })(req, res, next);
}

// Delete all Comment
exports.deleteAll = (req, res) => {
    Comment.deleteMany()
        .then(() => {
            return res.status(200).json({
                success: true,
            });
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while deleting Comment. "
            });
        });
}


// Retrieve all Comments involving a particular user
exports.delete = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }

        validateId(req, res);
        Comment.findByIdAndDelete(req.params.id)
            .then(data => {
                return res.status(200).json({
                    success: true,
                });
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err || "Some error occurred while deleting Comment."
                });
            });
    })(req, res, next);
}

exports.deleteByIssue = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }

        Comment.deleteMany({ issue: req.params.id })
            .then(() => {
                return res.status(200).json({
                    success: true,
                });
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err || "Some error occurred while deleting Comment. "
                });
            });
    })(req, res, next);
}