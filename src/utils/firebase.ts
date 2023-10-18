import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyA2hu4e50oDgy44c0h91jcYNcvzsKQ4Mb4",
    authDomain: "degil-web.firebaseapp.com",
    projectId: "degil-web",
    storageBucket: "degil-web.appspot.com",
    messagingSenderId: "90151992481",
    appId: "1:90151992481:web:3d115b45486cc81ef0c4e0",
    measurementId: "G-EDVLYTGPRQ"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage }