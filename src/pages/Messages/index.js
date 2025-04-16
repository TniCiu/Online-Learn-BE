import deleteIcon from "../../assets/images/delete.svg";
import iconPdf from "../../assets/images/ic-pdf.svg";
import clsx from "clsx";
import avatar from "../../assets/images/avatar_1.jpg";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Ink from "react-ink";
import { userSelector } from "../../redux/selector";
import { useOutsideClick } from "../../component/select/MultiSelectComponent";
import { searchContact } from "../../api/apiService/userService";
import { debounce } from "../../util/index";
import { getTimeElapsed } from "../../util/index";
import { useSelector } from "react-redux";
import * as chatService from "../../api/apiService/chatService";
import { toast } from "sonner";
import websocketService from "../../service/WebsocketService";
import { getFullName } from "../../util/index";
import * as messageUtil from "./messageUtil";

function AvatarAndStatus({ avatar, online = false }) {
    return (
        <div className="relative">
            <img
                src={avatar}
                alt=""
                className={clsx("w-12 h-12 rounded-full border-[2px] p-[2px]", {
                    "border-green-400 ": online,
                    "border-gray-400": !online,
                })}
            />
            <span
                className={clsx(
                    "shadow-lg rounded-full w-[10px] h-[10px] absolute right-[6px] -translate-y-full",
                    {
                        "bg-gray-400": !online,
                        "bg-green-400 animated-pulse bottom-0 ": online,
                    }
                )}
            ></span>
        </div>
    );
}

function MessageDefault() {
    return (
        <div className="message-to h-full">
            <div className="border-b-1 border-gray-200 flex justify-between gap-3 py-2.5 px-[20px]"></div>
            <div className="overflow-y-auto flex-1 lg:h-[500px] md:h-full center flex-col">
                <img
                    src="https://assets.minimals.cc/public/assets/icons/empty/ic-chat-active.svg"
                    alt=""
                    className="mb-3 w-[160px] h-[160px]"
                />
                <span className="font-semibold text-gray-500 text-xl">
                    Hello!
                </span>
                <span className="font-light text-sm text-gray-500">
                    Write something...
                </span>
            </div>
        </div>
    );
}

const MessageItem = ({ message, isMine = false }) => {
    const [isOpen, setIsOpen] = useState(false); // Quản lý trạng thái modal
    const [selectedImage, setSelectedImage] = useState(""); // Lưu URL hình ảnh

    const handleImageClick = (fileUrl) => {
        setSelectedImage(fileUrl); // Lưu URL hình ảnh được chọn
        setIsOpen(true); // Mở modal
    };

    const closeModal = () => {
        setIsOpen(false); // Đóng modal
        setSelectedImage(""); // Xóa URL hình ảnh khi đóng
    };

    const handleDowload = async () => {};
    return (
        <div
            className={clsx("flex gap-3 mb-6", {
                "flex-row-reverse": isMine,
            })}
        >
            <img
                src={message?.sender?.avatarUrl || avatar}
                alt="avatar"
                className="rounded-full w-8 h-8"
            />
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="relative bg-white p-4 rounded-lg max-w-[70%] max-h-[70%] "
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 text-black bg-gray-300 hover:bg-gray-400 rounded-full p-2 z-10"
                            onClick={closeModal}
                        >
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
                                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                        </button>
                        <div className="w-[600px] relative overflow-hidden">
                            <img
                                className="max-w-full max-h-full object-contain"
                                src={selectedImage}
                                alt="Expanded Chat File"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className={clsx("flex flex-col gap-2", {})}>
                <div
                    className={clsx("text-gray-400 font-normal text-xs", {
                        "flex justify-end": isMine,
                    })}
                >
                    {getTimeElapsed(message?.createdAt)}
                </div>
                {message.fileType === "image" && (
                    <div className="flex flex-col items-end">
                        <img
                            onClick={() => handleImageClick(message.fileUrl)}
                            className="rounded-lg max-w-[300px] h-auto hover:opacity-75 cursor-pointer"
                            src={message.fileUrl}
                            alt=""
                        />
                        <span className="text-gray-500 text-xs font-medium mt-2">
                            {message.fileName}
                        </span>
                    </div>
                )}
                {(message.fileType === "null" || message.content) && (
                    <div
                        className={clsx(
                            "rounded-lg p-3 font-light text-sm max-w-[320px]",
                            {
                                "bg-[#c8fad6]": isMine,
                                "bg-gray-200": !isMine,
                            }
                        )}
                    >
                        {message.content}
                    </div>
                )}
                {!message.content && message.fileType !== "image" && (
                    <div
                        className={clsx("flex flex-col justify-start", {
                            "items-end": isMine,
                            "items-start": !isMine,
                        })}
                    >
                        <a
                            href={message.fileUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative shadow-sm bg-[#f4f6f8] rounded-lg cursor-pointer hover:opacity-70"
                        >
                            <Ink></Ink>
                            <img
                                className="p-2 w-full h-full"
                                src={iconPdf}
                                alt=""
                            />
                        </a>
                        <span className="text-gray-500 text-xs font-medium mt-2">
                            {message.fileName}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export function Test() {
    return (
        <div className="flex h-screen flex-col p-10">
            <div className="grid h-full">
                <div className="flex gap-3 h-full col-md-1">
                    <div className="bg-blue-300 w-[100px]"></div>
                    <div className="h-full flex flex-col flex-1">
                        <div className="h-40"></div>
                        <section className="flex-height-scroll-parent">
                            <header id="header">This is a header</header>
                            <article className="flex-height-scroll-child">
                                <div className="h-[200px] bg-red-300 w-full"></div>
                                <div className="h-[200px] bg-red-300 w-full"></div>
                                <div className="h-[200px] bg-red-300 w-full"></div>
                                <div className="h-[200px] bg-red-300 w-full"></div>
                                <div className="h-[200px] bg-red-300 w-full"></div>
                                This is the content that
                                <br />
                                With a lot of lines.
                                <br />
                                With a lot of lines.
                                <br />
                                This is the content that
                                <br />
                                With a lot of lines.
                                <br /> <br />
                                This is the content that
                                <br />
                                With a lot of lines.
                                <br /> <br />
                                This is the content that
                                <br />
                                With a lot of lines.
                                <br /> <br />
                                This is the content that
                                <br />
                                With a lot of lines.
                                <br /> <br />
                                This is the content that
                                <br />
                                With a lot of lines.
                                <br /> <br />
                                This is the content that
                                <br />
                                With a lot of lines.
                                <br /> <br />
                                This is the content that
                                <br />
                                With a lot of lines.
                                <br /> <br />
                                This is the content that
                                <br />
                                With a lot of lines.
                                <br /> <br />
                                This is the content that
                                <br />
                                With a lot of lines.
                                <br /> <br />
                                This is the content that
                                <br />
                                With a lot of lines.
                                <br /> <br />
                                This is the content that
                                <br />
                                With a lot of lines.
                                <br />
                                <br />
                                This is the content that
                                <br />
                                With a lot of lines.
                                <br />
                                <br />
                                This is the content that
                                <br />
                                With a lot of lines.
                                <br />
                            </article>
                            <footer id="footer">This is a footer</footer>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MessageTo({
    activeChat,
    newMessage,
    currentUserEmail,
    recipientUser,
    handlePushUpChat,
    handleReadChat,
    handleDeleteChat,
}) {
    const user = useSelector(userSelector);
    const menuRef = useRef(null);
    const [chat, setChat] = useState({
        messages: [],
        ...activeChat,
    });
    const [isOpenMoreOption, setOpenMoreOption] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const fetchConversation = async () => {
        try {
            const res = await chatService.getConversation(recipientUser.email);
            if (res) {
                let updateMessages = res.messages
                    ? [...res.messages.content]
                    : [];

                if (newMessage?.chatId === chat?.id) {
                    updateMessages.push(newMessage);
                }

                setChat((prev) => ({
                    ...prev,
                    messages: updateMessages || [],
                    id: res?.id,
                    currentUserBlocked: res?.currentUserBlocked,
                    otherUserBlocked: res?.otherUserBlocked,
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSendMessage = (e) => {
        const value = e.target.value.trim();
        if (e.key !== "Enter" || value === "" || !recipientUser) return;
        messageUtil.SendMessage(
            recipientUser?.email,
            value,
            chat.id,
            user.email
        );

        // push up chat to top of list chat
        handlePushUpChat(chat.id);

        setChat((prev) => ({
            ...prev,
            messages: [
                ...prev.messages,
                {
                    content: value,
                    sender: {
                        email: user.email,
                        avatarUrl: user.avatarUrl,
                    },
                    createdAt: new Date(),
                },
            ],
        }));

        e.target.value = "";
    };

    const positionMenu = (event) => {
        const buttonRect = event.currentTarget.getBoundingClientRect();
        setMenuPosition({
            top: buttonRect.bottom + window.scrollY - 90,
            left: buttonRect.right + window.scrollX - 300,
        });
    };

    const handleMenuButtonClick = (event, course) => {
        event.stopPropagation();

        setOpenMoreOption((prev) => !prev);
        positionMenu(event);
    };

    useEffect(() => {
        fetchConversation();

        // add new message receive from websocket to list message in chat
    }, [recipientUser, newMessage, chat?.id]);

    const handleActionWithChat = async (action, chatId) => {
        switch (action.toLowerCase()) {
            case "block":
                toast.promise(chatService.blockChat(chatId), {
                    loading: "Blocking chat...",
                    success: (res) => {
                        console.log("🚀 ~ toast.promise ~ res:", res.content);
                        setChat((prev) => ({
                            ...prev,
                            currentUserBlocked: true,
                            otherUserBlocked: res.content.otherUserBlocked,
                        }));

                        return "Chat blocked";
                    },
                    error: (error) => {
                        console.log(error);
                        return "Server error";
                    },
                });
                break;
            case "unblock":
                toast.promise(chatService.unblockChat(chatId), {
                    loading: "Unblocking chat...",
                    success: (res) => {
                        setChat((prev) => ({
                            ...prev,
                            currentUserBlocked: false,
                            otherUserBlocked: res.content.otherUserBlocked,
                        }));
                        return "Chat unblocked";
                    },
                    error: (error) => {
                        console.log(error);
                        return "Server error";
                    },
                });
                break;
            case "delete":
                handleDeleteChat(chatId);
                setOpenMoreOption(false);
                break;
            default:
                break;
        }
    };

    const handleSendFile = async (event) => {
        const selectedFile = event.target.files[0];
        toast.promise(chatService.sendFile(chat?.id, selectedFile), {
            loading: "Sending file...",
            success: (res) => {
                console.log(res);
                return "File sent";
            },
            error: (error) => {
                console.log(error);
                return "Server error";
            },
        });
    };

    return (
        <div className="h-full flex flex-col flex-1">
            <div className="flex-height-scroll-parent">
                <div className="border-b-1 border-gray-200 flex justify-between gap-3 py-2.5 px-[20px]">
                    <AvatarAndStatus
                        avatar={recipientUser?.avatarUrl || avatar}
                        online={
                            recipientUser?.status.toLowerCase() === "online"
                        }
                    />
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="font-semibold text-sm mb-1 line-clamp-1">
                            {recipientUser
                                ? recipientUser.firstName +
                                  " " +
                                  recipientUser.lastName
                                : "Lucian Orber"}
                        </div>
                        <div className="font-normal text-gray-500 text-sm line-clamp-1">
                            {recipientUser?.status.toLowerCase() === "online"
                                ? recipientUser?.status
                                : getTimeElapsed(recipientUser?.lastOnline)}
                        </div>
                    </div>
                    <div className="center">
                        <div
                            className="relative py-1 px-1 justify-center itesm-center  rounded-full focus:outline-none cursor-pointer hover:bg-gray-300 hover:opacity-80 transition-all delay-50 ease-in menu-button"
                            onClick={(e) => handleMenuButtonClick(e)}
                        >
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
                                    d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="px-6 pt-10 pb-6 flex-height-scroll-child">
                    {chat?.messages?.map((message, index) => (
                        <div key={message?.id || Math.random()}>
                            <MessageItem
                                isMine={
                                    message?.sender?.email !==
                                    recipientUser?.email
                                }
                                message={message}
                            ></MessageItem>
                        </div>
                    ))}
                </div>

                <AnimatePresence>
                    {isOpenMoreOption && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.7,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.7,
                            }}
                            transition={{
                                duration: 0.4,
                                ease: [0, 0.71, 0.2, 1.01],
                            }}
                            ref={menuRef}
                            className="bg-custom absolute z-10 mt-2 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 w-48"
                            style={{
                                top: `${menuPosition.top}px`,
                                left: `${menuPosition.left}px`,
                            }}
                        >
                            <div className="px-2 py-1">
                                {/* <button
                                    onClick={() => {
                                        handleActionWithChat(
                                            "hide_notification",
                                            chat.id
                                        );
                                    }}
                                    className="transition-all relative font-normal group flex gap-3 w-full text-black items-center rounded-md px-2 py-2.5 text-sm hover:opacity-75 hover:bg-gray-200"
                                >
                                    <Ink></Ink>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                        role="img"
                                        className="w-5 h-5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M8.352 20.242A4.63 4.63 0 0 0 12 22a4.63 4.63 0 0 0 3.648-1.758a27.2 27.2 0 0 1-7.296 0"
                                        ></path>
                                        <path
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            d="M18.75 9v.704c0 .845.24 1.671.692 2.374l1.108 1.723c1.011 1.574.239 3.713-1.52 4.21a25.8 25.8 0 0 1-14.06 0c-1.759-.497-2.531-2.636-1.52-4.21l1.108-1.723a4.4 4.4 0 0 0 .693-2.374V9c0-3.866 3.022-7 6.749-7s6.75 3.134 6.75 7m-8.678.75A.737.737 0 0 1 9.349 9c0-.414.323-.75.723-.75h3.856c.293 0 .556.183.668.463a.77.77 0 0 1-.156.817l-2.622 2.72h2.11c.4 0 .723.336.723.75s-.323.75-.723.75h-3.856a.72.72 0 0 1-.668-.463a.77.77 0 0 1 .156-.817l2.623-2.72z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    Hide notifications
                                </button> */}
                                <button
                                    onClick={() => {
                                        handleActionWithChat(
                                            chat?.currentUserBlocked
                                                ? "Unblock"
                                                : "Block",
                                            chat.id
                                        );
                                    }}
                                    className="transition-all relative font-normal group flex gap-3 w-full text-black items-center rounded-md px-2 py-2.5 text-sm hover:opacity-75 hover:bg-gray-200"
                                >
                                    <Ink></Ink>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                        role="img"
                                        className="w-5 h-5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M12 22c5.523 0 10-4.477 10-10a9.96 9.96 0 0 0-2.418-6.52L5.479 19.581A9.96 9.96 0 0 0 12 22m0-20C6.477 2 2 6.477 2 12a9.96 9.96 0 0 0 2.418 6.52L18.521 4.419A9.96 9.96 0 0 0 12 2"
                                        ></path>
                                    </svg>
                                    {chat?.currentUserBlocked
                                        ? "Unblock"
                                        : "Block"}
                                </button>
                                <div className="border-b-[1px] border-gray-200 w-full my-1"></div>
                                <button
                                    onClick={() => {
                                        handleActionWithChat("delete", chat.id);
                                    }}
                                    className="hover:opacity-75 transition-all relative hover:bg-gray-200 font-normal group flex gap-3 text-red-500 w-full items-center rounded-md px-2 py-2.5 text-sm"
                                >
                                    <Ink></Ink>
                                    <img
                                        src={deleteIcon}
                                        alt=""
                                        className="w-5 h-5"
                                    />
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="messages-container border-t-1 border-gray-200 flex gap-3 w-full justify-between px-3 py-2">
                    {chat?.currentUserBlocked || chat?.otherUserBlocked ? (
                        chat?.currentUserBlocked ? (
                            <div className="flex text-sm w-full text-gray-500 italic justify-center">
                                You blocked this chat!
                                <button
                                    onClick={() =>
                                        handleActionWithChat("unblock", chat.id)
                                    }
                                    className="ml-2 underline font-semibold"
                                >
                                    Click to unblock
                                </button>
                            </div>
                        ) : chat?.otherUserBlocked ? (
                            <div className="flex text-sm w-full text-gray-500 italic justify-center">
                                You were blocked!
                            </div>
                        ) : null
                    ) : (
                        <>
                            <div className="flex-1">
                                <input
                                    onFocus={() => {
                                        handleReadChat(chat);
                                    }}
                                    onKeyDown={handleSendMessage}
                                    type="text"
                                    className="flex-1 outline-none text-sm py-2 w-full"
                                    placeholder="Type a message"
                                />
                            </div>
                            <div className="flex gap-2">
                                <div className="rounded-full transition-all focus:bg-gray-300 center hover:bg-gray-200 relative px-2 py-1  text-gray-500 cursor-pointer">
                                    <label
                                        htmlFor="img"
                                        className="cursor-pointer"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                            role="img"
                                            className="size-5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M12 22a5.86 5.86 0 0 1-6-5.7V6.13A4.24 4.24 0 0 1 10.33 2a4.24 4.24 0 0 1 4.34 4.13v10.18a2.67 2.67 0 0 1-5.33 0V6.92a1 1 0 0 1 1-1a1 1 0 0 1 1 1v9.39a.67.67 0 0 0 1.33 0V6.13A2.25 2.25 0 0 0 10.33 4A2.25 2.25 0 0 0 8 6.13V16.3a3.86 3.86 0 0 0 4 3.7a3.86 3.86 0 0 0 4-3.7V6.13a1 1 0 1 1 2 0V16.3a5.86 5.86 0 0 1-6 5.7"
                                            ></path>
                                        </svg>
                                    </label>

                                    <input
                                        onChange={handleSendFile}
                                        type="file"
                                        hidden
                                        id="img"
                                        accept=".*"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function MessagesPage() {
    const [searchValue, setSearchValue] = useState("");
    const [searchResult, setSearchResult] = useState([
        { label: "John Smith", value: 1, img: avatar },
        { label: "Emma Johnson", value: 2, img: avatar },
        { label: "Michael Brown", value: 3, img: avatar },
        { label: "Sophia Davis", value: 4, img: avatar },
        { label: "James Wilson", value: 5, img: avatar },
        { label: "Olivia Moore", value: 6, img: avatar },
        { label: "William Taylor", value: 7, img: avatar },
        { label: "Isabella Martinez", value: 8, img: avatar },
    ]);

    const [showSearchResult, setShowSearchResult] = useState(false);
    const [typeInterface, setTypeInterface] = useState("default");
    const [listChat, setListChat] = useState([]);
    const [activeChat, setActiveChat] = useState({
        messages: [],
    });
    const [newMessage, setNewMessage] = useState(null);

    const selectRef = useRef(null);
    const user = useSelector(userSelector);

    useOutsideClick(selectRef, () => {
        setShowSearchResult(false);
    });

    const handleAddRecipents = () => {};

    const fetchSearchData = async (name) => {
        try {
            if (!name.trim()) return;
            const res = await searchContact(name);
            setSearchResult(res);
            setShowSearchResult(true);
        } catch (error) {
            console.log(error);
        }
    };

    const debounceSearch = debounce(fetchSearchData, 500);

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        debounceSearch(e.target.value);
    };

    const addChatToList = (userChat) => {
        if (messageUtil.isContainChat(listChat, userChat)) return;
        const newChat = {
            id: "",
            recipient: userChat,
            lastMessageTime: new Date(),
            read: true,
        };

        setListChat((prev) => [newChat, ...prev]);
        return newChat;
    };

    const readChat = async (chatId) => {
        try {
            await chatService.readChat(chatId);
        } catch (error) {
            console.log(error);
        }
    };

    const handleReadChat = async (chat) => {
        if (chat.read || !chat.id) return;
        const newListChat = messageUtil.updateReadChat(listChat, chat.id);
        setListChat(newListChat);
        await readChat(chat.id);
    };

    const handleSelectChat = async (chat, user) => {
        setShowSearchResult(false);

        setActiveChat(chat);
        if (chat?.read === false) {
            // set chat to read
            handleReadChat(chat);
        }

        // if user not exist in list chat
        if (user) {
            // if user have chat exist in list chat
            if (messageUtil.isContainChatUser(user.email, listChat)) {
                const chatIndex = listChat.findIndex(
                    (c) => c.recipient?.email === user.email
                );
                setActiveChat(listChat[chatIndex]);
            } else {
                let newChat = addChatToList(user);
                setActiveChat(newChat);
            }
        }
        setTypeInterface("to");
    };

    const subcribeNotification = () => {
        websocketService.subscribe(`/user/${user?.email}/chats`, (data) => {
            const message = JSON.parse(data.body);

            setNewMessage(message);

            // push up chat to top of list chat

            setListChat((prev) => {
                const chatIndex = prev.findIndex(
                    (c) => c.id === message.chatId
                );
                if (chatIndex === -1) return prev;

                const updatedChatList = [...prev];
                updatedChatList[chatIndex] = {
                    ...updatedChatList[chatIndex],
                    read: false,
                };
                const updateList = [
                    updatedChatList[chatIndex],
                    ...updatedChatList.slice(0, chatIndex),
                    ...updatedChatList.slice(chatIndex + 1),
                ];
                return updateList;
            });

            const fullName = getFullName(message.sender);
            toast.info("You have a new message from " + fullName);
        });
    };

    useEffect(() => {
        subcribeNotification();

        const getAllConversation = async () => {
            try {
                const res = await chatService.getRecentChats();
                setListChat(res);
            } catch (error) {
                console.log(error);
            }
        };
        getAllConversation();

        return () => {
            websocketService.unsubscribe(`/user/${user?.email}/chats`);
        };
    }, [user?.email]);

    const pushUpChatAndSetToUnread = (chatId, setUnread = false) => {
        const updateList = messageUtil.pushUpChatAndSetToUnread(
            listChat,
            chatId,
            setUnread
        );
        setListChat(updateList);
    };

    const handleDeleteChat = (chatId) => {
        toast.promise(chatService.deleteChat(chatId), {
            loading: "Deleting chat...",
            success: (res) => {
                setListChat((prev) => messageUtil.deleteChat(prev, chatId));
                return "Chat deleted";
            },
            error: (error) => {
                console.log(error);
                return "Server error";
            },
        });
    };

    return (
        <div className="container flex h-[80%] lg:mt-8 md:mt-8 sm:mt-4 mt-4">
            <div className="w-full h-full">
                <div className="relative rounded-lg shadow-small lg:mt-6 md:mt-4 sm:mt-2 row h-full">
                    <div>
                        <button className="absolute size-8 bg-white items-center z-10 shadow-xl justify-center border-gray-300 border-1 rounded-full top-[18%] left-[0] max-sm:flex hidden">
                            <Ink></Ink>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className={clsx("size-5", {})}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 19.5 8.25 12l7.5-7.5"
                                />
                            </svg>
                        </button>
                    </div>
                    <div
                        className={clsx(
                            "border-r-1 border-gray-200 col-lg-3 col-md-4 col-sm-0 d-sm-block"
                        )}
                    >
                        <div className="flex justify-between pt-[20px] px-[20px]">
                            <AvatarAndStatus
                                avatar={user?.avatarUrl}
                                online={true}
                            ></AvatarAndStatus>
                            <div
                                onClick={handleAddRecipents}
                                className="center relative cursor-pointer w-10 h-10 rounded-full px-2 py-1 hover:bg-gray-200 transition-all"
                            >
                                <Ink></Ink>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    role="img"
                                    className="w-6 h-6 text-gray-500 "
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        cx="12"
                                        cy="6"
                                        r="4"
                                        fill="currentColor"
                                    ></circle>
                                    <path
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        d="M16.5 22c-1.65 0-2.475 0-2.987-.513C13 20.975 13 20.15 13 18.5s0-2.475.513-2.987C14.025 15 14.85 15 16.5 15s2.475 0 2.987.513C20 16.025 20 16.85 20 18.5s0 2.475-.513 2.987C18.975 22 18.15 22 16.5 22m.583-5.056a.583.583 0 1 0-1.166 0v.973h-.973a.583.583 0 1 0 0 1.166h.973v.973a.583.583 0 1 0 1.166 0v-.973h.973a.583.583 0 1 0 0-1.166h-.973z"
                                        clipRule="evenodd"
                                    ></path>
                                    <path
                                        fill="currentColor"
                                        d="M15.678 13.503c-.473.005-.914.023-1.298.074c-.643.087-1.347.293-1.928.875c-.582.581-.788 1.285-.874 1.928c-.078.578-.078 1.284-.078 2.034v.172c0 .75 0 1.456.078 2.034c.06.451.18.932.447 1.38H12c-8 0-8-2.015-8-4.5S7.582 13 12 13c1.326 0 2.577.181 3.678.503"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                        <div className="relative mt-[20px] transition-all mx-[20px] border-1 mb-[20px] flex items-center rounded-md focus-within:border-black border-gray-200">
                            <svg
                                aria-hidden="true"
                                role="img"
                                className="w-5 h-5 text-gray-400 ml-4 mr-2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="m20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8a7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42M5 11a6 6 0 1 1 6 6a6 6 0 0 1-6-6"
                                ></path>
                            </svg>
                            <input
                                value={searchValue}
                                onChange={handleSearchChange}
                                placeholder="Search contacts..."
                                type="text"
                                className="py-[12px] text-[14px] outline-none rounded-md flex-1 pr-[16px] font-light w-full"
                            />
                            <motion.div
                                animate={{
                                    opacity: showSearchResult ? 1 : 0.4,
                                    scale: showSearchResult ? 1 : 0.5,
                                }}
                                ref={selectRef}
                                className={clsx(
                                    "absolute bg-custom z-10  max-h-[232px] top-[103%] w-full px-1 py-2 shadow-lg overflow-y-auto rounded-lg",
                                    {
                                        block: showSearchResult,
                                        hidden: !showSearchResult,
                                    }
                                )}
                            >
                                {searchResult && searchResult.length > 0 ? (
                                    searchResult.map((user) => (
                                        <div
                                            key={user?.email || Math.random()}
                                            onClick={() =>
                                                handleSelectChat(null, user)
                                            }
                                            className={clsx(
                                                "text-sm flex gap-2 items-center relative text-gray-600 font-semibold p-2 my-1 hover:bg-gray-200 hover:opacity-75  ease-in cursor-pointer rounded-lg",
                                                {
                                                    // "bg-gray-200":
                                                    //     isSelectedItem(
                                                    //         item.value
                                                    //     ),
                                                }
                                            )}
                                        >
                                            <Ink></Ink>
                                            <img
                                                src={
                                                    user.avatarUrl ||
                                                    user.avatar
                                                }
                                                className="rounded-full w-6 h-6"
                                                alt=""
                                            />
                                            {(user.firstName || "") +
                                                " " +
                                                user.lastName}
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center text-base font-semibold text-gray-500">
                                        No data
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        <div className="overflow-y-auto lg:h-[440px] h-full">
                            {listChat?.length > 0 &&
                                listChat.map((chat) => (
                                    <div
                                        onClick={() => handleSelectChat(chat)}
                                        className={clsx(
                                            "flex relative justify-between py-2 px-[20px] gap-3 cursor-pointer hover:bg-gray-50 transition-all",
                                            {
                                                "bg-gray-100":
                                                    chat.read === false,
                                                "bg-gray-50":
                                                    activeChat?.id === chat.id,
                                            }
                                        )}
                                        key={chat?.id || Math.random()}
                                    >
                                        <Ink></Ink>
                                        <AvatarAndStatus
                                            avatar={
                                                chat?.recipient?.avatarUrl ||
                                                avatar
                                            }
                                            online={
                                                chat?.recipient?.status.toLowerCase() ===
                                                "online"
                                            }
                                        ></AvatarAndStatus>
                                        <div className="flex-1 flex justify-center flex-col">
                                            <div className="font-semibold text-sm mb-1 line-clamp-1">
                                                {getFullName(chat?.recipient)}
                                            </div>

                                            <div className="font-light text-gray-500 text-xs">
                                                {getTimeElapsed(
                                                    chat?.lastMessageTime ||
                                                        new Date()
                                                )}
                                            </div>
                                        </div>
                                        {!chat?.read && (
                                            <div className="size-2 bg-blue-400 rounded-full"></div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className="col-lg-9 col-md-8 col-sm-12 h-full">
                        {typeInterface === "default" ? (
                            <MessageDefault></MessageDefault>
                        ) : (
                            <MessageTo
                                activeChat={activeChat}
                                newMessage={newMessage}
                                currentUserEmail={user?.email}
                                recipientUser={activeChat?.recipient}
                                handleReadChat={handleReadChat}
                                handlePushUpChat={pushUpChatAndSetToUnread}
                            ></MessageTo>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessagesPage;
