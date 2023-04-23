import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

/**
 * A one-off req
 */
export const getAllUsers = async () => {
  const arr = [];
  try {
    const querySnapshot = await getDocs(collection(firestore, "users"));
    querySnapshot.forEach((doc) => {
      arr.push(doc.data());
    });
  } catch (e) {
    console.error(e);
  }
  return arr;
};