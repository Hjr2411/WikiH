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
let menuAberto = false;

// Ao carregar a página, verifica se já existe sessão salva
window.onload = function () {
  const user = localStorage.getItem("usuarioLogado");
  const tipo = localStorage.getItem("tipoUsuario");
  
  if (user && tipo) {
    usuarioLogado = user;
    tipoUsuario = tipo;
    mostrarApp();
    carregarCodigos();
  } else {
    mostrarTelaLogin();
  }
  
  // Configura o toggle do menu
  configurarMenuToggle();
  
  // Configura eventos de teclado para login
  configurarEventosLogin();
};

// Função para mostrar a tela de login
function mostrarTelaLogin() {
  document.getElementById('telaLogin').style.display = 'flex';
  document.getElementById('appPrincipal').style.display = 'none';
}

// Função para mostrar a aplicação principal
function mostrarApp() {
  document.getElementById('telaLogin').style.display = 'none';
  document.getElementById('appPrincipal').style.display = 'flex';
  document.getElementById('usuarioLogadoNome').textContent = usuarioLogado;
  mostrarBotaoAdmin();
}

// Função para configurar o menu toggle
function configurarMenuToggle() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('menuLateral');
  
  menuToggle.addEventListener('click', function() {
    toggleMenu();
  });
  
  // Fecha o menu ao clicar fora dele (apenas em mobile)
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        fecharMenu();
      }
    }
  });
  
  // Fecha o menu ao redimensionar para desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      fecharMenu();
    }
  });
}

// Função para configurar eventos de login
function configurarEventosLogin() {
  const usuarioInput = document.getElementById('usuarioLogin');
  const senhaInput = document.getElementById('senhaLogin');
  
  if (usuarioInput && senhaInput) {
    usuarioInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        senhaInput.focus();
      }
    });
    
    senhaInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        login();
      }
    });
  }
}

// Função para alternar o menu
function toggleMenu() {
  const sidebar = document.getElementById('menuLateral');
  menuAberto = !menuAberto;
  
  if (menuAberto) {
    sidebar.classList.add('open');
  } else {
    sidebar.classList.remove('open');
  }
}

// Função para fechar o menu
function fecharMenu() {
  const sidebar = document.getElementById('menuLateral');
  menuAberto = false;
  sidebar.classList.remove('open');
}

// Login
window.login = async function () {
  const user = document.getElementById('usuarioLogin').value.trim();
  const senha = document.getElementById('senhaLogin').value.trim();

  if (!user || !senha) {
    alert('Por favor, preencha usuário e senha.');
    return;
  }

  try {
    const snap = await get(child(dbRef, 'usuarios/' + user));
    if (snap.exists() && snap.val().senha === senha) {
      usuarioLogado = user;
      tipoUsuario = snap.val().tipo;

      // Salva a sessão no navegador
      localStorage.setItem('usuarioLogado', usuarioLogado);
      localStorage.setItem('tipoUsuario', tipoUsuario);

      mostrarApp();
      carregarCodigos();
      
      // Limpa os campos de login
      document.getElementById('usuarioLogin').value = '';
      document.getElementById('senhaLogin').value = '';
    } else {
      alert("Usuário ou senha inválidos.");
    }
  } catch (error) {
    alert("Erro ao fazer login: " + error.message);
  }
};

// Logout
window.logout = function () {
  usuarioLogado = "";
  tipoUsuario = "";
  localStorage.removeItem("usuarioLogado");
  localStorage.removeItem("tipoUsuario");
  
  // Limpa o conteúdo
  document.getElementById("listaCodigos").innerHTML = "";
  document.getElementById("contadorCodigos").innerText = "Total de Códigos: 0";
  document.getElementById("conteudoCodigo").innerHTML = `
    <div class="welcome-message">
      <h2>Bem-vindo ao WikiH</h2>
      <p>Selecione um item no menu lateral para visualizar o conteúdo.</p>
