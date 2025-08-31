// --- FORCE SCROLL TO TOP ON REFRESH ---
// Uncomment the line below to force the page to scroll to the top every time it is refreshed.
history.scrollRestoration = 'manual';
// --- END ---

document.addEventListener('DOMContentLoaded', () => {
    // Script by Fairuz Aghna Mulya
    
    // Typing animation
    const typingTextElement = document.getElementById('typing-text');
    const words = [
      "Full-Stack Game Developer",
      "Creative Front-End Engineer",
      "UI/UX Design Specialist",
      "3D Interaction Developer",
      "Digital Product Designer",
      "Illustration & Graphic Designer",
      "Software Engineer for Games",
      "Interactive Systems Architect",
      "Realtime Graphics Engineer",
      "Visual Storytelling Expert"
    ];

    let wordIndex = 0, charIndex = 0, isDeleting = false;
    
    function type() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            typingTextElement.textContent = currentWord.substring(0, charIndex--);
            if (charIndex < 0) { 
                isDeleting = false; 
                wordIndex = (wordIndex + 1) % words.length; 
            }
        } else {
            typingTextElement.textContent = currentWord.substring(0, charIndex++);
            if (charIndex > currentWord.length) { 
                isDeleting = true; 
                setTimeout(type, 2000); 
                return; 
            }
        }
        setTimeout(type, isDeleting ? 75 : 150);
    }
    setTimeout(type, 500);

    // Intersection Observer for reveal animations and counters
    const observer = new IntersectionObserver(async (entries, observerInstance) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const target = entry.target;
                target.classList.add('visible');

                // If the visible element is the stats section, fetch, update, and then animate
                if (target.id === 'animated-stats') {
                    try {
                        // Fetch Projects Page
                        const projectResponse = await fetch('pages/projects/project.html');
                        const projectHTML = await projectResponse.text();
                        const projectDoc = new DOMParser().parseFromString(projectHTML, 'text/html');
                        const projectCount = projectDoc.querySelectorAll('.interactive-card').length;

                        // Fetch Certificates Page
                        const certResponse = await fetch('pages/certificate/certificate.html');
                        const certHTML = await certResponse.text();
                        const certDoc = new DOMParser().parseFromString(certHTML, 'text/html');
                        const certCount = certDoc.querySelectorAll('.interactive-card').length;

                        // Update data-target attributes
                        const projectCounter = target.querySelector('.project-counter');
                        const certCounter = target.querySelector('.cert-counter');

                        if (projectCounter) projectCounter.dataset.target = projectCount;
                        if (certCounter) certCounter.dataset.target = certCount;

                    } catch (error) {
                        console.error('Failed to fetch dynamic stats:', error);
                    }
                }
                
                // Handle counter animations for all stat-counters within the revealed section
                const counters = target.querySelectorAll('.stat-counter');
                counters.forEach(counter => {
                    if (counter.animated) return;
                    counter.animated = true;
                    
                    const targetValue = +counter.dataset.target;
                    let current = 0;
                    // Calculate increment dynamically, ensuring it's at least 1
                    const increment = Math.max(1, Math.ceil(targetValue / 100));
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < targetValue) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = targetValue;
                        }
                    };
                    
                    updateCounter();
                });

                // We've handled this entry, so we can unobserve it
                observerInstance.unobserve(target);
            }
        }
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Staggered animation for skill cards
    document.querySelectorAll('.skill-card').forEach((card, index) => {
        card.style.setProperty('--delay', `${index * 100}ms`);
    });
    
    // Modal functionality
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.modal-content');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTechContainer = document.getElementById('modal-tech-container');
    const modalIssuerContainer = document.getElementById('modal-issuer-container');
    const modalDownloadBtn = document.getElementById('modal-download-btn');

    // Open modal handler
    document.querySelectorAll('.open-modal-btn').forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.interactive-card');
            const modalType = card.dataset.modalType;

            modalImg.src = card.dataset.img;
            modalTitle.textContent = card.dataset.title;
            modalDesc.textContent = card.dataset.desc || '';

            if (modalType === 'project') {
                modalTechContainer.classList.remove('hidden');
                modalIssuerContainer.classList.add('hidden');
                modalDownloadBtn.classList.add('hidden');
                
                modalTechContainer.innerHTML = '';
                card.dataset.tech.split(',').forEach(tech => {
                    const tag = document.createElement('span');
                    tag.className = 'bg-blue-500/20 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full';
                    tag.textContent = tech.trim();
                    modalTechContainer.appendChild(tag);
                });
            } else if (modalType === 'certificate') {
                modalTechContainer.classList.add('hidden');
                modalIssuerContainer.classList.remove('hidden');
                
                modalIssuerContainer.innerHTML = `${card.dataset.issuer}, <span>${card.dataset.year}</span>`;
                
                const pdfUrl = card.dataset.pdfUrl;
                if (pdfUrl && pdfUrl !== '#') {
                    modalDownloadBtn.href = pdfUrl;
                    modalDownloadBtn.classList.remove('hidden');
                } else {
                    modalDownloadBtn.classList.add('hidden');
                }
            }

            modal.classList.remove('invisible', 'opacity-0');
            modalContent.classList.add('scale-100');
        });
    });

    // Close modal
    const closeModal = () => {
        modal.classList.add('invisible', 'opacity-0');
        modalContent.classList.remove('scale-100');
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { 
        if (e.target === modal) closeModal(); 
    });

    // 3D card effect
    document.querySelectorAll('.interactive-card').forEach(card => {
        const inner = card.querySelector('.card-inner');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            inner.style.transform = 'none';
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent page reload

        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                formSuccess.classList.remove('hidden');
                contactForm.reset();
                setTimeout(() => formSuccess.classList.add('hidden'), 4000);
            } else {
                alert("Terjadi kesalahan, coba lagi.");
            }
        } catch (error) {
            alert("Terjadi kesalahan, coba lagi.");
        }
    });

    // Page transition logic
    document.body.classList.remove('is-entering');

    const pageLinks = document.querySelectorAll('a[href="pages/projects/project.html"], a[href="pages/certificate/certificate.html"]');
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const destination = this.href;
            document.body.classList.add('is-leaving');
            setTimeout(() => {
                window.location.href = destination;
            }, 400);
        });
    });

    // Contact form character counter
    const messageArea = document.querySelector('textarea[name="message"]');
    const charCounter = document.getElementById('char-counter');
    const maxLength = 250;

    if (messageArea && charCounter) {
        messageArea.addEventListener('input', () => {
            const currentLength = messageArea.value.length;
            charCounter.textContent = `${currentLength} / ${maxLength}`;
        });
    }

    // Randomize profile picture
    const profilePic = document.getElementById('profile-pic');
    if (profilePic) {
        const images = ['./assets/img/profile.jpg', './assets/img/profile.jpeg'];
        const randomIndex = Math.floor(Math.random() * images.length);
        profilePic.src = images[randomIndex];
    }
});

const snakeGame = {
    canvas: null,
    context: null,
    modal: null,
    closeBtn: null,
    scoreEl: null,
    grid: 20,
    loopId: null,
    score: 0,
    player: null,
    food: null,
    isInitialized: false,
    gameSpeed: 8, // Higher number = slower game
    frameCount: 0,

    init() {
        if (this.isInitialized) return;
        this.modal = document.getElementById('game-modal');
        this.closeBtn = document.getElementById('game-modal-close');
        this.canvas = document.getElementById('game-canvas');
        this.context = this.canvas.getContext('2d');
        this.scoreEl = document.getElementById('score');

        this.closeBtn.addEventListener('click', () => this.stop());
        this.isInitialized = true;
    },

    reset() {
        this.score = 0;
        this.updateScore();
        this.player = {
            x: 10 * this.grid,
            y: 10 * this.grid,
            dx: this.grid,
            dy: 0,
            cells: [],
            maxCells: 4
        };
        this.placeFood();
    },

    placeFood() {
        this.food = {
            x: Math.floor(Math.random() * (this.canvas.width / this.grid)) * this.grid,
            y: Math.floor(Math.random() * (this.canvas.height / this.grid)) * this.grid
        };
    },

    updateScore() {
        this.scoreEl.textContent = this.score;
    },

    start() {
        this.init();
        this.reset();
        this.modal.classList.remove('opacity-0', 'invisible');
        document.addEventListener('keydown', this.handleInput.bind(this));
        this.loopId = requestAnimationFrame(this.loop.bind(this));
    },

    stop() {
        this.modal.classList.add('opacity-0', 'invisible');
        document.removeEventListener('keydown', this.handleInput.bind(this));
        cancelAnimationFrame(this.loopId);
        this.loopId = null;
    },

    handleInput(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }

        if (e.key === 'ArrowLeft' && this.player.dx === 0) {
            this.player.dx = -this.grid; this.player.dy = 0;
        } else if (e.key === 'ArrowUp' && this.player.dy === 0) {
            this.player.dy = -this.grid; this.player.dx = 0;
        } else if (e.key === 'ArrowRight' && this.player.dx === 0) {
            this.player.dx = this.grid; this.player.dy = 0;
        } else if (e.key === 'ArrowDown' && this.player.dy === 0) {
            this.player.dy = this.grid; this.player.dx = 0;
        }
    },

    loop() {
        this.loopId = requestAnimationFrame(this.loop.bind(this));

        if (++this.frameCount < this.gameSpeed) {
            return;
        }
        this.frameCount = 0;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.player.x += this.player.dx;
        this.player.y += this.player.dy;

        if (this.player.x < 0) this.player.x = this.canvas.width - this.grid;
        else if (this.player.x >= this.canvas.width) this.player.x = 0;
        if (this.player.y < 0) this.player.y = this.canvas.height - this.grid;
        else if (this.player.y >= this.canvas.height) this.player.y = 0;

        this.player.cells.unshift({ x: this.player.x, y: this.player.y });
        if (this.player.cells.length > this.player.maxCells) {
            this.player.cells.pop();
        }

        this.context.fillStyle = '#f9e2af'; // Food color
        this.context.fillRect(this.food.x, this.food.y, this.grid - 1, this.grid - 1);

        this.context.fillStyle = '#a6e3a1'; // Snake color
        this.player.cells.forEach((cell, index) => {
            this.context.fillRect(cell.x, cell.y, this.grid - 1, this.grid - 1);
            if (cell.x === this.food.x && cell.y === this.food.y) {
                this.player.maxCells++;
                this.score++;
                this.updateScore();
                this.placeFood();
            }
            for (let i = index + 1; i < this.player.cells.length; i++) {
                if (cell.x === this.player.cells[i].x && cell.y === this.player.cells[i].y) {
                    this.reset();
                }
            }
        });
    }
};

// Konami Code Listener
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            konamiIndex = 0;
            snakeGame.start();
        }
    } else {
        konamiIndex = 0;
    }
});
