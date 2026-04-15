console.log("✅ config.js carregado com sucesso!");

// ===== LINKS DAS PLANILHAS (CSV) =====

// Link da planilha de EVENTOS (publicada como CSV)
var PLANILHA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQAnEvp2vlEz0mhHuIQw4OjNXTJuDRfXCGvOWpLfMEOcOYj7jXL5lCyC22UR5-Q5PXziNmUXIjFDI97/pub?gid=0&single=true&output=csv";

// Link da planilha de AGENDA (publicada como CSV)
var AGENDA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQAnEvp2vlEz0mhHuIQw4OjNXTJuDRfXCGvOWpLfMEOcOYj7jXL5lCyC22UR5-Q5PXziNmUXIjFDI97/pub?gid=1558274944&single=true&output=csv";

// Link da planilha de CONFIGURAÇÕES (aba "configuracoes") - CORRIGIDO
var CONFIG_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQAnEvp2vlEz0mhHuIQw4OjNXTJuDRfXCGvOWpLfMEOcOYj7jXL5lCyC22UR5-Q5PXziNmUXIjFDI97/pub?gid=667900171&single=true&output=csv";

// Link da planilha de INTEGRANTES (aba "integrantes") - CRIE ESTA ABA
var INTEGRANTES_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQAnEvp2vlEz0mhHuIQw4OjNXTJuDRfXCGvOWpLfMEOcOYj7jXL5lCyC22UR5-Q5PXziNmUXIjFDI97/pub?gid=1020801&single=true&output=csv";

console.log("URL eventos:", PLANILHA_URL);
console.log("URL agenda:", AGENDA_URL);
console.log("URL config:", CONFIG_URL);
console.log("URL integrantes:", INTEGRANTES_URL);

// ===== FALLBACKS (caso a planilha não carregue) =====
var FALLBACK_CONFIG = {
    email: "harangrupodedanca@gmail.com",
    telefone: "(81) 99999-9999",
    instagram: "https://instagram.com/harangrupodedanca",
    facebook: "https://facebook.com/harangrupodedanca",
    whatsapp: "https://wa.me/5581999999999",
    youtube: "https://youtube.com/@harangrupodedanca",
    logo_url: "/assets/images/logo-haran.png",
    banner_url: "",
    historia: "O Haran Grupo de Dança nasceu em 2015 na cidade de Bom Jardim - PE, com o propósito de levar arte, cultura e emoção através da dança teatral.",
    missao: "Levar arte e cultura através da dança, emocionando e inspirando públicos de todas as idades.",
    visao: "Ser referência em dança teatral na região.",
    valores: "Arte, Cultura, Emoção, Profissionalismo"
};

// Chave da API do Google Drive (para galeria de fotos)
var GOOGLE_DRIVE_API_KEY = "AIzaSyAv7dGI7IfkdBcaNtDWCBKRGSVgEShP4Is";