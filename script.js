const valoresEnviados = JSON.parse(localStorage.getItem("valoresEnviados")) || [];

function adicionarValor() {
    const nubankValue = parseFloat(document.getElementById("nubankInput").value) || 0;
    const c6Value = parseFloat(document.getElementById("c6Input").value) || 0;
    const bbValue = parseFloat(document.getElementById("bbInput").value) || 0;
    const dailyExpensesValue = parseFloat(document.getElementById("dailyExpenses").value) || 0;

    const nubankComment = document.getElementById("nubankComment").value;
    const c6Comment = document.getElementById("c6Comment").value;
    const bbComment = document.getElementById("bbComment").value;
    const dailyExpensesComment = document.getElementById("dailyExpensesComment").value;

    if (nubankValue > 0) {
        const valorNubank = {
            tipo: "Nubank",
            valor: nubankValue,
            comentario: nubankComment,
        };
        valoresEnviados.push(valorNubank);
    }
    if (c6Value > 0) {
        const valorC6 = {
            tipo: "C6",
            valor: c6Value,
            comentario: c6Comment,
        };
        valoresEnviados.push(valorC6);
    }
    if (bbValue > 0) {
        const valorBB = {
            tipo: "Banco do Brasil",
            valor: bbValue,
            comentario: bbComment,
        };
        valoresEnviados.push(valorBB);
    }
    if (dailyExpensesValue > 0) {
        const valorDailyExpenses = {
            tipo: "Contas do dia-a-dia",
            valor: dailyExpensesValue,
            comentario: dailyExpensesComment,
        };
        valoresEnviados.push(valorDailyExpenses);
    }

    atualizarValoresEnviados();
    salvarValoresNoLocalStorage();
    limparCampos();
}

function atualizarValoresEnviados() {
    const tableBody = document.getElementById("valoresEnviados");
    tableBody.innerHTML = "";

    let totalDevido = 0;

    for (const valor of valoresEnviados) {
        totalDevido += valor.valor;

        const row = document.createElement("tr");
        const tipoCell = document.createElement("td");
        tipoCell.textContent = valor.tipo;
        tipoCell.classList.add("valor-tipo"); // Adicione a classe CSS
        const valorCell = document.createElement("td");
        valorCell.textContent = valor.valor.toFixed(2);
        valorCell.classList.add("valor-valor"); // Adicione a classe CSS
        const comentarioCell = document.createElement("td");
        comentarioCell.textContent = valor.comentario || "-";
        comentarioCell.classList.add("valor-comentario"); // Adicione a classe CSS

        row.appendChild(tipoCell);
        row.appendChild(valorCell);
        row.appendChild(comentarioCell);
        tableBody.appendChild(row);
    }

    document.getElementById("totalDevido").textContent = totalDevido.toFixed(2);
    limparCampos();
}

function limparCampos() {
    document.getElementById("nubankInput").value = "";
    document.getElementById("c6Input").value = "";
    document.getElementById("bbInput").value = "";
    document.getElementById("dailyExpenses").value = "";
    document.getElementById("nubankComment").value = "";
    document.getElementById("c6Comment").value = "";
    document.getElementById("bbComment").value = "";
    document.getElementById("dailyExpensesComment").value = "";
}

function salvarValoresNoLocalStorage() {
    localStorage.setItem("valoresEnviados", JSON.stringify(valoresEnviados));
    atualizarValoresEnviados();
    salvarValoresNoLocalStorage();
    limparCampos();
}

function renovarInformacoes() {
    localStorage.removeItem("valoresEnviados");
    valoresEnviados.length = 0;
    atualizarValoresEnviados();
}

function exportarValores() {
    const total = valoresEnviados.reduce((acumulador, valor) => acumulador + valor.valor, 0).toFixed(2);

    const exportData = valoresEnviados.map((valor) => {
        return `${valor.tipo}: ${valor.valor.toFixed(2)} - ${valor.comentario || ""}`;
    }).join("\n");

    const exportDataWithTotal = exportData + `\nTotal da dívida: ${total}`;

    const blob = new Blob([exportDataWithTotal], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "valores_enviados.txt";
    a.click();
    URL.revokeObjectURL(url);
}

function carregarValoresSalvos() {
    const totalDevidoElement = document.getElementById("totalDevido");
    const valoresEnviadosTable = document.getElementById("valoresEnviados");

    if (valoresEnviados.length > 0) {
        const tableBody = document.createElement("tbody");

        let totalDevido = 0;

        for (const valor of valoresEnviados) {
            totalDevido += valor.valor;

            const row = document.createElement("tr");
            const tipoCell = document.createElement("td");
            tipoCell.textContent = valor.tipo;
            tipoCell.classList.add("valor-tipo");
            const valorCell = document.createElement("td");
            valorCell.textContent = valor.valor.toFixed(2);
            valorCell.classList.add("valor-valor");
            const comentarioCell = document.createElement("td");
            comentarioCell.textContent = valor.comentario || "-";
            comentarioCell.classList.add("valor-comentario");

            row.appendChild(tipoCell);
            row.appendChild(valorCell);
            row.appendChild(comentarioCell);
            tableBody.appendChild(row);
        }

        // Limpa a tabela antes de adicionar os novos valores
        while (valoresEnviadosTable.firstChild) {
            valoresEnviadosTable.removeChild(valoresEnviadosTable.firstChild);
        }

        valoresEnviadosTable.appendChild(tableBody);
    }
}

carregarValoresSalvos();

document.addEventListener("DOMContentLoaded", adicionarValor);
