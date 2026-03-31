function finalizarAuto() {
    // Mapeamento dos campos baseado no modelo físico da AMMPLA
    const camposObrigatorios = [
        { id: 'modelo', nome: '01. Modelo do Veículo' },
        { id: 'placa', nome: '01. Placa' },
        { id: 'empresa', nome: '02. Empresa/Condutor' },
        { id: 'local', nome: '03. Local da Infração' },
        { id: 'data', nome: '03. Data' },
        { id: 'hora', nome: '03. Hora' },
        { id: 'tipificacao', nome: '04. Tipificação da Infração' }
    ];

    let erros = [];

    // Limpa marcações de erro anteriores
    camposObrigatorios.forEach(campo => {
        document.getElementById(campo.id).style.border = "1px solid #ccc";
    });

    // Verificação campo a campo
    camposObrigatorios.forEach(campo => {
        const elemento = document.getElementById(campo.id);
        if (!elemento.value.trim()) {
            erros.push(campo.nome);
            elemento.style.border = "2px solid #e74c3c"; // Destaque em vermelho
        }
    });

    // Se houver erros, exibe o alerta e não prossegue
    if (erros.length > 0) {
        alert("⚠️ ATENÇÃO: AUTO INCOMPLETO\n\nO preenchimento do talão físico exige todos os dados para evitar nulidade. Faltam os seguintes campos:\n\n- " + erros.join("\n- "));
        return; // Interrompe a função aqui
    }

    // Se passar na validação
    confirmarRegistro();
}

function confirmarRegistro() {
    if (confirm("Todos os campos foram preenchidos corretamente. Deseja imprimir o comprovante e salvar na sessão?")) {
        salvarNaSessao();
        window.print();
        document.getElementById('talao-form').reset();
    }
}

function salvarNaSessao() {
    const resumo = {
        id: Date.now(),
        placa: document.getElementById('placa').value,
        infracao: document.getElementById('tipificacao').value,
        data: document.getElementById('data').value
    };
    
    let historico = JSON.parse(sessionStorage.getItem('autos')) || [];
    historico.push(resumo);
    sessionStorage.setItem('autos', JSON.stringify(historico));
}