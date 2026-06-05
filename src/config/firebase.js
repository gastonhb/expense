const admin = require('firebase-admin');
const config = require('./environment');

const buildCredential = () => {
  if (config.firebase.serviceAccountJson) {
    return admin.credential.cert(JSON.parse(config.firebase.serviceAccountJson));
  }

  if (config.firebase.projectId && config.firebase.clientEmail && config.firebase.privateKey) {
    return admin.credential.cert({
      projectId: config.firebase.projectId,
      clientEmail: config.firebase.clientEmail,
      privateKey: config.firebase.privateKey.replace(/\\n/g, '\n')
    });
  }

  return admin.credential.applicationDefault();
};

const getFirebaseApp = () => {
  if (admin.apps.length) {
    return admin.app();
  }

  return admin.initializeApp({
    credential: buildCredential(),
    projectId: config.firebase.projectId
  });
};

const firebaseApp = getFirebaseApp();

module.exports = {
  admin,
  firebaseApp,
  firebaseAuth: firebaseApp.auth()
};
