// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCO7YUn_yDXHFF9DJI5dlGrC_ZH7Eu5r_I",
  authDomain: "thesis-project-b7707.firebaseapp.com",
  projectId: "thesis-project-b7707",
  storageBucket: "thesis-project-b7707.appspot.com",
  messagingSenderId: "243803765228",
  appId: "1:243803765228:web:f0d856449372e66c5468c9",
  measurementId: "G-W5CJTK3D5B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)

export { app, storage};

