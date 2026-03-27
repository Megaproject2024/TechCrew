import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAB7KSKUn5HUh2Se-vpri-HGlxGsW9Y2-I",
  authDomain: "hospitalrouter-2f8f7.firebaseapp.com",
  databaseURL: "https://hospitalrouter-2f8f7-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// UI
window.openLogin = () => document.getElementById("loginModal").style.display="flex";
window.openSignup = () => document.getElementById("signupModal").style.display="flex";

// SIGNUP
window.signupUser = async () => {
    const email = document.getElementById("signupEmail").value;
    const pass = document.getElementById("signupPassword").value;
    const role = document.getElementById("role").value;

    try {
        await createUserWithEmailAndPassword(auth, email, pass);

        localStorage.setItem("role", role);

        if(role === "admin"){
            window.location = "admin.html";
        } else {
            window.location = "dashboard.html";
        }

    } catch(e){
        alert(e.message);
    }
};

// LOGIN
window.loginUser = async () => {
    const email = document.getElementById("loginEmail").value;
    const pass = document.getElementById("loginPassword").value;

    try {
        await signInWithEmailAndPassword(auth, email, pass);

        const role = localStorage.getItem("role");

        if(role === "admin"){
            window.location = "admin.html";
        } else {
            window.location = "dashboard.html";
        }

    } catch(e){
        alert(e.message);
    }
};