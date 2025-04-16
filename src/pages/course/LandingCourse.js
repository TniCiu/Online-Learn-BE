import { useEffect, useRef, useState } from "react";
import { CourseCard } from "../../component/ladingPage/CourseCard";
import searchIcon from "../../assets/images/search.png";
import { debounce } from "../../util";
import * as publicService from "../../api/apiService/publicService";
import PaginationItem from "../../component/Pagination";
import MultiSelectComponent from "../../component/select/MultiSelectComponent";
import SelectComponent from "../../component/select/SelectComponent";

const dataSort = [
    {
        label: "Featured",
        value: "featured",
    },
    {
        label: "Newest",
        value: "newest",
    },
    {
        label: "Oldest",
        value: "oldest",
    },
    {
        label: "Price: Low - High",
        value: "price_asc",
    },
    {
        label: "Price: High - Low",
        value: "price_desc",
    },
];

function LandingCourse() {
    const [courses, setCourses] = useState([]);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 12,
        totalElments: 0,
        totalPages: 0,
    });
    const [filter, setFilter] = useState({
        title: "",
        categories: [],
        sort: "featured",
    });
    const [categoriesSelect, setCategoriesSelect] = useState([
        {
            label: "All",
            value: "all",
        },
    ]);
    const isFirstRender = useRef(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const courseResult = await publicService.getCourseFilter(
                    "",
                    filter.categories,
                    filter.sort,
                    pagination.page,
                    pagination.size
                );
                // get all categories
                if (isFirstRender.current) {
                    isFirstRender.current = false;
                    const listCate = await publicService.getAllCategories();
                    setCategoriesSelect(
                        listCate.content.map((cate) => ({
                            label: cate.name,
                            value: cate.id,
                        }))
                    );
                }
                setCourses(courseResult.content);
                setPagination((prev) => ({
                    ...prev,
                    totalElments: courseResult.totalElements,
                    totalPages: courseResult.totalPages,
                }));
            } catch (error) {
                console.log(error);
            }
        };
        fetchCourse();
    }, [pagination.page, pagination.size, filter.sort, filter.categories]);
    // }, [pagination, filter]);

    const handleCategoriesChange = (value) => {
        setFilter((prev) => ({
            ...prev,
            categories: value,
        }));
    };

    const handleSortChange = (value) => {
        setFilter((prev) => ({
            ...prev,
            sort: value,
        }));
    };

    const handleChangePage = (event, page) => {
        setPagination((prev) => ({
            ...prev,
            page: page - 1,
        }));
    };
    const searchCourse = async () => {
        const res = await publicService.getCourseFilter(
            filter.title,
            filter.categories,
            filter.sort,
            pagination.page,
            pagination.size
        );
        setCourses(res.content);
        setPagination((prev) => ({
            ...prev,
            totalElments: res.totalElements,
            totalPages: res.totalPages,
        }));
    };
    const debounceUpdateSearch = debounce(searchCourse, 300);

    const handleChangeInputSearch = (event) => {
        setFilter((prev) => ({
            ...prev,
            title: event.target.value,
        }));
        debounceUpdateSearch();
    };

    return (
        <div className="xl:mx-24 lg:mx-16 max-sm:mx-3 sm:mx-6 md:mx-12 mt-10">
            <h1 className="text-xl font-bold mb-4">Course</h1>
            <div className=" flex max-sm:flex-col gap-3 justify-between mb-10 h-full items-center">
                <div className="max-sm:w-full relative flex items-center bg-white border-1 border-gray-300 rounded-md w-64 hover:border-black h-full focus-within:border-black gap-1.5 px-3">
                    <img src={searchIcon} alt="Search" className="w-4 h-4" />
                    <input
                        type="text"
                        value={filter.title}
                        onChange={handleChangeInputSearch}
                        className="flex-grow pl-1 text-sm font-light py-3 text-gray-700 leading-tight focus:outline-none w-full"
                        placeholder="Search course..."
                    />
                </div>
                <div className="flex gap-2 max-sm:flex-col max-sm:w-full">
                    <div className="flex-1 w-full">
                        <MultiSelectComponent
                            title="Category"
                            value={filter.categories}
                            handleChange={handleCategoriesChange}
                            maxValues={3}
                            data={categoriesSelect}
                        ></MultiSelectComponent>
                    </div>
                    <div className="max-sm:flex-1  max-w-[500px]">
                        <SelectComponent
                            value={"featured"}
                            data={dataSort}
                            handleChange={handleSortChange}
                        ></SelectComponent>
                    </div>
                </div>
            </div>
            <div className="course grid grid-cols-12 gap-4">
                {courses?.length > 0 &&
                    courses?.map((course, index) => (
                        <div
                            className="xl:col-span-3 lg:col-span-3 sm:col-span-6 md:col-span-6 col-span-12"
                            key={index}
                        >
                            <CourseCard course={course}></CourseCard>
                        </div>
                    ))}
            </div>

            {pagination.totalElments > 0 ? (
                <div className="my-10">
                    <PaginationItem
                        count={pagination.totalPages}
                        handleChange={handleChangePage}
                    ></PaginationItem>
                </div>
            ) : (
                <div className="text-center">No course to display !</div>
            )}
        </div>
    );
}

export default LandingCourse;
