'use client';
import Link from 'next/link';
import React from 'react';

const ClickableText: React.FC<{
    id: string;
    text: string;
    href: string;
}> = ({ text, id, href }) => {
    return (
        <div className="text-right grid gap-6 mb-6">
            <Link href={href} passHref>
                <p
                    id={id}
                    className="w-full text-sm font-medium text-blue-300 cursor-pointer transition-colors duration-300 ease-in-out 
                        hover:text-blue-600 focus:text-blue-700 outline-none"
                    tabIndex={0}>
                    {text}
                </p>
            </Link>
        </div>
    );
};

export default ClickableText;
