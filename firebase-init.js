const firebaseConfig = {
  apiKey: "AIzaSyAbJ539d9g9SXsKoJemr0y8LqP4uI_8Ou8",
  authDomain: "ketolowcarbapp.firebaseapp.com",
  projectId: "ketolowcarbapp",
  storageBucket: "ketolowcarbapp.firebasestorage.app",
  messagingSenderId: "805860565278",
  appId: "1:805860565278:web:0a4b27a0bf678161a8290f"
};

// Initialize Firebase via Global Compat objects loaded from index.html
firebase.initializeApp(firebaseConfig);
window.auth = firebase.auth();
window.db = firebase.firestore();
