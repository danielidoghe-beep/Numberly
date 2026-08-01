import {
    auth,
    db,
    provider,
    serverTimestamp
} from "./firebase.js";
import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

// ==========================
// Elements
// ==========================

const loginForm = document.getElementById("loginForm");
const googleLogin = document.getElementById("googleLogin");

const email = document.getElementById("email");
const password = document.getElementById("password");

const remember = document.getElementById("remember");
const togglePassword = document.getElementById("togglePassword");

const loginMessage = document.getElementById("loginMessage");
const signInBtn = document.querySelector(".signin-btn");

// ==========================
// Already Logged In
// ==========================

onAuthStateChanged(auth, (user) => {

    if (user) {

        window.location.href = "dashboard.html";

    }

});

// ==========================
// Show / Hide Password
// ==========================

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");

    } else {

        password.type = "password";

        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");

    }

});

// ==========================
// Email Login
// ==========================

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    loginMessage.style.display = "none";
    loginMessage.className = "message";

    signInBtn.disabled = true;
    signInBtn.textContent = "Signing in...";

    try {

        if (remember.checked) {

            await setPersistence(auth, browserLocalPersistence);

        } else {

            await setPersistence(auth, browserSessionPersistence);

        }

        const userCredential = await signInWithEmailAndPassword(

    auth,

    email.value.trim(),

    password.value

);

const user = userCredential.user;

await addDoc(collection(db, "notifications"), {

    uid: user.uid,

    title: "Successful Login",

    message: "You signed in to your Numberly account successfully.",

    read: false,

    createdAt: serverTimestamp()

});

        loginMessage.className = "message success";
        loginMessage.style.display = "block";
        loginMessage.textContent = "Login successful! Redirecting...";

        setTimeout(() => {

            window.location.href = "dashboard.html";

        }, 1500);

    } catch (error) {

        let message = "";

        switch (error.code) {

            case "auth/user-not-found":
            case "auth/wrong-password":
            case "auth/invalid-credential":
                message = "Invalid email or password";
                break;

            case "auth/invalid-email":
                message = "Please enter a valid email address.";
                break;

            case "auth/too-many-requests":
                message = "Too many login attempts. Try again later.";
                break;

            default:
                message = error.message;

        }

        loginMessage.className = "message error";
        loginMessage.style.display = "block";
        loginMessage.textContent = message;

        signInBtn.disabled = false;
        signInBtn.textContent = "Sign in";

    }

});

// ==========================
// Google Login
// ==========================

googleLogin.addEventListener("click", async () => {

    loginMessage.style.display = "none";
    loginMessage.className = "message";

    googleLogin.disabled = true;

    try {

        const result = await signInWithPopup(

    auth,

    provider

);

const user = result.user;

await addDoc(collection(db, "notifications"), {

    uid: user.uid,

    title: "Successful Login",

    message: "You signed in to your Numberly account successfully.",

    read: false,

    createdAt: serverTimestamp()

});

        loginMessage.className = "message success";
        loginMessage.style.display = "block";
        loginMessage.textContent = "Login successful! Redirecting...";

        setTimeout(() => {

            window.location.href = "dashboard.html";

        }, 1500);

    } catch (error) {

        loginMessage.className = "message error";
        loginMessage.style.display = "block";
        loginMessage.textContent = error.message;

        googleLogin.disabled = false;

    }

});
