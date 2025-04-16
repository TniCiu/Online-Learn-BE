import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import DataGridComponent from "../../component/table";
import SelectComponent from "../../component/select/SelectComponent";
import {
    getTotalStatistic,
    getStatisticFilter,
} from "../../api/apiService/instructorService";

function reFormatCuorse(data) {
    if (!data || data.length === 0) return [];

    return data.map((item) => {
        const create = new Date(item.createdAt);
        return {
            id: create.toString(),
            object: item.user,
            revenue: item.revenue,
            course: item.course,
            createdAt: create,
            actions: item,
        };
    });
}

const selectData = [
    {
        value: "week",
        label: "Last 7 days",
    },
    {
        value: "month",
        label: "Last 30 days",
    },
    {
        value: "year",
        label: "Last 12 months",
    },
    {
        value: "all",
        label: "All time",
    },
];

function OverviewInstructor() {
    const [type, setType] = useState("invoice");
    const [dateRange, setDateRange] = useState("week");
    const [totalStatistic, setTotalStatistic] = useState({});
    const [dataGrid, setDatagrid] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [pagination, setPagination] = useState({
        page: 1,
        size: 5,
    });
    const isFirstRender = useRef(true);
    const columns = [
        {
            field: "object",
            headerName: "Student",
            headerClassName: "theme-header",
            width: 380,
            type: "string",
            sortable: true,
            sortComparator: (v1, v2) => {
                return v1.title.localeCompare(v2.title);
            },
            renderCell: (params) => {
                return (
                    <div className={clsx("flex h-full items-center gap-2")}>
                        <img
                            className="rounded-full size-7"
                            src={params.value.avatarUrl}
                            alt=""
                        />
                        <div className="overflow-hidden">
                            <div className={clsx("overflow-hidden")}>
                                {(params.value.firstName != null
                                    ? params.value.firstName
                                    : "") +
                                    " " +
                                    params.value.lastName}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "course",
            headerName: "Course",
            headerClassName: "theme-header",
            width: 370,
            type: "string",
            sortable: true,
            sortComparator: (v1, v2) => {
                return v1.title.localeCompare(v2.title);
            },
            renderCell: (params) => {
                return (
                    <div className={clsx("flex gap-2 h-full items-center")}>
                        <img
                            className="rounded-full size-7"
                            src={params.value.thumbnail}
                            alt=""
                        />
                        <div className="overflow-hidden">
                            <div className={clsx("overflow-hidden")}>
                                {params.value.title}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "createdAt",
            headerName: "Create At",
            headerClassName: "theme-header",
            sortable: true,
            type: "dateTime",
            width: 220,
            renderCell: (params) => {
                const date = params.value.toLocaleDateString();
                const time = params.value.toLocaleTimeString();
                return <>{date + " - " + time}</>;
            },
        },

        {
            field: "actions",
            headerClassName: "theme-header",
            width: 180,
            type: "actions",
            renderCell: (params) => {
                return (
                    <div className={clsx("flex items-center h-full")}>
                        <div className={clsx("flex gap-4 items-center")}>
                            {/* <button
                                onClick={() => {
                                    setModalContent({
                                        ...modalContent,
                                        title: "DELETE",
                                        isOpen: true,
                                        description:
                                            "Are you sure want to delete",
                                        handleRemove: () =>
                                            handleRemoveCourse(params.value.id),
                                    });
                                }}
                            >
                                <img
                                    src={deleteIcon}
                                    alt=""
                                    className="cursor-pointer"
                                />
                            </button>
                            <div
                                className="py-1 px-1 justify-center itesm-center  rounded-full focus:outline-none cursor-pointer hover:bg-gray-300 hover:opacity-80 transition-all delay-50 ease-in menu-button relative"
                                onClick={(e) =>
                                    handleMenuButtonClick(e, params.value)
                                }
                            >
                                {" "}
                                <Ink></Ink>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                                    />
                                </svg>
                            </div> */}
                        </div>
                    </div>
                );
            },
        },
    ];

    const columnsInvoice = [
        {
            field: "object",
            headerName: "Student",
            headerClassName: "theme-header",
            width: 380,
            type: "string",
            sortable: true,
            sortComparator: (v1, v2) => {
                return v1.title.localeCompare(v2.title);
            },
            renderCell: (params) => {
                return (
                    <div className={clsx("flex h-full items-center gap-2")}>
                        <img
                            className="rounded-full size-7"
                            src={params.value.avatarUrl}
                            alt=""
                        />
                        <div className="overflow-hidden">
                            <div className={clsx("overflow-hidden")}>
                                {(params.value.firstName != null
                                    ? params.value.firstName
                                    : "") +
                                    " " +
                                    params.value.lastName}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "course",
            headerName: "Course",
            headerClassName: "theme-header",
            width: 370,
            type: "string",
            sortable: true,
            sortComparator: (v1, v2) => {
                return v1.title.localeCompare(v2.title);
            },
            renderCell: (params) => {
                return (
                    <div className={clsx("flex gap-2 h-full items-center")}>
                        <img
                            className="rounded-full size-7"
                            src={params.value.thumbnail}
                            alt=""
                        />
                        <div className="overflow-hidden">
                            <div className={clsx("overflow-hidden")}>
                                {params.value.title}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "revenue",
            headerName: "Revenut",
            headerClassName: "theme-header",
            sortable: false,
            type: "string",
            sortComparator: (v1, v2) => {
                if (v1.price === "Free" && v2.price === "Free") return 0;
                if (v1.price === "Free") return -1;
                if (v2.price === "Free") return 1;

                const price1 = parseFloat(v1.price);
                const price2 = parseFloat(v2.price);

                return price1 - price2;
            },
            width: 250,
            renderCell: (params) => {
                return params.value.price === 0
                    ? "Free"
                    : `${params.value.toLocaleString("vi-VN")} VND`;
            },
        },
        {
            field: "createdAt",
            headerName: "Create At",
            headerClassName: "theme-header",
            sortable: true,
            type: "dateTime",
            width: 220,
            renderCell: (params) => {
                const date = params.value.toLocaleDateString();
                const time = params.value.toLocaleTimeString();
                return <>{date + " - " + time}</>;
            },
        },
    ];

    const fetchTotalData = async () => {
        try {
            const data = await getTotalStatistic();
            setTotalStatistic(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            fetchTotalData();
        }

        const fectchDataFilter = async () => {
            try {
                const data = await getStatisticFilter(
                    type,
                    dateRange,
                    pagination.page,
                    pagination.size
                );
                setTotalElements(data.totalElements);
                setDatagrid(data.content);
            } catch (error) {
                console.log(error);
            }
        };
        fectchDataFilter();
    }, [type, dateRange, pagination.page, pagination.size]);

    const handlePaginationChange = (pagi) => {
        setPagination((prev) => ({
            ...prev,
            page: pagi.page,
            size: pagi.pageSize,
        }));
    };

    return (
        <div className="container">
            <h3 className="font-bold text-2xl mb-4">Overview</h3>
            <div className="b-shadow-light rounded-lg p-2">
                <div className="flex gap-4 px-3 border-b-1 border-gray-200">
                    <div
                        onClick={() => {
                            setType("invoice");
                        }}
                        className={clsx(
                            "relative pb-2.5 border-b-2 border-transparent transition-all text-gray-400 hover:text-black cursor-pointer",
                            {
                                "text-black border-black ": type === "invoice",
                            }
                        )}
                    >
                        <span className="text-base font-normal">
                            Total revenue
                        </span>
                        <div className="text-2xl my-1.5">
                            {(totalStatistic?.totalAmountInvoice?.toLocaleString(
                                "vi-VN"
                            ) || 0) + " VND "}
                        </div>
                        <div>
                            {(totalStatistic?.totalAmountInvoiceInMonth?.toLocaleString(
                                "vi-VN"
                            ) || 0) + " VND "}
                            this month
                        </div>
                    </div>
                    <div
                        onClick={() => {
                            setType("enrollment");
                        }}
                        className={clsx(
                            "relative pb-2.5 border-b-2 border-transparent transition-all text-gray-400 hover:text-black cursor-pointer",
                            {
                                "text-black border-black":
                                    type === "enrollment",
                            }
                        )}
                    >
                        <span className="text-base font-normal">
                            Total enrollment
                        </span>
                        <div className="text-2xl my-1.5 ">
                            {totalStatistic?.totalAmountEnrollment || 0}
                        </div>
                        <div>
                            {totalStatistic?.totalEnrollmentInMonth || 0} this
                            month
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-end my-2 w-full px-3">
                        <div className="flex gap-2">
                            <div className="flex gap-2 text-sm items-center">
                                Date range:
                                <SelectComponent
                                    handleChange={(e) => {
                                        setDateRange(e);
                                    }}
                                    value={dateRange}
                                    data={selectData}
                                ></SelectComponent>
                            </div>
                        </div>
                    </div>
                    <DataGridComponent
                        paginationModel={{
                            pageSize: pagination.size,
                            page: pagination.page,
                        }}
                        totalElements={totalElements}
                        setPaginationModel={handlePaginationChange}
                        rows={reFormatCuorse(dataGrid)}
                        columns={type !== "invoice" ? columns : columnsInvoice}
                    ></DataGridComponent>
                </div>
            </div>
        </div>
    );
}

export default OverviewInstructor;
