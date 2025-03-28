document.addEventListener("DOMContentLoaded", () => {
  let expenses = [];
  let budget = 0;

  const budgetInput = document.querySelector("#budgetInput");
  const setBudgetBtn = document.querySelector("#setBudgetBtn");
  const budgetDisplay = document.querySelector("#budgetDisplay");
  const expenseForm = document.querySelector("#expenseForm");
  const expenseList = document.querySelector("#expenseList");
  const totalExpensesDisplay = document.querySelector("#totalExpenses");
  const alertMessage = document.querySelector("#alertMessage");


  fetch("http://localhost:3000/budget")
  .then(response => response.json())
  .then(data => {
    budget = data.amount || 0;
    budgetDisplay.textContent = budget;
  })
  .catch(error => console.error("Error fetching budget:", error));


  fetch("http://localhost:3000/expenses")
  .then(response => response.json())
  .then(data => {
    expenses = data;
    renderExpenses();
  })
  .catch(error => console.error("Error fetching expenses:", error));

  setBudgetBtn.addEventListener("click", () => {
    const enteredBudget = parseFloat(budgetInput.value) || 0;

    if (enteredBudget > 0) {
      budget = enteredBudget;
      budgetDisplay.textContent = budget;
      fetch("http://localhost:3000/budget", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: budget })
      })
      .then(response => response.json())
      .then(data => {
        budgetDisplay.textContent = data.amount;
      })
      .catch(error => console.error("Error saving budget:", error));
    } else {
      alert("Please enter a valid budget");
    }
  });

  expenseForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.querySelector("#expenseName").value;
    const category = document.querySelector("#expenseCategory").value;
    const amount = parseFloat(document.querySelector("#expenseAmount").value) || 0;

    if (name && amount > 0) {
      const newExpense = { name, category, amount }
      fetch("http://localhost:3000/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense)
      })
      .then(response => response.json())
      .then(data => {
        expenses.push(data);
        renderExpenses();
        expenseForm.reset();
      })
      .catch(error => console.error("Error adding expense:", error));
    } else {
      alert("Please fill in all fields correctly");
    }
  });

  function renderExpenses() {
    expenseList.innerHTML = "";
    let totalExpenses = 0;
    expenses.forEach(expense => {
      totalExpenses += Number(expense.amount);
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${expense.name}</td>
        <td>${expense.category}</td>
        <td>KES ${expense.amount}</td>
        <td><button class="btn-delete" data-id="${expense.id}">Delete</button></td>
        `;
        expenseList.appendChild(row);
    });

    totalExpensesDisplay.textContent = totalExpenses;
    checkBudgetAlert();
  }

  function checkBudgetAlert(){
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    if (totalExpenses > budget) {
      alertMessage.textContent = "Warning: You have exceeded your budget!";
      alertMessage.style.color = "red";
    } else {
      alertMessage.textContent = "You are within your budget";
      alertMessage.style.color = "green";
    }
  }

  expenseList.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-delete")) {
      const expenseId = event.target.dataset.id;
      fetch(`http://localhost:3000/expenses/${expenseId}`, {
        method: "DELETE"
      })
      .then(response => {
          if (!response.ok) throw new Error("Error deleting");
          return response.text();
      })
      .then(() => {
          expenses = expenses.filter(expense => expense.id !== Number(expenseId));
          renderExpenses();
      })
      .catch(error => console.error("Error deleting expense:", error));
    }

  });


});