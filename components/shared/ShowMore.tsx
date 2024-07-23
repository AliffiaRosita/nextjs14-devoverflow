import { ShowMoreProps } from '@/types';
import React from 'react';

export const ShowMore = ({ text, maxLength, link }: ShowMoreProps) => {
    const htmlContent = text.replace(/<[^>]+>/g, ' ');
    const splittedHtmlContent = htmlContent.split(' ');
    const itCanOverflow = splittedHtmlContent.length > maxLength;
    const beginHtmlContent = itCanOverflow
        ? splittedHtmlContent.slice(0, maxLength - 1).join(' ')
        : htmlContent;

    return (
        <div className="text-justify">
            <p>
                {beginHtmlContent}
                {itCanOverflow && (
                    <>
                        <span>... </span>
                        <a href={link} className='text-blue-500'>show more</a>
                    </>
                )}
            </p>
        </div>
    );
};
