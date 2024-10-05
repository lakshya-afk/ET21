// js/categories.js

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const categoriesList = document.getElementById('category-list');
    const totalSpentElement = document.getElementById('total-spent');
    const currentMonthElement = document.getElementById('current-month');
    const progressCircle = document.querySelector('.progress-ring__circle');
    const categorySelect = document.getElementById('category-select');
    const filterBtn = document.getElementById('filter-btn');

    // Data
    let expenses = [];
    let monthlyBudget = 0;

    // Initialize App
    init();

    function init() {
        // Load expenses from localStorage
        if (localStorage.getItem('expenses')) {
            expenses = JSON.parse(localStorage.getItem('expenses'));
            renderCategories(expenses);
            updateTotalSpent();
        } else {
            categoriesList.innerHTML = '<p>No expenses to display.</p>';
        }

        // Load monthly budget
        if (localStorage.getItem('monthlyBudget')) {
            monthlyBudget = parseFloat(localStorage.getItem('monthlyBudget'));
            updateProgressBar();
        }

        // Set current month
        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
        currentMonthElement.textContent = currentMonth;

        // Event Listener for Filter Button
        filterBtn.addEventListener('click', () => {
            const selectedCategory = categorySelect.value;
            if (selectedCategory === 'all') {
                renderCategories(expenses);
            } else {
                const filteredExpenses = expenses.filter(exp => exp.category.toLowerCase() === selectedCategory);
                renderCategories(filteredExpenses);
            }
        });
    }

    // Functions

    // Render Categories Summary
    function renderCategories(expensesToRender) {
        const categoryTotals = {};

        expensesToRender.forEach(expense => {
            const category = expense.category;
            if (categoryTotals[category]) {
                categoryTotals[category] += expense.amount;
            } else {
                categoryTotals[category] = expense.amount;
            }
        });

        categoriesList.innerHTML = ''; // Clear existing

        for (const [category, total] of Object.entries(categoryTotals)) {
            const categoryItem = document.createElement('li');
            categoryItem.classList.add('category-item');

            // Get category color
            const categoryColor = getCategoryColor(category);

            categoryItem.innerHTML = `
                <span style="color: ${categoryColor}; font-weight: bold;">${category}</span>
                <span>₹${total.toFixed(2)}</span>
            `;
            categoriesList.appendChild(categoryItem);
        }

        // If no expenses in the selected category
        if (expensesToRender.length === 0) {
            categoriesList.innerHTML = '<p>No expenses in this category.</p>';
        }
    }

    // Get Category Color
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

    // Update Total Spent
    function updateTotalSpent() {
        const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        totalSpentElement.textContent = `₹${total.toFixed(2)}`;
        updateProgressBar();
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
