import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyCdVcmRpwxZdsUuOC2RVekVrzAb_maUUBo",
  authDomain: "crown-shop-testing.firebaseapp.com",
  databaseURL: "https://crown-shop-testing.firebaseio.com",
  projectId: "crown-shop-testing",
  storageBucket: "crown-shop-testing.appspot.com",
  messagingSenderId: "213428739604",
  appId: "1:213428739604:web:6aaf2f334f3f9bb6bd9101"
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
  // checks if we have an user: if userAuth == null (False) = no user, ! will revert it and the function will return; if user userAuth == object (True) - ! will revert it and we will execute the False branch
  if (!userAuth) return;

  const userRef = firestore.doc(`/users/${userAuth.uid}`); //document reference
  const snapShot = await userRef.get();

  //if the user does NOT exist - we will create it in the DB
  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log("Error creating the user", error.message);
    }
  }

  return userRef;
};

// Initialize Firebase - docs https://firebase.google.com/docs/web/setup?authuser=0
// sign-in docs: https://firebase.google.com/docs/auth/web/google-signin?authuser=0
firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

// Setup google auth utility - docs on https://developers.google.com/identity/protocols/OpenIDConnect#authenticationuriparameters
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account"
});

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
