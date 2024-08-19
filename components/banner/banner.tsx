'use client';

import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import slide from './banner.json';

const slides = [slide.img1];

export const ImageSwiper = () => {
    const [isBannerVisible, setIsBannerVisible] = useState(true);
    const handleBannerClose = () => {
        setIsBannerVisible(false);
    };

    return (
        <>
            {isBannerVisible && (
                <div className="min-[320px]:mb-24 sm:mb-20 md:mb-20 lg:mb-20 xl:mb-5 2xl:mb-0 relative">
                    <div className="h-10 sm:h-16 xl:h-32 2xl:h-40">
                        <button
                            onClick={handleBannerClose}
                            className="flex items-center justify-center text-lg w-1 h-1 p-2 absolute -right-5 mt-0 z-40 rounded-full shadow-md shadow-gray-700 text-black bg-white hover:bg-gray-500 hover:text-white">
                            &times;
                        </button>

                        <Carousel
                            axis="horizontal"
                            autoPlay={true}
                            infiniteLoop={true}
                            showThumbs={false}
                            showStatus={false}
                            interval={6000}
                            className="h-28 w-full">
                            {slides.map((item, index) => (
                                <div key={index} className="h-28 w-full">
                                    <img
                                        src={item}
                                        alt={`Image ${index + 1}`}
                                        className="object-fit h-28 w-full"
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                </div>
            )}
        </>
    );
};
