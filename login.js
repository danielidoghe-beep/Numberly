import {
    auth,
    provider
} from "./firebase.js";

import {
    signInWithEmailAndPassword,
    signInWithPopup,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

// Elements

const loginForm = document.getElementById("loginForm");
const googleLogin = document.getElementById("googleLogin");

const email = document.getElementById("email");
const password = document.getElementById("password");

const remember = document.getElementById("remember");

const togglePassword = document.getElementById("togglePassword");

// Already Logged In

onAuthStateChanged(auth, (user)=>{

    if(user){

        window.location.href = "dashboard.html";

    }

});

// Show / Hide Password

togglePassword.addEventListener("click", ()=>{

    if(password.type === "password"){

        password.type = "text";

        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");

    }else{

        password.type = "password";

        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");

    }

});

// Email Login

loginForm.addEventListener("submit", async(e)=>{

    e.preventDefault();

    try{

        if(remember.checked){

            await setPersistence(
                auth,
                browserLocalPersistence
            );

        }else{

            await setPersistence(
                auth,
                browserSessionPersistence
            );

        }

        await signInWithEmailAndPassword(

            auth,

            email.value.trim(),

            password.value

        );

        alert("Login successful");

        window.location.href = "dashboard.html";

    }catch(error){

        alert(error.message);

    }

});

// Google Login

googleLogin.addEventListener("click", async()=>{

    try{

        await signInWithPopup(

            auth,

            provider

        );

        window.location.href = "dashboard.html";

    }

    catch(error){

        alert(error.message);

    }

});
