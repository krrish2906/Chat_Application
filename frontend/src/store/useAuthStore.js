import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const { data } = await axiosInstance.get('/user/auth/verify');
            set({ authUser: data.data });
        } catch (error) {
            console.log(error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (userData) => {
        set({ isSigningUp: true });
        try {
            const { data } = await axiosInstance.post('/user/signup', userData, {
                validateStatus: function (status) {
                    return status < 500; 
                }
            });

            if(data.success) {
                set({ authUser: data.data });
                toast.success('Account created successfully!');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            //toast.error(error.response.data.message);
            toast.error(error.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (userData) => {
        set({ isLoggingIn: true });
        try {
            const { data } = await axiosInstance.post('/user/login', userData, {
                validateStatus: function (status) {
                    return status < 500; 
                }
            });

            if(data.success) {
                set({ authUser: data.data });
                toast.success("Logged In successfully!");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            const { data } = await axiosInstance.post('/user/logout', {} , {
                validateStatus: function (status) {
                    return status < 500; 
                }
            });

            if(data.success) {
                set({ authUser: null });
                toast.success("Logged out successfully!");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    },

    updateProfile: async (imageFile) => {
        set({ isUpdatingProfile: true });
        try {
            var updateProfileData = new FormData();
            updateProfileData.append('image', imageFile);
            const { data } = await axiosInstance.patch('/user/profile/update', updateProfileData, {
                validateStatus: function (status) {
                    return status < 500; 
                }
            });
            
            if(data.success) {
                set({ authUser: data.data });
                toast.success("Profile updated successfully!");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            set({ isUpdatingProfile: false });
        }
    }
}));