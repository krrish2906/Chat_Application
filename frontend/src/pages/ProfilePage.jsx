import { useAuthStore } from "../store/useAuthStore";
import { Camera, Loader, Mail, User } from "lucide-react";
import Moment from 'moment'
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

function ProfilePage() {
	const { isUpdatingProfile, updateProfile, authUser } = useAuthStore();
    const [date, setDate] = useState(Moment(authUser.createdAt).format('MMMM Do YYYY'));
    const [image, setImage] = useState(authUser.profilePic);

    const fetchUser = async () => {
        try {
            const { data } = await axiosInstance.get('/user', {
                validateStatus: function (status) {
                    return status < 500; 
                }
            });
            if(data.success) {
                setImage(data.data.profilePic);
                setDate(Moment(data.data.createdAt).format('MMMM Do YYYY'));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleImageUpdate = async (event) => {
        const file = event.target.files[0];
        if(!file) return;
        await updateProfile(file);
        fetchUser();
    }
    
    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="h-full pt-20">
            <div className="max-w-2xl mx-auto p-4 py-8">
                <div className="bg-base-300 rounded-xl p-6 space-y-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold">Profile</h1>
                        <p className="mt-2">Your profile information</p>
                    </div>
                    
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <img
                                src={image || authUser.profilePic || "/avatar.png"}
                                alt="profile"
                                className="size-32 rounded-full object-cover border-4"
                            />
                            <div
                                className={`size-32 rounded-full absolute top-0 right-0 flex justify-center items-center
                                ${ isUpdatingProfile ? "bg-black/50" : "hidden" }`}>
                                    <Loader className={`size-6 z-10 ${ !isUpdatingProfile ? "hidden" : "animate-spin"}`} />
                            </div>
                            <label
                                htmlFor="avatar-upload"
                                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer
                                transition-all duration-200 ${ isUpdatingProfile ? "animate-pulse pointer-events-none" : "" }`}
                            >
                                <Camera className="size-5 text-base-200" />
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpdate}
                                    disabled={isUpdatingProfile}
                                />
                            </label>
                        </div>
                        <p className="text-sm text-zinc-400">
                            {
                                isUpdatingProfile ? "Updating..." : "Click on the camera icon to update your profile"
                            }
                        </p>
                    </div>

                    {/* User Info */}
                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <div className="test-sm text-zinc-400 flex items-center gap-2">
                                <User className="size-4" />
                                Full Name
                            </div>
                            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser.fullname}</p>
                        </div>
                        
                        <div className="space-y-1.5">
                            <div className="test-sm text-zinc-400 flex items-center gap-2">
                                <Mail className="size-4" />
                                Email Address
                            </div>
                            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser.email}</p>
                        </div>
                    </div>
                
                    <div className="mt-6 bg-base-300 rounded-xl p-6">
                        <h2 className="text-lg font-medium mb-4">Account Information</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                                <span>Member Since</span>
                                <span>{date}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                                <span>Account Status</span>
                                <span className="text-green-500">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;