'use client';

import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import slide from './banner.json';

const slides = [slide.img1, slide.img2, slide.img3, slide.img4, slide.img5];

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
                            className="absolute top-0 right-0 mt-2 mr-2 z-40 text-cyan-500 px-3 py-1 hover:text-red-700">
                            {`Close [x]`}
                        </button>

                        <Carousel
                            axis="horizontal"
                            autoPlay={true}
                            infiniteLoop={true}
                            showThumbs={false}
                            showStatus={false}
                            interval={2000}
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
