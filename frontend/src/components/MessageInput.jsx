import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

function MessageInput() {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    const { sendMessage } = useChatStore();

    const handleImage = async (event) => {
        const file = event.target.files[0]
        if (!file || !file.type.startsWith('image/')) {
            toast.error('Please select an image file')
            return;
        }
        setImageFile(file)
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        }
        reader.readAsDataURL(file);
    }

    const removeImage = () => {
        setImagePreview(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
    }

    const handleSendMessage = async (event) => {
        event.preventDefault();
        if(!text.trim() && !imagePreview) return;

        try {
            await sendMessage({
                text: text.trim(),
                imageFile
            });

            setText("");
            setImageFile(null);
            setImagePreview(null);
            if(fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className='p-4 w-full'>
            {
                imagePreview && (
                    <div className='mb-3 flex items-center gap-2'>
                        <div className='relative'>
                            <img
                                src={imagePreview}
                                alt='preview'
                                className='size-20 object-cover rounded-lg bg-zinc-700'
                            />
                            <button
                                onClick={removeImage}
                                type='button'
                                className='absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center'
                            >
                                <X className='size-3' />
                            </button>
                        </div>
                    </div>
                )
            }
            
            <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
                <div className='flex flex-1 gap-2 items-center'>
                    <input
                        type="text"
                        placeholder='Type a message...'
                        className='w-full input input-bordered rounded-lg input-sm sm:input-md'
                        value={text}
                        onChange={(e) => setText(e.target.value)} 
                    />
                    <input
                        type="file"
                        accept='image/*'
                        className='hidden'
                        ref={fileInputRef}
                        onChange={handleImage}
                    />
                    <button
                        type='button'
                        className={`hidden sm:flex btn btn-circle ${ imagePreview ? "text-emerald-500" : "text-zinc-400" }`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={20} />
                    </button>
                    <button
                        type="submit"
                        className='btn btn-circle'
                        disabled={!text.trim() && !imagePreview}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    )
}

export default MessageInput