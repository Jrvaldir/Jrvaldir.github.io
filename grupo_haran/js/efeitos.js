// ===== EFEITOS DE CINEMA E MOUSE (CORRIGIDO) =====

// Aguarda o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    
    // Verifica se não é dispositivo móvel
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    if (!isMobile) {
        
        // Cria os elementos do cursor
        const cursorDot = document.createElement('div');
        const cursorRing = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        cursorRing.className = 'cursor-ring';
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorRing);
        
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;
        let dotX = 0, dotY = 0;
        
        // Atualiza posição do mouse
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Ponto segue exatamente o mouse
            cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
            
            // Efeito de rastro (opcional - pode remover se quiser)
            if (Math.random() > 0.9) { // reduz a quantidade de rastros
                const trail = document.createElement('div');
                trail.className = 'trail';
                trail.style.left = (mouseX - 3) + 'px';
                trail.style.top = (mouseY - 3) + 'px';
                document.body.appendChild(trail);
                setTimeout(() => trail.remove(), 500);
            }
        });
        
        // Anima o anel com suavidade
        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
            requestAnimationFrame(animateRing);
        }
        animateRing();
        
        // Efeito de hover em elementos interativos
        const interactiveElements = document.querySelectorAll('a, button, .card-botao, .card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorRing.style.width = '60px';
                cursorRing.style.height = '60px';
                cursorRing.style.borderColor = '#FFD700';
                cursorRing.style.opacity = '1';
                cursorRing.style.boxShadow = '0 0 15px var(--dourado)';
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.style.width = '40px';
                cursorRing.style.height = '40px';
                cursorRing.style.borderColor = 'var(--dourado)';
                cursorRing.style.opacity = '0.8';
                cursorRing.style.boxShadow = 'none';
            });
        });
    }
    
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
    
    // Remove rastros antigos periodicamente (para não acumular)
    setInterval(() => {
        const trails = document.querySelectorAll('.trail');
        if (trails.length > 50) {
            for (let i = 0; i < 20; i++) {
                if (trails[i]) trails[i].remove();
            }
        }
    }, 5000);
    
    console.log('🎬 Efeitos de cinema carregados!');
});