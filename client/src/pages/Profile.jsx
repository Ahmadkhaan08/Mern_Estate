import React from 'react'
import { useSelector } from 'react-redux'

export default function Profile() {
  const {currentUser}=useSelector((state)=>state.user)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='font-bold  text-3xl text-center mt-3'>Profile</h1>
      <form  className='flex flex-col gap-4'>
      <img src={currentUser.avatar} alt='User_Image' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-3' />
      <input type="text" className="border p-3 rounded-lg" id="username" placeholder='Username' />
      <input type="email" className="border p-3 rounded-lg" id="email" placeholder='Email' />
      <input type="password" className="border p-3 rounded-lg" id="password" placeholder='Password' />
      <button className='bg-slate-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>Create Listing</button>
      </form>
      <div className='flex justify-between mt-3'>
        <span className='text-red-700  cursor-pointer'>Delete Account</span>
        <span className='text-red-700  cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
