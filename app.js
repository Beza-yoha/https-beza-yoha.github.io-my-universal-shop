// 1. Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBJUkhL15N98dxnB-n3xyXhSBPwV_I3zjQ",
  authDomain: "my-universal-shop.firebaseapp.com",
  projectId: "my-universal-shop",
  storageBucket: "my-universal-shop.firebasestorage.app",
  messagingSenderId: "724909231088",
  appId: "1:724909231088:web:f6ed2f86020c8e4c052b35"
};

// 2. Initialize
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 3. Shop Data
const shopConfigs = {
    coffee: { name: "Morning Brew Coffee", products: ["Espresso", "Latte", "Cappuccino"] },
    flowers: { name: "Petals & Blooms", products: ["Red Roses", "White Lilies", "Sunflowers"] },
    jewelry: { name: "Luxury Gems", products: ["Gold Ring", "Diamond Necklace", "Silver Bracelet"] }
};

// 4. Function to change the shop and DRAW the buttons
function changeShop(type) {
    const config = shopConfigs[type];
    document.getElementById('shop-name').innerText = config.name;
    
    const list = document.getElementById('product-list');
    list.innerHTML = ""; // Clear old products

    config.products.forEach(item => {
        list.innerHTML += `
            <div class="product-card" style="border: 1px solid #ccc; padding: 10px; margin: 10px;">
                <h3>${item}</h3>
                <button onclick="orderItem('${item}')">Order ${item} Now</button>
            </div>
        `;
    });
}

// 5. Function to send the order to Firebase
function orderItem(item) {
    db.collection("orders").add({
        product: item,
        time: new Date().toLocaleString(),
        status: "New Order"
    })
    .then(() => {
        alert("🎉 Success! Order for " + item + " sent to your Database!");
    })
    .catch((error) => {
        console.error("Error: ", error);
    });
}