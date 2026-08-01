import { auth } from "./firebase.js";

import {
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

// ==========================
// Elements
// ==========================

const resetForm = document.getElementById("resetForm");

const email = document.getElementById("email");

const resetBtn = document.getElementById("resetBtn");

const resetMessage = document.getElementById("resetMessage");

// ==========================
// Reset Password
// ==========================

resetForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    resetMessage.style.display = "none";

    resetMessage.className = "message";

    resetBtn.disabled = true;

    resetBtn.textContent = "Sending...";

    try {

        await sendPasswordResetEmail(

            auth,

            email.value.trim()

        );

        let timeLeft = 60;

        resetMessage.className = "message success";

        resetMessage.style.display = "block";

        resetMessage.innerHTML = `

        Password reset link has been sent successfully.<br><br>

        Please check your <strong>Inbox</strong>. If you don't see it, check your <strong>Spam</strong> folder and mark the email as <strong>"Not Spam"</strong> so future emails from Numberly arrive directly in your inbox.

        <span class="countdown">

        This message will close in <span id="timer">60</span>s

        </span>

        `;

        resetBtn.disabled = false;

        resetBtn.textContent = "Send reset code";

        const timer = document.getElementById("timer");

        const countdown = setInterval(() => {

            timeLeft--;

            timer.textContent = timeLeft;

            if (timeLeft <= 0) {

                clearInterval(countdown);

                resetMessage.style.display = "none";

            }

        }, 1000);

    } catch (error) {

        let message = "";

        switch (error.code) {

            case "auth/user-not-found":
                message = "No account was found with this email address.";
                break;

            case "auth/invalid-email":
                message = "Please enter a valid email address.";
                break;

            case "auth/too-many-requests":
                message = "Too many attempts. Please try again later.";
                break;

            default:
                message = error.message;
        }

        resetMessage.className = "message error";

        resetMessage.style.display = "block";

        resetMessage.textContent = message;

        resetBtn.disabled = false;

        resetBtn.textContent = "Send reset code";

    }

});
