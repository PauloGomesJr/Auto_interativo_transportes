/**
 * SIMULADOR DE AUTO DE INFRAÇÃO - AMMPLA
 * Desenvolvido para fins didáticos.
 */

let historicoAutos = [];

/**
 * Gerencia a troca de abas da aplicação
 */
function mudarAba(abaId) {
    // Remove classe ativa de todas as abas
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('active'));
    // Ativa a aba selecionada
    document.getElementById('aba-' + abaId).classList.add('active');
}

/**
 * Validação e Processamento do Auto
 */
function finalizarAuto() {
    // Lista de campos obrigatórios conforme o modelo AMMPLA
    const obrigatorios = [
        { id: 'categoria_transporte', nome: 'Categoria do Transporte' },
        { id: 'placa', nome: 'Placa do Veículo' },
        { id: 'num_ordem', nome: 'Nº da Ordem' },
        { id: 'empresa', nome: 'Empresa/Condutor' },
        { id: 'local', nome: 'Local da Infração' },
        { id: 'data', nome: 'Data' },
        { id: 'hora', nome: 'Hora' },
        { id: 'amparo_ato', nome: 'Amparo Legal (Ato)' },
        { id: 'fiscal_nome', nome: 'Nome do Fiscal' },
        { id: 'fiscal_matricula', nome: 'Matrícula do Fiscal' }
    ];

    let erros = [];

    // 1. Validar campos de texto e select
    obrigatorios.forEach(campo => {
        const input = document.getElementById(campo.id);
        if (!input.value.trim()) {
            erros.push(campo.nome);
            input.parentElement.style.color = "red"; // Alerta visual no label
        } else {
            input.parentElement.style.color = "inherit";
        }
    });

    // 2. Validar se uma infração foi selecionada (Radio Button)
    const infracaoCheck = document.querySelector('input[name="infracao"]:checked');
    if (!infracaoCheck) {
        erros.push("Seleção da Infração (Seção 04)");
    }

    // 3. Exibir alertas se houver erros
    if (erros.length > 0) {
        alert("⚠️ ATENÇÃO: Campos obrigatórios não preenchidos!\n\n- " + erros.join("\n- "));
        return;
    }

    // 4. Se validado, salvar objeto no histórico
    const autoAtual = {
        placa: document.getElementById('placa').value.toUpperCase(),
        data: document.getElementById('data').value,
        hora: document.getElementById('hora').value,
        infracao: infracaoCheck.value,
        fiscal: document.getElementById('fiscal_nome').value
    };

    historicoAutos.push(autoAtual);
    atualizarTabela();

    // 5. Feedback de sucesso e impressão
    alert("✅ Auto validado e registrado no histórico!");
    window.print();
    
    // Limpar formulário para o próximo aluno
    document.getElementById('talao-form').reset();
}

/**
 * Atualiza a tabela de histórico na Aba 2
 */
function atualizarTabela() {
    const corpoTabela = document.getElementById('lista-corpo');
    corpoTabela.innerHTML = ""; // Limpa para renderizar atualizado

    historicoAutos.forEach(auto => {
        const linha = `
            <tr>
                <td><strong>${auto.placa}</strong></td>
                <td>${formatarData(auto.data)} - ${auto.hora}</td>
                <td>${auto.infracao}</td>
                <td>${auto.fiscal}</td>
            </tr>
        `;
        corpoTabela.innerHTML += linha;
    });
}

/**
 * Auxiliar para formatar data BR
 */
function formatarData(dataISO) {
    if(!dataISO) return "";
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}