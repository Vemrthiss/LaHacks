import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { manipulateAsync } from 'expo-image-manipulator';
import { Image } from 'react-native';
import { createItemDocument } from './itemsRepository';

const getImageSize = async (uri) => {
    return new Promise((resolve, reject) => {
      Image.getSize(uri, (width, height) => {
        resolve({ width, height });
      }, (error) => {
        reject(error);
      });
    });
}

/**
 * 
 * @param {String} uri uri to local image file (original photo before cropping)
 */
export default async function cropImage(
    uri,
    {
        height, 
        originX, 
        originY, 
        width
    },
    {
        captureWidth,
        captureHeight
    }
) {
    const fileName = uuidv4();
    const filePath = `${fileName}.png`;
    const reference = ref(storage, filePath);

    await createItemDocument(filePath);

    try {
        const { width: realWidth, height: realHeight } = await getImageSize(uri);
        const scalingMultipleX = realWidth/captureWidth;
        const scalingMultipleY = realHeight/captureHeight;
        const manipulateResult = await manipulateAsync(
            uri,
            [{
                crop: {
                    height: height*realHeight/captureHeight, 
                    originY: originY * scalingMultipleY, 
                    originX: originX * scalingMultipleX,
                    width: width*realWidth/captureWidth,
                }
            }],
            {
                compression: 1,
                base64: true,
                format: 'png'
            }
        )
        fetch(manipulateResult.uri).then(resp => resp.blob()).then(blob => uploadBytes(reference, blob));
    } catch (e){
        console.error(e);
    }
}