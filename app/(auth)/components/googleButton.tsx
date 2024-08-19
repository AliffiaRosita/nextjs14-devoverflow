'use client';
import React from 'react';
import { FcGoogle } from "react-icons/fc";

const GoogleButton: React.FC<{
    id: string;
    buttonName: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ buttonName, id, onClick }) => {
    return (
        <div className="grid gap-6 mb-6">
            <button
                id={id}
                className='w-full py-2 px-4 bg-white text-black text-sm font-medium rounded-lg border border-gray-300 transition-colors duration-300 ease-in-out flex justify-center'
                onClick={onClick}>
                <FcGoogle className='text-lg mr-3'/>{buttonName}
            </button>
        </div>
    );
};

export default GoogleButton;
