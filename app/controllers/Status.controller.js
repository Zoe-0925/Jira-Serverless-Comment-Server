const db = require("../models");
const Status = db.status
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

        // Create a status
        const id = mongoose.Types.ObjectId();
        const status = new Status({
            _id: id,
            name: req.body.name,
            project: req.body.project
        });
        try {
            await status.save()
            return res.status(200).json({
                success: true, id: status._id
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while creating the status."
            });
        }
    })(req, res, next);
}

// Retrieve all statuss involving a particular user
exports.findAll = (req, res) => {
    Status.find().then(data => { res.status(200).send(data); })
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while retrieving Statuss."
            });
        });
}

// Retrieve a single Status with id
exports.findOne = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        validateId(req, res);
        Status.find({ _id: req.params.id }).then(data => {
            return res.status(200).json({
                success: true,
                data: data
            });
        }).catch(err => {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while retrieving Statuss."
            });
        });
    })(req, res, next);
}

// Retrieve all Statuss in a particular project
exports.findByProject = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        validateId(req, res);
        Status.find({ project: req.params.id }).then(data => {
            return res.status(200).json({
                success: true,
                data: data
            });
        }).catch(err => {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while retrieving Statuss."
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
        Status.findByIdAndUpdate(req.params.id, req.body.data).then(data => {
            return res.status(200).json({
                success: true,
                data: data
            });
        }).catch(err => {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while retrieving Statuss."
            });
        });
    })(req, res, next);
}

exports.updateIssueOrders = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        validateId(req, res);
        const status = await Status.findById(req.params.id)
        try {
            const result = Array.from(status.issue_order);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            status.issue_order = result
            await Status.save()
            return res.status(200).json({
                success: true
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: err || "Some error occurred while retrieving Statuss."
            });
        }
    })(req, res, next);
}

exports.moveIssueOrders = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        validateId(req, res);
        const sourceStatus = await Status.findById(req.body.data.source)
        const destinationStatus = await Status.findById(req.body.data.destination)
        try {
            const sourceResult = Array.from(sourceStatus.issue_order);
            const destinationResult = Array.from(destinationStatus.issue_order);
            const [removed] = sourceResult.splice(startIndex, 1);
            destinationResult.splice(endIndex, 0, removed);
            sourceStatus.issue_order = sourceResult
            destinationStatus.issue_order = destinationResult
            await Status.save()
            res.status(200).json({
                success: true
            });
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: err || "Some error occurred while retrieving Statuss."
            });
        }
    })(req, res, next);
}

// Delete all Status
exports.deleteAll = async (req, res) => {
    await Status.deleteMany()
    try {
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({
            message: err || "Some error occurred while deleting Status. "
        });
    }
}

// Retrieve all Statuss involving a particular user
exports.delete = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        validateId(req, res);
        if (err) {
            console.log(err);
        }
        if (info !== undefined) {
            res.status(403).send(info.message);
        }
        try {
            await Status.findByIdAndDelete(req.params.id)
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(500).json({
                message: err || "Some error occurred while deleting Status. "
            });
        }
    })(req, res, next);
};

