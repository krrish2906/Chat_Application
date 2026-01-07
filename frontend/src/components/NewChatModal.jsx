import React, { useState, useEffect } from 'react';
import { X, Search, MessageSquarePlus } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const NewChatModal = ({ onClose }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { setSelectedUser, users: sidebarUsers } = useChatStore();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axiosInstance.get('/users');
                if (data.success) {
                    setUsers(data.data);
                }
            } catch (error) {
                toast.error("Failed to load users");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => 
        user.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStartChat = (user) => {
        // defined logic to set selectedUser. 
        // If user is already in sidebar (recent chats), we just select them.
        // If not, we set them as selectedUser, and when message is sent, they will appear in sidebar (handled by getConversations logic on refresh)
        setSelectedUser(user);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-base-100 w-full max-w-md rounded-2xl p-6 shadow-xl max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <MessageSquarePlus className="size-6 text-primary" /> New Chat
                    </h2>
                    <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
                        <X className="size-5" />
                    </button>
                </div>

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-3 size-4 text-base-content/40" />
                    <input 
                        type="text"
                        placeholder="Search users..."
                        className="input input-bordered w-full pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="overflow-y-auto flex-1 space-y-2">
                    {isLoading ? (
                        <div className="text-center py-4">Loading users...</div>
                    ) : (
                        filteredUsers.map(user => (
                            <button 
                                key={user._id}
                                onClick={() => handleStartChat(user)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg transition-colors text-left"
                            >
                                <img 
                                    src={user.profilePic || "/avatar.png"} 
                                    alt={user.fullname} 
                                    className="size-10 rounded-full object-cover border"
                                />
                                <div>
                                    <p className="font-medium">{user.fullname}</p>
                                    <p className="text-xs text-base-content/60">{user.email}</p>
                                </div>
                            </button>
                        ))
                    )}
                    {!isLoading && filteredUsers.length === 0 && (
                        <div className="text-center py-8 text-base-content/50">No users found</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewChatModal;
