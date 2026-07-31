import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";

import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-analytics.js";

import {
    getAuth,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

import {
    getFirestore,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-storage.js";

const firebaseConfig = {

    apiKey: "AIzaSyCibEw5lU9zozY6F68sddfSUz9JEVknYyY",

    authDomain: "numberly-5c8b4.firebaseapp.com",

    projectId: "numberly-5c8b4",

    storageBucket: "numberly-5c8b4.firebasestorage.app",

    messagingSenderId: "835905384846",

    appId: "1:835905384846:web:65de73ed5b641c598574df",

    measurementId: "G-V3RE6LZ11E"

};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({

    prompt: "select_account"

});

export {

    app,

    analytics,

    auth,

    db,

    storage,

    provider,

    serverTimestamp

};
