'use client';
import React from 'react';

const Button: React.FC<{
    id: string;
    buttonName: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
}> = ({ buttonName, id, onClick, disabled = false }) => {
    return (
        <div className="grid gap-6 mb-6">
            <button
                id={id}
                className={`w-full py-2 px-4 bg-blue-500 text-white text-sm font-medium rounded-lg shadow-md transition-colors duration-300 ease-in-out 
                    ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300'}`}
                onClick={onClick}
                disabled={disabled}>
                {buttonName}
            </button>
        </div>
    );
};

export default Button;
