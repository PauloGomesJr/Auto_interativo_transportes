function finalizarAuto() {
    const camposObrigatorios = [
        { id: 'categoria_transporte', nome: '01. Categoria do Transporte' },
        { id: 'modelo', nome: '01. Modelo' },
        { id: 'placa', nome: '01. Placa' },
        { id: 'num_ordem', nome: '01. Nº da Ordem' },
        { id: 'empresa', nome: '02. Empresa/Condutor' },
        { id: 'local', nome: '03. Local da Infração' },
        { id: 'data', nome: '03. Data' },
        { id: 'hora', nome: '03. Hora' },
        { id: 'empresa', nome: '02. Empresa/Autorizatário/Condutor' },
        { id: 'cnh', nome: '02. CNH' },
        { id: 'cat_cnh', nome: '02. Categoria da CNH' }
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

    const infracaoSelecionada = document.querySelector('input[name="infracao"]:checked');
    const descricaoTexto = document.getElementById('desc_infracao').value.trim();

    if (!infracaoSelecionada) {
        alert("⚠️ ERRO: Nenhuma infração foi selecionada na Seção 04.");
        return;
    }

    if (infracaoSelecionada.value === "Outros" && descricaoTexto === "") {
        alert("⚠️ ERRO: Você selecionou 'Outros', mas não descreveu a infração.");
        return;
    }

    // Se tudo estiver OK, salvar e imprimir
    registrarEImprimir();
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