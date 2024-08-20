'use server';

export const uploadImage = async (formData: FormData) => {
    try {
        const response = await fetch(
            process.env.GCP_UPLOAD_URL as string,
            {
                method: 'POST',
                body: formData,
            },
        );

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const resp = await response.json();
        return resp;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
