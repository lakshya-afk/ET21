// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const userNameElement = document.getElementById('user-name');
    const loginModal = document.getElementById('login-modal');
    const closeLoginModal = document.getElementById('close-login-modal');
    const loginBtn = document.getElementById('login-btn');
    const usernameInput = document.getElementById('username-input');

    const addExpenseBtn = document.getElementById('add-expense-btn');
    const addExpenseModal = document.getElementById('add-expense-modal');
    const closeAddExpenseModal = document.getElementById('close-add-expense-modal');
    const saveExpenseBtn = document.getElementById('save-expense-btn');
    const expenseCategoryInput = document.getElementById('expense-category');
    const expenseAmountInput = document.getElementById('expense-amount');

    const categoriesBtn = document.getElementById('categories-btn');
    const categoriesModal = document.getElementById('categories-modal');
    const closeCategoriesModal = document.getElementById('close-categories-modal');
    const categoriesList = document.getElementById('categories-list');

    const transactionsList = document.getElementById('transactions-list');

    const totalSpentElement = document.getElementById('total-spent');

    // Data
    let user = null;
    let expenses = [];

    // Initialize App
    init();

    function init() {
        // Load user from localStorage
        if (localStorage.getItem('expenseUser')) {
            user = JSON.parse(localStorage.getItem('expenseUser'));
            userNameElement.textContent = `Hi ${user.name}`;
        }

        // Load expenses from localStorage
        if (localStorage.getItem('expenses')) {
            expenses = JSON.parse(localStorage.getItem('expenses'));
            renderExpenses();
            updateTotalSpent();
        }

        // Event Listeners
        userNameElement.addEventListener('click', openLoginModal);
        closeLoginModal.addEventListener('click', closeModal);
        loginBtn.addEventListener('click', handleLogin);

        addExpenseBtn.addEventListener('click', openAddExpenseModal);
        closeAddExpenseModal.addEventListener('click', closeModal);
        saveExpenseBtn.addEventListener('click', saveExpense);

        categoriesBtn.addEventListener('click', openCategoriesModal);
        closeCategoriesModal.addEventListener('click', closeModal);

        // Close modals when clicking outside the modal content
        window.addEventListener('click', outsideClick);
    }

    // Functions

    // Open Login Modal
    function openLoginModal() {
        loginModal.classList.remove('hidden');
    }

    // Open Add Expense Modal
    function openAddExpenseModal() {
        addExpenseModal.classList.remove('hidden');
    }

    // Open Categories Modal
    function openCategoriesModal() {
        renderCategories();
        categoriesModal.classList.remove('hidden');
    }

    // Close Modal
    function closeModal(event) {
        // Check if the close button was clicked
        if (
            event.target === closeLoginModal ||
            event.target === closeAddExpenseModal ||
            event.target === closeCategoriesModal ||
            event.target.classList.contains('close')
        ) {
            loginModal.classList.add('hidden');
            addExpenseModal.classList.add('hidden');
            categoriesModal.classList.add('hidden');
        }
    }

    // Close Modals on Outside Click
    function outsideClick(event) {
        if (event.target === loginModal) {
            loginModal.classList.add('hidden');
        }
        if (event.target === addExpenseModal) {
            addExpenseModal.classList.add('hidden');
        }
        if (event.target === categoriesModal) {
            categoriesModal.classList.add('hidden');
        }
    }

    // Handle Login
    function handleLogin() {
        const name = usernameInput.value.trim();
        if (name) {
            user = { name };
            localStorage.setItem('expenseUser', JSON.stringify(user));
            userNameElement.textContent = `Hi ${user.name}`;
            loginModal.classList.add('hidden');
            usernameInput.value = '';
        } else {
            alert('Please enter your name.');
        }
    }

    // Save Expense
    function saveExpense() {
        const category = expenseCategoryInput.value.trim();
        const amount = parseFloat(expenseAmountInput.value.trim());

        if (category && !isNaN(amount) && amount > 0) {
            const expense = {
                id: Date.now(),
                category,
                amount,
                date: new Date().toLocaleString()
            };
            expenses.push(expense);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            renderExpenses();
            updateTotalSpent();
            addExpenseModal.classList.add('hidden');
            expenseCategoryInput.value = '';
            expenseAmountInput.value = '';
        } else {
            alert('Please enter a valid category and amount.');
        }
    }

    // Render Expenses in Transactions List
    function renderExpenses() {
        transactionsList.innerHTML = ''; // Clear existing

        if (expenses.length === 0) {
            transactionsList.innerHTML = '<p>No recent transactions.</p>';
            return;
        }

        // Optionally, reverse the array to show the latest expense on top
        const reversedExpenses = [...expenses].reverse();

        reversedExpenses.forEach(expense => {
            const expenseItem = document.createElement('div');
            expenseItem.classList.add('transaction-item');
            expenseItem.innerHTML = `
                <p>${expense.category}</p>
                <p>₹${expense.amount.toFixed(2)}</p>
            `;
            transactionsList.appendChild(expenseItem);
        });
    }

    // Update Total Spent
    function updateTotalSpent() {
        const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        totalSpentElement.textContent = `₹${total.toFixed(2)}`;
    }

    // Render Categories Summary
    function renderCategories() {
        categoriesList.innerHTML = ''; // Clear existing

        if (expenses.length === 0) {
            categoriesList.innerHTML = '<p>No expenses to display.</p>';
            return;
        }

        const categoryTotals = {};

        expenses.forEach(expense => {
            if (categoryTotals[expense.category]) {
                categoryTotals[expense.category] += expense.amount;
            } else {
                categoryTotals[expense.category] = expense.amount;
            }
        });

        for (const [category, total] of Object.entries(categoryTotals)) {
            const categoryItem = document.createElement('div');
            categoryItem.classList.add('category-item');
            categoryItem.innerHTML = `
                <span>${category}</span>
                <span>₹${total.toFixed(2)}</span>
            `;
            categoriesList.appendChild(categoryItem);
        }
    }
    
});
