/**
 * SIMULADOR de AUTO DE INFRAÇÃO DE TRANSPORTES AMMPLA - Lógica de Validação e Histórico de Sessão
 * Foco: Didática para novos servidores agentes de trânsito e transporte em Petrolina/PE
 */

let historicoAutos = [];

/**
 * Gerencia a troca de abas entre o Formulário e o Histórico
 */
function mudarAba(abaId) {
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('active'));
    const selecionada = document.getElementById('aba-' + abaId);
    if (selecionada) {
        selecionada.classList.add('active');
        // Garante que a página suba ao topo para melhor experiência mobile
        window.scrollTo(0, 0); 
    }
}

/**
 * Funções para o Alerta Customizado (Substitui o alert nativo)
 */
function exibirAlerta(titulo, mensagem, tipo = 'erro') {
    const modal = document.getElementById('custom-alert');
    const icon = tipo === 'erro' ? '⚠️' : '✅';
    
    document.getElementById('alert-icon').innerText = icon;
    document.getElementById('alert-title').innerText = titulo;
    document.getElementById('alert-message').innerText = mensagem;
    
    // Aplica a classe de estilo baseada no tipo (sucesso ou erro)
    modal.className = 'modal-alert ' + (tipo === 'erro' ? 'alerta-erro' : 'alerta-sucesso');
    modal.style.display = 'block';
}

function fecharAlerta() {
    document.getElementById('custom-alert').style.display = 'none';
}

/**
 * Valida o preenchimento, registra no histórico e gera a impressão
 */
function finalizarAuto() {
    // Lista de campos estritamente obrigatórios
    const camposObrigatorios = [
        'categoria_transporte', 'modelo', 'placa', 
        'empresa', 'cnh', 'cat_cnh', 'local', 'data', 'hora',
        'amparo_ato', 'fiscal_nome', 'fiscal_matricula'
    ];

    let erros = [];

    // 1. Validação de preenchimento
    camposObrigatorios.forEach(id => {
        const campo = document.getElementById(id);
        if (!campo || !campo.value.trim()) {
            erros.push(id);
            if (campo) campo.style.borderBottom = "2px solid #d63031";
        } else {
            if (campo) campo.style.borderBottom = "1px solid #000";
        }
    });

    // 2. Validação da Tipificação (Radio Buttons da Seção 04)
    const infracao = document.querySelector('input[name="infracao"]:checked');
    if (!infracao) {
        exibirAlerta("Seção 04 Pendente", "Selecione uma infração para tipificar o auto.", "erro");
        return;
    }

    // 3. Verificação de erros acumulados
    if (erros.length > 0) {
        exibirAlerta(
            "Auto Incompleto", 
            "Preencha todos os campos destacados para evitar nulidade. (Nº da Ordem é opcional)", 
            "erro"
        );
        return;
    }

    // 4. Gravação dos dados para o Histórico da Sessão
    const auto = {
        placa: document.getElementById('placa').value.toUpperCase(),
        data: document.getElementById('data').value,
        hora: document.getElementById('hora').value,
        infracao: infracao.value,
        fiscal: document.getElementById('fiscal_nome').value,
        recolhido: document.getElementById('veiculo_recolhido').checked ? "SIM" : "NÃO",
        notificado: document.getElementById('infrator_notificado').checked ? "SIM" : "NÃO"
    };

    historicoAutos.push(auto);
    atualizarTabela();
    
    // 5. Feedback amigável e Impressão
    exibirAlerta("Sucesso!", "Auto validado e registrado no histórico da aula.", "sucesso");
    
    // Pequeno delay na impressão para permitir que o usuário veja o alerta de sucesso
    setTimeout(() => {
        window.print();
        document.getElementById('talao-form').reset();
        
        // Reseta as bordas após o reset do formulário
        camposObrigatorios.forEach(id => {
            const campo = document.getElementById(id);
            if (campo) campo.style.borderBottom = "1px solid #000";
        });
    }, 1000);
}

/**
 * Atualiza a tabela na aba de Histórico da Sessão
 */
function atualizarTabela() {
    const corpo = document.getElementById('lista-corpo');
    if (!corpo) return;

    corpo.innerHTML = historicoAutos.map(a => `
        <tr>
            <td><strong>${a.placa}</strong></td>
            <td>${formatarData(a.data)} às ${a.hora}</td>
            <td>${a.infracao}</td>
            <td>${a.fiscal}</td>
        </tr>
    `).join('');
}

/**
 * Função auxiliar para exibir a data no formato brasileiro
 */
function formatarData(dataISO) {
    if (!dataISO) return "";
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}