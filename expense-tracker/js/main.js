// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const userNameElement = document.getElementById('user-name');
    const categoriesBtn = document.getElementById('categories-btn');
    const categoriesModal = document.getElementById('categories-modal');
    const closeCategoriesModal = document.getElementById('close-categories-modal');
    const categoriesList = document.getElementById('categories-list');
    const transactionsList = document.getElementById('transactions-list');
    const totalSpentElement = document.getElementById('total-spent');
    const currentMonthElement = document.getElementById('current-month');
    const progressCircle = document.querySelector('.progress-ring__circle');

    // Data
    let user = null;
    let expenses = [];
    let monthlyBudget = 0;

    // Initialize App
    init();

    function init() {
        // Load user from localStorage
        if (localStorage.getItem('expenseUser')) {
            user = JSON.parse(localStorage.getItem('expenseUser'));
            userNameElement.textContent = `Hi, ${user.name}`;
        } else {
            // Redirect to login if not logged in
            window.location.href = 'login.html';
        }

        // Load expenses from localStorage
        if (localStorage.getItem('expenses')) {
            expenses = JSON.parse(localStorage.getItem('expenses'));
            renderExpenses(expenses);
            updateTotalSpent();
        }

        // Load monthly budget
        if (localStorage.getItem('monthlyBudget')) {
            monthlyBudget = parseFloat(localStorage.getItem('monthlyBudget'));
            updateProgressBar();
        }

        // Set current month
        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
        currentMonthElement.textContent = currentMonth;

        // Event Listeners
        // Add Expense button now redirects via link; no need for event listener

        categoriesBtn.addEventListener('click', openCategoriesModal);
        closeCategoriesModal.addEventListener('click', closeModal);

        // Close modals when clicking outside the modal content
        window.addEventListener('click', outsideClick);
    }

    // Functions

    // Open Categories Modal
    function openCategoriesModal() {
        renderCategories();
        categoriesModal.classList.remove('hidden');
    }

    // Close Modal
    function closeModal(event) {
        if (
            event.target === closeCategoriesModal ||
            event.target.classList.contains('close')
        ) {
            categoriesModal.classList.add('hidden');
        }
    }

    // Close Modals on Outside Click
    function outsideClick(event) {
        if (event.target === categoriesModal) {
            categoriesModal.classList.add('hidden');
        }
    }

    // Render Expenses in Transactions List
    function renderExpenses(expensesToRender) {
        transactionsList.innerHTML = ''; // Clear existing

        if (expensesToRender.length === 0) {
            transactionsList.innerHTML = '<p>No recent transactions.</p>';
            return;
        }

        // Optionally, reverse the array to show the latest expense on top
        const reversedExpenses = [...expensesToRender].reverse();

        reversedExpenses.forEach(expense => {
            const expenseItem = document.createElement('div');
            expenseItem.classList.add('transaction-item');
            
            // Assign category-specific class for color-coding
            const categoryClass = `category-${expense.category}`;
            expenseItem.classList.add(getCategoryClass(expense.category));

            expenseItem.innerHTML = `
                <p class="transaction-company">${expense.company}</p>
                <p class="transaction-amount">₹${expense.amount.toFixed(2)}</p>
            `;
            transactionsList.appendChild(expenseItem);
        });
    }

    // Update Total Spent
    function updateTotalSpent() {
        const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        totalSpentElement.textContent = `₹${total.toFixed(2)}`;
        updateProgressBar();
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

            // Get category color
            const categoryColor = getCategoryColor(category);

            categoryItem.innerHTML = `
                <span style="color: ${categoryColor};">${category}</span>
                <span>₹${total.toFixed(2)}</span>
            `;
            categoriesList.appendChild(categoryItem);
        }
    }

    // Get Category Class for Transactions
    function getCategoryClass(category) {
        switch(category) {
            case 'Food':
                return 'category-Food';
            case 'Travel':
                return 'category-Travel';
            case 'Fashion':
                return 'category-Fashion';
            case 'Entertainment':
                return 'category-Entertainment';
            case 'Utilities':
                return 'category-Utilities';
            case 'Others':
                return 'category-Others';
            default:
                return 'category-Others';
        }
    }

    // Get Category Color for Categories Modal
    function getCategoryColor(category) {
        switch(category) {
            case 'Food':
                return '#FF6347'; // Tomato
            case 'Travel':
                return '#1E90FF'; // Dodger Blue
            case 'Fashion':
                return '#FFD700'; // Gold
            case 'Entertainment':
                return '#FF69B4'; // Hot Pink
            case 'Utilities':
                return '#32CD32'; // Lime Green
            case 'Others':
                return '#A9A9A9'; // Dark Gray
            default:
                return '#A9A9A9'; // Dark Gray
        }
    }

    // Update Circular Progress Bar
    function updateProgressBar() {
        if (monthlyBudget > 0) {
            const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
            const percentage = Math.min((totalSpent / monthlyBudget) * 100, 100);

            // Calculate stroke-dashoffset
            const radius = progressCircle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (percentage / 100) * circumference;

            progressCircle.style.strokeDashoffset = offset;

            // Change progress color based on usage
            if (percentage < 50) {
                progressCircle.style.stroke = '#4CAF50'; // Green
            } else if (percentage < 75) {
                progressCircle.style.stroke = '#FF9800'; // Orange
            } else {
                progressCircle.style.stroke = '#F44336'; // Red
            }
        }
    }
});
