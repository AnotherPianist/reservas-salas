const functions = require('firebase-functions');
const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.makeAdmin = functions.auth.user().onCreate((user) => {
  if (user.email && user.email.endsWith('@admin.reservasalas.cl')) {
    const customClaims = { admin: true };
    return admin.auth().setCustomUserClaims(user.uid, customClaims);
  }
});
