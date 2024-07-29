import React, { useCallback, useState, DragEvent, ChangeEvent } from 'react';
import Image from 'next/image';

const ImageUpload: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState<string>('');
    const [isDragActive, setIsDragActive] = useState<boolean>(false);

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(false);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(false);
        handleFiles(event.dataTransfer.files);
    };

    const handleFiles = useCallback((files: FileList) => {
        try {
            setError('');
            const file = files[0];
            if (!file) return;

            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                setError('Invalid file type.');
                return;
            }

            if (file.size > 1048576) {
                // 1MB
                setError('File is too large.');
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            setError('An error occurred while uploading the image.');
        }
    }, []);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleFiles(event.target.files!);
    };

    return (
        <div
            className={`cursor-pointer rounded-lg border-2 border-dashed border-blue-500 p-5 text-center ${isDragActive ? 'bg-blue-100' : 'bg-gray-100'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput')!.click()}>
            <input
                id="fileInput"
                type="file"
                className="hidden"
                accept="image/jpeg, image/png"
                onChange={handleChange}
            />
            {isDragActive ? (
                <p>Drop the files here...</p>
            ) : (
                <p className="text-light-500">
                    Drag & drop an image here, or click to select an image
                </p>
            )}
            {error && <p className="text-red-500">{error}</p>}
            {image && (
                <div className="mt-2 w-full">
                    <Image
                        src={image}
                        alt="Uploaded"
                        layout="responsive"
                        width={500}
                        height={500}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
