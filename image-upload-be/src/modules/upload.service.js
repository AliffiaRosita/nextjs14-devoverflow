require('dotenv').config();
const path = require('path');
const gc = require('../utils/storage');
const bucket = gc.bucket(process.env.GC_BUCKET_NAME);

module.exports = {
    service: file =>
        new Promise((resolve, reject) => {
            const { originalname, buffer } = file;
            const timeStamp = Date.now();
            const extension = path.extname(originalname);
            const uniqueFileName = `img${timeStamp}${extension}`;

            const blob = bucket.file(uniqueFileName);
            const blobStream = blob.createWriteStream({
                resumable: false,
            });

            blobStream
                .on('finish', () => {
                    const publicUrl = `${process.env.GC_PUBLIC_URL}/${bucket.name}/${blob.name}`;
                    resolve(publicUrl);
                })
                .on('error', () => {
                    reject(`Unable to upload image`);
                })
                .end(buffer);
        }),
};
