const multer = require('multer');

module.exports = {
    multerMid: multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 },
    }),
};
