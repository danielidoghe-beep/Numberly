import {
    auth,
    db
} from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

import {
    doc,
    getDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

// ===============================
// ELEMENTS
// ===============================

const userFirstName = document.getElementById("userFirstName");

const profileInitial = document.getElementById("profileInitial");

const walletBalance = document.getElementById("walletBalance");

const walletHeaderBalance = document.getElementById("walletHeaderBalance");

const purchaseCount = document.getElementById("purchaseCount");

const inventoryCount = document.getElementById("inventoryCount");

const inventoryBreakdown = document.getElementById("inventoryBreakdown");

// ===============================
// AUTH
// ===============================

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        window.location.replace("login.html");

        return;

    }

    loadDashboard(user);

});

// ===============================
// LOAD DASHBOARD
// ===============================

function loadDashboard(user){

    const userRef = doc(db,"users",user.uid);

    onSnapshot(userRef,(snapshot)=>{

        if(!snapshot.exists()) return;

        const data = snapshot.data();

        // User Name

        userFirstName.textContent =
        data.firstName || "User";

        // Profile Initial

        profileInitial.textContent =
        (data.firstName || "U")
        .charAt(0)
        .toUpperCase();

        // Wallet

        const balance =
        data.walletBalance || 0;

        walletBalance.textContent =
        "₦" + balance.toLocaleString("en-NG");

        walletHeaderBalance.textContent =
        "₦" + balance.toLocaleString("en-NG");

        // Purchases

        purchaseCount.textContent =
        data.purchaseCount || 0;

        // Inventory

        const logs =
        data.availableLogs || 0;

        const tools =
        data.availableTools || 0;

        inventoryCount.textContent =
        logs + tools;

        inventoryBreakdown.textContent =
        `${logs} logs • ${tools} tools`;

    });

}
