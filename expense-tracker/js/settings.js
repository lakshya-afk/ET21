// js/settings.js

document.addEventListener('DOMContentLoaded', () => {
    const settingsForm = document.getElementById('settings-form');
    const budgetInput = document.getElementById('budget-input');
    const saveBudgetBtn = document.getElementById('save-budget-btn');

    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const budget = parseFloat(budgetInput.value.trim());
        if (!isNaN(budget) && budget > 0) {
            localStorage.setItem('monthlyBudget', budget.toFixed(2));
            alert('Monthly budget set successfully!');
            window.location.href = 'index.html';
        } else {
            alert('Please enter a valid budget amount.');
        }
    });
});
