import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// የእርስዎን Firebase Config እዚህ ያስገቡ
const firebaseConfig = {
 apiKey: "AIzaSyDV-7voUWNUNN8Q7OXt0Ml4EwoL-z8qx0s",
        authDomain: "horizon-web-tech.firebaseapp.com",
        projectId: "horizon-web-tech",
        storageBucket: "horizon-web-tech.firebasestorage.app",
        messagingSenderId: "472300718563",
        appId: "1:472300718563:web:66e0aa4250fac73e3678d6"
    };
    firebase.initializeApp(firebaseConfig);

    const auth = firebase.auth();
    const db = firebase.firestore();
    const storage = firebase.storage();

// መረጃን ከዳታቤዝ አምጥቶ ማሳያ
async function loadOrders() {
    const listContainer = document.getElementById('ordersList');
    const updateContainer = document.getElementById('update-list');
    const deleteContainer = document.getElementById('delete-list');

    try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        [listContainer, updateContainer, deleteContainer].forEach(c => c.innerHTML = "");

        querySnapshot.forEach((docSnap) => {
            const order = docSnap.data();
            const id = docSnap.id;

            // 1. መደበኛ ዝርዝር (All Orders)
            listContainer.innerHTML += `
                <div class="card">
                    <b>${order.customerName || "ስም የለም"}</b> - ${order.serviceType || "አገልግሎት የለም"}
                    <p>ሁኔታ፦ <span style="color:blue">${order.status || "Pending"}</span></p>
                </div>`;

            // 2. ሁኔታ መቀየሪያ (Update Section)
            updateContainer.innerHTML += `
                <div class="card">
                    <b>${order.customerName || "ስም"}</b>
                    <select onchange="changeStatus('${id}', this.value)" style="width:100%; padding:8px; margin-top:5px;">
                        <option value="">ሁኔታ ቀይር (አሁን: ${order.status})</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>`;

            // 3. መረጃ ማጥፊያ (Delete Section)
            deleteContainer.innerHTML += `
                <div class="card" style="display:flex; justify-content:space-between; align-items:center;">
                    <span><b>${order.customerName || "ስም"}</b></span>
                    <button onclick="removeOrder('${id}')" class="btn-delete" style="background:red; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">ሰርዝ</button>
                </div>`;
        });
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// ተግባራትን ለዊንዶው ማስተዋወቅ
window.changeStatus = async (id, newStatus) => {
    if(!newStatus) return;
    await updateDoc(doc(db, "orders", id), { status: newStatus });
    loadOrders();
};

window.removeOrder = async (id) => {
    if(confirm("ይህ ትዕዛዝ ይጥፋ?")) {
        await deleteDoc(doc(db, "orders", id));
        loadOrders();
    }
};

loadOrders();