import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
   apiKey: "AIzaSyDV-7voUWNUNN8Q7OXt0Ml4EwoL-z8qx0s",
        authDomain: "horizon-web-tech.firebaseapp.com",
        projectId: "horizon-web-tech",
        storageBucket: "horizon-web-tech.firebasestorage.app",
        messagingSenderId: "472300718563",
        appId: "1:472300718563:web:66e0aa4250fac73e3678d6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadData() {
    const containers = {
        all: document.getElementById('ordersList'),
        pending: document.getElementById('list-pending'),
        progress: document.getElementById('list-progress'),
        completed: document.getElementById('list-completed'),
        update: document.getElementById('update-only-list'),
        delete: document.getElementById('delete-only-list')
    };

    // Loaders
    Object.values(containers).forEach(c => { if(c) c.innerHTML = "<p>በመጫን ላይ...</p>"; });

    try {
        const snap = await getDocs(collection(db, "orders"));
        Object.values(containers).forEach(c => { if(c) c.innerHTML = ""; });

        snap.forEach(docSnap => {
            const order = docSnap.data();
            const id = docSnap.id;
            const status = order.status || "Pending";

            const card = `
                <div style="background:white; border:1px solid #e2e8f0; padding:15px; border-radius:10px; margin-bottom:10px;">
                    <p><strong>${order.customerName}</strong> - ${order.serviceType}</p>
                    <p style="font-size:0.9rem; color:#64748b;">Status: <span style="color:#3b82f6; font-weight:600;">${status}</span></p>
                </div>`;

            if(containers.all) containers.all.innerHTML += card;
            if(status === "Pending" && containers.pending) containers.pending.innerHTML += card;
            if(status === "In Progress" && containers.progress) containers.progress.innerHTML += card;
            if(status === "Completed" && containers.completed) containers.completed.innerHTML += card;

            // Update Section
            if(containers.update) {
                containers.update.innerHTML += `
                    <div style="background:white; border:1px solid #e2e8f0; padding:15px; border-radius:10px; margin-bottom:10px;">
                        <p><strong>${order.customerName}</strong></p>
                        <select onchange="updateStatus('${id}', this.value)" style="width:100%; padding:8px; border-radius:5px;">
                            <option value="">Status ቀይር (አሁን: ${status})</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>`;
            }

            // Delete Section
            if(containers.delete) {
                containers.delete.innerHTML += `
                    <div style="display:flex; justify-content:space-between; background:white; border:1px solid #e2e8f0; padding:15px; border-radius:10px; margin-bottom:10px;">
                        <span><strong>${order.customerName}</strong></span>
                        <button onclick="deleteOrder('${id}')" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:5px; cursor:pointer;">ሰርዝ</button>
                    </div>`;
            }
        });
    } catch (e) { console.error(e); }
}

window.updateStatus = async (id, s) => { if(s) { await updateDoc(doc(db, "orders", id), {status: s}); loadData(); } };
window.deleteOrder = async (id) => { if(confirm("ይጥፋ?")) { await deleteDoc(doc(db, "orders", id)); loadData(); } };

loadData();