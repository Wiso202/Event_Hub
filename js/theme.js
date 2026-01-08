// js/theme.js

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Vérifier si un thème est déjà sauvegardé
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
    enableDarkMode();
}

themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});

function enableDarkMode() {
    body.classList.add('dark-mode');
    body.setAttribute('data-theme', 'dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun'); // Change l'icône
    localStorage.setItem('theme', 'dark');
}

function disableDarkMode() {
    body.classList.remove('dark-mode');
    body.removeAttribute('data-theme');
    themeIcon.classList.replace('fa-sun', 'fa-moon'); // Change l'icône
    localStorage.setItem('theme', 'light');
}
