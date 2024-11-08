import React from 'react'

export default function CreateListing() {
     return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a List</h1>
      <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input type="text" placeholder='Name' className='border border-slate-700 p-3 rounded-lg' id='name' required maxLength='62' minLength='10' />
          <textarea type="text" placeholder='Description' className='border p-3 rounded-lg border-slate-700' id='description' required  />
          <input type="text" placeholder='Address' className='border p-3 rounded-lg border-slate-700' id='address' required  />
          <div className='flex gap-4 flex-wrap'>
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className='w-3' />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className='w-3' />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className='w-3' />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className='w-3' />
              <span>Offer</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className='w-3' />
              <span>Furnished</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className="flex items-center gap-2">
              <input type="number" id='bedrooms' min='1' max='10' required className='p-3 border border-gray-800 rounded-lg' />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" id='bedrooms' min='1' max='10' required className='p-3 border border-gray-800 rounded-lg' />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" id='bedrooms' min='1' max='10' required className='p-3 border border-gray-800 rounded-lg' />
              <p>Regular Price</p>
              <span className='text-xs'>($/Month)</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" id='bedrooms' min='1' max='10' required className='p-3 border border-gray-800 rounded-lg' />
              <p>Discounted Price</p>
              <span className='text-xs'>($/Month)</span>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-4 flex-1'>
          <p className='font-semibold'>Images:
          <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
          </p>
          <div className="flex gap-4">
            <input type="file"  id="images" accept='image/*'
            className='p-3 border border-slate-800 rounded w-full' multiple />
            <button type='button' className='p-3 border border-green-600 text-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 '>
              Upload
            </button>
          </div>
          <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create a List</button>
        </div>
      </form>
    </main>
  )
}
