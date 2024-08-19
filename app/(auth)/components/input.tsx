'use client';
import React from 'react';

const FormText: React.FC<{
    placeholder: string;
    type: string;
    // defaultValue: string;
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}> = ({ placeholder, type, id, name, value, onChange, error }) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleShowPasswordToggle = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form>
            <div className="grid gap-6 mb-6 md:grid-cols-1">
                <div>
                    <input
                        type={
                            type === 'password' && showPassword ? 'text' : type
                        }
                        id={id}
                        name={name}
                        value={value}
                        // defaultValue={defaultValue}
                        className="shadow-lg border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder={placeholder}
                        onChange={onChange}
                        required
                    />
                    {error && (
                        <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                    {type === 'password' && (
                        <div className="mt-2">
                            <label className="text-sm font-medium text-gray-700">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    onChange={handleShowPasswordToggle}
                                />
                                Show password
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
};

export default FormText;
