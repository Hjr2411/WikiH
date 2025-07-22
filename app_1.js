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
    </div>
  `;
  
  // Fecha painel admin se estiver aberto
  document.getElementById("painelAdmin").style.display = "none";
  
  // Fecha menu se estiver aberto
  fecharMenu();
  
  // Mostra tela de login
  mostrarTelaLogin();
};

// Função para mostrar/ocultar botão de admin
function mostrarBotaoAdmin() {
  const btnAdmin = document.getElementById('btnAdmin');
  if (tipoUsuario === 'admin') {
    btnAdmin.style.display = 'inline-block';
  } else {
    btnAdmin.style.display = 'none';
  }
}

// Carrega os códigos do banco e exibe
function carregarCodigos() {
  const listaCodigosDiv = document.getElementById('listaCodigos');
  listaCodigosDiv.innerHTML = "";
  
  get(child(dbRef, 'codigos')).then(snapshot => {
    if (snapshot.exists()) {
      const dados = snapshot.val();
      let total = 0;
      
      for (let id in dados) {
        total++;
        const item = dados[id];

        const divTitulo = document.createElement('div');
        divTitulo.className = 'code-header';
        divTitulo.innerText = item.titulo;
        divTitulo.dataset.id = id;
        divTitulo.onclick = () => {
          exibirConteudoCodigo(item);
          // Marca como ativo
          document.querySelectorAll('.code-header').forEach(el => el.classList.remove('active'));
          divTitulo.classList.add('active');
          // Fecha menu em mobile após seleção
          if (window.innerWidth <= 768) {
            fecharMenu();
          }
        };
        listaCodigosDiv.appendChild(divTitulo);
      }
      
      document.getElementById('contadorCodigos').innerText = `Total de Códigos: ${total}`;
    } else {
      document.getElementById('contadorCodigos').innerText = `Total de Códigos: 0`;
    }
  }).catch(error => {
    console.error('Erro ao carregar códigos:', error);
    document.getElementById('contadorCodigos').innerText = `Erro ao carregar códigos`;
  });
}

function exibirConteudoCodigo(item) {
  const conteudoCodigo = document.getElementById('conteudoCodigo');
  conteudoCodigo.innerHTML = `
    <div class="code-card">
      <div class="code-header">${item.titulo}</div>
      <div class="code-meta">${item.linguagem} | ${item.descricao || ''}<br>${item.usuario} | ${item.datahora}</div>
      <pre>${item.codigo}</pre>
    </div>
  `;
}

// Função para alternar o painel de administração
window.toggleAdmin = function () {
  const painelAdmin = document.getElementById('painelAdmin');
  if (painelAdmin.style.display === 'none' || painelAdmin.style.display === '') {
    if (tipoUsuario === 'admin') {
      painelAdmin.style.display = 'block';
      carregarUsuariosAdmin();
      carregarCodigosAdmin();
    } else {
      alert('Acesso negado. Apenas administradores podem acessar este painel.');
    }
  } else {
    painelAdmin.style.display = 'none';
  }
};

// Função para adicionar novo usuário
document.addEventListener('DOMContentLoaded', function() {
  const formNovoUsuario = document.getElementById('formNovoUsuario');
  if (formNovoUsuario) {
    formNovoUsuario.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      if (tipoUsuario !== 'admin') {
        alert('Apenas administradores podem adicionar usuários.');
        return;
      }
      
      const nome = document.getElementById('novoUsuarioNome').value.trim();
      const senha = document.getElementById('novoUsuarioSenha').value.trim();
      const tipo = document.getElementById('novoUsuarioTipo').value;
      
      if (!nome || !senha || !tipo) {
        alert('Todos os campos são obrigatórios.');
        return;
      }
      
      try {
        // Verifica se o usuário já existe
        const snap = await get(child(dbRef, 'usuarios/' + nome));
        if (snap.exists()) {
          alert('Usuário já existe.');
          return;
        }
        
        // Adiciona o novo usuário
        await set(ref(db, 'usuarios/' + nome), {
          senha: senha,
          tipo: tipo
        });
        
        alert('Usuário adicionado com sucesso!');
        document.getElementById('formNovoUsuario').reset();
        carregarUsuariosAdmin();
      } catch (error) {
        alert('Erro ao adicionar usuário: ' + error.message);
      }
    });
  }

  // Função para adicionar novo código
  const formNovoCodigo = document.getElementById('formNovoCodigo');
  if (formNovoCodigo) {
    formNovoCodigo.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      if (tipoUsuario !== 'admin') {
        alert('Apenas administradores podem adicionar códigos.');
        return;
      }
      
      const titulo = document.getElementById('novoTitulo').value.trim();
      const linguagem = document.getElementById('novaLinguagem').value.trim();
      const descricao = document.getElementById('novaDescricao').value.trim();
      const codigo = document.getElementById('novoCodigo').value.trim();
      
      if (!titulo || !linguagem || !codigo) {
        alert('Título, linguagem e código são obrigatórios.');
        return;
      }
      
      try {
        const agora = new Date();
        const dataHora = agora.toLocaleString('pt-BR');
        
        await push(ref(db, 'codigos'), {
          titulo: titulo,
          linguagem: linguagem,
          descricao: descricao,
          codigo: codigo,
          usuario: usuarioLogado,
          datahora: dataHora
        });
        
        alert('Código adicionado com sucesso!');
        document.getElementById('formNovoCodigo').reset();
        carregarCodigos();
        carregarCodigosAdmin();
      } catch (error) {
        alert('Erro ao adicionar código: ' + error.message);
      }
    });
  }
});

// Função para carregar usuários no painel admin
async function carregarUsuariosAdmin() {
  const listaUsuarios = document.getElementById('listaUsuariosAdmin');
  if (!listaUsuarios) return;
  
  listaUsuarios.innerHTML = '';
  
  try {
    const snapshot = await get(child(dbRef, 'usuarios'));
    if (snapshot.exists()) {
      const usuarios = snapshot.val();
      for (let nome in usuarios) {
        const usuario = usuarios[nome];
        
        const div = document.createElement('div');
        div.className = 'admin-item';
        div.innerHTML = `
          <div class="admin-item-info">
            <div class="admin-item-title">${nome}</div>
            <div class="admin-item-meta">Tipo: ${usuario.tipo}</div>
          </div>
          <div class="admin-item-actions">
            <button class="delete" onclick="excluirUsuario('${nome}')">Excluir</button>
          </div>
        `;
        listaUsuarios.appendChild(div);
      }
    }
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
  }
}

// Função para carregar códigos no painel admin
async function carregarCodigosAdmin() {
  const listaCodigos = document.getElementById('listaCodigosAdmin');
  if (!listaCodigos) return;
  
  listaCodigos.innerHTML = '';
  
  try {
    const snapshot = await get(child(dbRef, 'codigos'));
    if (snapshot.exists()) {
      const codigos = snapshot.val();
      for (let id in codigos) {
        const codigo = codigos[id];
        
        const div = document.createElement('div');
        div.className = 'admin-item';
        div.innerHTML = `
          <div class="admin-item-info">
            <div class="admin-item-title">${codigo.titulo}</div>
            <div class="admin-item-meta">${codigo.linguagem} | ${codigo.usuario} | ${codigo.datahora}</div>
          </div>
          <div class="admin-item-actions">
            <button class="delete" onclick="excluirCodigo('${id}')">Excluir</button>
          </div>
        `;
        listaCodigos.appendChild(div);
      }
    }
  } catch (error) {
    console.error('Erro ao carregar códigos:', error);
  }
}

// Função para excluir usuário
window.excluirUsuario = async function(nome) {
  if (tipoUsuario !== 'admin') {
    alert('Apenas administradores podem excluir usuários.');
    return;
  }
  
  if (nome === usuarioLogado) {
    alert('Você não pode excluir seu próprio usuário.');
    return;
  }
  
  if (confirm(`Tem certeza que deseja excluir o usuário "${nome}"?`)) {
    try {
      await remove(ref(db, 'usuarios/' + nome));
      alert('Usuário excluído com sucesso!');
      carregarUsuariosAdmin();
    } catch (error) {
      alert('Erro ao excluir usuário: ' + error.message);
    }
  }
};

// Função para excluir código
window.excluirCodigo = async function(id) {
  if (tipoUsuario !== 'admin') {
    alert('Apenas administradores podem excluir códigos.');
    return;
  }
  
  if (confirm('Tem certeza que deseja excluir este código?')) {
    try {
      await remove(ref(db, 'codigos/' + id));
      alert('Código excluído com sucesso!');
      carregarCodigos();
      carregarCodigosAdmin();
      // Limpa o conteúdo se estava sendo exibido
      document.getElementById('conteudoCodigo').innerHTML = `
        <div class="welcome-message">
          <h2>Bem-vindo ao WikiH</h2>
          <p>Selecione um item no menu lateral para visualizar o conteúdo.</p>
        </div>
      `;
    } catch (error) {
      alert('Erro ao excluir código: ' + error.message);
    }
  }
};

