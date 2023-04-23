import { addDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

/**
 *
 * @param {String} reference uri/file path in firebase storage
 */
export const createItemDocument = async (reference) => {
  try {
    const docRef = await addDoc(collection(firestore, "items"), {
      reference,
    });
    console.log("new doc", docRef.id);
  } catch (e) {
    console.error(e);
  }
};

/**
 * A one-off req
 */
export const getAllDocuments = async () => {
  const arr = [];
  try {
    const querySnapshot = await getDocs(collection(firestore, "items"));
    querySnapshot.forEach((doc) => {
      arr.push(doc.data());
    });
  } catch (e) {
    console.error(e);
  }
  return arr;
};

/**
 * 
 * @returns an unsubscribe function
 */
export const listenToCollection = (cb) => {
  return onSnapshot(collection(firestore, "items"), cb, (error) => console.error(error));
}