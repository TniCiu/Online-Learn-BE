import CourseCard from "../../component/ladingPage/CourseCard.js";
import { useDispatch } from "react-redux";
import * as publicService from "../../api/apiService/publicService.js";
import { useEffect, useState } from "react";
import PostItem from "../../component/PostItem.js";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    A11y,
    Autoplay,
    Navigation,
    Pagination,
    Scrollbar,
} from "swiper/modules";
import Ink from "react-ink";
import { getPosts } from "../../api/apiService/postService.js";

function LandingPageComponent() {
    const dispatch = useDispatch();
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await getPosts(1, 8);
                setPosts(result.content);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, [dispatch]);

    return (
        <div className="flex flex-col items-center pt-5 bg-white">
            <main className="w-full">
                {/* <section className="p-4 sm:px-5 sm:py-10 mx-auto lg:max-w-[1200px] max-lg:w-[1200px]">
                    <SlideShow />
                </section> */}
                <div className="flex items-center justify-center">
                    <CourseCard />
                </div>
                <div>
                    <div className="p-4 sm:px-5 sm:py-10 mx-auto container">
                        <div className="flex justify-between">
                            <h2 className="text-xl font-semibold hover:underline hover:opacity-85 cursor-pointer transition-all">
                                #Featured Post
                            </h2>
                            <div className="flex gap-3">
                                <button
                                    id="featur=e-post-prev"
                                    type="button"
                                    className="rounded-full px-2 flex relative items-center "
                                >
                                    <Ink />
                                    <svg
                                        focusable="false"
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        className="w-[22px] h-[22px]"
                                    >
                                        <path
                                            fill="black"
                                            fillRule="evenodd"
                                            d="M15.488 4.43a.75.75 0 0 1 .081 1.058L9.988 12l5.581 6.512a.75.75 0 1 1-1.138.976l-6-7a.75.75 0 0 1 0-.976l6-7a.75.75 0 0 1 1.057-.081"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    id="feature-post-next"
                                    className="rounded-full px-2 flex relative items-center"
                                >
                                    <Ink />
                                    <svg
                                        focusable="false"
                                        className="w-[22px] h-[22px]"
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="black"
                                            fillRule="evenodd"
                                            d="M8.512 4.43a.75.75 0 0 1 1.057.082l6 7a.75.75 0 0 1 0 .976l-6 7a.75.75 0 0 1-1.138-.976L14.012 12L8.431 5.488a.75.75 0 0 1 .08-1.057"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <Swiper
                            spaceBetween={30}
                            modules={[
                                Navigation,
                                Pagination,
                                Scrollbar,
                                A11y,
                                Autoplay,
                            ]}
                            slidesPerView={4}
                            className="py-4 px-1"
                            autoplay={{
                                delay: 1500,
                                disableOnInteraction: false,
                            }}
                            navigation={{
                                nextEl: "#feature-post-next",
                                prevEl: "#feature-post-prev",
                            }}
                            breakpoints={{
                                // khi width >= 320px
                                320: {
                                    slidesPerView: 1, // Hiển thị 1 slide
                                    spaceBetween: 10, // Khoảng cách 10px giữa các slide
                                },
                                // khi width >= 480px
                                480: {
                                    slidesPerView: 1, // Hiển thị 1 slide
                                    spaceBetween: 20, // Khoảng cách 20px giữa các slide
                                },
                                // khi width >= 640px
                                640: {
                                    slidesPerView: 1, // Hiển thị 2 slide
                                    spaceBetween: 30, // Khoảng cách 30px giữa các slide
                                },
                                // khi width >= 768px (phù hợp với tablet)
                                768: {
                                    slidesPerView: 2, // Hiển thị 3 slide
                                    spaceBetween: 30, // Khoảng cách 30px giữa các slide
                                },
                                // khi width >= 1024px (phù hợp với laptop hoặc desktop nhỏ)
                                1024: {
                                    slidesPerView: 3, // Hiển thị 4 slide
                                    spaceBetween: 30, // Khoảng cách 30px giữa các slide
                                },
                                // khi width >= 1280px (phù hợp với desktop lớn)
                                1280: {
                                    slidesPerView: 4, // Hiển thị 5 slide
                                    spaceBetween: 40, // Khoảng cách 40px giữa các slide
                                },
                                // khi width >= 1600px (phù hợp với màn hình lớn)
                                1600: {
                                    slidesPerView: 5, // Hiển thị 6 slide
                                    spaceBetween: 50, // Khoảng cách 50px giữa các slide
                                },
                            }}
                        >
                            {posts &&
                                posts.map((post) => (
                                    <SwiperSlide key={post.id}>
                                        <PostItem post={post}></PostItem>
                                    </SwiperSlide>
                                ))}
                        </Swiper>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default LandingPageComponent;
