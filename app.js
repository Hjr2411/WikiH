<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PlanEmailH - Sistema de Gestão de E-mails N3</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
    <style>
        :root {
            --windows-blue: #0078d4;
            --windows-light-blue: #106ebe;
            --windows-gray: #f3f2f1;
            --windows-dark-gray: #605e5c;
            --success-green: #107c10;
            --warning-yellow: #fed100;
            --error-red: #d13438;
        }

        * {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        }

        .glass-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .btn-windows {
            background: var(--windows-blue);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .btn-windows:hover {
            background: var(--windows-light-blue);
            transform: translateY(-1px);
        }

        .btn-success {
            background: var(--success-green);
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        }

        .btn-success:hover {
            background: #0e6b0e;
        }

        .btn-complete {
            background: var(--windows-dark-gray);
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        }

        .btn-complete:hover {
            background: #4a4846;
        }

        .thermometer {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: inline-block;
            margin: 0 5px;
            position: relative;
        }

        .thermometer.green-light {
            background: #10b981;
            box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }

        .thermometer.green-dark {
            background: #059669;
            box-shadow: 0 0 10px rgba(5, 150, 105, 0.5);
        }

        .thermometer.yellow {
            background: var(--warning-yellow);
            box-shadow: 0 0 10px rgba(254, 209, 0, 0.5);
        }

        .thermometer.red {
            background: var(--error-red);
            box-shadow: 0 0 10px rgba(209, 52, 56, 0.5);
        }

        .table-container {
            max-height: 600px;
            overflow-y: auto;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }

        .table-row.completed {
            background-color: #f9fafb !important;
            color: #6b7280;
        }

        .table-row.completed .thermometer {
            background: #d1d5db !important;
            box-shadow: none !important;
        }

        .input-field {
            border: 1px solid #d1d5db;
            border-radius: 4px;
            padding: 8px 12px;
            font-size: 14px;
            transition: border-color 0.2s ease;
        }

        .input-field:focus {
            outline: none;
            border-color: var(--windows-blue);
            box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.2);
        }

        .select-field {
            border: 1px solid #d1d5db;
            border-radius: 4px;
            padding: 8px 12px;
            font-size: 14px;
            background: white;
            cursor: pointer;
        }

        .select-field:focus {
            outline: none;
            border-color: var(--windows-blue);
            box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.2);
        }

        .update-field {
            width: 100%;
            padding: 4px 8px;
            border: 1px solid #d1d5db;
            border-radius: 3px;
            font-size: 12px;
            resize: none;
            min-height: 30px;
        }

        .update-field:focus {
            outline: none;
            border-color: var(--windows-blue);
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
        }

        .modal-content {
            background: white;
            margin: 5% auto;
            padding: 30px;
            border-radius: 8px;
            max-width: 800px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group label {
            font-weight: 600;
            margin-bottom: 5px;
            color: var(--windows-dark-gray);
        }

        .header-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .stat-label {
            color: var(--windows-dark-gray);
            font-size: 14px;
        }

        @media (max-width: 768px) {
            .table-container {
                font-size: 12px;
            }
            
            .thermometer {
                width: 15px;
                height: 15px;
            }
            
            .btn-success, .btn-complete {
                padding: 4px 8px;
                font-size: 10px;
            }
        }
    </style>
</head>
<body class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="glass-card rounded-lg p-6 mb-8">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">
                        <i class="fas fa-envelope-open-text text-blue-600 mr-3"></i>
                        PlanEmailH
                    </h1>
                    <p class="text-gray-600">Sistema de Gestão de E-mails para Suporte N3</p>
                </div>
                <div class="flex space-x-3">
                    <button onclick="openModal()" class="btn-windows">
                        <i class="fas fa-plus mr-2"></i>Novo Chamado
                    </button>
                    <button onclick="exportToExcel()" class="btn-windows">
                        <i class="fas fa-file-excel mr-2"></i>Exportar Excel
                    </button>
                </div>
            </div>

            <!-- Statistics Cards -->
            <div class="header-stats">
                <div class="stat-card">
                    <div class="stat-number text-green-600" id="totalAtivos">0</div>
                    <div class="stat-label">Chamados Ativos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number text-red-600" id="totalVermelho">0</div>
                    <div class="stat-label">Críticos (Vermelho)</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number text-yellow-600" id="totalAmarelo">0</div>
                    <div class="stat-label">Atenção (Amarelo)</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number text-gray-600" id="totalConcluido">0</div>
                    <div class="stat-label">Concluídos</div>
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="glass-card rounded-lg p-6">
            <div class="table-container">
                <table class="w-full">
                    <thead class="bg-gray-100 sticky top-0">
                        <tr>
                            <th class="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Termômetro</th>
                            <th class="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Analista</th>
                            <th class="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Chamado</th>
                            <th class="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Atualização</th>
                            <th class="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sistema</th>
                            <th class="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Cenário</th>
                            <th class="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Assunto do E-mail</th>
                            <th class="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Data Abertura</th>
                            <th class="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Data Envio N3</th>
                            <th class="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fila</th>
                            <th class="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                            <th class="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody">
                        <!-- Dados serão inseridos aqui -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Modal for New Call -->
    <div id="modal" class="modal">
        <div class="modal-content">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Novo Chamado</h2>
                <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>

            <form id="chamadoForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="analista">Analista *</label>
                        <input type="text" id="analista" class="input-field" required>
                    </div>
                    <div class="form-group">
                        <label for="chamado">Chamado *</label>
                        <input type="text" id="chamado" class="input-field" required>
                    </div>
                    <div class="form-group">
                        <label for="sistema">Sistema *</label>
                        <input type="text" id="sistema" class="input-field" required>
                    </div>
                    <div class="form-group">
                        <label for="cenario">Cenário *</label>
                        <input type="text" id="cenario" class="input-field" required>
                    </div>
                    <div class="form-group">
                        <label for="assunto">Assunto do E-mail *</label>
                        <input type="text" id="assunto" class="input-field" required>
                    </div>
                    <div class="form-group">
                        <label for="dataAbertura">Data de Abertura *</label>
                        <input type="date" id="dataAbertura" class="input-field" required>
                    </div>
                    <div class="form-group">
                        <label for="dataEnvioN3">Data de Envio para o N3 *</label>
                        <input type="datetime-local" id="dataEnvioN3" class="input-field" required>
                    </div>
                    <div class="form-group">
                        <label for="fila">Fila *</label>
                        <input type="text" id="fila" class="input-field" required>
                    </div>
                    <div class="form-group">
                        <label for="status">Status *</label>
                        <select id="status" class="select-field" required>
                            <option value="">Selecione...</option>
                            <option value="aguardando fornecedor">Aguardando Fornecedor</option>
                            <option value="nao enviado ao N3">Não Enviado ao N3</option>
                            <option value="resolvido">Resolvido</option>
                            <option value="outros">Outros</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="atualizacao">Atualização Inicial</label>
                        <textarea id="atualizacao" class="input-field" rows="3" placeholder="Descrição inicial do chamado..."></textarea>
                    </div>
                </div>

                <div class="flex justify-end space-x-3 mt-6">
                    <button type="button" onclick="closeModal()" class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        Cancelar
                    </button>
                    <button type="submit" class="btn-windows">
                        <i class="fas fa-save mr-2"></i>Salvar Chamado
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        // Dados dos chamados
        let chamados = JSON.parse(localStorage.getItem('planEmailH_chamados')) || [];

        // Função para calcular cor do termômetro
        function getThermometerColor(dataAtualizacao) {
            if (!dataAtualizacao) return 'red';
            
            const hoje = new Date();
            const dataUpdate = new Date(dataAtualizacao);
            const diffTime = Math.abs(hoje - dataUpdate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return 'green-light';
            if (diffDays === 1) return 'green-dark';
            if (diffDays === 2) return 'yellow';
            return 'red';
        }

        // Função para formatar data abreviada
        function formatShortDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
        }

        // Função para formatar data e hora completa
        function formatFullDateTime(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleString('pt-BR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });
        }

        // Função para renderizar tabela
        function renderTable() {
            const tbody = document.getElementById('tableBody');
            tbody.innerHTML = '';

            chamados.forEach((chamado, index) => {
                const thermometerColor = chamado.concluido ? '' : getThermometerColor(chamado.dataAtualizacao);
                const rowClass = chamado.concluido ? 'completed' : '';

                const row = `
                    <tr class="table-row ${rowClass} hover:bg-gray-50">
                        <td class="px-3 py-4">
                            ${!chamado.concluido ? `<div class="thermometer ${thermometerColor}"></div>` : '<div class="thermometer" style="background: #d1d5db;"></div>'}
                        </td>
                        <td class="px-3 py-4 text-sm text-gray-900">${chamado.analista}</td>
                        <td class="px-3 py-4 text-sm text-gray-900">${chamado.chamado}</td>
                        <td class="px-3 py-4">
                            <textarea class="update-field" ${chamado.concluido ? 'disabled' : ''} onchange="updateChamado(${index}, this.value)">${chamado.atualizacao || ''}</textarea>
                            <div class="text-xs text-gray-500 mt-1">${chamado.dataAtualizacao ? formatFullDateTime(chamado.dataAtualizacao) : ''}</div>
                        </td>
                        <td class="px-3 py-4 text-sm text-gray-900">${chamado.sistema}</td>
                        <td class="px-3 py-4 text-sm text-gray-900">${chamado.cenario}</td>
                        <td class="px-3 py-4 text-sm text-gray-900">${chamado.assunto}</td>
                        <td class="px-3 py-4 text-sm text-gray-900">${formatShortDate(chamado.dataAbertura)}</td>
                        <td class="px-3 py-4 text-sm text-gray-900">${formatFullDateTime(chamado.dataEnvioN3)}</td>
                        <td class="px-3 py-4 text-sm text-gray-900">${chamado.fila}</td>
                        <td class="px-3 py-4 text-sm text-gray-900">${chamado.status}</td>
                        <td class="px-3 py-4">
                            <div class="flex space-x-2">
                                ${!chamado.concluido ? `
                                    <button class="btn-success" onclick="updateDateTime(${index})" title="Atualizar">
                                        <i class="fas fa-sync-alt"></i>
                                    </button>
                                    <button class="btn-complete" onclick="completeChamado(${index})" title="Concluir">
                                        <i class="fas fa-check"></i>
                                    </button>
                                ` : `
                                    <span class="text-gray-400 text-xs">Concluído</span>
                                `}
                            </div>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });

            updateStats();
        }

        // Função para atualizar estatísticas
        function updateStats() {
            const ativos = chamados.filter(c => !c.concluido).length;
            const concluidos = chamados.filter(c => c.concluido).length;
            const vermelhos = chamados.filter(c => !c.concluido && getThermometerColor(c.dataAtualizacao) === 'red').length;
            const amarelos = chamados.filter(c => !c.concluido && getThermometerColor(c.dataAtualizacao) === 'yellow').length;

            document.getElementById('totalAtivos').textContent = ativos;
            document.getElementById('totalConcluido').textContent = concluidos;
            document.getElementById('totalVermelho').textContent = vermelhos;
            document.getElementById('totalAmarelo').textContent = amarelos;
        }

        // Função para salvar dados
        function saveData() {
            localStorage.setItem('planEmailH_chamados', JSON.stringify(chamados));
        }

        // Função para abrir modal
        function openModal() {
            document.getElementById('modal').style.display = 'block';
        }

        // Função para fechar modal
        function closeModal() {
            document.getElementById('modal').style.display = 'none';
            document.getElementById('chamadoForm').reset();
        }

        // Função para atualizar chamado
        function updateChamado(index, value) {
            chamados[index].atualizacao = value;
            saveData();
        }

        // Função para atualizar data e hora
        function updateDateTime(index) {
            chamados[index].dataAtualizacao = new Date().toISOString();
            saveData();
            renderTable();
        }

        // Função para concluir chamado
        function completeChamado(index) {
            if (confirm('Tem certeza que deseja concluir este chamado?')) {
                chamados[index].concluido = true;
                saveData();
                renderTable();
            }
        }

        // Função para exportar para Excel
        function exportToExcel() {
            const ws = XLSX.utils.json_to_sheet(chamados.map(c => ({
                'Analista': c.analista,
                'Chamado': c.chamado,
                'Atualização': c.atualizacao || '',
                'Data Atualização': c.dataAtualizacao ? formatFullDateTime(c.dataAtualizacao) : '',
                'Sistema': c.sistema,
                'Cenário': c.cenario,
                'Assunto do E-mail': c.assunto,
                'Data de Abertura': formatShortDate(c.dataAbertura),
                'Data de Envio para o N3': formatFullDateTime(c.dataEnvioN3),
                'Fila': c.fila,
                'Status': c.status,
                'Situação': c.concluido ? 'Concluído' : 'Ativo'
            })));

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'PlanEmailH');
            XLSX.writeFile(wb, `PlanEmailH_${new Date().toISOString().split('T')[0]}.xlsx`);
        }

        // Event listener para o formulário
        document.getElementById('chamadoForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const novoChamado = {
                analista: document.getElementById('analista').value,
                chamado: document.getElementById('chamado').value,
                atualizacao: document.getElementById('atualizacao').value,
                sistema: document.getElementById('sistema').value,
                cenario: document.getElementById('cenario').value,
                assunto: document.getElementById('assunto').value,
                dataAbertura: document.getElementById('dataAbertura').value,
                dataEnvioN3: document.getElementById('dataEnvioN3').value,
                fila: document.getElementById('fila').value,
                status: document.getElementById('status').value,
                dataAtualizacao: new Date().toISOString(),
                concluido: false
            };

            chamados.push(novoChamado);
            saveData();
            renderTable();
            closeModal();
            
            alert('Chamado cadastrado com sucesso!');
        });

        // Fechar modal clicando fora
        window.onclick = function(event) {
            const modal = document.getElementById('modal');
            if (event.target === modal) {
                closeModal();
            }
        }

        // Inicializar
        document.addEventListener('DOMContentLoaded', function() {
            renderTable();
            
            // Definir data atual como padrão
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('dataAbertura').value = today;
            
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            document.getElementById('dataEnvioN3').value = now.toISOString().slice(0, 16);
        });

        // Atualizar termômetros a cada minuto
        setInterval(() => {
            renderTable();
        }, 60000);
    </script>
</body>
</html>
