const { service } = require('./upload.service');

module.exports = {
    controler: async (req, res, next) => {
        try {
            const file = req.file;
            const imgUrl = await service(file);
            res.status(200).json({
                message: 'Image uploaded successfully',
                data: imgUrl,
            });
        } catch (error) {
            next(error);
        }
    },
};
