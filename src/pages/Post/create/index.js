import { Quill } from "react-quill-new/lib";
import ImageUploader from "quill-image-uploader";
import clsx from "clsx";
import fileSelect from "../../../assets/images/fileSelect.svg";
import styles from "../../admin/Course/create/CreateCourse.module.scss";
import ReactQuill from "react-quill-new";
import * as publicService from "../../../api/apiService/publicService";
import "react-quill-new/dist/quill.snow.css";
import InputComponent from "../../../component/InputComponent";
import * as userService from "../../../api/apiService/authService";
import * as postService from "../../../api/apiService/postService";

import "quill-image-uploader/dist/quill.imageUploader.min.css";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import btnClose from "../../../assets/images/btnClose.svg";
import { json, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AIBox from "../../../component/AIBox";
import Ink from "react-ink";
import PreviewPost from "./preview";

Quill.register("modules/imageUploader", ImageUploader);
let injectIsLoading = null;
const handleUpload = (file, setIsLoading) => {
    if (!file) {
        return;
    }
    injectIsLoading(true);
    const fetchApi = async () => {
        try {
            const result = await publicService.uploadFile(file);
            injectIsLoading(false);
            return result.content;
        } catch (error) {
            console.log(error);
        }
    };

    return fetchApi();
};

function CreatePost({
    initPost = {
        title: "Sample Post Title",
        description: "This is a sample description for the post.",
        content:
            "<p>This is the content of the post. You can edit it using the editor.</p>",
        thumbnail: "https://via.placeholder.com/150", // URL của ảnh đại diện
    },
}) {
    const [errors, setErrors] = useState({});
    const { title } = useParams();
    const [listTagData, setListTagData] = useState([]);
    const [post, setPost] = useState(initPost);
    const [showAIBox, setShowAIBox] = useState(false);
    const AIBtnRef = useRef(null);
    const [openPreview, setOpenPreview] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const containerAIBox = useRef(null);

    injectIsLoading = setIsLoading;

    const navigate = useNavigate();

    // const handleChangeTag = (data) => {
    //     setPost({ ...post, tags: [...data] });
    // };
    const handleRemoveItemPrevivew = (e) => {
        setPost({ ...post, thumbnail: "" });
    };

    const handleUpLoadThubmnail = (e) => {
        const file = e.target.files[0];
        setIsLoading(true);
        toast.promise(publicService.uploadFile(file), {
            loading: "loading...",
            success: (data) => {
                setPost({ ...post, thumbnail: data.content.url });
                setIsLoading(false);
                return "Upload thumbnail success";
            },
            error: (error) => {
                console.log(error);
                return "error";
            },
        });
        e.target.value = "";
    };

    const handleChangeQuill = (content) => {
        setPost((prev) => ({ ...prev, content }));
    };

    const handleTitleChange = (e) => {
        setPost((prev) => ({ ...prev, title: e.target.value }));
    };
    const handleDescChange = (e) => {
        setPost((prev) => ({ ...prev, description: e.target.value }));
    };

    useEffect(() => {
        // let reformatTags = [];
        // if (initPost?.tags) {
        //     reformatTags = initPost.tags.map((tag) => ({
        //         label: tag.name,
        //         value: tag.id,
        //     }));
        // }
        setPost({ ...initPost });
    }, [initPost]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await publicService.getAllTag();
                const formatTags = result.map((tag) => ({
                    label: tag.name,
                    value: tag.id,
                }));
                setListTagData(formatTags);
            } catch (error) {
                console.log(error);
                toast.error("Error!");
            }
        };
        // fetchApi();

        return () => {};
    }, []);

    const handleUpdatePost = () => {
        const tagsValue = post.tags.map((tag) => {
            return {
                name: tag.label,
            };
        });
        toast.promise(userService.updatePost({ ...post, tags: tagsValue }), {
            loading: "loading...",
            success: () => {
                navigate(`/posts/${encodeURIComponent(post?.title)}/view`);
                return "Update successfully";
            },
            error: (error) => {
                console.log(error);
                return error.message;
            },
        });
    };

    const handlePusblish = () => {
        // const tagsValue = post.tags.map((tag) => {
        //     return {
        //         name: tag.label,
        //     };
        // });
        const user = JSON.parse(sessionStorage.getItem("user"));
        toast.promise(postService.createPost({ ...post, id: user.id }), {
            loading: "loading...",
            success: () => {
                navigate(`/posts/${encodeURIComponent(post?.title)}`);
                return "Publis successfully, please wait for admin approval";
            },
            error: (error) => {
                console.log(error);
                return error.message;
            },
        });
    };

    const handlePreview = () => {
        if (
            !post?.title ||
            !post?.description ||
            !post?.content ||
            !post?.thumbnail ||
            !post?.tags
        ) {
            toast.warning("Please fill all fields");
            return;
        }
        setOpenPreview(true);
    };

    return (
        <div className="relative">
            {openPreview && (
                <div className="absolute inset-0 bg-white z-10">
                    <div className="flex justify-between gap-3 border-b-1 border-gray-200 py-3 px-3">
                        <h4 className="text-xl">Preview</h4>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setOpenPreview(false)}
                                className="rounded-lg relative text-sm font-bold px-2 border-1 border-gray-400 bg-white"
                            >
                                <Ink></Ink>
                                Cancel
                            </button>
                            <button
                                onClick={handlePusblish}
                                className="rounded-lg relative text-sm font-bold px-3.5 border-1 border-gray-400 bg-black text-white"
                            >
                                <Ink></Ink>
                                Post
                            </button>
                        </div>
                    </div>
                    <PreviewPost post={post}></PreviewPost>
                </div>
            )}
            <div className="container flex py-10 relative">
                <div className="mx-auto max-w-[800px] w-[800px] ">
                    <div className="shadow-lg rounded-lg flex flex-col gap-4">
                        <div className="w-full p-6 border-b-[1px] border-b-gray-300 flex justify-between">
                            <div>
                                <h4 className="font-bold text-2xl">Details</h4>
                                <span className="text-gray-500 text-sm font">
                                    Title, short description, image...
                                </span>
                            </div>
                            {/* <div className="flex items-center">
                                <button className=" relative hover:opacity-80 bg-black text-sm font-semibold text-white rounded-md p-1">
                                    <Ink></Ink>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                                        />
                                    </svg>
                                </button>
                                <div className="absolute shadow-overlay bg-gray-300 inset-0 w-full h-[100vh] z-10 ">
                                    <div>
                                        <h4>Idea</h4>
                                        <div>
                                            <input type="Write idea for post..." />
                                        </div>
                                    </div>
                                    <div>
                                        <h4></h4>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                        <div className="px-6 mb-6 flex flex-col gap-4">
                            <InputComponent
                                onHandleChange={handleTitleChange}
                                value={post?.title}
                                label="Title"
                            ></InputComponent>
                            <InputComponent
                                onHandleChange={handleDescChange}
                                value={post?.description}
                                size="lg"
                                label="Description"
                            ></InputComponent>
                            <div>
                                <span className="text-xs font-bold">
                                    Content
                                </span>
                                <div className="mt-2.5 relative">
                                    <ReactQuill
                                        theme="snow"
                                        value={post?.content}
                                        onChange={(
                                            content,
                                            delta,
                                            source,
                                            editor
                                        ) => {
                                            handleChangeQuill(
                                                content,
                                                delta,
                                                source,
                                                editor
                                            );
                                        }}
                                        modules={toolbar}
                                        formats={formats}
                                    ></ReactQuill>
                                    <button
                                        ref={AIBtnRef}
                                        className="absolute right-2 bottom-2 bg-black px-2 rounded-lg py-2 text-white text-xs shadow-2xl btnLGBT"
                                        onClick={() => {
                                            setShowAIBox(!showAIBox);
                                        }}
                                    >
                                        <Ink></Ink>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                                            />
                                        </svg>
                                    </button>
                                    <div
                                        ref={containerAIBox}
                                        className="absolute z-30 w-full top-[102%]"
                                    >
                                        <AIBox
                                            showAIBox={showAIBox}
                                            contentValue={post?.content || ""}
                                            updateContentValue={
                                                handleChangeQuill
                                            }
                                            buttonRef={AIBtnRef}
                                        ></AIBox>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span className="text-xs font-bold">Cover</span>
                                <div className="mt-2.5">
                                    <div className="flex overflow-hidden">
                                        <div
                                            className={clsx(
                                                styles.formField,
                                                "w-1/2 overflow-hidden"
                                            )}
                                        >
                                            <label
                                                htmlFor="thumbnail"
                                                className={clsx(
                                                    styles.formLabel2,
                                                    styles.labelFile
                                                )}
                                            >
                                                <div
                                                    className={clsx(
                                                        styles.iconFile
                                                    )}
                                                >
                                                    <img
                                                        src={fileSelect}
                                                        alt=""
                                                    />
                                                </div>
                                            </label>
                                            {errors.thumbnail && (
                                                <div className="text-red-500 mt-1 text-sm mr-2">
                                                    {errors.thumbnail}
                                                </div>
                                            )}
                                            <input
                                                name="thumbnail"
                                                onChange={handleUpLoadThubmnail}
                                                id="thumbnail"
                                                type="file"
                                                hidden
                                                accept=".jpg, .jpeg, .png, .webp"
                                            />
                                        </div>
                                        <div
                                            className={clsx(
                                                styles.formField,
                                                "w-1/2 mt-[10px] ml-2"
                                            )}
                                        >
                                            {post?.thumbnail && (
                                                <div
                                                    className={clsx(
                                                        styles.imgField
                                                    )}
                                                >
                                                    <img
                                                        className={clsx(
                                                            styles.thumbnailImg,
                                                            "rounded-lg"
                                                        )}
                                                        src={post?.thumbnail}
                                                        alt=""
                                                    />
                                                    <button
                                                        onClick={(e) =>
                                                            handleRemoveItemPrevivew(
                                                                e
                                                            )
                                                        }
                                                        className={clsx(
                                                            styles.btnClosePreview,
                                                            "w-4 h-4"
                                                        )}
                                                    >
                                                        <img
                                                            src={btnClose}
                                                            alt=""
                                                        />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="mb-2">
                                <SelectComponent
                                    data={listTagData}
                                    value={post?.tags}
                                    handleChange={handleChangeTag}
                                ></SelectComponent>
                            </div> */}
                        </div>
                    </div>
                    <div className="text-right mt-8">
                        <button
                            onClick={handlePreview}
                            type="button"
                            className="rounded-lg cursor-pointer bg-white hover:bg-gray-100 transition-all ease-linear delay-50 border border-gray-300 text-black mr-4 font-bold text-base px-4 py-2.5"
                        >
                            Preview
                        </button>
                        {!title && (
                            <button
                                type="button"
                                onClick={handlePusblish}
                                className="rounded-lg cursor-pointer hover:opacity-75 bg-[#1C252E] text-white font-bold text-base px-4 py-2.5"
                            >
                                Publish
                            </button>
                        )}
                        {title && (
                            <button
                                type="button"
                                onClick={handleUpdatePost}
                                className="rounded-lg cursor-pointer hover:opacity-75 bg-[#1C252E] text-white font-bold text-base px-4 py-2.5"
                            >
                                SaveChange
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const toolbar = {
    toolbar: {
        container: [
            [{ header: "1" }, { header: "2" }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
            ],
            ["link", "image"],
            ["clean"],
        ],
    },
    imageUploader: {
        upload: handleUpload,
    },
    clipboard: {
        matchVisual: false,
    },
};

const formats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "imageBlot",
];

export default CreatePost;
