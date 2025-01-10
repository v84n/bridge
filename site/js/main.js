import { supabase } from './config.js';

// Theme Switching
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

document.getElementById('themeToggle').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Initialize theme
initTheme();

// Countdown Timer
const launchDate = new Date('April 15, 2025 00:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Form Handling
const interestForm = document.getElementById('interestForm');

interestForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: e.target.name.value,
        email: e.target.email.value,
        watch_model: e.target.watchModel.value,
        top_feature: e.target.topFeature.value,
        message: e.target.message.value,
        created_at: new Date().toISOString()
    };

    try {
        const { error } = await supabase
            .from('interest_submissions')
            .insert([formData]);

        if (error) throw error;

        alert('Thank you for your interest! We\'ll keep you updated.');
        interestForm.reset();
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting the form. Please try again later.');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
}); 