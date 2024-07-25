'use client';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
    Navigation,
    Pagination,
    Scrollbar,
    A11y,
    Autoplay,
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import banner from './banner.json';

const banners = [
    { img: banner.img1 },
    { img: banner.img2 },
    { img: banner.img3 },
];

export const ImageSwiper = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const paginationBullets = document.querySelectorAll(
            '.swiper-pagination-bullet',
        );
        paginationBullets.forEach(bullet => {
            (bullet as HTMLElement).style.backgroundColor = '#0490da';
        });

        const activeBullet = document.querySelector(
            '.swiper-pagination-bullet-active',
        );
        if (activeBullet) {
            (activeBullet as HTMLElement).style.backgroundColor = '#a5f3fc';
        }
    }, []);

    // Mobile device isn't fixed yet
    return (
        <div>
            {!isMobile && (
                <div className="mb-10 rounded-xl w-full object-cover">
                    <Swiper
                        modules={[
                            Navigation,
                            Pagination,
                            Scrollbar,
                            A11y,
                            Autoplay,
                        ]}
                        spaceBetween={10}
                        slidesPerView={1}
                        autoplay={{ delay: 3000 }}
                        loop={true}
                        pagination={{ clickable: true }}>
                        {banners.map((item, index) => (
                            <SwiperSlide key={index + 1}>
                                <img
                                    className="w-full h-80 rounded-xl"
                                    src={item.img}
                                    alt={`Image ${index + 1}`}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </div>
    );
};
