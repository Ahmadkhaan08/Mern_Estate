import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

export default function SignIn() {
  const [formData,setFormData]=useState({})
  const {loading,error}=useSelector((state)=>state.user)
  const navigate=useNavigate()
  const dispatch=useDispatch()

  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value
    })
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
      dispatch(signInStart())
      const res=await fetch("/api/auth/signin",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
      })
      const data=await res.json()
      if(data.success===false){
        dispatch(signInFailure(data.message))
        return
      }
      dispatch(signInSuccess(data))
      navigate('/')
    } catch (error) {
        dispatch(signInFailure(error.message))
        }
  }
  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-3xl text-center font-bold my-7">SignIn</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter Email..."
          id="email"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="Enter Password..."
          id="password"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading...." : "Sign In"}
        </button>
        <OAuth/>
      </form>
      <div className="flex  justify-center items-center gap-2 mt-5 ">
        <p>Don't have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      <div className="flex  justify-center items-center gap-2 mt-3 ">
        {error && <p className="text-red-500 mt-5">{error}</p>}
      </div>
    </div>
  )
}
