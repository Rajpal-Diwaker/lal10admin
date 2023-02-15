// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  // 'messagingSenderId': 'AAAAB7qgR9I:APA91bE6oDy03gPffSco5O3SbphQ1qvXU4xIw03m4OQmRXPwDOMeKQpIHorPdKsS_AJYYa88sQo-75jWYj-_EtFXSqJPbXb6yJ9sezVC7qodCjYgnbqajqZZ1MMQpSVKyiJKKHIL7-LY'
  apiKey: 'AIzaSyCxqWTYChwEk6My7r8c5PI2q4jpvlfe3us',
    authDomain: 'lal10-3c896.firebaseapp.com',
    databaseURL: 'https://lal10-3c896.firebaseio.com',
    projectId: 'lal10-3c896',
    storageBucket: 'lal10-3c896.appspot.com',
    messagingSenderId: '33195837394',
    appId: '1:33195837394:web:e1e96873a147b0775cea0b',
    measurementId: 'G-JL8ZPKHSF1'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
