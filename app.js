// 1. YOUR FIREBASE CONFIG GOES HERE (Copy from Firebase Console)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

// 2. Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// 3. THE FUNCTION THAT THE BUTTON CLICKS
function handleShopCreation() {
    console.log("Button clicked!");
    
    const id = document.getElementById('shop-id').value;
    const name = document.getElementById('biz-name').value;
    const price = document.getElementById('p-price').value;
    const pName = document.getElementById('p-name').value;

    if (!id || !name) {
        alert("Please enter Shop ID and Business Name");
        return;
    }

    db.collection("shops").doc(id).set({
        businessName: name,
        products: [{ name: pName, price: price }]
    }).then(() => {
        alert("Shop Created!");
        window.location.href = "index.html?id=" + id;
    }).catch((error) => {
        console.error("Error writing document: ", error);
    });
}

// 4. WHATSAPP FUNCTION
function buyOnWhatsApp(productName, price, shopName) {
    const myNumber = "251900000000"; // CHANGE THIS
    const message = `Hello ${shopName}! I want to buy ${productName} for $${price}.`;
    const url = `https://wa.me/${myNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}