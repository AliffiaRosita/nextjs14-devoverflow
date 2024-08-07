'use server';

import { Storage } from '@google-cloud/storage';

export const UploadFile = async (form: FormData) => {
    try {
        const file = form.get('file') as File;
        if (!file) throw new Error('No file provided');
        if (file.size < 1) throw new Error('No file selected');

        const buffer = await file.arrayBuffer();
        const storage = new Storage();
        await storage
            .bucket('skillguru_bucket')
            .file(file.name)
            .save(Buffer.from(buffer));

        return true;
    } catch (error) {
        console.log('error uploading: ' + error);
        return false;
    }
};
