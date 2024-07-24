import { MaxTitleProps, ShowMoreProps } from '@/types';
import Link from 'next/link';
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
                        <Link href={link} className='text-blue-500'>show more</Link>
                    </>
                )}
            </p>
        </div>
    );
};

export const MaxTitle = ({ title, maxLength }: MaxTitleProps) => {
    const htmlContent = title.replace(/<[^>]+>/g, '');
    const splittedHtmlContent = htmlContent.split('');
    const itCanOverflow = splittedHtmlContent.length > maxLength;
    const beginHtmlContent = itCanOverflow
        ? splittedHtmlContent.slice(0, maxLength - 1).join('')
        : htmlContent;

    return (
        <div className="sm:h3-semibold base-semibold flex-1 text-primary-500 hover:text-blue-500">
            <>
                {beginHtmlContent}
                {itCanOverflow && (
                    <>...</>
                )}
            </>
        </div>
    );
};

