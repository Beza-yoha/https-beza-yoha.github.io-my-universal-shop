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

// --- SAVE FUNCTION ---
async function handleShopCreation() {
    const id = document.getElementById('shop-id').value.toLowerCase().replace(/\s+/g, '-');
    const name = document.getElementById('biz-name').value;
    const file = document.getElementById('logo-file').files[0];
    
    let logoData = "https://via.placeholder.com/150";

    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            saveToFirebase(id, name, reader.result);
        };
    } else {
        saveToFirebase(id, name, logoData);
    }
}

function saveToFirebase(id, name, logo) {
    db.collection("shops").doc(id).set({
        businessName: name,
        logo: logo,
        products: [{ 
            name: document.getElementById('p-name').value, 
            price: document.getElementById('p-price').value 
        }]
    }).then(() => {
        alert("Success! Your shop is live.");
        window.location.href = "index.html?id=" + id;
    });
}

// --- LOAD FUNCTION ---
const urlParams = new URLSearchParams(window.location.search);
const currentId = urlParams.get('id');

if (currentId && document.getElementById('product-list')) {
    db.collection("shops").doc(currentId).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            document.getElementById('shop-name').innerText = data.businessName;
            document.getElementById('logo-place').innerHTML = `<img src="${data.logo}" class="logo-img">`;
            
            let html = "";
            data.products.forEach(p => {
                html += `

                // ... inside the db.collection("shops").doc(currentShopId).get() block ...

            let html = "";
            data.products.forEach(p => {
                // PASTE THE NEW CODE RIGHT HERE:
                html += `
                <div class="col-md-4">
                    <div class="product-card">
                        <h4 class="fw-bold">${p.name}</h4>
                        <p class="price-tag">$${p.price}</p>
                        <button class="btn-buy" onclick="buyOnWhatsApp('${p.name}', '${p.price}', '${data.businessName}')">
                            Buy on WhatsApp 💬
                        </button>
                    </div>
                </div>`;
            });
            document.getElementById('product-list').innerHTML = html;

// ...
                <div class="col-md-4 col-sm-6">
                    <div class="product-card">
                        <h4 class="fw-bold">${p.name}</h4>
                        <p class="price-tag mb-3">$${p.price}</p>
                        <button class="btn-buy" onclick="alert('Order Sent!')">Order Now</button>
                    </div>
                </div>`;
            });
            document.getElementById('product-list').innerHTML = html;
        } else {
            document.getElementById('shop-name').innerText = "Shop Not Found";
        }
    });
}
function buyOnWhatsApp(productName, price, shopName) {
    const myNumber = "251912345678"; // <--- CHANGE THIS TO YOUR NUMBER
    const message = `Hello ${shopName}! I want to buy: ${productName} for $${price}. Is it available?`;
    const whatsappUrl = `https://wa.me/${myNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}