console.log("✅ eventos.js carregado!");

// Função que converte qualquer link do Google Drive para o formato de imagem
function converterLinkGoogleDrive(link) {
    if (!link) return "https://placehold.co/600x400?text=Sem+Imagem";
    
    if (link.includes("placehold.co") || link.includes("imgur.com") || link.includes("i.ibb.co")) {
        return link;
    }
    
    let id = null;
    let match = link.match(/\/file\/d\/([^\/]+)/);
    if (match) id = match[1];
    
    if (!id) {
        match = link.match(/[?&]id=([^&]+)/);
        if (match) id = match[1];
    }
    
    if (!id) {
        match = link.match(/thumbnail\?id=([^&]+)/);
        if (match) id = match[1];
    }
    
    if (id) {
        return `https://drive.google.com/thumbnail?id=${id}&sz=w800`;
    }
    
    return link;
}

// Função principal para carregar eventos da planilha
async function carregarEventos() {
    try {
        console.log("1. Carregando planilha...");
        console.log("URL:", PLANILHA_URL);
        
        const resposta = await fetch(PLANILHA_URL);
        const texto = await resposta.text();
        
        console.log("2. CSV recebido. Primeiros 300 caracteres:");
        console.log(texto.substring(0, 300));
        
        const linhas = texto.split("\n").filter(l => l.trim() !== "");
        if (linhas.length < 2) {
            console.warn("Apenas cabeçalho, sem dados");
            return [];
        }
        
        // Pega cabeçalhos
        const cabecalhos = [];
        let temp = "";
        let dentroAspas = false;
        for (let char of linhas[0]) {
            if (char === '"') {
                dentroAspas = !dentroAspas;
            } else if (char === "," && !dentroAspas) {
                cabecalhos.push(temp.trim());
                temp = "";
            } else {
                temp += char;
            }
        }
        cabecalhos.push(temp.trim());
        
        for (let i = 0; i < cabecalhos.length; i++) {
            cabecalhos[i] = cabecalhos[i].replace(/^"|"$/g, "");
        }
        
        console.log("3. Cabeçalhos:", cabecalhos);
        
        const eventos = [];
        
        // Processa cada linha de dados
        for (let i = 1; i < linhas.length; i++) {
            const valores = [];
            let tempValor = "";
            let dentroAspas = false;
            
            for (let char of linhas[i]) {
                if (char === '"') {
                    dentroAspas = !dentroAspas;
                } else if (char === "," && !dentroAspas) {
                    valores.push(tempValor.trim());
                    tempValor = "";
                } else {
                    tempValor += char;
                }
            }
            valores.push(tempValor.trim());
            
            for (let j = 0; j < valores.length; j++) {
                valores[j] = valores[j].replace(/^"|"$/g, "");
            }
            
            if (valores.length >= 1 && valores[0] !== "") {
                const evento = {};
                cabecalhos.forEach((cabecalho, idx) => {
                    evento[cabecalho] = valores[idx] || "";
                });
                
                const status = evento["Status"] || "Ativo";
                const temId = evento["ID"] && evento["ID"] !== "";
                const temNome = evento["Nome do Evento"] && evento["Nome do Evento"] !== "";
                
                // Só adiciona se tiver ID (tudo preenchido) E status Ativo
                if (temId && temNome && status === "Ativo") {
                    eventos.push(evento);
                    console.log(`   Evento encontrado: ${evento["Nome do Evento"]} (ID: ${evento["ID"]})`);
                } else if (temNome && !temId) {
                    console.log(`   Evento incompleto (aguardando preenchimento): ${evento["Nome do Evento"]}`);
                } else if (temNome && status !== "Ativo") {
                    console.log(`   Evento ignorado (status: ${status}): ${evento["Nome do Evento"]}`);
                }
            }
        }
        
        console.log(`4. Total de eventos carregados: ${eventos.length}`);
        
        // Ordenação por ano e mês (mais novo primeiro)
        eventos.sort((a, b) => {
            const dataA = a["Data"] || "";
            const dataB = b["Data"] || "";
            
            function extrairAnoMes(dataStr) {
                let ano = 0;
                let mes = 0;
                
                const anoMatch = dataStr.match(/\d{4}/);
                if (anoMatch) ano = parseInt(anoMatch[0]);
                
                const meses = {
                    "janeiro": 1, "fevereiro": 2, "março": 3, "abril": 4,
                    "maio": 5, "junho": 6, "julho": 7, "agosto": 8,
                    "setembro": 9, "outubro": 10, "novembro": 11, "dezembro": 12
                };
                
                for (const [nome, num] of Object.entries(meses)) {
                    if (dataStr.toLowerCase().includes(nome)) {
                        mes = num;
                        break;
                    }
                }
                
                if (mes === 0) {
                    const mesMatch = dataStr.match(/(\d{1,2})\/\d{4}/);
                    if (mesMatch) mes = parseInt(mesMatch[1]);
                }
                
                return { ano, mes };
            }
            
            const dataObjA = extrairAnoMes(dataA);
            const dataObjB = extrairAnoMes(dataB);
            
            if (dataObjA.ano !== dataObjB.ano) {
                return dataObjB.ano - dataObjA.ano;
            }
            return dataObjB.mes - dataObjA.mes;
        });
        
        console.log("5. Eventos ordenados por data (mais novo primeiro)");
        eventos.forEach(e => console.log(`   - ${e["Nome do Evento"]}: ${e["Data"]}`));
        
        return eventos;
        
    } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        return [];
    }
}

// Função para exibir eventos na tela
function exibirEventos(eventos, containerId, limite = 0) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container '${containerId}' não encontrado`);
        return;
    }
    
    console.log(`Exibindo ${eventos.length} eventos em ${containerId}`);
    
    if (!eventos || eventos.length === 0) {
        container.innerHTML = `<div class="sem-eventos">📭 Nenhum evento cadastrado no momento. Aguarde novidades!</div>`;
        return;
    }
    
    const eventosExibir = limite > 0 ? eventos.slice(0, limite) : eventos;
    
    let html = '<div class="grid">';
    for (const evento of eventosExibir) {
        const titulo = evento["Nome do Evento"] || "Evento";
        const categoria = evento["Categoria"] || "Apresentação";
        const data = evento["Data"] || "";
        const local = evento["Local"] || "";
        const sinopse = evento["Sinopse/Descrição"] || evento["Descrição"] || "";
        
        let linkCapa = evento["Link da Capa"] || "https://placehold.co/600x400?text=Sem+Imagem";
        linkCapa = converterLinkGoogleDrive(linkCapa);
        
        html += `
            <div class="card">
                <img class="card-imagem" src="${linkCapa}" alt="${titulo}" loading="lazy" onerror="this.src='https://placehold.co/600x400?text=Imagem+Indisponível'">
                <div class="card-conteudo">
                    <span class="card-categoria">${categoria}</span>
                    <h2 class="card-titulo">${titulo}</h2>
                    ${data ? `<div class="card-info"><span>📅</span> ${data}</div>` : ""}
                    ${local ? `<div class="card-info"><span>📍</span> ${local}</div>` : ""}
                    ${sinopse ? `<div class="card-descricao">${sinopse.substring(0, 120)}${sinopse.length > 120 ? "..." : ""}</div>` : ""}
                    <a href="evento.html?evento=${encodeURIComponent(titulo)}" class="card-botao">📖 Ver detalhes</a>
                </div>
            </div>
        `;
    }
    html += '</div>';
    container.innerHTML = html;
}