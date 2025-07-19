
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

let usuarioLogado = "", tipoUsuario = "";

document.getElementById('btnLogin').onclick = async () => {
  const user = document.getElementById('usuario').value.trim();
  const senha = document.getElementById('senha').value.trim();

  const snap = await get(child(dbRef, 'usuarios/' + user));
  if (snap.exists() && snap.val().senha === senha) {
    usuarioLogado = user;
    tipoUsuario = snap.val().tipo;
    alert(`Logado como ${tipoUsuario}`);
    carregarCodigos();
  } else {
    alert("Usuário ou senha inválidos.");
  }
};

document.getElementById('btnLogout').onclick = () => {
  usuarioLogado = ""; tipoUsuario = "";
  document.getElementById('listaCodigos').innerHTML = "";
};

function carregarCodigos() {
  const lista = document.getElementById('listaCodigos');
  lista.innerHTML = "";
  get(child(dbRef, 'codigos')).then(snapshot => {
    if (snapshot.exists()) {
      const dados = snapshot.val();
      for (let id in dados) {
        const item = dados[id];
        const div = document.createElement('div');
        div.className = 'code-card';
        div.innerHTML = `
          <div class="code-header">${item.titulo}</div>
          <div class="code-meta">${item.linguagem} | ${item.descricao || ''}<br>${item.usuario} | ${item.datahora}</div>
          <div class="code-content">${item.codigo}</div>`;
        lista.appendChild(div);
      }
    }
  });
}
