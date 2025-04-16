import { Link } from "react-router-dom";

function PreviewPost({ post }) {
    return (
        <>
            <div
                style={{ backgroundImage: `url(${post.thumbnail})` }}
                className="w-full h-[400px] bg-cover bg-center relative flex bg-opacity-70"
            >
                <div className="absolute inset-0 bg-black opacity-70"></div>
                <div className="w-[800px] px-3 mx-auto z-[2] flex flex-col justify-between">
                    <h1 className="font-bold text-3xl text-white pt-[64px] max-w-[800px]">
                        {post.title}
                    </h1>
                </div>
            </div>
            <div className="flex gap-2">
                <div className="mx-auto w-[720px] mt-4 flex flex-col gap-3">
                    <div className="text-base font-normal text-black ">
                        <div className="text-xl font-bold ml-3 mb-2">
                            Description
                        </div>
                        <div className="border-b-[1px] border-gray-300"></div>
                        <br />
                        {post.description ? (
                            post.description
                        ) : (
                            <span className="text-gray-500">
                                No description
                            </span>
                        )}
                        <div className="border-b-[1px] border-gray-300 mt-4"></div>
                        <br />
                        {post.content === "<p><br></p>" ? (
                            <span className="text-gray-500"> No content</span>
                        ) : (
                            <div
                                className="overflow-hidden text-[#1C252E] font-medium text-base content-html"
                                dangerouslySetInnerHTML={{
                                    __html: post.content,
                                }}
                            ></div>
                        )}
                    </div>
                    <div className="border-b-[1px] border-dotted border-gray-300 my-2"></div>
                </div>
            </div>
        </>
    );
}

export default PreviewPost;
