// js/include.js
console.log("✅ include.js carregado!");

// Links padrão (fallback) - apenas se não estiverem no config.js
const DEFAULT_LINKS = {
    instagram: "https://instagram.com/harangrupodedanca",
    facebook: "https://facebook.com/harangrupodedanca",
    whatsapp: "https://wa.me/5581999999999",
    youtube: "https://youtube.com/@harangrupodedanca"
};

async function loadComponent(id, url) {
    try {
        console.log(`Carregando ${url}...`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const html = await response.text();
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.innerHTML = html;
            console.log(`✅ ${url} carregado com sucesso!`);
            return true;
        } else {
            console.error(`Elemento com id '${id}' não encontrado`);
            return false;
        }
    } catch (error) {
        console.error(`Erro ao carregar ${url}:`, error);
        return false;
    }
}

async function carregarRedesSociais() {
    try {
        console.log("Buscando redes sociais da planilha...");
        
        // Usa a CONFIG_URL que já está definida no config.js
        if (typeof CONFIG_URL === 'undefined') {
            console.error("CONFIG_URL não definida no config.js");
            return;
        }
        
        const response = await fetch(CONFIG_URL);
        const texto = await response.text();
        
        const linhas = texto.split("\n").filter(l => l.trim() !== "");
        const config = {};
        
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
            
            const chave = valores[0]?.replace(/^"|"$/g, "");
            const valor = valores[1]?.replace(/^"|"$/g, "");
            if (chave && valor) {
                config[chave] = valor;
            }
        }
        
        // Processa WhatsApp
        let whatsappLink = config.whatsapp || DEFAULT_LINKS.whatsapp;
        if (config.telefone && !config.whatsapp) {
            const numeros = config.telefone.replace(/\D/g, '');
            if (numeros.length >= 10) {
                whatsappLink = `https://wa.me/55${numeros}`;
            }
        }
        
        const links = {
            instagram: config.instagram || DEFAULT_LINKS.instagram,
            facebook: config.facebook || DEFAULT_LINKS.facebook,
            whatsapp: whatsappLink,
            youtube: config.youtube || DEFAULT_LINKS.youtube
        };
        
        // Atualiza footer
        const instagramEl = document.getElementById('footer-instagram');
        const facebookEl = document.getElementById('footer-facebook');
        const whatsappEl = document.getElementById('footer-whatsapp');
        const youtubeEl = document.getElementById('footer-youtube');
        
        if (instagramEl) instagramEl.href = links.instagram;
        if (facebookEl) facebookEl.href = links.facebook;
        if (whatsappEl) whatsappEl.href = links.whatsapp;
        if (youtubeEl) youtubeEl.href = links.youtube;
        
        console.log("✅ Redes sociais atualizadas:", links);
        
    } catch (error) {
        console.error("Erro ao carregar redes sociais:", error);
    }
}

// Carrega tudo na ordem
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM carregado, iniciando carregamento dos componentes...");
    
    // Carrega header
    await loadComponent('header-placeholder', 'components/header.html');
    
    // Carrega footer
    await loadComponent('footer-placeholder', 'components/footer.html');
    
    // Atualiza redes sociais
    await carregarRedesSociais();
    
    console.log("✅ Todos os componentes carregados!");
});