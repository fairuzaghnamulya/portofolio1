document.addEventListener('DOMContentLoaded', () => {
    // Fade in on load
    document.body.classList.remove('is-entering');

    // Fade-out on navigation to home
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
});
