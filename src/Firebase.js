import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyBKjEZlODnxEc4x_m9X_vRGUeESyjF3BcQ",
  authDomain: "fir-d9bb6.firebaseapp.com",
  databaseURL: "https://fir-d9bb6.firebaseio.com",
  projectId: "fir-d9bb6",
  storageBucket: "fir-d9bb6.appspot.com",
  messagingSenderId: "418879909007",
  appId: "1:418879909007:web:f632245bcd12b70e2d54fa",
  measurementId: "G-8NYYJLTFRP"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;