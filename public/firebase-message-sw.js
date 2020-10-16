importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-messaging.js');

/**
 * serverkey: AAAAB7T0LUM:APA91bEbVE_fc7O8lv_hs9lNFx0PPr-qlszY0Qe6ivq1gKJpNBbCrn7LXw12wgSe6uNIkn7vEt1zTpUdzNOgCy6wclK_wzEB-4gmU9W6ByDoWxw1RbpA63GVLg7AwiJfuN4p2IYIY43y
 */
const firebaseConfig = {
    apiKey: "AIzaSyC_vI0dn39agd91ZR8jjSs7Rb67snKV9vU",
    authDomain: "benoo149.firebaseapp.com",
    databaseURL: "https://benoo149.firebaseio.com",
    projectId: "benoo149",
    storageBucket: "benoo149.appspot.com",
    messagingSenderId: "33100672323",
    appId: "1:33100672323:web:563000313bbde7207ed3f6",
    measurementId: "G-8732M5XHDX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
     const promiseChain = clients
         .matchAll({
              type: "window",
              includeUncontrolled: true,
         })
         .then((windowClients) => {
              for (let i = 0; i < windowClients.length; i++) {
                   const windowClient = windowClients[i];
                   windowClient.postMessage(payload);
              }
         })
         .then(() => {
              return registration.showNotification("my notification title");
         });
     return promiseChain;
});



self.addEventListener("notificationclick", function(event) {
    console.log(event);
});

