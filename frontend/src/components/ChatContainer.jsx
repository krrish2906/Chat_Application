import React, { useEffect, useRef } from 'react'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore';
import Moment from 'moment';
import { Check, CheckCheck, Smile } from 'lucide-react';

function ChatContainer() {
    const {
        messages, isMessagesLoading, getMessages, selectedUser,
        subscribeToMessage, unsubscribeFromMessages,
        markMessagesAsSeen, sendReaction, isTyping
    } = useChatStore();
    const { authUser } = useAuthStore();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        getMessages(selectedUser._id);
        markMessagesAsSeen(selectedUser._id);
        subscribeToMessage();
        return () => unsubscribeFromMessages();
    }, [selectedUser, getMessages, subscribeToMessage, unsubscribeFromMessages, markMessagesAsSeen]);

    useEffect(() => {
        if (messagesEndRef.current && messages) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping]);
      
    const handleReaction = (messageId, emoji) => {
        sendReaction(messageId, emoji);
    }

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
                                    className={`chat ${ msg.senderId === authUser.userId ? "chat-end" : "chat-start" } group`}
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
                                        {/* Group Chat: Show Sender Name if not me - Merged to prevent overlap */}
                                        {selectedUser.isGroup && msg.senderId !== authUser.userId && (
                                            <span className="text-xs opacity-70 font-semibold ml-2">
                                                {msg.senderId?.fullname || "Member"}
                                            </span>
                                        )}
                                        <time className='text-xs opacity-50 ml-1'>
                                            { Moment(msg.createdAt).format('LLL') }
                                        </time>
                                    </div>

                                    <div className='chat-bubble flex flex-col relative'>
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
                                        {/* Reactions Display */}
                                        {msg.reactions && msg.reactions.length > 0 && (
                                           <div className={`absolute -bottom-5 ${msg.senderId === authUser.userId ? '-left-2' : '-right-2'} flex gap-1 bg-base-100 rounded-full p-0.5 shadow-sm text-sm`}>
                                                {msg.reactions.map((r, i) => (
                                                    <span key={i}>{r.emoji}</span>
                                                ))}
                                           </div>
                                        )}
                                        
                                        {/* Quick Reaction (Hover) - Simplified */}
                                        <div className={`absolute ${msg.senderId === authUser.userId ? 'right-42' : 'left-27'} top-1 hidden group-hover:flex gap-1 bg-base-300 p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity`}>
                                            {['👍', '❤️', '😂', '😍', '🎉', '😭'].map(emoji => (
                                                <button key={emoji} onClick={() => handleReaction(msg._id, emoji)} className='hover:scale-125 transition-transform'>
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Message Status */}
                                    {msg.senderId === authUser.userId && (
                                        <div className="chat-footer opacity-50 text-xs flex items-center gap-1 mt-1">
                                            {msg.status === 'seen' ? (
                                                <CheckCheck className="size-3.5 text-blue-600" />
                                            ) : msg.status === 'delivered' ? (
                                                <CheckCheck className="size-3.5" />
                                            ) : (
                                                <Check className="size-3.5" />
                                            )}
                                            {/* msg.status */} 
                                        </div>
                                    )}
                                </div>
                            ))
                        }
                        
                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="chat chat-start">
                                <div className="chat-image avatar">
                                    <div className="size-10 rounded-full border">
                                        <img src={selectedUser.profilePic || "/avatar.png"} alt="profilePic" />
                                    </div>
                                </div>
                                <div className="chat-bubble bg-base-200 text-base-content min-h-0 py-2">
                                    <span className="loading loading-dots loading-xs"></span>
                                </div>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>
                )
            }
            <MessageInput />
        </div>
    )
}

export default ChatContainer;