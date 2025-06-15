import { create } from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

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

    sendMessage: async ({ text, imageFile }) => {
        const { selectedUser, messages} = get();
        try {
            var messageData = new FormData();
            messageData.append('text', text);
            messageData.append('image', imageFile);

            const { data } = await axiosInstance.post(`/send/${selectedUser._id}`, messageData, {
                validateStatus: function (status) {
                    return status < 500; 
                }
            });

            if(data.success) {
                set({ messages: [...messages, data.data] });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
}));