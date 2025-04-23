document.addEventListener('DOMContentLoaded', () => {
    // Инициализация кастомного курсора
    const cursor = document.querySelector('.cursor-follower');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    }

    // Инициализация анимации печатающего текста
    if (document.querySelector('.typing-animation')) {
        new Typed('.typing-animation', {
            strings: ['разработчик', 'Java-эксперт', 'фрилансер'],
            typeSpeed: 50,
            backSpeed: 30,
            loop: true,
            showCursor: false
        });
    }

    // Параллакс эффект
    const parallaxElements = document.querySelectorAll('.parallax');
    if (parallaxElements.length > 0) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.1;
                el.style.transform = `translate(${x * speed * 100}px, ${y * speed * 100}px)`;
            });
        });
    }

    // Загрузка проектов при переходе на страницу works
    if (window.location.pathname.includes('works')) {
        loadProjects();
        setupFilterButtons();
    }

    // Инициализация модального окна
    initModal();
});

// Загрузка проектов из API
async function loadProjects() {
    try {
        const response = await fetch('/api/works');
        if (!response.ok) throw new Error('Ошибка сети');
        
        const projects = await response.json();
        renderProjects(projects);
    } catch (error) {
        console.error('Ошибка загрузки проектов:', error);
        showErrorNotification('Не удалось загрузить проекты');
    }
}

// Рендеринг проектов
function renderProjects(projects) {
    const grid = document.getElementById('works-grid');
    if (!grid) return;

    grid.innerHTML = '';
    
    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'work-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="work-image" style="background-image: url(images/${project.images?.[0] || 'images/default.jpg'})"></div>
            <div class="work-content">
                <h3>${project.title || 'Без названия'}</h3>
                <p>${project.description || 'Описание отсутствует'}</p>
                <div class="work-buttons">
                    <a href="${project.githubUrl}" class="btn primary-btn hover-effect" target="_blank">
                        GitHub
                    </a>
                    <button class="btn outline-btn hover-effect view-details" data-project-id="${project.id}">
                        Подробнее
                        <span class="btn-arrow">→</span>
                    </button>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Фильтрация проектов
function setupFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', async () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            try {
                const tag = btn.dataset.filter;
                const response = await fetch(`/api/works?tag=${tag}`);
                const projects = await response.json();
                renderProjects(projects);
            } catch (error) {
                console.error('Ошибка фильтрации:', error);
            }
        });
    });
}

// Инициализация модального окна
function initModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close');

    // Открытие модального окна
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.view-details')) {
            const projectId = e.target.closest('.view-details').dataset.projectId;
            await openProjectModal(projectId);
        }
    });

    // Закрытие модального окна
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Загрузка данных для модального окна
async function openProjectModal(projectId) {
    try {
        const response = await fetch(`/api/works/${projectId}`);
        if (!response.ok) throw new Error('Проект не найден');
        
        const project = await response.json();
        fillModalContent(project);
        
        const modal = document.getElementById('project-modal');
        modal.style.display = 'flex';
    } catch (error) {
        console.error('Ошибка загрузки проекта:', error);
        showErrorNotification('Не удалось загрузить данные проекта');
    }
}

// Заполнение модального окна данными
function fillModalContent(project) {
    const title = document.getElementById('modal-title');
    const description = document.getElementById('modal-description');
    const techTags = document.querySelector('.tech-tags');
    const mainImage = document.querySelector('.main-image');
    const thumbnails = document.querySelector('.thumbnails');
    const reviewsList = document.getElementById('reviews-list');
    const githubLink = document.getElementById('github-link');

    // Основная информация
    title.textContent = project.title || 'Без названия';
    description.textContent = project.description || 'Описание отсутствует';
    
    // Технологии
    techTags.innerHTML = '';
    project.tags?.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = tag;
        techTags.appendChild(span);
    });

    // Изображения
    if (project.images?.length > 0) {
        mainImage.style.backgroundImage = `url(${project.images[0]})`;
        thumbnails.innerHTML = '';
        
        project.images.forEach(img => {
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail';
            thumb.style.backgroundImage = `url(${img})`;
            thumb.addEventListener('click', () => {
                mainImage.style.backgroundImage = `url(${img})`;
            });
            thumbnails.appendChild(thumb);
        });
    }

    // Отзывы
    reviewsList.innerHTML = '';
    project.reviews?.forEach(review => {
        const div = document.createElement('div');
        div.className = 'review';
        div.textContent = review;
        reviewsList.appendChild(div);
    });

    // Ссылка на GitHub
    if (githubLink) {
        githubLink.href = project.githubUrl;
    }
}

// Показать уведомление об ошибке
function showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Анимация кнопок
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Эффект пульсации
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        const rect = this.getBoundingClientRect();
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', function(e) {
        e.preventDefault();
        const targetPage = this.dataset.tab === 'login' ? '/login' : '/reg';

        // Обновляем URL без перезагрузки страницы
        history.pushState({}, '', targetPage);

        // Принудительно перезагружаем страницу для применения изменений
        window.location.reload();
    });
});

// После загрузки страницы активируем нужную форму
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const activeForm = path.includes('/reg') ? 'register' : 'login';

    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
        if (form.id === `${activeForm}Form`) form.classList.add('active');
    });

    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === activeForm) tab.classList.add('active');
    });
});