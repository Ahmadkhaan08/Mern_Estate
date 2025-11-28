import React, { useEffect, useState } from "react";
import { bucketID, ID, storage } from "../appwrite";
import { Permission } from "appwrite";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
const BASE_URI=import.meta.env.VITE_BACKEND_URI


function CreateListing() {
  const {currentUser}=useSelector(state=>state.user)
  const navigate=useNavigate()
  const params=useParams()
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [formData, setFormData] = useState({imageUrls:[],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  console.log(formData)
  console.log(files);

  useEffect(()=>{
    const fetchListing=async()=>{
        const listingId=params.listingID
        const res=await fetch(`${BASE_URI}/api/listing/get/${listingId}`)
        const data=await res.json()
        if(data.success===false){
            return
        }
        setFormData(data)
    }
    fetchListing()
  },[])

  const handleImageUpload = async () => {
    if (!files || files.length === 0) {
      setImageUploadError("No images selected");
      return;
    }
    if (files.length + formData.imageUrls.length > 6) {
      setImageUploadError("You can upload max 6 images");
      return;
    }
    setUploading(true);
    setImageUploadError("");
    try {
      const uploadPromises = [];
      for (let i = 0; i < files.length; i++) {
        uploadPromises.push(storeImage(files[i]));
      }

      const urls = await Promise.all(uploadPromises);
      setUploading(false);
      setFormData({ ...formData, imageUrls: [...formData.imageUrls, ...urls] });
    } catch (error) {
      console.error(error);
      setImageUploadError("Image upload failed (2MB max per image)");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise(async (resolve, reject) => {
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
        console.log("Uploaded:", uploaded);
        const baseUrl = import.meta.env.VITE_APPWRITE_ENDPOINT;
        const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID

        const fileUrl = `${baseUrl}/storage/buckets/${bucketID}/files/${uploaded.$id}/view?project=${projectId}`;
        resolve(fileUrl);
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleRemoveImage=(index)=>{
    setFormData({
        ...formData,
        imageUrls:formData.imageUrls.filter((_,i)=>i!==index)
    })
  }

  const handleChange=(e)=>{
    if(e.target.id==="sale" || e.target.id==="rent"){
      setFormData({
        ...formData,
        type:e.target.id,
      })
    }

    if(e.target.id==="parking" || e.target.id==="furnished" || e.target.id==="offer"){
      setFormData({
        ...formData,
        [e.target.id]:e.target.checked
      })
    }

    if(e.target.type==="text" || e.target.type==="number" || e.target.type==="textarea"){
      setFormData({
        ...formData,
        [e.target.id]:e.target.value
      })
    }
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    if(formData.imageUrls.length < 1)
       return setError("You must upload at least one image")
      if(+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than regular price')
    try {
      setLoading(true)
      setError(false)
      const res=await fetch(`${BASE_URI}/api/listing/update/${params.listingID}`,{
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          ...formData,
          userRef:currentUser._id

        })
      })
      const data=await res.json()
      if(data.success===false){
        setError(data.error)
        setLoading(false)
        return
      }
      setLoading(false)
      navigate(`/listing/${data._id}`)
      
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col flex-1 gap-4">
          <input
            type="text"
            placeholder="Name"
            id="name"
            maxLength="62"
            minLength="10"
            required
            className="border p-3 rounded-lg"
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            id="description"
            placeholder="Description"
            required
            type="text"
            className="border p-3 rounded-lg"
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            id="address"
            required
            className="border p-3 rounded-lg"
            onChange={handleChange}
            value={formData.address}
          />
            <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5"  onChange={handleChange}
              checked={formData.type==="sale"} />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" onChange={handleChange}
              checked={formData.type==="rent"} />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" onChange={handleChange}
              checked={formData.parking}/>
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" onChange={handleChange}
              checked={formData.furnished}/>
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" onChange={handleChange}
              checked={formData.offer} />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
            value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
            value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
            value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                {formData.type==="rent" && (
                <span className="text-xs">($ / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
                
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="0"
                max="1000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
            value={formData.discountPrice}
              />
              <div className="flex flex-col items-center">
                <p>Discount Price</p>
                {formData.type==="rent" &&(
                <span className="text-xs">($ / month)</span>
                )}
              </div>
            </div>
              )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              onClick={handleImageUpload}
              type="button"
              disabled={uploading}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError}
          </p>
          {
            formData.imageUrls.length>0 && formData.imageUrls.map((url,index)=>(
                <div key={url}
                className='flex justify-between p-3 border items-center'>
                    <img src={url} alt="images" className='w-20 h-20 object-contain rounded-lg' />
                    <button type="button" onClick={()=>handleRemoveImage(index)}
                    className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                </div>
            ))
          }
          <button disabled={loading || uploading} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? "Updating....":"Update Listing"}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
