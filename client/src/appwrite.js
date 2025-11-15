import { Client, Storage} from 'appwrite';

export const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Replace with your project ID

export const storage = new Storage(client);
export const bucketID=import.meta.env.VITE_APPWRITE_BUCKET_ID
export { ID } from 'appwrite';
