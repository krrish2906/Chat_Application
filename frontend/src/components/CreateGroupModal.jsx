import React, { useState, useEffect } from 'react';
import { X, Camera, Users, Search } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

const CreateGroupModal = ({ onClose }) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const { createGroup, isCreatingGroup } = useChatStore();

  useEffect(() => {
    // Fetch all users for selection (exclude self if needed, but endpoint returns all except me usually)
    const fetchUsers = async () => {
        try {
            const { data } = await axiosInstance.get('/users'); // Old endpoint gets all users
            if (data.success) {
                setAllUsers(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    }
    fetchUsers();
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const toggleUser = (userId) => {
    setSelectedUsers(prev => 
        prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return toast.error('Group name required');
    if (selectedUsers.length < 2) return toast.error('Select at least 2 members');

    const success = await createGroup({
        name: groupName,
        description,
        members: selectedUsers,
        imageFile
    });

    if (success) onClose();
  };

  const filteredUsers = allUsers.filter(user => 
    user.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 w-full max-w-md rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="size-6 text-primary" /> Create New Group
          </h2>
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img 
                src={imagePreview || "/avatar.png"} 
                alt="Group Icon" 
                className="size-24 rounded-full object-cover border-4 border-base-200"
              />
              <label className="absolute bottom-0 right-0 bg-primary text-primary-content p-2 rounded-full cursor-pointer hover:bg-primary-focus transition-colors shadow-lg">
                <Camera className="size-4" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImage} />
              </label>
            </div>
            <p className="text-xs text-base-content/60">Upload Group Icon</p>
          </div>

          {/* Group Details */}
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Group Name" 
              className="input input-bordered w-full"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
            <input 
              type="text" 
              placeholder="Description (Optional)" 
              className="input input-bordered w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Member Selection */}
          <div className="space-y-2">
             <label className="label">
                <span className="label-text font-medium">Select Members ({selectedUsers.length})</span>
             </label>
             
             {/* Search */}
             <div className="relative mb-2">
                <Search className="absolute left-3 top-3 size-4 text-base-content/40" />
                <input 
                    type="text"
                    placeholder="Search users..."
                    className="input input-bordered w-full pl-9 h-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>

             <div className="h-48 overflow-y-auto border rounded-xl p-2 space-y-1">
                {filteredUsers.map(user => (
                    <div 
                        key={user._id} 
                        onClick={() => toggleUser(user._id)}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedUsers.includes(user._id) ? 'bg-primary/10 border border-primary/20' : 'hover:bg-base-200'}`}
                    >
                        <div className="relative">
                            <img src={user.profilePic || "/avatar.png"} alt={user.fullname} className="size-10 rounded-full object-cover" />
                             {selectedUsers.includes(user._id) && (
                                <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5">
                                    <Users className="size-3" />
                                </div>
                             )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{user.fullname}</p>
                            <p className="text-xs text-base-content/60 truncate">{user.email}</p>
                        </div>
                        <input 
                            type="checkbox" 
                            className="checkbox checkbox-primary checkbox-sm"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => {}} // Handled by div click
                        />
                    </div>
                ))}
                {filteredUsers.length === 0 && (
                     <div className="text-center py-8 text-base-content/50 text-sm">No users found</div>
                )}
             </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full" 
            disabled={isCreatingGroup}
          >
            {isCreatingGroup ? (
                <>
                    <span className="loading loading-spinner loading-sm"></span> Creating...
                </>
            ) : "Create Group"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
