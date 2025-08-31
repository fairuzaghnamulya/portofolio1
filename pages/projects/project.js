document.addEventListener('DOMContentLoaded', () => {
    // --- ANIMATIONS ---
    document.body.classList.remove('is-entering');
    const homeLink = document.querySelector('a[href="../../index.html"]');
    if (homeLink) {
        homeLink.addEventListener('click', function(e) {
            e.preventDefault();
            const destination = this.href;
            document.body.classList.add('is-leaving');
            setTimeout(() => {
                window.location.href = destination;
            }, 400);
        });
    }

    // --- SEARCH FUNCTIONALITY ---
    const searchInput = document.getElementById('project-search');
    const projectCards = document.querySelectorAll('.interactive-card');

    if (searchInput && projectCards.length > 0) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();

            projectCards.forEach(card => {
                const titleElement = card.querySelector('h4');
                const descriptionElement = card.querySelector('p');
                const techElement = card.querySelector('.flex > div:first-child');

                const title = titleElement ? titleElement.textContent.toLowerCase() : '';
                const description = descriptionElement ? descriptionElement.textContent.toLowerCase() : '';
                const tech = techElement ? techElement.textContent.toLowerCase() : '';

                const isMatch = title.includes(searchTerm) || description.includes(searchTerm) || tech.includes(searchTerm);

                // Use Tailwind's 'hidden' class to show/hide
                if (isMatch) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    }
});