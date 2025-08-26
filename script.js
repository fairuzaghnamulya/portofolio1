document.addEventListener('DOMContentLoaded', () => {
    // Typing animation
    const typingTextElement = document.getElementById('typing-text');
    const words = ["Game Developer", "UI/UX Enthusiast", "Creative Coder"];
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
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Handle counter animations
                const counters = entry.target.querySelectorAll('.stat-counter');
                counters.forEach(counter => {
                    if (counter.animated) return;
                    counter.animated = true;
                    
                    const target = +counter.dataset.target;
                    let current = 0;
                    const increment = target / 100;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    
                    updateCounter();
                });
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
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
});