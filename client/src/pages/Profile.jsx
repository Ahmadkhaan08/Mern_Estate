import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice';

export default function Profile() {
  const { currentUser ,loading,error} = useSelector((state) => state.user); // Getting the current user from the Redux store
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [formData,setFormData]=useState({})
  const dispatch=useDispatch()
  //console.log(formData)

  // Cloudinary credentials (use environment variables in production)
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME // Use your Cloudinary cloud name
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET // Use your upload preset

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!file) return;

    setUploading(true);
    setFileUploadError(false);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setFilePerc(progress);
        },
      });
      setImageUrl(response.data.secure_url);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading image: ", error);
      setFileUploadError(true);
      setUploading(false);
    }
  };

  useEffect(() => {
    if (file) {
      uploadImage();
    }
  }, [file]);

  //handle change on updating
  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }
  //handle submit of form
  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
        dispatch(updateUserStart())

const updatedFormData = { ...formData, avatar: imageUrl || currentUser.avatar }
        const res=await fetch(`/api/user/update/${currentUser._id}`,
          {
            method:'POST',
            headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify(updatedFormData)
          }
        )
        const data= await res.json()
        if(data.success===false){
          dispatch(updateUserFailure(data.message))
          return
        }
        dispatch(updateUserSuccess(data))
        setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='font-bold text-3xl text-center mt-3'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit /* Handle form submission */ }>
        <input 
          type="file" 
          ref={fileRef} 
          hidden
          onChange={handleFileChange}
          accept="image/*" // Ensures only images can be uploaded
        />
        <img 
          onClick={() => fileRef.current.click()} 
          src={imageUrl || currentUser.avatar} 
          alt='User_Image' 
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-3' 
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>Error uploading image (image must be less than 2MB)</span>
          ) : uploading ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : (
            filePerc === 100 ? <span className='text-green-700'>Image successfully uploaded</span> : ''
          )}
        </p>
        <input type="text" className="border p-3 rounded-lg" id="username" placeholder='Username' required   defaultValue={currentUser.username} onChange={handleChange}/>
        <input type="email" className="border p-3 rounded-lg" id="email" placeholder='Email' required  defaultValue={currentUser.email} onChange={handleChange}/>
        <input type="password" className="border p-3 rounded-lg" id="password" placeholder='Password'   onChange={handleChange} />
        <button 
         disabled={loading}
          type="submit"
          className='bg-slate-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
        >
          {loading? 'Loading....':'Update'}
        </button>
      </form>
      <div className='flex justify-between mt-3'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      <div className='flex flex-col items-center'>
      <span className='text-red-700 '>{error?error:''}</span>
      <span className='text-green-700 '>{updateSuccess?'User Updated Successfully':''}</span>
      </div>
    </div>
  );
}
