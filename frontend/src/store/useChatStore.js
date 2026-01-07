import { create } from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isTyping: false,

    setSelectedUser: (selectedUser) => set({ selectedUser }),

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const { data } = await axiosInstance.get('/users', {
                validateStatus: function (status) {
                    return status < 500; 
                }
            });

            if(data.success) {
                set({ users: data.data });
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (personId) => {
        set({ isMessagesLoading: true });
        try {
            const { data } = await axiosInstance.get(`/messages/${personId}`, {
                validateStatus: function (status) {
                    return status < 500; 
                }
            });

            if(data.success) {
                set({ messages: data.data });
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
        socket.off("typing_start");
        socket.off("typing_stop");
        socket.off("messagesSeen");
        socket.off("messageReaction");
    },
    
    // Group & Sidebar Logic
    isCreatingGroup: false,

    getConversations: async () => {
        set({ isUsersLoading: true });
        try {
            const { data } = await axiosInstance.get('/conversations');
            if(data.success) {
                set({ users: data.data }); // Reusing 'users' state for sidebar list (which now contains groups mixed in?)
                // Actually, let's separate or keep it consistent. 
                // data.data will be array of { _id, fullname/name, profilePic/groupImage, isGroup... }
                // Schema returns 'group' objects and 'user' objects.
                // We need to normalize them?
                // Backend getRecentConversations returns { _id, username, fullname, profilePic, lastMessage } for DMs.
                // What about Groups? getGroups returns Groups.
                // We need to merge them.
                // Let's fetch both.
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    
    // Redefining getUsers to actually fetch Sidebar Data (DMs + Groups)
    getSidebarData: async () => {
        set({ isUsersLoading: true });
        try {
            // Parallel fetch
            const [conversationsRes, groupsRes] = await Promise.all([
                axiosInstance.get('/conversations'),
                axiosInstance.get('/groups')
            ]);
            
            const conversations = conversationsRes.data.success ? conversationsRes.data.data : [];
            const groups = groupsRes.data.success ? groupsRes.data.data : [];
            
            // Normalize groups to look like sidebar items
            const formattedGroups = groups.map(g => ({
                _id: g._id,
                fullname: g.name,
                profilePic: g.groupImage || "/avatar.png", // Default group icon
                isGroup: true,
                members: g.members,
                admin: g.admin,
                description: g.description
            }));
            
            // Merge & Sort by last message (stub sort for now, ideally backend sorts)
            // For now, let's just put groups at top or bottom? Or merge.
            // Let's just set them.
            set({ users: [...formattedGroups, ...conversations] }); 
            
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch sidebar data");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    createGroup: async (groupData) => {
        set({ isCreatingGroup: true });
        try {
            const formData = new FormData();
            formData.append('name', groupData.name);
            formData.append('description', groupData.description);
            formData.append('members', JSON.stringify(groupData.members)); // Send as stringified array
            if(groupData.imageFile) formData.append('image', groupData.imageFile);

            const { data } = await axiosInstance.post('/groups/create', formData);
            if(data.success) {
                toast.success('Group created successfully');
                // Refresh sidebar
                get().getSidebarData(); 
                return true;
            }
        } catch (error) {
            toast.error(error.message);
            return false;
        } finally {
            set({ isCreatingGroup: false });
        }
    },

    // Override sendMessage to handle groups
    sendMessage: async ({ text, imageFile }) => {
        const { selectedUser, messages } = get();
        try {
            var messageData = new FormData();
            messageData.append('text', text);
            if (imageFile) messageData.append('image', imageFile);

            // Check if selectedChat is a group
            // If selectedUser.isGroup, we send key 'isGroup'
            const isGroup = selectedUser.isGroup;
            
            const { data } = await axiosInstance.post(`/send/${selectedUser._id}?isGroup=${isGroup}`, messageData);

            if(data.success) {
                set({ messages: [...messages, data.data] });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    },

    markMessagesAsSeen: async (senderId) => {
        try {
            await axiosInstance.post('/messages/seen', { senderId });
        } catch (error) {
            console.log(error);
        }
    },

    sendReaction: async (messageId, emoji) => {
        try {
            await axiosInstance.post(`/messages/${messageId}/reaction`, { emoji });
        } catch (error) {
            toast.error(error.message);
        }
    },

    subscribeToMessage: () => {
        const { selectedUser } = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        
        socket.on("newMessage", (newMessage) => {
            const { selectedUser } = get();
            
            // Check if message belongs to current chat
            const isRelevantMessage = 
                selectedUser && (
                    (newMessage.groupId && newMessage.groupId === selectedUser._id) ||
                    (newMessage.senderId === selectedUser._id) ||
                    (newMessage.receiverId === selectedUser._id) // If I sent it from another tab
                );

            if(isRelevantMessage) {
                 set({ messages: [...get().messages, newMessage] });
            }
            
            // Refresh Sidebar to show latest message / reorder
            get().getSidebarData();
        });

        socket.on("typing_start", ({ senderId }) => {
            if (senderId === selectedUser._id) set({ isTyping: true });
        });

        socket.on("typing_stop", ({ senderId }) => {
            if (senderId === selectedUser._id) set({ isTyping: false });
        });

        socket.on("messagesSeen", ({ receiverId }) => {
            if (receiverId === selectedUser._id) {
                const { messages } = get();
                // Mark all messages sent by ME to selectedUser as seen
                const updatedMessages = messages.map(msg => 
                    // msg.receiverId is the person who received (selectedUser), so if it matches, update
                    // Wait, `msg.receiverId` should match `receiverId` (the user who just saw them)
                    msg.receiverId === receiverId ? { ...msg, status: 'seen' } : msg
                );
                set({ messages: updatedMessages });
            }
        });

        socket.on("messageReaction", (updatedMessage) => {
            if (updatedMessage.senderId === selectedUser._id || updatedMessage.receiverId === selectedUser._id) {
                const { messages } = get();
                const updatedMessages = messages.map(msg => 
                    msg._id === updatedMessage._id ? updatedMessage : msg
                );
                set({ messages: updatedMessages });
            }
        });
    },
    
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
        socket.off("typing_start");
        socket.off("typing_stop");
        socket.off("messagesSeen");
        socket.off("messageReaction");
    }
}));