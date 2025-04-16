import clsx from "clsx";
import styles from "../pages/admin/Course/list/List.module.scss";
import { useEffect, useState } from "react";
import deleteIcon from "../assets/images/delete.svg";
import restoreIcon from "../assets/images/restore.svg";
import * as adminService from "../api/apiService/adminService";
import Modal from "./modal";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment/moment";
import DataGridComponent from "./table";
import { debounce } from "../util";

function ListInvoice({
    searchFunc,
    isHistoryDeletedPage,
    modalContent = {
        title: "",
        description: "",
        isReject: false,
        handleRemove: () => {},
        isOpen: false,
        handleCloseModal: () => {},
    },
    setModalContent = () => {},
    getTotalDataFunc = () => {},
}) {
    const [invoices, setInvoices] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 5,
    });
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [value, setValue] = useState({
        startDate: new Date(),
        endDate: new Date().setMonth(11),
    });

    const columns = [
        {
            field: "course",
            headerName: "Course",
            headerClassName: "theme-header",
            width: 300,
            type: "string",
            sortable: true,
            sortComparator: (v1, v2) => {
                return v1.title.localeCompare(v2.title);
            },
            renderCell: (params) => {
                return (
                    <div
                        className={clsx(
                            styles.field,
                            "flex h-full items-center"
                        )}
                    >
                        <div className={clsx(styles.cssImg)}>
                            <img src={params.value.thumbnail} alt="" />
                        </div>
                        <div className="overflow-hidden">
                            <div
                                className={clsx(styles.name, "overflow-hidden")}
                            >
                                {params.value.title}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "user",
            headerName: "User",
            headerClassName: "theme-header",
            width: 300,
            type: "string",
            sortable: true,
            sortComparator: (v1, v2) => {
                return (v1.lastName + v1.firstName).localeCompare(
                    v2.lastName + v2.firstName
                );
            },
            renderCell: (params) => {
                return (
                    <div className={clsx(styles.field, "flex h-full relative")}>
                        <div
                            className={clsx(
                                styles.cssImg,
                                "flex items-center absolute top-0 translate-y-1/4"
                            )}
                        >
                            <img
                                src={
                                    !params.value?.avatarUrl
                                        ? "avatar"
                                        : params.value?.avatarUrl
                                }
                                alt=""
                            />
                        </div>
                        <div className="overflow-hidden flex flex-col justify-center ">
                            <div className={clsx(styles.name)}>
                                {params.value.lastName +
                                    " " +
                                    params.value.firstName}
                            </div>
                            <div className={clsx(styles.categories)}>
                                {params.value.email}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "amount",
            headerName: "Total",
            headerClassName: "theme-header",
            sortable: true,
            sortComparator: (v1, v2) => {
                if (v1.total === "Free" && v2.total === "Free") return 0;
                if (v1.total === "Free") return -1;
                if (v2.total === "Free") return 1;

                const total1 = parseFloat(v1.total);
                const total2 = parseFloat(v2.total);

                return total1 - total2;
            },
            width: 130,
            renderCell: (params) => {
                return `${params.value?.toLocaleString("vi-VN")} VND`;
            },
        },
        {
            field: "method",
            headerName: "Method",
            headerClassName: "theme-header",
            sortable: true,
            width: 120,
            renderCell: (params) => {
                return `${params.value}`;
            },
        },
        {
            field: "createdAt",
            headerName: "Create At",
            headerClassName: "theme-header",
            sortable: true,
            type: "dateTime",
            width: 180,
            renderCell: (params) => {
                const date = params.value.toLocaleDateString();
                const time = params.value.toLocaleTimeString();
                return <>{date + " - " + time}</>;
            },
        },
        {
            field: "actions",
            headerClassName: "theme-header",
            width: 160,
            type: "actions",
            renderCell: (params) => {
                return (
                    <div
                        className={clsx(
                            styles.field,
                            "flex items-center h-full"
                        )}
                    >
                        <div
                            className={clsx(
                                styles.name,
                                "flex gap-4 items-center"
                            )}
                        >
                            <button
                                onClick={() => {
                                    setModalContent({
                                        ...modalContent,
                                        handleRemove: () =>
                                            modalContent.handleRemove(
                                                params.value.id
                                            ),
                                        isOpen: true,
                                    });
                                }}
                            >
                                {
                                    <img
                                        src={
                                            isHistoryDeletedPage
                                                ? restoreIcon
                                                : deleteIcon
                                        }
                                        alt=""
                                        className="cursor-pointer"
                                    />
                                }
                            </button>
                        </div>
                    </div>
                );
            },
        },
    ];

    const handlePageData = (pagination) => {
        const { pageSize, page } = pagination;
        setPagination((prev) => ({
            ...prev,
            page: page,
            size: pageSize,
        }));
    };

    useEffect(() => {
        setIsLoadingData(true);
        const fetchApi = async () => {
            try {
                let result;
                result = await getTotalDataFunc(
                    pagination.page,
                    pagination.size,
                    false
                );
                setInvoices(result.content);
                setTotalData(result.totalElements);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchApi();
    }, [pagination, modalContent.isOpen]);

    const handleValueChange = (newValue) => {
        if (newValue.startDate === null && newValue.endDate === null) {
            const fetchApi = async () => {
                try {
                    const result = await adminService.getAllInvoice();
                    setInvoices(result.content.content);
                    console.log(result);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchApi();
            return;
        }

        const tempStart = moment(newValue.startDate, "YYYY-MM-DD");
        const tempEnd = moment(newValue.endDate, "YYYY-MM-DD");
        const startDate = tempStart.format("YYYY-MM-DDTHH:mm:ss.SSS");
        const enđDate = tempEnd.format("YYYY-MM-DDTHH:mm:ss.SSS");
        const fetchApi = async () => {
            try {
                const result = await adminService.getInvoicesByDate(
                    startDate,
                    enđDate,
                    pagination.page,
                    pagination.size
                );
                setInvoices(result.content.content);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
        setValue(newValue);
    };

    const searchApi = debounce(async (value) => {
        setIsLoadingData(true);
        try {
            const result = await searchFunc(
                value,
                pagination.page,
                pagination.size
            );
            setInvoices(result.content);
            setTotalData(result.totalElements);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingData(false);
        }
    }, 500);

    const handleSearch = async (e) => {
        const value = e.target.value;
        searchApi(value, 0, 5);
    };

    return (
        <div className="flex justify-center w-full ">
            <div className="container mt-4 mx-14">
                <div className="wrapMainDash">
                    <div className={clsx(styles.topMain)}>
                        <div className={clsx(styles.itemTopMain)}>
                            <h4>List</h4>
                        </div>
                        <div className={clsx(styles.itemTopMain)}></div>
                    </div>

                    <div className="formGroup flex flex-col gap-3">
                        <div
                            className={clsx(
                                styles.contentMain,
                                "flex justify-between gap-3"
                            )}
                        >
                            <div
                                className={clsx(
                                    styles.contentItem,
                                    "w-[240px]"
                                )}
                            >
                                <div className={clsx(styles.formSelect)}>
                                    <label htmlFor="">Date</label>
                                    <Datepicker
                                        containerClassName="relative h-full"
                                        inputClassName="h-full border-gray-200 border pl-2 w-full rounded-md focus:ring-0 font-normal"
                                        value={value}
                                        onChange={handleValueChange}
                                    />
                                </div>
                            </div>
                            <div className={clsx(styles.contentItem, "flex-1")}>
                                <div
                                    id="seachWrap"
                                    className={clsx(styles.search)}
                                >
                                    <input
                                        onChange={handleSearch}
                                        id="searchInput"
                                        type="search"
                                        placeholder="Search.."
                                    />
                                </div>
                            </div>
                        </div>
                        <DataGridComponent
                            columns={columns}
                            rows={reFormat(invoices)}
                            totalElements={totalData}
                            isLoading={isLoadingData}
                            paginationModel={{
                                pageSize: pagination.size,
                                page: pagination.page,
                            }}
                            setPaginationModel={handlePageData}
                        ></DataGridComponent>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalContent.isOpen}
                closeModal={modalContent.handleCloseModal}
                handleRemove={modalContent.handleRemove}
                title={modalContent.title}
                description={modalContent.description}
            ></Modal>
        </div>
    );
}

export default ListInvoice;

function reFormat(data) {
    if (!data || data.length === 0) return [];

    return data.map((item) => {
        const create = new Date(item.createdAt);
        return {
            id: item.id,
            course: item.course,
            user: item.user,
            createdAt: create,
            method: item.method,
            amount: item.total,
            actions: item,
        };
    });
}
