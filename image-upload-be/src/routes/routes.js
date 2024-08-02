const uploadRouter = require('../modules/upload.routes');
const router = require('express').Router();

router.use('/api', uploadRouter);

module.exports = router;
