import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCpb0-b_Rq-aQzk6LAdIir_WSc-OLM4byY",
  authDomain: "appchath-f9d90.firebaseapp.com",
  databaseURL: "https://appchath-f9d90-default-rtdb.firebaseio.com",
  projectId: "appchath-f9d90",
  storageBucket: "appchath-f9d90.appspot.com",
  messagingSenderId: "431216579611",
  appId: "1:431216579611:web:054613cef17d08680154be"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db);

let usuarioLogado = "";
let tipoUsuario = "";

document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('logoutBtn').addEventListener('click', logout);

function login() {
  const user = document.getElementById('usuario').value.trim();
  const senha = document.getElementById('senha').value.trim();

  get(child(dbRef, 'usuarios/' + user)).then(snap => {
    if (snap.exists() && snap.val().senha === senha) {
      usuarioLogado = user;
      tipoUsuario = snap.val().tipo;
      alert(`Logado como ${tipoUsuario}`);
      carregarTitulos();
    } else {
      alert("Usuário ou senha inválidos.");
    }
  });
}

function logout() {
  usuarioLogado = "";
  tipoUsuario = "";
  document.getElementById('conteudo').innerHTML = "<p>Faça login para ver os códigos.</p>";
}

function carregarTitulos() {
  const container = document.getElementById('conteudo');
  container.innerHTML = "<h2>Lista de Códigos</h2>";

  get(child(dbRef, 'codigos')).then(snap => {
    if (snap.exists()) {
      const dados = snap.val();
      for (let id in dados) {
        const item = dados[id];
        const link = document.createElement('span');
        link.className = 'titulo-link';
        link.textContent = item.titulo;
        link.onclick = () => mostrarCodigo(item);
        container.appendChild(link);
      }
    } else {
      container.innerHTML += "<p>Nenhum código encontrado.</p>";
    }
  });
}

function mostrarCodigo(item) {
  const container = document.getElementById('conteudo');
  container.innerHTML = `
    <h2>${item.titulo}</h2>
    <p><strong>Linguagem:</strong> ${item.linguagem}</p>
    <p><strong>Descrição:</strong> ${item.descricao || '(sem descrição)'}</p>
    <p><strong>Autor:</strong> ${item.usuario}</p>
    <p><strong>Data:</strong> ${item.datahora}</p>
    <div class="code-content">${item.codigo.replace(/&lt;/g, '<').replace(/&gt;/g, '>')}</div>
    <button onclick="window.location.reload()">⬅ Voltar à lista</button>
  `;
}
