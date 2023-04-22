const {
  initializeApp,
  applicationDefault,
  cert,
  getApps,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const functions = require("firebase-functions");
const vision = require("@google-cloud/vision");

exports.processNewFile = functions.storage
  .object()
  .onFinalize(async (object) => {
    const client = new vision.ImageAnnotatorClient();
    const filePath = object.name;
    const bucketname = object.bucket;
    const [result] = await client.textDetection(
      `gs://${bucketname}/${filePath}`
    );
    const detections = result.textAnnotations;
    var arr = [];
    const words = detections[0].description.split("\n");
    const price = words.pop();
    const item = words.join();

    if (!getApps().length) {
      initializeApp();
    }
    const db = getFirestore();
    const snapshot = await db
      .collection("items")
      .where("reference", "==", filePath)
      .get();
    if (snapshot.empty) {
      console.log("No matching documents.");
      return;
    } else {
      snapshot.forEach(async (doc) => {
        const entry = db.collection("items").doc(doc.id);
        const res = await entry.update({ name: item, price: price });
      });
    }
  });
