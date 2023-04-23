import { addDoc, collection, getDocs } from "firebase/firestore";
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
  console.log(arr[0])
  return arr;
};
