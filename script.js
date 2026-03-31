function finalizarAuto() {
    const camposObrigatorios = [
        { id: 'categoria_transporte', nome: '01. Categoria do Transporte' },
        { id: 'modelo', nome: '01. Modelo' },
        { id: 'placa', nome: '01. Placa' },
        { id: 'num_ordem', nome: '01. Nº da Ordem' },
        { id: 'empresa', nome: '02. Empresa/Condutor' },
        { id: 'local', nome: '03. Local da Infração' },
        { id: 'data', nome: '03. Data' },
        { id: 'hora', nome: '03. Hora' }
    ];

    let erros = [];

    camposObrigatorios.forEach(campo => {
        const elemento = document.getElementById(campo.id);
        if (!elemento.value.trim()) {
            erros.push(campo.nome);
            elemento.style.backgroundColor = "#ffeaa7"; // Destaque suave em amarelo
        } else {
            elemento.style.backgroundColor = "transparent";
        }
    });

    if (erros.length > 0) {
        alert("⚠️ ERRO DE PREENCHIMENTO\n\nTodos os campos de identificação devem ser preenchidos:\n\n- " + erros.join("\n- "));
        return;
    }

    // Se passar na validação, executa o restante...
    alert("Auto validado com sucesso!");
    salvarNaSessao();
    window.print();
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