const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.makeAdmin = functions.auth.user().onCreate((user) => {
  if (user.email && user.email.endsWith('@admin.reservasalas.cl')) {
    const customClaims = { admin: true };
    return admin.auth().setCustomUserClaims(user.uid, customClaims);
  }
});
