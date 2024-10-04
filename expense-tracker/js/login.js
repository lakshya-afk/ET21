// js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    const usernameInput = document.getElementById('username-input');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        if (username) {
            localStorage.setItem('expenseUser', JSON.stringify({ name: username }));
            window.location.href = 'index.html';
        } else {
            alert('Please enter your name.');
        }
    });

    // If user is already logged in, redirect to dashboard
    if (localStorage.getItem('expenseUser')) {
        window.location.href = 'index.html';
    }
});
