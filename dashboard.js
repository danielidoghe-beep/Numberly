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
    onSnapshot,
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    updateDoc,
    writeBatch
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

// ======================================
// ELEMENTS
// ======================================

// Header

const menuBtn = document.getElementById("menuBtn");

const themeBtn = document.getElementById("themeBtn");

const notificationBtn = document.getElementById("notificationBtn");

const notificationBadge =
document.getElementById("notificationBadge");

const notificationDropdown =
document.getElementById("notificationDropdown");

const recentNotifications =
document.getElementById("recentNotifications");

const markAllRead =
document.getElementById("markAllRead");

const walletHeaderBalance =
document.getElementById("walletHeaderBalance");

const profileInitial =
document.getElementById("profileInitial");

// Sidebar

const sidebar =
document.getElementById("sidebar");

// Dashboard

const userFirstName =
document.getElementById("userFirstName");

const walletBalance =
document.getElementById("walletBalance");

const purchaseCount =
document.getElementById("purchaseCount");

const inventoryCount =
document.getElementById("inventoryCount");

const inventoryBreakdown =
document.getElementById("inventoryBreakdown");

// Footer

const currentYear =
document.getElementById("currentYear");

// ======================================
// AUTH
// ======================================

onAuthStateChanged(auth, (user)=>{

    if(!user){

        window.location.replace("login.html");

        return;

    }

    loadUserData(user);

});
// ======================================
// LOAD DASHBOARD
// ======================================

function loadDashboard(user){

    const userRef = doc(db,"users",user.uid);

    onSnapshot(userRef,(snapshot)=>{

        if(!snapshot.exists()) return;

        const data = snapshot.data();

        // ==========================
        // User Name
        // ==========================

        const firstName =

    data.firstName ||

    (user.email
        ? user.email.split("@")[0].charAt(0).toUpperCase() +
          user.email.split("@")[0].slice(1)
        : "User");

        userFirstName.textContent = firstName;

        // ==========================
        // Profile Initial
        // ==========================

        profileInitial.textContent =
        firstName.charAt(0).toUpperCase();

        // ==========================
        // Wallet Balance
        // ==========================

        const balance = data.walletBalance || 0;

        walletBalance.textContent =
        "₦" + balance.toLocaleString("en-NG");

        walletHeaderBalance.textContent =
        "₦" + balance.toLocaleString("en-NG");

        // ==========================
        // Purchases
        // ==========================

        const purchases =
        data.purchaseCount || 0;

        purchaseCount.textContent =
        purchases.toLocaleString("en-NG");

        // ==========================
        // Inventory
        // ==========================

        const logs =
        data.availableLogs || 0;

        const tools =
        data.availableTools || 0;

        inventoryCount.textContent =
        (logs + tools).toLocaleString("en-NG");

        inventoryBreakdown.textContent =
        `${logs} Logs • ${tools} Tools`;

    });

// ======================================
// LOAD NOTIFICATIONS
// ======================================

function loadNotifications(uid){

    const notificationQuery = query(

        collection(db,"notifications"),

        where("uid","==",uid),

        orderBy("createdAt","desc"),

        limit(2)

    );

    onSnapshot(notificationQuery,(snapshot)=>{

        recentNotifications.innerHTML="";

        if(snapshot.empty){

            notificationBadge.style.display="none";

            recentNotifications.innerHTML=`

                <div class="notification-empty">

                    <p>No notifications yet.</p>

                </div>

            `;

            return;

        }

        notificationBadge.style.display="flex";

        notificationBadge.textContent=snapshot.size;

        snapshot.forEach((docSnap)=>{

            const data=docSnap.data();

            const item=document.createElement("div");

            item.className="notification-item";

            item.innerHTML=`

                <h4>${data.title}</h4>

                <p>${data.message}</p>

                <span class="notification-time">
                    Just now
                </span>

            `;

            recentNotifications.appendChild(item);

        });

    });

}

// ======================================
// MARK ALL AS READ
// ======================================

markAllRead.addEventListener("click",async()=>{

    const user=auth.currentUser;

    if(!user) return;

    const q=query(

        collection(db,"notifications"),

        where("uid","==",user.uid)

    );

    const snapshot=await getDocs(q);

    const batch=writeBatch(db);

    snapshot.forEach((document)=>{

        batch.update(document.ref,{

            read:true

        });

    });

    await batch.commit();

    notificationBadge.style.display="none";

});
// ======================================
// SIDEBAR
// ======================================

menuBtn.addEventListener("click",(e)=>{

    e.stopPropagation();

    sidebar.classList.toggle("active");

});

document.addEventListener("click",(e)=>{

    if(

        !sidebar.contains(e.target)

        &&

        !menuBtn.contains(e.target)

    ){

        sidebar.classList.remove("active");

    }

});

// ======================================
// NOTIFICATION DROPDOWN
// ======================================

notificationBtn.addEventListener("click",(e)=>{

    e.stopPropagation();

    notificationDropdown.style.display=

    notificationDropdown.style.display==="block"

    ? "none"

    : "block";

});

document.addEventListener("click",(e)=>{

    if(

        !notificationDropdown.contains(e.target)

        &&

        !notificationBtn.contains(e.target)

    ){

        notificationDropdown.style.display="none";

    }

});

// ======================================
// THEME
// ======================================

const savedTheme=

localStorage.getItem("theme");

if(savedTheme==="dark"){

    document.body.classList.add("dark");

}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

    }else{

        localStorage.setItem("theme","light");

    }

});

// ======================================
// LOGOUT
// ======================================

const logoutBtn=document.getElementById("logoutBtn");

if(logoutBtn){

    logoutBtn.addEventListener("click",async()=>{

        try{

            await signOut(auth);

            window.location.replace("login.html");

        }

        catch(error){

            console.error(error);

        }

    });

}

// ======================================
// FOOTER YEAR
// ======================================

if(currentYear){

    currentYear.textContent=

    new Date().getFullYear();

}

// ======================================
// PREVENT IMAGE DRAGGING
// ======================================

document.querySelectorAll("img").forEach(img=>{

    img.draggable=false;

});

// ======================================
// DISABLE RIGHT CLICK ON LOGO
// ======================================

const logo=document.querySelector(".logo");

if(logo){

    logo.addEventListener("contextmenu",(e)=>{

        e.preventDefault();

    });

}
// ======================================
// RECENT ORDERS
// ======================================

const recentOrdersContainer =
document.getElementById("recentOrders");

const totalOrders =
document.getElementById("totalOrders");

function loadRecentOrders(uid){

    if(!recentOrdersContainer) return;

    const ordersQuery=query(

        collection(db,"orders"),

        where("uid","==",uid),

        orderBy("createdAt","desc"),

        limit(5)

    );

    onSnapshot(ordersQuery,(snapshot)=>{

        recentOrdersContainer.innerHTML="";

        if(totalOrders){

            totalOrders.textContent=snapshot.size;

        }

        if(snapshot.empty){

            recentOrdersContainer.innerHTML=`

            <div class="empty-orders">

                <div class="empty-icon">

                    <i class="fa-solid fa-box-open"></i>

                </div>

                <div>

                    <h3>No orders yet</h3>

                    <p>Your purchases will appear here.</p>

                </div>

            </div>

            `;

            return;

        }

        snapshot.forEach((doc)=>{

            const data=doc.data();

            const item=document.createElement("div");

            item.className="order-item";

            item.innerHTML=`

                <div class="order-left">

                    <h4>${data.productName || "Product"}</h4>

                    <span>${data.status || "Completed"}</span>

                </div>

                <div class="order-right">

                    ₦${Number(data.amount || 0).toLocaleString("en-NG")}

                </div>

            `;

            recentOrdersContainer.appendChild(item);

        });

    });

}

// ======================================
// LOAD EVERYTHING
// ======================================

function loadUserData(user){

    loadDashboard(user);

    loadNotifications(user.uid);

    loadRecentOrders(user.uid);

}
