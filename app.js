import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, set, remove, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Configurações do Firebase
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

// Ao carregar a página, verifica se já existe sessão salva
window.onload = function () {
  const user = localStorage.getItem('usuarioLogado');
  const tipo = localStorage.getItem('tipoUsuario');
  if (user && tipo) {
    usuarioLogado = user;
    tipoUsuario = tipo;
    carregarCodigos();
  }
};

// Login
window.login = async function () {
  const user = document.getElementById('usuario').value.trim();
  const senha = document.getElementById('senha').value.trim();

  const snap = await get(child(dbRef, 'usuarios/' + user));
  if (snap.exists() && snap.val().senha === senha) {
    usuarioLogado = user;
    tipoUsuario = snap.val().tipo;

    // Salva a sessão no navegador
    localStorage.setItem('usuarioLogado', usuarioLogado);
    localStorage.setItem('tipoUsuario', tipoUsuario);

    alert(`Logado como ${tipoUsuario}`);
    carregarCodigos();
  } else {
    alert("Usuário ou senha inválidos.");
  }
};

// Logout
window.logout = function () {
  usuarioLogado = "";
  tipoUsuario = "";
  localStorage.removeItem('usuarioLogado');
  localStorage.removeItem('tipoUsuario');
  document.getElementById('listaCodigos').innerHTML = "";
  document.getElementById('contadorCodigos').innerText = "Total de Códigos: 0";
  alert("Você saiu.");
};

// Carrega os códigos do banco e exibe
function carregarCodigos() {
  const lista = document.getElementById('listaCodigos');
  lista.innerHTML = "";
  get(child(dbRef, 'codigos')).then(snapshot => {
    if (snapshot.exists()) {
      const dados = snapshot.val();
      let total = 0;
      for (let id in dados) {
        total++;
        const item = dados[id];

        const div = document.createElement('div');
        div.className = 'code-card';

        div.innerHTML = `
          <div class="code-header">${item.titulo}</div>
          <div class="code-meta">${item.linguagem} | ${item.descricao || ''}<br>${item.usuario} | ${item.datahora}</div>
          <div class="code-content">${item.codigo}</div>`;
        lista.appendChild(div);
      }
      document.getElementById('contadorCodigos').innerText = `Total de Códigos: ${total}`;
    } else {
      document.getElementById('contadorCodigos').innerText = `Total de Códigos: 0`;
    }
  });
}
