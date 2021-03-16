import firebase from 'firebase'

// Your web app's Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyBDoENxwT0GJcRINjwbwsvinXZB6Fjxcsg",
    authDomain: "cs573-a3.firebaseapp.com",
    projectId: "cs573-a3",
    storageBucket: "cs573-a3.appspot.com",
    messagingSenderId: "33168466973",
    appId: "1:33168466973:web:09558c0685dc09287992f4"
  };

  let fire = firebase.initializeApp(firebaseConfig);
  export default fire;