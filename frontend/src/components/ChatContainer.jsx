import React, { useEffect, useRef } from 'react'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore';
import Moment from 'moment';

function ChatContainer() {
    const { messages, isMessagesLoading, getMessages, selectedUser } = useChatStore();
    const { authUser } = useAuthStore();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        getMessages(selectedUser._id);
    }, [selectedUser, getMessages]);

    useEffect(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, [messages]);
      
    
    return (
        <div className='flex flex-1 flex-col overflow-auto'>
            <ChatHeader />
            {
                isMessagesLoading ? 
                <MessageSkeleton /> : (
                    <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                        {
                            messages.map((msg) => (
                                <div
                                    key={msg._id}
                                    className={`chat ${ msg.senderId === authUser.userId ? "chat-end" : "chat-start" }`}
                                >
                                    <div className='chat-image avatar'>
                                        <div className='size-10 rounded-full border'>
                                            <img
                                                src={msg.senderId === authUser.userId ?
                                                    authUser.profilePic || "/avatar.png" :
                                                    selectedUser.profilePic || "/avatar.png"}
                                                alt="profilePic"
                                            />
                                        </div>
                                    </div>

                                    <div className='chat-header mb-1'>
                                        <time className='text-xs opacity-50 ml-1'>
                                            { Moment(msg.createdAt).format('LLL') }
                                        </time>
                                    </div>

                                    <div className='chat-bubble flex flex-col'>
                                        {
                                            msg.image && (
                                                <img src={msg.image} alt="attachment"
                                                className='sm:max-w-[200px] rounded-md mb-2' />
                                            )
                                        }
                                        {
                                            msg.text && (
                                                <p>{ msg.text }</p>
                                            )
                                        }
                                    </div>
                                </div>
                            ))
                        }
                        <div ref={messagesEndRef} />
                    </div>
                )
            }
            <MessageInput />
        </div>
    )
}

export default ChatContainer;