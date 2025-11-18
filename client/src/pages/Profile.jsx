import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ID, storage, bucketID } from "../appwrite";
import { Permission } from "appwrite";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUser,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signInStart,
  signOutUserStart,
  signInSuccess,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const fileRef = useRef(null);
  const [showListingError,setShowListingError]=useState(false)
  const [userListings,setUserListings]=useState([])
  // console.log(formData)

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const uploaded = await storage.createFile(
        bucketID,
        ID.unique(),
        file,
        [Permission.read("any"), Permission.write("any")],
        {
          onProgress: (p) => {
            console.log(p);
          },
        }
      );
      console.log("Uploaded file:", uploaded);
      const fileUrl = `${
        import.meta.env.VITE_APPWRITE_ENDPOINT
      }/storage/buckets/${bucketID}/files/${uploaded.$id}/view?project=${
        import.meta.env.VITE_APPWRITE_PROJECT_ID
      }`;
      console.log(fileUrl);
      setAvatar(fileUrl);
      dispatch(updateUser({ avatar: fileUrl }));
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const payload = { ...formData, avatar };
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data && data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };
 const handleShowListing=async()=>{
  try {
      setShowListingError(false)
    const res=await fetch(`/api/user/listings/${currentUser._id}`)
    const data=await res.json()
    if(data.success===false){
      setShowListingError(true)
      return
    }
setUserListings(data)
  } catch (error) {
    setShowListingError(error.message)
  }
 }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={uploadImage}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={currentUser.avatar || avatar || formData.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="text"
          id="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="text"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update User"}
        </button>
      <Link to="/create-listing" className="bg-green-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 text-center">Create Listing</Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-700 mt-5">
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-700
             mt-5"
        >
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User is updated successfully!" : ""}
      </p>
      <button onClick={handleShowListing} className='text-green-700 w-full'>Show Listing</button>
      <p className='text-red-700 mt-5'>
        {showListingError ? 'Error showing listings' : ''}
      </p>

      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
