// ===== CONFIGURAÇÕES DO SITE (carregadas da planilha) =====

console.log("🔄 Carregando configuracoes.js...");

// Cache das configurações
let configCache = null;
let integrantesCache = null;

// Função para converter link do Google Drive
function converterLinkGoogleDrive(link, tamanho = "w400") {
    if (!link) return "";
    if (link.includes("placehold.co") || link.includes("imgur.com")) return link;
    
    let id = null;
    let match = link.match(/\/file\/d\/([^\/]+)/);
    if (match) id = match[1];
    if (!id) match = link.match(/[?&]id=([^&]+)/);
    if (match) id = match[1];
    if (!id) match = link.match(/thumbnail\?id=([^&]+)/);
    if (match) id = match[1];
    
    if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=${tamanho}`;
    return link;
}

// Função para parse de CSV
function parseCSV(texto) {
    const linhas = texto.split("\n").filter(l => l.trim() !== "");
    if (linhas.length < 2) return {};
    
    const resultado = {};
    for (let i = 1; i < linhas.length; i++) {
        const valores = [];
        let temp = "";
        let dentroAspas = false;
        
        for (let char of linhas[i]) {
            if (char === '"') {
                dentroAspas = !dentroAspas;
            } else if (char === "," && !dentroAspas) {
                valores.push(temp.trim());
                temp = "";
            } else {
                temp += char;
            }
        }
        valores.push(temp.trim());
        
        const chave = valores[0]?.replace(/^"|"$/g, "").trim();
        const valor = valores[1]?.replace(/^"|"$/g, "").trim();
        if (chave && valor) {
            resultado[chave] = valor;
        }
    }
    return resultado;
}

// Carregar configurações da planilha
async function carregarConfiguracoes() {
    if (configCache) return configCache;
    
    try {
        console.log("📡 Buscando configurações da planilha...");
        const resposta = await fetch(CONFIG_URL);
        const texto = await resposta.text();
        const config = parseCSV(texto);
        
        configCache = { ...FALLBACK_CONFIG, ...config };
        console.log("✅ Configurações carregadas:", configCache);
        return configCache;
        
    } catch (error) {
        console.error("❌ Erro ao carregar configurações:", error);
        configCache = FALLBACK_CONFIG;
        return configCache;
    }
}

// Carregar integrantes da planilha
async function carregarIntegrantes() {
    if (integrantesCache) return integrantesCache;
    
    try {
        console.log("📡 Buscando integrantes da planilha...");
        const resposta = await fetch(INTEGRANTES_URL);
        const texto = await resposta.text();
        
        const linhas = texto.split("\n").filter(l => l.trim() !== "");
        if (linhas.length < 2) return [];
        
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
        
        const integrantes = [];
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
            
            const integrante = {};
            cabecalhos.forEach((cabecalho, idx) => {
                integrante[cabecalho] = valores[idx]?.replace(/^"|"$/g, "") || "";
            });
            
            if (integrante.Status === "ativo" && integrante.Nome) {
                integrantes.push(integrante);
            }
        }
        
        integrantesCache = integrantes;
        console.log(`✅ ${integrantes.length} integrantes carregados`);
        return integrantes;
        
    } catch (error) {
        console.error("❌ Erro ao carregar integrantes:", error);
        return [];
    }
}

// Função para obter uma configuração específica
async function getConfig(chave) {
    const config = await carregarConfiguracoes();
    return config[chave] || "";
}

console.log("✅ configuracoes.js carregado!");