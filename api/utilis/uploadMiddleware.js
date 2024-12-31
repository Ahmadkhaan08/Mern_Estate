import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary (keep this as-is)
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Configure Cloudinary storage for Multer (replace diskStorage with CloudinaryStorage)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads/', // Specify the folder name in Cloudinary
        resource_type: 'auto',     // Automatically detect file type
        public_id: (req, file) => file.fieldname + '-' + Date.now(), // Unique filename generation
    },
});

// Update Multer to use Cloudinary storage
const upload = multer({ storage });

 export  default upload ;