'use client';

import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import slide from './banner.json';

const slides = [slide.img1, slide.img2, slide.img3];

export const ImageSwiper = () => {
    return (
        <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
            <Carousel
                autoPlay
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                interval={2000}
                className="w-full h-80">
                {slides.map((item, index) => (
                    <div key={index} className="w-full h-80">
                        <img
                            src={item}
                            alt={`Image ${index + 1}`}
                            className="object-fit w-full h-80"
                        />
                    </div>
                ))}
            </Carousel>
        </div>
    );
};