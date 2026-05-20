/**
 * SIMULADOR AMMPLA - Lógica com Edição e 2ª Via no Histórico
 */

let historicoAutos = [];
let indiceEdicao = null; 

function mudarAba(abaId) {
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('active'));
    const selecionada = document.getElementById('aba-' + abaId);
    if (selecionada) {
        selecionada.classList.add('active');
        window.scrollTo(0, 0); 
    }
    
    if (abaId === 'form' && indiceEdicao === null) {
        document.getElementById('talao-form').reset();
        const numDoc = document.getElementById('num-auto-doc');
        if (numDoc) numDoc.innerText = "";
        
        // Retorna a área de texto ao tamanho normal para um Novo Auto
        const textarea = document.getElementById('desc_infracao');
        if (textarea) textarea.style.height = '';
    }
}

function exibirAlerta(titulo, mensagem, tipo = 'erro') {
    const modal = document.getElementById('custom-alert');
    document.getElementById('alert-icon').innerText = tipo === 'erro' ? '⚠️' : '✅';
    document.getElementById('alert-title').innerText = titulo;
    document.getElementById('alert-message').innerText = mensagem;
    modal.className = 'modal-alert ' + (tipo === 'erro' ? 'alerta-erro' : 'alerta-sucesso');
    modal.style.display = 'block';
}

function fecharAlerta() {
    document.getElementById('custom-alert').style.display = 'none';
}

function finalizarAuto() {
    const camposObrigatorios = [
        'categoria_transporte', 'modelo', 'placa', 
        'empresa', 'cnh', 'cat_cnh', 'local', 'data', 'hora',
        'amparo_ato', 'fiscal_nome', 'fiscal_matricula'
    ];

    let erros = [];

    camposObrigatorios.forEach(id => {
        const campo = document.getElementById(id);
        if (!campo || !campo.value.trim()) {
            erros.push(id);
            if (campo) campo.style.borderBottom = "2px solid #d63031";
        } else {
            if (campo) campo.style.borderBottom = "1px solid #000";
        }
    });

    const infracao = document.querySelector('input[name="infracao"]:checked');
    if (!infracao) return exibirAlerta("Seção 04 Pendente", "Selecione uma infração.", "erro");

    if (erros.length > 0) {
        return exibirAlerta("Auto Incompleto", "Preencha todos os campos destacados. (Nº da Ordem é opcional)", "erro");
    }

    const autoCompleto = {
        categoria_transporte: document.getElementById('categoria_transporte').value,
        modelo: document.getElementById('modelo').value,
        marca: document.getElementById('marca').value || '',
        placa: document.getElementById('placa').value.toUpperCase(),
        num_ordem: document.getElementById('num_ordem').value || '',
        linha: document.getElementById('linha').value || '',
        cod_linha: document.getElementById('cod_linha').value || '',
        tp: document.getElementById('tp').value || '',
        empresa: document.getElementById('empresa').value,
        cnh: document.getElementById('cnh').value,
        cat_cnh: document.getElementById('cat_cnh').value,
        local: document.getElementById('local').value,
        data: document.getElementById('data').value,
        hora: document.getElementById('hora').value,
        infracao: infracao.value,
        desc_infracao: document.getElementById('desc_infracao').value || '',
        veiculo_recolhido: document.getElementById('veiculo_recolhido').checked,
        infrator_notificado: document.getElementById('infrator_notificado').checked,
        amparo_ato: document.getElementById('amparo_ato').value,
        amparo_artigos: document.getElementById('amparo_artigos').value || '',
        amparo_incisos: document.getElementById('amparo_incisos').value || '',
        fiscal_nome: document.getElementById('fiscal_nome').value,
        fiscal_matricula: document.getElementById('fiscal_matricula').value,
        infrator_nome: document.getElementById('infrator_nome').value || ''
    };

    if (indiceEdicao !== null) {
        autoCompleto.idTalao = historicoAutos[indiceEdicao].idTalao; 
        historicoAutos[indiceEdicao] = autoCompleto;
        indiceEdicao = null; 
        exibirAlerta("Atualizado!", "O auto foi atualizado com sucesso no histórico.", "sucesso");
    } else {
        autoCompleto.idTalao = "T" + String(historicoAutos.length + 1).padStart(4, '0');
        historicoAutos.push(autoCompleto);
        exibirAlerta("Sucesso!", "Auto registrado. Você pode imprimi-lo na aba Histórico.", "sucesso");
    }

    atualizarTabela();
    
    setTimeout(() => {
        document.getElementById('talao-form').reset();
        const numDoc = document.getElementById('num-auto-doc');
        if (numDoc) numDoc.innerText = ""; 
        camposObrigatorios.forEach(id => {
            const campo = document.getElementById(id);
            if (campo) campo.style.borderBottom = "1px solid #000";
        });
        mudarAba('lista');
    }, 1500);
}

function atualizarTabela() {
    const corpo = document.getElementById('lista-corpo');
    if (!corpo) return;

    corpo.innerHTML = historicoAutos.map((a, index) => `
        <tr>
            <td><strong style="color: #d63031; font-size: 1.1rem;">${a.idTalao}</strong></td>
            <td><strong>${a.placa}</strong></td>
            <td>${formatarData(a.data)} às ${a.hora}</td>
            <td>${a.infracao}</td>
            <td>${a.fiscal_nome}</td> 
            <td class="no-print">
                <button onclick="editarAuto(${index})" class="btn-acao btn-editar">✏️ Editar</button>
                <button onclick="imprimirAuto(${index})" class="btn-acao btn-imprimir">🖨️ 2ª Via</button>
            </td>
        </tr>
    `).join('');
}

function carregarNoFormulario(index) {
    const auto = historicoAutos[index];
    
    const numDoc = document.getElementById('num-auto-doc');
    if (numDoc) {
        numDoc.innerText = auto.idTalao ? "AIT Nº " + auto.idTalao : "";
    }
    
    const camposTexto = [
        'categoria_transporte', 'modelo', 'marca', 'placa', 'num_ordem', 'linha', 'cod_linha', 'tp',
        'empresa', 'cnh', 'cat_cnh', 'local', 'data', 'hora', 'desc_infracao',
        'amparo_ato', 'amparo_artigos', 'amparo_incisos', 'fiscal_nome', 'fiscal_matricula', 'infrator_nome'
    ];
    
    camposTexto.forEach(id => {
        if(document.getElementById(id)) document.getElementById(id).value = auto[id];
    });

    const radios = document.getElementsByName('infracao');
    radios.forEach(r => r.checked = (r.value === auto.infracao));

    document.getElementById('veiculo_recolhido').checked = auto.veiculo_recolhido;
    document.getElementById('infrator_notificado').checked = auto.infrator_notificado;
}

function editarAuto(index) {
    indiceEdicao = index; 
    mudarAba('form');     
    carregarNoFormulario(index); 
    exibirAlerta("Modo de Edição", "Faça as correções e clique em Finalizar.", "sucesso");
}

function imprimirAuto(index) {
    mudarAba('form'); 
    carregarNoFormulario(index); 
    
    setTimeout(() => {
        const textarea = document.getElementById('desc_infracao');
        if (textarea) {
            textarea.style.height = 'auto'; 
            textarea.style.height = (textarea.scrollHeight + 5) + 'px'; 
        }

        window.print();
    }, 800); 
}

function formatarData(dataISO) {
    if (!dataISO) return "";
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}