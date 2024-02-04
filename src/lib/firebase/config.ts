import { initializeApp } from "firebase/app";

export default function init() {
  const firebaseConfig = {
    apiKey: "AIzaSyDiZaSgETMr9cSMJtHVAgkBo40NJBP94TM",
    authDomain: "scodes-77f2e.firebaseapp.com",
    databaseURL: "https://scodes-77f2e.firebaseio.com",
    projectId: "scodes-77f2e",
    storageBucket: "scodes-77f2e.appspot.com",
    messagingSenderId: "769813910186",
    appId: "1:769813910186:web:ea28e3e982464559fe36d3",
  };
  
  return initializeApp(firebaseConfig);
}
