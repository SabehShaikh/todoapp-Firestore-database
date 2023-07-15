import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { collection, addDoc, getFirestore, onSnapshot, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCYe28GX4SaUpVxIu94pPEvQ8qjRaMxQm4",
    authDomain: "todo-app-17670.firebaseapp.com",
    databaseURL: "https://todo-app-17670-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "todo-app-17670",
    storageBucket: "todo-app-17670.appspot.com",
    messagingSenderId: "386829734243",
    appId: "1:386829734243:web:47f23723bc6fa132ba8356"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const ids = [];
let total = 0;

const getTodos = () => {
    onSnapshot(collection(db, "todos"), (data) => {
        data.docChanges().forEach((todo) => {
            ids.push(todo.doc.id)
            if (todo.type === 'removed') {
                let progress = document.getElementById("progress-width");
                if (Math.round(100 / total) < 100) {
                    total--;
                    progress.style.width = Math.round(100 / total) + "%"
                    progress.innerText = Math.round(100 / total) + "%"
                }
                let dtodo = document.getElementById(todo.doc.id);
                if (dtodo) {
                    dtodo.remove()
                }
            } else if (todo.type === 'added') {
                total++;
                var list = document.getElementById("list");
                list.innerHTML += `
                <li id='${todo.doc.id}'>
                <input class='todo-input' type='text' value='${todo.doc.data().value}' disabled/>
                ${todo.doc.data().time}
                <button onclick='delTodo("${todo.doc.id}")'>Delete</button> 
                <button onclick='editTodo(this,"${todo.doc.id}")'>Edit</button>
                </li>
                `
            }
        })
    });
}

getTodos()


const addTodo = async () => {
    try {
        var todo = document.getElementById("todo");
        var date = new Date()
        const docRef = await addDoc(collection(db, "todos"), {
            value: todo.value,
            time: date.toLocaleString()
        });
        todo.value = ""
    } catch (err) {
        console.log(err)
    }

}

async function delTodo(id) {
    await deleteDoc(doc(db, "todos", id));
    console.log("Todo deleted")
}

var edit = false;
async function editTodo(e, id) {

    if (edit) {
        await updateDoc(doc(db, "todos", id), {
            value: e.parentNode.childNodes[1].value
        });
        e.parentNode.childNodes[1].disabled = true;
        e.parentNode.childNodes[1].blur()
        e.parentNode.childNodes[5].innerHTML = "Edit"
        edit = false;
    } else {
        e.parentNode.childNodes[1].disabled = false;
        e.parentNode.childNodes[1].focus()
        e.parentNode.childNodes[5].innerHTML = "Update"
        edit = true;
    }
}


async function deleteAll() {
    let progress = document.getElementById("progress");
    progress.style.display = "block"
    var list = document.getElementById("list");
    list.innerHTML = ""
    let arr = []
    for (var i = 0; i < ids.length; i++) {
        arr.push(await deleteDoc(doc(db, "todos", ids[i])))
    }
    Promise.all(arr)
        .then((res) => {
            console.log("All data has been deleted")
        })
        .catch(err => {
            console.log("err")
        })
}



window.addTodo = addTodo;
window.delTodo = delTodo;
window.editTodo = editTodo;
window.deleteAll = deleteAll;