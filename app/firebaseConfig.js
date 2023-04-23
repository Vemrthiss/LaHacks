import { initializeApp } from 'firebase/app';
import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore'

// Initialize Firebase

export const app = initializeApp({
    projectId: 'lahacks-cfaef',
    storageBucket: 'lahacks-cfaef.appspot.com',
    apiKey: 'AIzaSyDtxa3dHgRfP2MlHtMnLANHPf5TQP0p94k'
});
export const storage = getStorage(app);
export const firestore = getFirestore(app);