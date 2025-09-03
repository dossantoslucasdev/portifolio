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

// Exibir repositórios "pinned" do GitHub na section projetos
document.addEventListener('DOMContentLoaded', function() {
    // const githubUser = 'DevDosSantosLucas';
    const githubUser = 'DevDosSantosLucasDev';
    const projectsContainer = document.getElementById('github-projects');

    if (projectsContainer) {
        // Usando a API GraphQL do GitHub para buscar os pinned repos
        fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer SEU_TOKEN_GITHUB', // Para mais de 60 req/hora, use um token
            },
            body: JSON.stringify({
                query: `{
                  user(login: "${githubUser}") {
                    pinnedItems(first: 6, types: REPOSITORY) {
                      nodes {
                        ... on Repository {
                          name
                          description
                          url
                          primaryLanguage { name }
                        }
                      }
                    }
                  }
                }`
            })
        })
        .then(res => res.json())
        .then(data => {
            const repos = data.data?.user?.pinnedItems?.nodes || [];
            if (repos.length === 0) {
                projectsContainer.innerHTML = '<p>Nenhum projeto fixado encontrado no GitHub.</p>';
                return;
            }
            projectsContainer.innerHTML = repos.map(repo => `
                <div class="project-card">
                    <img src="https://raw.githubusercontent.com/${githubUser}/${repo.name}/main/logo.png" alt="Imagem do Projeto do GitHub" class="project-image">
                    <h3 class="project-title">
                        <a href="${repo.url}" target="_blank">${repo.name}</a>
                    </h3>
                    <p class="project-description">${repo.description || 'Sem descrição.'}</p>
                    <div class="project-tech">
                        <span class="tech-tag">${repo.primaryLanguage?.name || 'N/A'}</span>
                    </div>
                </div>
            `).join('');
        })
        .catch(error => {
            projectsContainer.innerHTML = '<p>Não foi possível carregar os projetos fixados do GitHub.</p>';
            console.error(error);
        });
    }
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
