// js/include.js
// Função para carregar componentes HTML

async function loadComponent(id, url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        document.getElementById(id).innerHTML = html;
    } catch (error) {
        console.error(`Erro ao carregar ${url}:`, error);
    }
}

// Carrega o cabeçalho e rodapé em todas as páginas
document.addEventListener('DOMContentLoaded', () => {
    // Carrega o cabeçalho
    loadComponent('header-placeholder', 'components/header.html');
    
    // Carrega o rodapé
    loadComponent('footer-placeholder', 'components/footer.html');
});