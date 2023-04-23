import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

/**
 * 
 * @param {String} reference uri/file path in firebase storage
 */
export const createItemDocument = async (reference) => {
    try {
        const docRef = await addDoc(collection(firestore, 'items'), {
            reference
        })
        console.log('new doc', docRef.id);
    } catch (e) {
        console.error(e);
    }
}