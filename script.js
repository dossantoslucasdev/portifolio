// Menu hambúrguer functionality
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Fechar menu mobile se estiver aberto
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Fechar menu mobile ao clicar fora
    document.addEventListener('click', function(e) {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Efeito de scroll no header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(10, 10, 15, 0.98)';
        } else {
            header.style.background = 'rgba(10, 10, 15, 0.95)';
        }
    });

    // Intersection Observer para animar elementos quando entram na viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animar categorias de habilidades
                if (entry.target.classList.contains('skill-category')) {
                    entry.target.classList.add('animate');
                }
                
                // Animar outros elementos se necessário
                if (entry.target.classList.contains('project-card') || 
                    entry.target.classList.contains('article-card')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, observerOptions);

    // Observar categorias de habilidades
    document.querySelectorAll('.skill-category').forEach(category => {
        observer.observe(category);
    });

    // Observar cards de projetos e artigos
    document.querySelectorAll('.project-card, .article-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.8s ease-out';
        observer.observe(card);
    });

    // Função para verificar se um elemento está na viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Animar elementos quando a página carrega
    setTimeout(() => {
        document.querySelectorAll('.skill-category').forEach(category => {
            if (isInViewport(category)) {
                category.classList.add('animate');
            }
        });
    }, 100);

    // Função para abrir o cliente de e-mail
    function openEmailClient() {
        const email = 'dossantoslucasdev@gmail.com';
        const subject = 'Contato via Portfólio';
        const body = 'Olá! Vi seu portfólio e gostaria de entrar em contato...';
        
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink);
    }

    // Adicionar evento ao botão de e-mail
    const emailButton = document.querySelector('.email-button');
    if (emailButton) {
        emailButton.addEventListener('click', openEmailClient);
    }

    // Função para abrir links de redes sociais em nova aba
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                window.open(href, '_blank');
            }
        });
    });
});

// Exibir repositórios do GitHub na section projetos
document.addEventListener('DOMContentLoaded', function() {
    const githubUser = 'DosSantosLucasDev';
    const projectsContainer = document.getElementById('github-projects');

    if (!projectsContainer) {
        console.warn('Elemento #github-projects não encontrado');
        return;
    }

    console.log('Iniciando busca de repositórios do GitHub para:', githubUser);

    // Buscar os repositórios públicos
    fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=6`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(repos => {
            console.log('Repositórios encontrados:', repos.length);
            
            if (!repos || repos.length === 0) {
                projectsContainer.innerHTML = '<p>Nenhum repositório encontrado.</p>';
                return;
            }

            projectsContainer.innerHTML = repos.map((repo, index) => {
                // Gerar cor consistente baseada no índice
                const hue = (index * 60) % 360;
                const bgColor = `hsl(${hue}, 70%, 50%)`;
                
                return `
                    <div class="github-project-card">
                        <div class="github-project-header">
                           
                            <div class="github-project-info">
                                <h4 class="github-project-name">${repo.name}</h4>
                                <p class="github-project-description">${repo.description || 'Sem descrição'}</p>
                            </div>
                        </div>
                        <div class="github-project-meta">
                            <div class="github-project-tech">
                                ${repo.language ? `<span class="github-tech-tag">${repo.language}</span>` : ''}
                                <span class="github-stars">⭐ ${repo.stargazers_count}</span>
                            </div>
                            <a href="${repo.html_url}" target="_blank" class="github-repo-button">
                                Ver repositório
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                `;
            }).join('');
            
            console.log('Repositórios carregados com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao buscar repositórios:', error);
            projectsContainer.innerHTML = `
                <p style="grid-column: 1 / -1; text-align: center; color: #ff6b6b;">
                    Não foi possível carregar os repositórios do GitHub. 
                    <br>Erro: ${error.message}
                </p>
            `;
        });
});

// Função para copiar e-mail para a área de transferência
function copyEmail() {
    const email = 'dossantoslucasdev@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
        // Mostrar feedback visual
        const emailButton = document.querySelector('.email-button');
        if (emailButton) {
            const originalText = emailButton.innerHTML;
            emailButton.innerHTML = '✓ E-mail Copiado!';
            emailButton.style.background = 'var(--accent)';
            emailButton.style.color = 'white';
            
            setTimeout(() => {
                emailButton.innerHTML = originalText;
                emailButton.style.background = '';
                emailButton.style.color = '';
            }, 2000);
        }
    }).catch(err => {
        console.error('Erro ao copiar e-mail:', err);
        // Fallback para navegadores mais antigos
        openEmailClient();
    });
}


