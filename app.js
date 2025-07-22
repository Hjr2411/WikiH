import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, push, remove, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

window.onload = () => {
  const u = localStorage.getItem("usuarioLogado");
  const t = localStorage.getItem("tipoUsuario");
  if (u && t) {
    usuarioLogado = u;
    tipoUsuario = t;
    carregarTitulos();
    if (tipoUsuario === 'admin') document.getElementById("adminPanel").classList.remove("hidden");
  }
};

window.login = async () => {
  const user = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();

  const snap = await get(child(dbRef, 'usuarios/' + user));
  if (snap.exists() && snap.val().senha === senha) {
    usuarioLogado = user;
    tipoUsuario = snap.val().tipo;
    localStorage.setItem("usuarioLogado", usuarioLogado);
    localStorage.setItem("tipoUsuario", tipoUsuario);
    alert(`Logado como ${tipoUsuario}`);
    carregarTitulos();
    if (tipoUsuario === 'admin') {
      document.getElementById("adminPanel").classList.remove("hidden");
      listarUsuarios();
    }
  } else {
    alert("Usuário ou senha inválidos.");
  }
};

window.logout = () => {
  usuarioLogado = "";
  tipoUsuario = "";
  localStorage.clear();
  document.getElementById("listaTitulos").innerHTML = "";
  document.getElementById("conteudoCodigo").innerHTML = "<p>Selecione um título para ver o conteúdo.</p>";
  document.getElementById("adminPanel").classList.add("hidden");
};

function carregarTitulos() {
  const lista = document.getElementById("listaTitulos");
  const conteudo = document.getElementById("conteudoCodigo");
  lista.innerHTML = "";
  conteudo.innerHTML = "<p>Selecione um título para ver o conteúdo.</p>";

  get(child(dbRef, 'codigos')).then(snapshot => {
    if (snapshot.exists()) {
      const dados = snapshot.val();
      for (let id in dados) {
        const item = dados[id];
        const link = document.createElement("a");
        link.textContent = item.titulo;
        link.href = "#";
        link.onclick = () => exibirCodigo(item);
        lista.appendChild(link);
      }
    }
  });
}

function exibirCodigo(item) {
  const conteudo = document.getElementById("conteudoCodigo");
  conteudo.innerHTML = `
    <h2>${item.titulo}</h2>
    <p><strong>Linguagem:</strong> ${item.linguagem}</p>
    <p><strong>Descrição:</strong> ${item.descricao || ''}</p>
    <p><strong>Autor:</strong> ${item.usuario}</p>
    <p><strong>Data/Hora:</strong> ${item.datahora}</p>
    <hr>
    <pre>${item.codigo}</pre>
  `;
}

// Admin — Gerenciar usuários
window.cadastrarUsuario = () => {
  const novoUser = document.getElementById("newUser").value.trim();
  const novoPass = document.getElementById("newPass").value.trim();
  const novoTipo = document.getElementById("newTipo").value;

  if (!novoUser || !novoPass) {
    alert("Preencha usuário e senha.");
    return;
  }

  set(ref(db, 'usuarios/' + novoUser), { senha: novoPass, tipo: novoTipo }).then(() => {
    alert("Usuário cadastrado.");
    document.getElementById("newUser").value = "";
    document.getElementById("newPass").value = "";
    listarUsuarios();
  });
};

function listarUsuarios() {
  const div = document.getElementById("listaUsuarios");
  div.innerHTML = "";
  get(child(dbRef, 'usuarios')).then(snapshot => {
    if (snapshot.exists()) {
      const dados = snapshot.val();
      for (let user in dados) {
        const p = document.createElement("div");
        p.textContent = `${user} [${dados[user].tipo}]`;
        div.appendChild(p);
      }
    }
  });
}
