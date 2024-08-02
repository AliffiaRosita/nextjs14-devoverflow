const { multerMid } = require('../middleware/multer.middleware');
const { controler } = require('./upload.controller');

const uploadRouter = require('express').Router();

uploadRouter.post('/upload', multerMid.single('file'), controler);

module.exports = uploadRouter;
