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
    setDoc
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

// ======================
// Elements
// ======================

const registerForm = document.getElementById("registerForm");
const googleRegister = document.getElementById("googleRegister");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");

const email = document.getElementById("email");
const password = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");

const registerMessage = document.getElementById("registerMessage");

const createBtn = document.querySelector(".signin-btn");

// ======================
// Already Logged In
// ======================

onAuthStateChanged(auth, (user) => {

    if (user) {

        window.location.href = "dashboard.html";

    }

});

// ======================
// Password Toggle
// ======================

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.classList.replace("fa-eye", "fa-eye-slash");

    } else {

        password.type = "password";

        togglePassword.classList.replace("fa-eye-slash", "fa-eye");

    }

});

// ======================
// Register With Email
// ======================

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
            firstName.value.trim() + " " + lastName.value.trim();

        await updateProfile(user, {

            displayName: fullName

        });

        await setDoc(doc(db, "users", user.uid), {

            uid: user.uid,

            firstName: firstName.value.trim(),

            lastName: lastName.value.trim(),

            fullName: fullName,

            email: email.value.trim(),

            balance: 0,

            totalOrders: 0,

            status: "active",

            profilePhoto: "",

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

// ======================
// Google Sign Up
// ======================

googleRegister.addEventListener("click", async () => {

    registerMessage.style.display = "none";
    registerMessage.className = "message";

    try {

        const result = await signInWithPopup(auth, provider);

        const user = result.user;

        const names = (user.displayName || "").split(" ");

        await setDoc(doc(db, "users", user.uid), {

            uid: user.uid,

            firstName: names[0] || "",

            lastName: names.slice(1).join(" ") || "",

            fullName: user.displayName || "",

            email: user.email,

            balance: 0,

            totalOrders: 0,

            status: "active",

            profilePhoto: user.photoURL || "",

            createdAt: serverTimestamp()

        }, {

            merge: true

        });

        registerMessage.className = "message success";
        registerMessage.style.display = "block";
        registerMessage.textContent =
            "Account created successfully! Redirecting...";

        setTimeout(() => {

            window.location.href = "dashboard.html";

        }, 1500);

    } catch (error) {

        registerMessage.className = "message error";
        registerMessage.style.display = "block";
        registerMessage.textContent = error.message;

    }

});
