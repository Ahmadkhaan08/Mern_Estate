import { useRef, useState } from "react"
import { useDispatch, useSelector} from "react-redux"
import { ID, storage,bucketID } from "../appwrite"
import { Permission } from "appwrite"
import { updateUserFailure, updateUserStart, updateUserSuccess ,updateUser} from "../redux/user/userSlice"


export default function Profile(){
    const {currentUser}=useSelector((state)=>state.user)
    const [avatar,setAvatar]=useState(currentUser.avatar)
    const [formData,setFormData]=useState({})
    const dispatch = useDispatch();
    const fileRef=useRef(null)
    // console.log(formData)


    const uploadImage=async(e)=>{
        const file=e.target.files[0]
        if(!file) return
        try {
            const uploaded=await storage.createFile(
                bucketID,
                ID.unique(),
                file,[
      Permission.read("any"),
      Permission.write("any")
    ],{
        onProgress: (p) => {
          console.log(p)
        }
    }
            )
             console.log("Uploaded file:", uploaded);
             const fileUrl = `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${bucketID}/files/${uploaded.$id}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
             console.log(fileUrl)
             setAvatar(fileUrl)
            dispatch(updateUser({ avatar: fileUrl }));
        } catch (error) {
            console.error("Upload error:", error);
        }
    }

    const handleChange=(e)=>{
        setFormData({
            ...formData,[e.target.id]:e.target.value
        })
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        try {
            dispatch(updateUserStart())
            const payload = { ...formData, avatar };
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            if (data && data.success === false) {
                dispatch(updateUserFailure(data.message))
                return
            }
            dispatch(updateUserSuccess(data))
        } catch (error) {
                dispatch(updateUserFailure(error.message))
            
        }
    }
    return (
        <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
        <form  onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input onChange={uploadImage} type="file" ref={fileRef} hidden accept="image/*" />
            <img onClick={()=>fileRef.current.click()} src={avatar} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />
            <input type="text" id="username" placeholder="Username" className="border p-3 rounded-lg" defaultValue={currentUser.username} onChange={handleChange} />
            <input type="text" id="email" placeholder="Email" className="border p-3 rounded-lg"  defaultValue={currentUser.email} onChange={handleChange}/>
            <input type="text" id="password" placeholder="Password" className="border p-3 rounded-lg" onChange={handleChange} />
            <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>Update User</button>
        </form>
        <div className="flex justify-between mt-5">
            <span className="text-red-700 mt-5">Delete Account</span>
            <span className="text-red-700
             mt-5">Sign Out</span>
        </div>
        </div>
    )
}