// js/add-expense.js

document.addEventListener('DOMContentLoaded', () => {
    const addExpenseForm = document.getElementById('add-expense-form');
    const expenseCompanyInput = document.getElementById('expense-company');
    const expenseAmountInput = document.getElementById('expense-amount');
    const expenseCategorySelect = document.getElementById('expense-category');

    addExpenseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const company = expenseCompanyInput.value.trim();
        const amount = parseFloat(expenseAmountInput.value.trim());
        const category = expenseCategorySelect.value;

        // Validate Inputs
        if (!company) {
            alert('Please enter the company name.');
            return;
        }

        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        if (!category) {
            alert('Please select a category.');
            return;
        }

        // Create Expense Object
        const expense = {
            id: Date.now(),
            company,
            amount,
            category,
            date: new Date().toLocaleString()
        };

        // Retrieve existing expenses from localStorage
        let expenses = [];
        if (localStorage.getItem('expenses')) {
            expenses = JSON.parse(localStorage.getItem('expenses'));
        }

        // Add new expense
        expenses.push(expense);

        // Save back to localStorage
        localStorage.setItem('expenses', JSON.stringify(expenses));

        // Optionally, update the monthly budget if set
        if (localStorage.getItem('monthlyBudget')) {
            const budget = parseFloat(localStorage.getItem('monthlyBudget'));
            const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
            if (totalSpent > budget) {
                alert('You have exceeded your monthly budget!');
            }
        }

        // Redirect back to the main dashboard
        window.location.href = 'index.html';
    });
});
