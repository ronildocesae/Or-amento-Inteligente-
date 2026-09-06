// ========== DADOS INICIAIS ==========
let dados = {
    categorias: [],
    lancamentos: [],
    metas: [],
    usuarios: []
};

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
    iniciarRelogio();
    atualizarTudo();
    
    // Dados de exemplo se estiver vazio
    if (dados.categorias.length === 0) {
        criarDadosExemplo();
    }
});

function criarDadosExemplo() {
    // Categorias
    dados.categorias = [
        { id: '1', nome: 'Mercado', icone: '', cor: '#2E7D32', tipo: 'Despesa' },
        { id: '2', nome: 'Luz e Água', icone: '⚡', cor: '#F57C00', tipo: 'Despesa' },
        { id: '3', nome: 'Combustível', icone: '⛽', cor: '#1565C0', tipo: 'Despesa' },
        { id: '4', nome: 'Aposentadoria', icone: '💼', cor: '#2E7D32', tipo: 'Receita' },
        { id: '5', nome: 'BPC LOAS', icone: '', cor: '#2E7D32', tipo: 'Receita' }
    ];
    
    // Usuários
    dados.usuarios = [
        { id: '1', nome: 'Ronildo', email: 'ronildocesarr961@gmail.com' }
    ];
    
    // Lançamentos
    dados.lancamentos = [
        { id: '1', data: '2026-09-06', tipo: 'Despesa', categoria: 'Mercado', descricao: 'Compras da semana', valor: 150.00, usuario: 'Ronildo' },
        { id: '2', data: '2026-09-06', tipo: 'Receita', categoria: 'Aposentadoria', descricao: 'Aposentadoria setembro', valor: 1412.00, usuario: 'Ronildo' }
    ];
    
    // Metas
    dados.metas = [
        { id: '1', nome: 'Reserva Emergencial', valorMeta: 3000.00, valorAtual: 2450.00 }
    ];
    
    salvarDados();
}

// ========== RELÓGIO ==========
function iniciarRelogio() {
    atualizarRelogio();
    setInterval(atualizarRelogio, 1000);
}

function atualizarRelogio() {
    const agora = new Date();
    
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const segundos = String(agora.getSeconds()).padStart(2, '0');
    
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();
    
    document.getElementById('time').textContent = `${horas}:${minutos}:${segundos}`;
    document.getElementById('date').textContent = `${dia}/${mes}/${ano}`;
}

// ========== NAVEGAÇÃO ==========
function showScreen(screenName) {
    // Remove active de todas as telas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Remove active de todos os botões
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Adiciona active na tela selecionada
    document.getElementById(screenName).classList.add('active');
    
    // Adiciona active no botão clicado
    event.currentTarget.classList.add('active');
    
    // Atualiza a tela
    atualizarTela(screenName);
}

// ========== CRUD GENÉRICO ==========
function carregarDados() {
    const dadosSalvos = localStorage.getItem('orcamentoInteligente');
    if (dadosSalvos) {
        dados = JSON.parse(dadosSalvos);
    }
}

function salvarDados() {
    localStorage.setItem('orcamentoInteligente', JSON.stringify(dados));
}

function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ========== MODAL ==========
function openModal(tipo) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalForm = document.getElementById('modalForm');
    
    modal.classList.add('active');
    
    let html = '';
    
    switch(tipo) {
        case 'categoria':
            modalTitle.textContent = 'Nova Categoria';
            html = `
                <div class="form-group">
                    <label>Nome *</label>
                    <input type="text" id="catNome" required>
                </div>
                <div class="form-group">
                    <label>Ícone</label>
                    <input type="text" id="catIcone" placeholder="🛒">
                </div>
                <div class="form-group">
                    <label>Cor</label>
                    <input type="color" id="catCor" value="#2E7D32">
                </div>
                <div class="form-group">
                    <label>Tipo *</label>
                    <select id="catTipo" required>
                        <option value="Despesa">Despesa</option>
                        <option value="Receita">Receita</option>
                    </select>
                </div>
            `;
            break;
            
        case 'lancamento':
            modalTitle.textContent = 'Novo Lançamento';
            const catOptions = dados.categorias.map(c => `<option value="${c.nome}">${c.icone} ${c.nome}</option>`).join('');
            const userOptions = dados.usuarios.map(u => `<option value="${u.nome}">${u.nome}</option>`).join('');
            html = `
                <div class="form-group">
                    <label>Data *</label>
                    <input type="date" id="lancData" required value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label>Tipo *</label>
                    <select id="lancTipo" required onchange="atualizarCategoriasPorTipo()">
                        <option value="Despesa">Despesa</option>
                        <option value="Receita">Receita</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Categoria *</label>
                    <select id="lancCategoria" required>
                        ${catOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Descrição</label>
                    <input type="text" id="lancDescricao">
                </div>
                <div class="form-group">
                    <label>Valor *</label>
                    <input type="number" id="lancValor" step="0.01" required>
                </div>
                <div class="form-group">
                    <label>Usuário *</label>
                    <select id="lancUsuario" required>
                        ${userOptions}
                    </select>
                </div>
            `;
            break;
            
        case 'meta':
            modalTitle.textContent = 'Nova Meta';
            html = `
                <div class="form-group">
                    <label>Nome da Meta *</label>
                    <input type="text" id="metaNome" required>
                </div>
                <div class="form-group">
                    <label>Valor Meta *</label>
                    <input type="number" id="metaValor" step="0.01" required>
                </div>
                <div class="form-group">
                    <label>Valor Atual</label>
                    <input type="number" id="metaValorAtual" step="0.01" value="0">
                </div>
            `;
            break;
            
        case 'usuario':
            modalTitle.textContent = 'Novo Usuário';
            html = `
                <div class="form-group">
                    <label>Nome *</label>
                    <input type="text" id="userNome" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="userEmail">
                </div>
            `;
            break;
    }
    
    html += `
        <div class="form-actions">
            <button type="button" class="btn-save" onclick="salvarFormulario('${tipo}')">Salvar</button>
            <button type="button" class="btn-cancel" onclick="closeModal()">Cancelar</button>
        </div>
    `;
    
    modalForm.innerHTML = html;
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

function atualizarCategoriasPorTipo() {
    const tipo = document.getElementById('lancTipo').value;
    const select = document.getElementById('lancCategoria');
    const categoriasFiltradas = dados.categorias.filter(c => c.tipo === tipo);
    
    select.innerHTML = categoriasFiltradas.map(c => 
        `<option value="${c.nome}">${c.icone} ${c.nome}</option>`
    ).join('');
}

function salvarFormulario(tipo) {
    switch(tipo) {
        case 'categoria':
            const categoria = {
                id: gerarId(),
                nome: document.getElementById('catNome').value,
                icone: document.getElementById('catIcone').value || '📌',
                cor: document.getElementById('catCor').value,
                tipo: document.getElementById('catTipo').value
            };
            dados.categorias.push(categoria);
            break;
            
        case 'lancamento':
            const lancamento = {
                id: gerarId(),
                data: document.getElementById('lancData').value,
                tipo: document.getElementById('lancTipo').value,
                categoria: document.getElementById('lancCategoria').value,
                descricao: document.getElementById('lancDescricao').value,
                valor: parseFloat(document.getElementById('lancValor').value),
                usuario: document.getElementById('lancUsuario').value
            };
            dados.lancamentos.push(lancamento);
            break;
            
        case 'meta':
            const meta = {
                id: gerarId(),
                nome: document.getElementById('metaNome').value,
                valorMeta: parseFloat(document.getElementById('metaValor').value),
                valorAtual: parseFloat(document.getElementById('metaValorAtual').value) || 0
            };
            dados.metas.push(meta);
            break;
            
        case 'usuario':
            const usuario = {
                id: gerarId(),
                nome: document.getElementById('userNome').value,
                email: document.getElementById('userEmail').value
            };
            dados.usuarios.push(usuario);
            break;
    }
    
    salvarDados();
    closeModal();
    atualizarTudo();
}

// ========== ATUALIZAÇÃO DAS TELAS ==========
function atualizarTudo() {
    atualizarDashboard();
    atualizarLancamentos();
    atualizarMetas();
    atualizarConfiguracoes();
}

function atualizarTela(tela) {
    switch(tela) {
        case 'dashboard':
            atualizarDashboard();
            break;
        case 'lancamentos':
            atualizarLancamentos();
            break;
        case 'metas':
            atualizarMetas();
            break;
        case 'configuracoes':
            atualizarConfiguracoes();
            break;
    }
}

function atualizarDashboard() {
    // Calcular totais
    const totalReceitas = dados.lancamentos
        .filter(l => l.tipo === 'Receita')
        .reduce((sum, l) => sum + l.valor, 0);
    
    const totalDespesas = dados.lancamentos
        .filter(l => l.tipo === 'Despesa')
        .reduce((sum, l) => sum + l.valor, 0);
    
    const saldo = totalReceitas - totalDespesas;
    
    // Atualizar cards
    document.getElementById('totalIncome').textContent = formatarMoeda(totalReceitas);
    document.getElementById('totalExpense').textContent = formatarMoeda(totalDespesas);
    document.getElementById('totalBalance').textContent = formatarMoeda(saldo);
    document.getElementById('monthExpenses').textContent = formatarMoeda(totalDespesas);
    
    // Metas
    const totalMetas = dados.metas.reduce((sum, m) => sum + m.valorAtual, 0);
    document.getElementById('savedForGoals').textContent = formatarMoeda(totalMetas);
    if (dados.metas.length > 0) {
        document.getElementById('goalTarget').textContent = dados.metas[0].valorMeta.toFixed(2);
    }
    
    // Últimas movimentações
    const recentes = dados.lancamentos
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 5);
    
    const recentList = document.getElementById('recentList');
    if (recentes.length === 0) {
        recentList.innerHTML = '<div class="empty-state">Nenhuma movimentação</div>';
    } else {
        recentList.innerHTML = '<div class="list-container">' +
            recentes.map(l => `
                <div class="list-item">
                    <div class="list-item-info">
                        <div class="list-item-title">${l.categoria}</div>
                        <div class="list-item-subtitle">${formatarData(l.data)} - ${l.usuario}</div>
                    </div>
                    <div class="list-item-value ${l.tipo.toLowerCase()}">
                        ${l.tipo === 'Receita' ? '+' : '-'} ${formatarMoeda(l.valor)}
                    </div>
                </div>
            `).join('') +
        '</div>';
    }
    
    // Gráfico simples (barras)
    atualizarGrafico();
}

function atualizarGrafico() {
    const canvas = document.getElementById('expenseChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;
    
    const despesasPorCategoria = {};
    dados.lancamentos
        .filter(l => l.tipo === 'Despesa')
        .forEach(l => {
            despesasPorCategoria[l.categoria] = (despesasPorCategoria[l.categoria] || 0) + l.valor;
        });
    
    const categorias = Object.keys(despesasPorCategoria);
    const valores = Object.values(despesasPorCategoria);
    const total = valores.reduce((a, b) => a + b, 0);
    
    if (categorias.length === 0) {
        ctx.fillStyle = '#999';
        ctx.font = '14px Montserrat';
        ctx.textAlign = 'center';
        ctx.fillText('Sem dados de despesas', canvas.width/2, canvas.height/2);
        return;
    }
    
    // Gráfico de pizza simples
    let startAngle = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    const cores = ['#2E7D32', '#D32F2F', '#1976D2', '#F57C00', '#7B1FA2', '#00796B'];
    
    categorias.forEach((cat, i) => {
        const sliceAngle = (valores[i] / total) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = cores[i % cores.length];
        ctx.fill();
        
        startAngle += sliceAngle;
    });
    
    // Legenda
    let legendY = 20;
    categorias.forEach((cat, i) => {
        ctx.fillStyle = cores[i % cores.length];
        ctx.fillRect(10, legendY, 15, 15);
        ctx.fillStyle = '#333';
        ctx.font = '12px Montserrat';
        ctx.textAlign = 'left';
        ctx.fillText(`${cat}: ${formatarMoeda(despesasPorCategoria[cat])}`, 30, legendY + 12);
        legendY += 25;
    });
}

function atualizarLancamentos() {
    const container = document.getElementById('lancamentosList');
    const searchTerm = document.getElementById('searchLancamento')?.value.toLowerCase() || '';
    const filterType = document.getElementById('filterType')?.value || '';
    
    let filtrados = dados.lancamentos;
    
    if (searchTerm) {
        filtrados = filtrados.filter(l => 
            l.categoria.toLowerCase().includes(searchTerm) ||
            (l.descricao && l.descricao.toLowerCase().includes(searchTerm))
        );
    }
    
    if (filterType) {
        filtrados = filtrados.filter(l => l.tipo === filterType);
    }
    
    filtrados.sort((a, b) => new Date(b.data) - new Date(a.data));
    
    if (filtrados.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhum lançamento encontrado</div>';
    } else {
        container.innerHTML = '<div class="list-container">' +
            filtrados.map(l => `
                <div class="list-item">
                    <div class="list-item-info">
                        <div class="list-item-title">${l.categoria}</div>
                        <div class="list-item-subtitle">${formatarData(l.data)} - ${l.usuario}</div>
                        ${l.descricao ? `<div class="list-item-subtitle">${l.descricao}</div>` : ''}
                    </div>
                    <div class="list-item-value ${l.tipo.toLowerCase()}">
                        ${formatarMoeda(l.valor)}
                    </div>
                    <div class="list-item-actions">
                        <button class="btn-edit" onclick="editarLancamento('${l.id}')">✏️</button>
                        <button class="btn-delete" onclick="excluirLancamento('${l.id}')">🗑️</button>
                    </div>
                </div>
            `).join('') +
        '</div>';
    }
}

function atualizarMetas() {
    const container = document.getElementById('metasList');
    
    if (dados.metas.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhuma meta cadastrada</div>';
        return;
    }
    
    container.innerHTML = '<div class="list-container">' +
        dados.metas.map(m => {
            const percentual = (m.valorAtual / m.valorMeta * 100).toFixed(1);
            return `
                <div class="list-item">
                    <div class="list-item-info">
                        <div class="list-item-title">${m.nome}</div>
                        <div class="list-item-subtitle">${formatarMoeda(m.valorAtual)} de ${formatarMoeda(m.valorMeta)}</div>
                        <div style="background:#eee;height:8px;border-radius:4px;margin-top:5px;">
                            <div style="background:#2E7D32;height:100%;border-radius:4px;width:${Math.min(percentual, 100)}%"></div>
                        </div>
                        <div class="list-item-subtitle">${percentual}% atingido</div>
                    </div>
                    <div class="list-item-actions">
                        <button class="btn-edit" onclick="editarMeta('${m.id}')">✏️</button>
                        <button class="btn-delete" onclick="excluirMeta('${m.id}')">🗑️</button>
                    </div>
                </div>
            `;
        }).join('') +
    '</div>';
}

function atualizarConfiguracoes() {
    // Categorias
    const catContainer = document.getElementById('categoriasList');
    if (dados.categorias.length === 0) {
        catContainer.innerHTML = '<div class="empty-state">Nenhuma categoria</div>';
    } else {
        catContainer.innerHTML = '<div class="list-container">' +
            dados.categorias.map(c => `
                <div class="list-item">
                    <div class="list-item-info">
                        <div class="list-item-title">${c.icone} ${c.nome}</div>
                        <div class="list-item-subtitle">${c.tipo}</div>
                    </div>
                    <div class="list-item-actions">
                        <button class="btn-edit" onclick="editarCategoria('${c.id}')">✏️</button>
                        <button class="btn-delete" onclick="excluirCategoria('${c.id}')">🗑️</button>
                    </div>
                </div>
            `).join('') +
        '</div>';
    }
    
    // Usuários
    const userContainer = document.getElementById('usuariosList');
    if (dados.usuarios.length === 0) {
        userContainer.innerHTML = '<div class="empty-state">Nenhum usuário</div>';
    } else {
        userContainer.innerHTML = '<div class="list-container">' +
            dados.usuarios.map(u => `
                <div class="list-item">
                    <div class="list-item-info">
                        <div class="list-item-title">${u.nome}</div>
                        <div class="list-item-subtitle">${u.email || ''}</div>
                    </div>
                    <div class="list-item-actions">
                        <button class="btn-edit" onclick="editarUsuario('${u.id}')">✏️</button>
                        <button class="btn-delete" onclick="excluirUsuario('${u.id}')">🗑️</button>
                    </div>
                </div>
            `).join('') +
        '</div>';
    }
}

// ========== FUNÇÕES DE EDIÇÃO E EXCLUSÃO ==========

function editarCategoria(id) {
    const cat = dados.categorias.find(c => c.id === id);
    if (!cat) return;
    
    openModal('categoria');
    document.getElementById('catNome').value = cat.nome;
    document.getElementById('catIcone').value = cat.icone;
    document.getElementById('catCor').value = cat.cor;
    document.getElementById('catTipo').value = cat.tipo;
    
    // Remove a antiga para ser substituída pela nova ao salvar
    dados.categorias = dados.categorias.filter(c => c.id !== id);
}

function excluirCategoria(id) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        dados.categorias = dados.categorias.filter(c => c.id !== id);
        salvarDados();
        atualizarTudo();
    }
}

function editarLancamento(id) {
    const lanc = dados.lancamentos.find(l => l.id === id);
    if (!lanc) return;
    
    openModal('lancamento');
    document.getElementById('lancData').value = lanc.data;
    document.getElementById('lancTipo').value = lanc.tipo;
    atualizarCategoriasPorTipo(); // Atualiza as opções do select
    document.getElementById('lancCategoria').value = lanc.categoria;
    document.getElementById('lancDescricao').value = lanc.descricao || '';
    document.getElementById('lancValor').value = lanc.valor;
    document.getElementById('lancUsuario').value = lanc.usuario;
    
    // Remove o antigo para ser substituído pelo novo ao salvar
    dados.lancamentos = dados.lancamentos.filter(l => l.id !== id);
}

function excluirLancamento(id) {
    if (confirm('Tem certeza que deseja excluir este lançamento?')) {
        dados.lancamentos = dados.lancamentos.filter(l => l.id !== id);
        salvarDados();
        atualizarTudo();
    }
}

function editarMeta(id) {
    const meta = dados.metas.find(m => m.id === id);
    if (!meta) return;
    
    openModal('meta');
    document.getElementById('metaNome').value = meta.nome;
    document.getElementById('metaValor').value = meta.valorMeta;
    document.getElementById('metaValorAtual').value = meta.valorAtual;
    
    dados.metas = dados.metas.filter(m => m.id !== id);
}

function excluirMeta(id) {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
        dados.metas = dados.metas.filter(m => m.id !== id);
        salvarDados();
        atualizarTudo();
    }
}

function editarUsuario(id) {
    const user = dados.usuarios.find(u => u.id === id);
    if (!user) return;
    
    openModal('usuario');
    document.getElementById('userNome').value = user.nome;
    document.getElementById('userEmail').value = user.email || '';
    
    dados.usuarios = dados.usuarios.filter(u => u.id !== id);
}

function excluirUsuario(id) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        dados.usuarios = dados.usuarios.filter(u => u.id !== id);
        salvarDados();
        atualizarTudo();
    }
}

function filterLancamentos() {
    atualizarLancamentos();
}

// ========== UTILITÁRIOS ==========

function formatarMoeda(valor) {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

function formatarData(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Fechar modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}
