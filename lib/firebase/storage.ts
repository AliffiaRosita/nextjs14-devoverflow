import { nanoid } from 'nanoid';
import storage from './firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const uploadFile = async (file: File, folder: string) => {
    const filename = nanoid();
    const storageRef = ref(
        storage,
        `${folder}${filename}.${file.name.split('.').pop()}`,
    );
    try {
        const res = await uploadBytes(storageRef, file);
        return res.metadata.fullPath;
    } catch (error) {
        console.error('Error uploading file: ', error);
        throw new Error('File upload failed');
    }
};

export const getFile = async (path: string) => {
    try {
        const fireRef = ref(storage, path);
        return getDownloadURL(fireRef);
    } catch (error) {
        throw new Error('Failed to get file');
    }
};
