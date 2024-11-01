import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import Oauth from '../components/Oauth'

export default function SignUp() {
  const [formData,setformData]=useState({})
  const [error,setError]=useState(null)
  const [loading,setLoading]=useState(false)
  const navigate=useNavigate()

  //handle change function..
  const handleChange=(e)=>{
    setformData({
      ...formData,
      [e.target.id]:e.target.value,
    })
  }

  //handle submit function....
  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
      setLoading(true)
      const res=await fetch('/api/auth/signup',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
      })
      const data=await res.json()
      console.log(data)
      if(data.success===false){
        setLoading(false);
        setError(data.message)
        return;
      }
      setLoading(false)
      setError(null)
      navigate('/sign-in') 
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='Username'
        className='border p-3 rounded-lg'
        id='username'  onChange={handleChange}/>
        <input type="email" placeholder='Email'
        className='border p-3 rounded-lg'
        id='email' onChange={handleChange}/>
        <input type="password" placeholder='Password'
        className='border p-3 rounded-lg'
        id='password'onChange={handleChange} />
        <button disabled={loading}className='bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-95 disabled:opacity-80 '>{loading ? 'Loading....':'Sign Up'}</button>
        <Oauth/>
      </form>
      <div className='flex justify-center gap-2 mt-5'>
        <p>Already have an account?</p>
        <Link to='/sign-in'>
        <span className='text-blue-700 hover:underline'>Sign In</span></Link>
      </div>
      {error && 
      <p
      className='text-red-500 mt-5 flex justify-center '>{error}</p>
      }
    </div>
  )
}
