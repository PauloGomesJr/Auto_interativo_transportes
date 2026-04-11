/**
 * SIMULADOR AMMPLA - Lógica de Validação e Histórico de Sessão
 * Foco: Didática para novos servidores e agentes de trânsito
 */

let historicoAutos = [];

/**
 * Gerencia a troca de abas entre o Formulário e o Histórico
 */
function mudarAba(abaId) {
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('active'));
    const selecionada = document.getElementById('aba-' + abaId);
    if (selecionada) selecionada.classList.add('active');
}

/**
 * Valida o preenchimento, registra no histórico e gera a impressão
 */
function finalizarAuto() {
    // Lista de campos estritamente obrigatórios (num_ordem removido para ser opcional)
    const camposObrigatorios = [
        'categoria_transporte', 'modelo', 'placa', 
        'empresa', 'cnh', 'cat_cnh', 'local', 'data', 'hora',
        'amparo_ato', 'fiscal_nome', 'fiscal_matricula'
    ];

    let erros = [];

    // 1. Validação de preenchimento dos campos obrigatórios
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
        alert("⚠️ ATENÇÃO: Selecione uma infração na Seção 04.");
        return;
    }

    // 3. Verificação de erros acumulados
    if (erros.length > 0) {
        alert("⚠️ ATENÇÃO: Preencha todos os campos destacados para validar o auto. (Nº da Ordem é opcional)");
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
    
    // 5. Feedback, Impressão e Reset do Formulário
    alert("✅ Auto validado e registrado com sucesso!");
    window.print();
    document.getElementById('talao-form').reset();
    
    // Reseta visualmente as bordas vermelhas após o reset do form
    camposObrigatorios.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) campo.style.borderBottom = "1px solid #000";
    });
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