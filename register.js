import {
    auth,
    db,
    provider,
    serverTimestamp
} from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

import {
    doc,
    setDoc,
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

// =====================================
// Elements
// =====================================

const registerForm = document.getElementById("registerForm");

const googleRegister = document.getElementById("googleRegister");

const firstName = document.getElementById("firstName");

const lastName = document.getElementById("lastName");

const email = document.getElementById("email");

const password = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");

const registerMessage = document.getElementById("registerMessage");

const createBtn = document.querySelector(".signin-btn");

// =====================================
// Already Logged In
// =====================================

onAuthStateChanged(auth, (user) => {

    if (user) {

        window.location.replace("dashboard.html");

    }

});

// =====================================
// Show / Hide Password
// =====================================

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

// =====================================
// Email Registration
// =====================================

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    registerMessage.style.display = "none";

    registerMessage.className = "message";

    createBtn.disabled = true;

    createBtn.textContent = "Creating account...";

    try {

        const userCredential = await createUserWithEmailAndPassword(

            auth,

            email.value.trim(),

            password.value

        );

        const user = userCredential.user;

        const fullName =
            `${firstName.value.trim()} ${lastName.value.trim()}`;

        await updateProfile(user, {

            displayName: fullName

        });
                // =====================================
        // Save User To Firestore
        // =====================================

        await setDoc(doc(db, "users", user.uid), {

            uid: user.uid,

            firstName: firstName.value.trim(),

            lastName: lastName.value.trim(),

            fullName: fullName,

            email: email.value.trim(),

            phone: "",

            walletBalance: 0,

            purchaseCount: 0,

            availableLogs: 0,

            availableTools: 0,

            totalOrders: 0,

            profilePhoto: "",

            status: "active",

            createdAt: serverTimestamp()

        });

        // =====================================
        // Welcome Notification
        // =====================================

        await addDoc(collection(db, "notifications"), {

            uid: user.uid,

            title: "Account Created",

            message: "Welcome to Numberly. Your account has been created successfully.",

            read: false,

            createdAt: serverTimestamp()

        });

        registerMessage.className = "message success";

        registerMessage.style.display = "block";

        registerMessage.textContent =
            "Account created successfully! Redirecting...";

        setTimeout(() => {

            window.location.href = "dashboard.html";

        }, 1500);

    } catch (error) {

        let msg = "";

        switch (error.code) {

            case "auth/email-already-in-use":
                msg = "This email is already registered.";
                break;

            case "auth/weak-password":
                msg = "Password must be at least 6 characters.";
                break;

            case "auth/invalid-email":
                msg = "Please enter a valid email address.";
                break;

            default:
                msg = error.message;

        }

        registerMessage.className = "message error";

        registerMessage.style.display = "block";

        registerMessage.textContent = msg;

        createBtn.disabled = false;

        createBtn.textContent = "Create account";

    }

});
// =====================================
// Google Sign Up
// =====================================

googleRegister.addEventListener("click", async () => {

    registerMessage.style.display = "none";

    registerMessage.className = "message";

    googleRegister.disabled = true;

    try {

        const result = await signInWithPopup(

            auth,

            provider

        );

        const user = result.user;

        // Get the username from the email address

const emailUsername = user.email
    .split("@")[0]
    .trim();

// Capitalize the first letter

const firstName =

    emailUsername.charAt(0).toUpperCase() +

    emailUsername.slice(1);

await setDoc(doc(db, "users", user.uid), {

    uid: user.uid,

    firstName: firstName,

    lastName: "",

    fullName: user.displayName || "",

    email: user.email,

    walletBalance: 0,

    purchaseCount: 0,

    availableLogs: 0,

    availableTools: 0,

    status: "active",

    profilePhoto: user.photoURL || "",

    createdAt: serverTimestamp()

}, {

    merge: true

});

            email: user.email || "",

            phone: "",

            walletBalance: 0,

            purchaseCount: 0,

            availableLogs: 0,

            availableTools: 0,

            totalOrders: 0,

            profilePhoto: user.photoURL || "",

            status: "active",

            createdAt: serverTimestamp()

        }, {

            merge: true

        });

        await addDoc(collection(db, "notifications"), {

            uid: user.uid,

            title: "Account Created",

            message: "Welcome to Numberly. Your account has been created successfully.",

            read: false,

            createdAt: serverTimestamp()

        });

        registerMessage.className = "message success";

        registerMessage.style.display = "block";

        registerMessage.textContent =
            "Account created successfully! Redirecting...";

        setTimeout(() => {

            window.location.href = "dashboard.html";

        }, 1500);

    } catch (error) {

        let message = "";

        switch (error.code) {

            case "auth/popup-closed-by-user":
                message = "Google sign up was cancelled.";
                break;

            case "auth/popup-blocked":
                message = "Popup was blocked by your browser.";
                break;

            default:
                message = error.message;

        }

        registerMessage.className = "message error";

        registerMessage.style.display = "block";

        registerMessage.textContent = message;

        googleRegister.disabled = false;

    }

});
