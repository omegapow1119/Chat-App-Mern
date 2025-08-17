import React, { useContext, useEffect, useState } from "react";
import assets, { imagesDummyData } from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const RightSidebar = () => {

  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  //get all the images from the messages and set them to state
  useEffect(() => {
    setMsgImages(messages.filter(msg => msg.image).map(msg => msg.image));
  }, [messages]);

  return selectedUser && (
    <div
      className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-auto ${selectedUser ? "max-md:hidden" : ""
        }`}
    >
      {/* User Info - reduced padding */}
      <div className="pt-8 flex flex-col items-center gap-1 text-xs font-light mx-auto">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt="Profile"
          className="w-20 aspect-[1/1] rounded-full"
        />
        <h1 className="px-10 text-lg font-medium mx-auto flex items-center gap-2">
          {onlineUsers.includes(selectedUser._id) &&
            <p className="w-2 h-2 rounded-full bg-green-500"></p>
          }
          {selectedUser.name}
        </h1>
        <p className="px-10 mx-auto">
          {selectedUser.bio || "No bio available"}
        </p>
      </div>

      <hr className="border-[#ffffff50] my-3" />

      {/* Media Section - less height & button included below */}
      <div className="px-5 text-xs">
        <p>
          Media
        </p>
        <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
          {msgImages.map((url, index) => (
            <div
              key={index}
              onClick={() => window.open(url)}
              className="cursor-pointer rounded"
            >
              <img
                src={url}
                alt=""
                className="h-full rounded-md"
              />
            </div>
          ))}
        </div>
</div>
        {/* Logout Button right after media */}
        <button
          onClick={() => logout()}
          className=" absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm border-none font-light py-2 px-15 rounded-full shadow-md hover:scale-105 transition cursor-pointer"
        >
          Logout
        </button>
      </div>
  
  );
};

export default RightSidebar;
