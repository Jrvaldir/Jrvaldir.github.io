// ===== EFEITOS DO SITE (sem cursor personalizado) =====

console.log("🎬 Efeitos carregados!");

document.addEventListener('DOMContentLoaded', function() {
    
    // Animação de revelação para cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.setProperty('--i', index);
    });
    
    // Efeito de parallax suave no banner
    const banner = document.querySelector('.banner');
    if (banner) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            banner.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
        });
    }
    
    // Adiciona classe de revelação aos elementos
    const revealElements = document.querySelectorAll('.section-title, .card, .banner h1');
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });
    
    console.log('✅ Efeitos de animação carregados!');
});