import {GoogleAuthProvider,  getAuth, signInWithPopup } from "firebase/auth"
import { app } from "../../firebase"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { signInSuccess } from "../redux/user/userSlice"
const BASE_URI=import.meta.env.VITE_BACKEND_URI


export default function OAuth(){
     const dispatch=useDispatch()
    const navigate=useNavigate()

  const   handleGoogleClick=async()=>{
    try {
        const provider=new GoogleAuthProvider()
        const auth=getAuth(app)
        const result = await signInWithPopup(auth,provider)
        // console.log(result)
        const res=await fetch(`${BASE_URI}/api/auth/google`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            credentials: 'include',
            body:JSON.stringify({name:result.user.displayName,email:result.user.email,photo:result.user.photoURL})
        })
        const data=await res.json()
        console.log('OAuth response:', data)
        dispatch(signInSuccess(data))
        navigate("/")
    } catch (error) {
        console.log("Cannot procced with google auth",error)
    }
    }
    return (
<button onClick={handleGoogleClick} type="button" className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
    Continue with Google
</button>
    )
}