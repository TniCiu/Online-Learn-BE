import React, { useEffect } from "react";

const CozeChat = () => {
    useEffect(() => {
        // Load the Coze SDK script
        const script = document.createElement("script");
        script.src =
            "https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.0.0-beta.4/libs/oversea/index.js";
        script.async = true;
        script.onload = () => {
          
        };
        document.body.appendChild(script);

        // Cleanup function to remove the script when the component is unmounted
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return <div id="coze-chat-container"></div>;
};

export default CozeChat;
