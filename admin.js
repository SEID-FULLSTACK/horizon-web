// 1. አስፈላጊ የሆኑ የFirebase አገልግሎቶችን ማስገባት (Import)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. የFirebase ማገናኛ (Configuration) - የራስህን መረጃ እዚህ ተካ
const firebaseConfig = {
  apiKey: "AIzaSyDV-7voUWNUNN8Q7OXt0Ml4EwoL-z8qx0s",
        authDomain: "horizon-web-tech.firebaseapp.com",
        projectId: "horizon-web-tech",
        storageBucket: "horizon-web-tech.firebasestorage.app",
        messagingSenderId: "472300718563",
        appId: "1:472300718563:web:66e0aa4250fac73e3678d6"
};

// 3. Firebase-ን ማስነሳት (Initialize)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- 4. CREATE: አዲስ ፕሮጀክት መጫኛ ---
async function uploadProject() {
    const title = document.getElementById('projectTitle').value;
    const desc = document.getElementById('projectDesc').value;
    const fileInput = document.getElementById('projectImage');

    if (!title || !fileInput.files[0]) {
        return alert("እባክህ ርዕስ እና ፎቶ አስገባ!");
    }

    const reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);

    reader.onload = async () => {
        const base64Image = reader.result; // ፎቶው ወደ ጽሁፍ ተቀየረ

        try {
            await addDoc(collection(db, "projects"), {
                title: title,
                description: desc,
                image: base64Image,
                createdAt: serverTimestamp()
            });
            alert("ፕሮጀክቱ በተሳካ ሁኔታ ተጭኗል!");
            document.getElementById('projectTitle').value = "";
            document.getElementById('projectDesc').value = "";
            displayProjects(); // ዝርዝሩን አድስ
        } catch (e) {
            console.error("Error adding document: ", e);
            alert("ስህተት ተፈጥሯል፦ " + e.message);
        }
    };
}

// --- 5. READ: የተጫኑ ፕሮጀክቶችን ማሳያ ---
async function displayProjects() {
    const container = document.getElementById('adminProjectList');
    container.innerHTML = "በመጫን ላይ..."; 

    try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        container.innerHTML = ""; 

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            container.innerHTML += `
                <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 8px;">
                    <img src="${data.image}" style="width: 150px; border-radius: 5px; display: block; margin-bottom: 10px;">
                    <strong>ርዕስ፦</strong> ${data.title} <br>
                    <strong>መግለጫ፦</strong> ${data.description || 'የለም'} <br><br>
                    <button onclick="updateProject('${doc.id}')" style="background-color: #ffa500; border: none; padding: 5px 10px; color: white; cursor: pointer; border-radius: 3px;">Update Name</button>
                    <button onclick="deleteProject('${doc.id}')" style="background-color: #ff4d4d; border: none; padding: 5px 10px; color: white; cursor: pointer; border-radius: 3px; margin-left: 5px;">Delete</button>
                </div>
            `;
        });
    } catch (e) {
        container.innerHTML = "መረጃውን ማምጣት አልተቻለም።";
        console.error("Error getting documents: ", e);
    }
}

// --- 6. DELETE: ፕሮጀክት ማጥፊያ ---
async function deleteProject(id) {
    if (confirm("እርግጠኛ ነህ ይህ ፕሮጀክት እንዲጠፋ ትፈልጋለህ?")) {
        try {
            await deleteDoc(doc(db, "projects", id));
            alert("ተሰርዟል!");
            displayProjects();
        } catch (e) {
            alert("ማጥፋት አልተቻለም፦ " + e.message);
        }
    }
}

// --- 7. UPDATE: የፕሮጀክት ስም መቀየሪያ ---
async function updateProject(id) {
    const newName = prompt("አዲሱን የፕሮጀክት ስም ያስገቡ፦");
    if (newName) {
        try {
            const projectRef = doc(db, "projects", id);
            await updateDoc(projectRef, { title: newName });
            alert("ተስተካክሏል!");
            displayProjects();
        } catch (e) {
            alert("ማስተካከል አልተቻለም፦ " + e.message);
        }
    }
}
async function updateOrderStatus(orderId, newStatus) {
    if (!newStatus) return;
    try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, {
            status: newStatus
        });
        alert("የመቆጣጠሪያ ሁኔታው ወደ " + newStatus + " ተቀይሯል!");
        displayOrders(); // ገጹን አድስ
    } catch (e) {
        alert("ስህተት ተፈጥሯል፦ " + e.message);
    }
}
window.updateOrderStatus = updateOrderStatus;
// --- 8. ለ HTML እንዲታዩ ማድረግ (Global Scope) ---
// type="module" ስለተጠቀምን እነዚህ መስመሮች ለ HTML onclick አስፈላጊ ናቸው
window.uploadProject = uploadProject;
window.deleteProject = deleteProject;
window.updateProject = updateProject;

// ገጹ ሲከፈት ዝርዝሩን እንዲያሳይ መጥራት
displayProjects();