let historicoAutos = [];

function mudarAba(abaId) {
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('active'));
    const selecionada = document.getElementById('aba-' + abaId);
    if (selecionada) selecionada.classList.add('active');
}

function finalizarAuto() {
    // Lista completa de IDs para validação rigorosa
    const camposId = [
        'categoria_transporte', 'modelo', 'placa', 'num_ordem', 
        'empresa', 'cnh', 'cat_cnh', 'local', 'data', 'hora',
        'amparo_ato', 'fiscal_nome', 'fiscal_matricula'
    ];

    let erros = [];

    // Validação de preenchimento
    camposId.forEach(id => {
        const campo = document.getElementById(id);
        if (!campo || !campo.value.trim()) {
            erros.push(id);
            if (campo) campo.style.borderBottom = "2px solid #d63031";
        } else {
            if (campo) campo.style.borderBottom = "1px solid #000";
        }
    });

    // Validação da Seção 04 (Radio)
    const infracao = document.querySelector('input[name="infracao"]:checked');
    if (!infracao) {
        erros.push("Seleção da Infração");
        alert("⚠️ Selecione uma infração na Seção 04.");
        return;
    }

    if (erros.length > 0) {
        alert("⚠️ ATENÇÃO: Preencha todos os campos destacados para validar o auto.");
        return;
    }

    // Gravação no histórico da aula
    const auto = {
        placa: document.getElementById('placa').value.toUpperCase(),
        data: document.getElementById('data').value,
        hora: document.getElementById('hora').value,
        infracao: infracao.value,
        fiscal: document.getElementById('fiscal_nome').value
    };

    historicoAutos.push(auto);
    atualizarTabela();
    
    alert("✅ Auto validado e registrado!");
    window.print();
    document.getElementById('talao-form').reset();
}

function atualizarTabela() {
    const corpo = document.getElementById('lista-corpo');
    if (!corpo) return;
    corpo.innerHTML = historicoAutos.map(a => `
        <tr>
            <td>${a.placa}</td>
            <td>${a.data} às ${a.hora}</td>
            <td>${a.infracao}</td>
            <td>${a.fiscal}</td>
        </tr>
    `).join('');
}