function finalizarAuto() {
    const campos = [
        { id: 'placa', nome: 'Placa do Veículo' },
        { id: 'empresa', nome: 'Nome da Empresa/Condutor' },
        { id: 'local', nome: 'Local da Infração' },
        { id: 'data', nome: 'Data' },
        { id: 'tipificacao', nome: 'Tipificação da Infração' }
    ];

    let esquecidos = [];

    campos.forEach(campo => {
        const elemento = document.getElementById(campo.id);
        if (!elemento.value || elemento.value === "") {
            esquecidos.push(campo.nome);
            elemento.style.border = "2px solid red";
        } else {
            elemento.style.border = "1px solid #ccc";
        }
    });

    if (esquecidos.length > 0) {
        alert("ERRO DE PREENCHIMENTO:\nOs seguintes campos são obrigatórios:\n- " + esquecidos.join("\n- "));
    } else {
        alert("Auto validado com sucesso! Gerando comprovante para impressão.");
        salvarNaSessao();
        window.print();
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