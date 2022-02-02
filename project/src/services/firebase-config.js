import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCwEFyd4L_08SjOK-H_iFQpAe2YEMHGzrY",
  authDomain: "commsbar-52f65.firebaseapp.com",
  projectId: "commsbar-52f65",
  storageBucket: "commsbar-52f65.appspot.com",
  messagingSenderId: "448877061154",
  appId: "1:448877061154:web:e81aeb30b56aa59470167b",
  measurementId: "G-7XSH6V8RZG"
};

export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);