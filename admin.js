// admin.js (ለ Firebase v8)
function loadData() {
    const listAll = document.getElementById('ordersList');
    const listUp = document.getElementById('update-only-list');
    const listDel = document.getElementById('delete-only-list');

    db.collection("orders").get().then((querySnapshot) => {
        listAll.innerHTML = "";
        listUp.innerHTML = "";
        listDel.innerHTML = "";

        if (querySnapshot.empty) {
            listAll.innerHTML = "<p>ምንም ትዕዛዝ የለም።</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const order = doc.data();
            const id = doc.id;

            // ለ All Orders
            listAll.innerHTML += `
                <div class="card">
                    <b>${order.Name}</b> - ${order.serviceType} <br>
                    Status: <span style="color:blue">${order.status || 'Pending'}</span>
                </div>`;

            // ለ Update Menu
            listUp.innerHTML += `
                <div class="card">
                    <b>${order.customerName}</b>
                    <select onchange="updateStatus('${id}', this.value)">
                        <option value="">ሁኔታ ቀይር</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>`;

            // ለ Delete Menu
            listDel.innerHTML += `
                <div class="card" style="display:flex; justify-content:space-between;">
                    <span>${order.customerName}</span>
                    <button onclick="deleteOrder('${id}')" class="btn-delete">ሰርዝ</button>
                </div>`;
        });
    }).catch((error) => {
        console.error("Error getting documents: ", error);
        alert("ዳታውን ማምጣት አልተቻለም፦ " + error.message);
    });
}

// Status Update ተግባር
window.updateStatus = function(id, newStatus) {
    if(!newStatus) return;
    db.collection("orders").doc(id).update({ status: newStatus })
    .then(() => { alert("ተቀይሯል!"); loadData(); });
}

// Delete ተግባር
window.deleteOrder = function(id) {
    if(confirm("ይጥፋ?")) {
        db.collection("orders").doc(id).delete()
        .then(() => { loadData(); });
    }
}

// ገጹ ሲከፈት ዳታውን ጥራ
loadData();