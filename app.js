import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, set, remove, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
let codigosCarregados = [];

window.onload = function () {
  const user = localStorage.getItem("usuarioLogado");
  const tipo = localStorage.getItem("tipoUsuario");
  if (user && tipo) {
    usuarioLogado = user;
    tipoUsuario = tipo;
    mostrarConteudo();
    mostrarBotaoAdmin();
    carregarCodigos();
  } else {
    ocultarConteudo();
  }
};

function mostrarConteudo() {
  document.getElementById("conteudoCodigo").innerHTML =
    "<p>Selecione um título na lateral para ver o conteúdo.</p>";
  document.getElementById("listaTitulos").classList.remove("hidden");
  document.getElementById("toggleMenuBtn").style.display = "block";
}

function ocultarConteudo() {
  document.getElementById("listaTitulos").classList.add("hidden");
  document.getElementById("conteudoCodigo").innerHTML =
    "<p>Faça login para acessar o conteúdo.</p>";
  document.getElementById("toggleMenuBtn").style.display = "none";
  document.getElementById("listaCodigos").innerHTML = "";
}

window.login = async function () {
  const user = document.getElementById('usuario').value.trim();
  const senha = document.getElementById('senha').value.trim();

  const snap = await get(child(dbRef, 'usuarios/' + user));
  if (snap.exists() && snap.val().senha === senha) {
    usuarioLogado = user;
    tipoUsuario = snap.val().tipo;

    localStorage.setItem('usuarioLogado', usuarioLogado);
    localStorage.setItem('tipoUsuario', tipoUsuario);

    alert(`Logado como ${tipoUsuario}`);
    mostrarConteudo();
    mostrarBotaoAdmin();
    carregarCodigos();
  } else {
    alert("Usuário ou senha inválidos.");
  }
};

window.logout = function () {
  usuarioLogado = "";
  tipoUsuario = "";
  localStorage.clear();
  ocultarConteudo();
  alert("Você saiu.");
};

function carregarCodigos() {
  const listaCodigosDiv = document.getElementById('listaCodigos');
  listaCodigosDiv.innerHTML = "";
  codigosCarregados = [];
  get(child(dbRef, 'codigos')).then(snapshot => {
    if (snapshot.exists()) {
      const dados = snapshot.val();
      for (let id in dados) {
        const item = { id, ...dados[id] };
        codigosCarregados.push(item);
      }
      renderizarCodigos(codigosCarregados);
    }
  });
}

function renderizarCodigos(lista) {
  const listaCodigosDiv = document.getElementById('listaCodigos');
  listaCodigosDiv.innerHTML = "";
  lista.forEach(item => {
    const divTitulo = document.createElement('div');
    divTitulo.className = 'code-header';
    divTitulo.innerText = item.titulo;
    divTitulo.dataset.id = item.id;
    divTitulo.onclick = () => exibirConteudoCodigo(item);
    listaCodigosDiv.appendChild(divTitulo);
  });
}

function exibirConteudoCodigo(item) {
  const conteudoCodigo = document.getElementById('conteudoCodigo');
  conteudoCodigo.innerHTML = `
    <div class="code-card">
      <div class="code-header">${item.titulo}</div>
      <div class="code-meta">${item.linguagem} | ${item.descricao || ''}<br>${item.usuario} | ${item.datahora}</div>
      <div class="code-content">${item.codigo}</div>
    </div>
  `;
}

window.toggleMenu = function () {
  document.getElementById("listaTitulos").classList.toggle("hidden");
};

window.filtrarCodigos = function () {
  const termo = document.getElementById("pesquisa").value.trim().toLowerCase();
  const filtrados = codigosCarregados.filter(item =>
    item.titulo.toLowerCase().includes(termo) ||
    (item.descricao || '').toLowerCase().includes(termo) ||
    (item.codigo || '').toLowerCase().includes(termo)
  );
  renderizarCodigos(filtrados);
};

function mostrarBotaoAdmin() {
  const btnAdmin = document.getElementById('btnAdmin');
  if (tipoUsuario === 'admin') {
    btnAdmin.style.display = 'inline-block';
  } else {
    btnAdmin.style.display = 'none';
  }
}

window.toggleAdmin = function () {
  const painelAdmin = document.getElementById('painelAdmin');
  if (painelAdmin.style.display === 'none') {
    if (tipoUsuario === 'admin') {
      painelAdmin.style.display = 'block';
    } else {
      alert('Acesso negado.');
    }
  } else {
    painelAdmin.style.display = 'none';
  }
};
