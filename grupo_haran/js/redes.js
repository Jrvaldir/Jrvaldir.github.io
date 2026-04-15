// ===== REDES SOCIAIS E CONTATO (carregados da planilha) =====

async function carregarRedesSociais() {
    const config = await carregarConfiguracoes();
    
    const redes = {
        instagram: config.instagram || "#",
        facebook: config.facebook || "#",
        whatsapp: config.whatsapp || "#",
        youtube: config.youtube || "#",
        email: config.email || "",
        telefone: config.telefone || ""
    };
    
    // Atualiza os links no footer e contato
    const instagramLink = document.getElementById('link-instagram');
    const facebookLink = document.getElementById('link-facebook');
    const youtubeLink = document.getElementById('link-youtube');
    const whatsappLink = document.getElementById('link-whatsapp');
    const emailSpan = document.getElementById('email-contato');
    const telefoneSpan = document.getElementById('telefone-contato');
    
    if (instagramLink) instagramLink.href = redes.instagram;
    if (facebookLink) facebookLink.href = redes.facebook;
    if (youtubeLink) youtubeLink.href = redes.youtube;
    if (whatsappLink) whatsappLink.href = redes.whatsapp;
    if (emailSpan) emailSpan.innerHTML = redes.email;
    if (telefoneSpan) telefoneSpan.innerHTML = redes.telefone;
    
    return redes;
}

// Carrega as redes quando a página estiver pronta
document.addEventListener('DOMContentLoaded', () => {
    carregarRedesSociais();
});