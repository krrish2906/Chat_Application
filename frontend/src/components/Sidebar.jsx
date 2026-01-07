import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users, Plus, MessageSquarePlus } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import CreateGroupModal from './CreateGroupModal';
import NewChatModal from './NewChatModal';

function Sidebar() {
    const { getSidebarData, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
    const { onlineUsers } = useAuthStore();

    useEffect(() => {
        getSidebarData();
    }, [getSidebarData]);

    const filteredUsers = showOnlineOnly 
        ? users.filter(user => user.isGroup || onlineUsers.includes(user._id)) 
        : users;

    if(isUsersLoading) return <SidebarSkeleton />

    return (
        <aside className='h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>
            <div className='border-b border-base-300 w-full p-5'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <Users className='size-6' />
                        <span className='font-medium hidden lg:block'>Chats</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <button 
                            onClick={() => setIsNewChatModalOpen(true)}
                            className='btn btn-circle btn-sm btn-ghost hover:bg-base-200'
                            title="New Chat"
                        >
                            <MessageSquarePlus className='size-5' />
                        </button>
                        <button 
                            onClick={() => setIsGroupModalOpen(true)}
                            className='btn btn-circle btn-sm btn-ghost hover:bg-base-200'
                            title="Create Group"
                        >
                            <Plus className='size-5' />
                        </button>
                    </div>
                </div>
                
                <div className='mt-3 hidden lg:flex items-center gap-2'>
                    <label className='cursor-pointer flex items-center gap-2'>
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className='checkbox checkbox-sm'
                        />
                        <span className='text-sm'>Show online only</span>
                    </label>
                    <span className='text-xs text-zinc-500'>({ onlineUsers.length - 1 } online)</span>
                </div>
            </div>

            <div className='overflow-y-auto w-full py-3'>
                {
                    filteredUsers.map((user) => (
                        <button
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
                            ${ selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : "" }`}
                        >
                            <div className='relative mx-auto lg:mx-0'>
                                <img src={user.profilePic || "/avatar.png"} alt={user.fullname}
                                className='size-12 object-cover rounded-full' />
                                {
                                    !user.isGroup && onlineUsers.includes(user._id) && (
                                        <span className='absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900'>
                                        </span>
                                    )
                                }
                            </div>

                            <div className='hidden lg:block text-left min-w-0 flex-1'>
                                <div className='font-medium truncate'> { user.fullname } </div>
                                <div className='text-sm text-zinc-400 truncate'>
                                    { user.isGroup 
                                        ? <span className='text-xs italic'>Group</span> 
                                        : (onlineUsers.includes(user._id) ? "Online" : "Offline") 
                                    }
                                </div>
                            </div>
                        </button>
                    ))
                }
                {
                    filteredUsers.length === 0 && (
                        <div className='text-center text-zinc-500 py-4'>
                            No conversations
                        </div>
                    )
                }
            </div>

            {isGroupModalOpen && (
                <CreateGroupModal onClose={() => setIsGroupModalOpen(false)} />
            )}
            {isNewChatModalOpen && (
                <NewChatModal onClose={() => setIsNewChatModalOpen(false)} />
            )}
        </aside>
    )
}

export default Sidebar