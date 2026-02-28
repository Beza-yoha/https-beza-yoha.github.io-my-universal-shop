// FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyBJUkhL15N98dxnB-n3xyXhSBPwV_I3zjQ",
    authDomain: "my-universal-shop.firebaseapp.com",
    projectId: "my-universal-shop",
    storageBucket: "my-universal-shop.firebasestorage.app",
    messagingSenderId: "724909231088",
    appId: "1:724909231088:web:f6ed2f86020c8e4c052b35"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- 🛠️ SELLER LOGIC (SAVE METHOD) ---
async function launchPlatform() {
    const slug = document.getElementById('shop-slug').value.toLowerCase().replace(/\s+/g, '-');
    const title = document.getElementById('shop-title').value;
    const file = document.getElementById('shop-logo').files[0];
    
    let logoBase64 = "https://via.placeholder.com/150";

    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            finalizeSave(slug, title, reader.result);
        };
    } else {
        finalizeSave(slug, title, logoBase64);
    }
}

function finalizeSave(id, name, img) {
    db.collection("shops").doc(id).set({
        businessName: name,
        logo: img,
        products: [{ 
            name: document.getElementById('item-name').value, 
            price: document.getElementById('item-price').value 
        }]
    }).then(() => {
        alert("Shop is live!");
        window.location.href = "index.html?id=" + id;
    });
}

// --- 🛍️ CUSTOMER LOGIC (MULTI-TENANT VIEW) ---
const params = new URLSearchParams(window.location.search);
const currentShop = params.get('id');

if (currentShop && document.getElementById('display-products')) {
    db.collection("shops").doc(currentShop).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            document.getElementById('display-shop-name').innerText = data.businessName;
            document.getElementById('logo-container').innerHTML = `<img src="${data.logo}" class="logo-circle">`;
            
            let productHtml = "";
            data.products.forEach(p => {
                productHtml += `
                <div class="col-lg-4 col-md-6">
                    <div class="card-product text-center">
                        <h3 class="fw-bold">${p.name}</h3>
                        <p class="price">$${p.price}</p>
                        <button class="btn-apple" onclick="sendOrder('${p.name}', ${p.price})">Buy Now</button>
                    </div>
                </div>`;
            });
            document.getElementById('display-products').innerHTML = productHtml;
        }
    });
}

function sendOrder(itemName, itemPrice) {
    db.collection("orders").add({
        targetShop: currentShop, // This tells YOU which shop owner gets the money
        product: itemName,
        amount: itemPrice,
        status: "New Order",
        date: new Date().toISOString()
    }).then(() => {
        alert("✅ Order sent to " + currentShop + "!");
    });
}