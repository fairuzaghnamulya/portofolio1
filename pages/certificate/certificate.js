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
    const searchInput = document.getElementById('certificate-search');
    const certificateCards = document.querySelectorAll('.interactive-card');

    if (searchInput && certificateCards.length > 0) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();

            certificateCards.forEach(card => {
                const titleElement = card.querySelector('h4');
                const issuerElement = card.querySelector('p');

                const title = titleElement ? titleElement.textContent.toLowerCase() : '';
                const issuer = issuerElement ? issuerElement.textContent.toLowerCase() : '';

                const isMatch = title.includes(searchTerm) || issuer.includes(searchTerm);

                // Use Tailwind's 'hidden' class to show/hide
                if (isMatch) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    }
    
    // --- FOOTER YEAR ---
    const yearSpan = document.getElementById("year");
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});