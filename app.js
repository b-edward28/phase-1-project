document.addEventListener("DOMContentLoaded", () => {
  let budget = 0;
  let expenses = [];

  fetch("http://localhost:3000/budget")
  .then(response => response.json())
  .then(data => {
    budget = data.amount || 0;
    document.querySelector("#budgetDisplay").textContent = budget;
    checkBudgetAlert();
  });

  fetch("http://localhost:3000/expenses")
  .then(response => response.json())
  .then(data => {
    expenses = data;
    renderExpenses();
  });

  document.querySelector("#setBudgetBtn").addEventListener("click", () => {
    budget = parseFloat(document.querySelector("#budgetInput").value) || 0;
    document.querySelector("#budgetDisplay").textContent = budget;
    checkBudgetAlert();

    fetch("http://localhost:3000/budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({amount: budget})
    });
  });

  document.querySelector("#expenseForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const name = document.querySelector("#expenseName").value;
    const category = document.querySelector("#expenseCategory").value;
    const amount = parseFloat(document.querySelector("#expenseAmount").value) || 0;

    if (name && category && amount){
      const newExpense = {id:Number, name, category, amount};
      expenses.push(newExpense);
      renderExpenses();
      this.reset();

      fetch("http://localhost:3000/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newExpense)
      });
      
    }
  });

  function renderExpenses() {
    const expenseList = document.querySelector("#expenseList");
    expenseList.innerHTML = "";
    let totalExpenses = 0;
    expenses.forEach(expense => {
      totalExpenses =+ expense.amount;
      expenseList.innerHTML += `
      <tr>
                  <td>${expense.name}</td>
                  <td>${expense.amount}</td>
                  <td>${expense.category}</td>
                  <td>
                      <button class="btn-delete" data-id="${expense.id}">Delete</button>
                  </td>
              </tr>
              `;
    });

    document.querySelector("#totalExpense").textContent = totalExpenses;
    checkBudgetAlert(totalExpenses);

  }

  function checkBudgetAlert(totalExpenses = 0){
    const alertMessage = document.querySelector("#alertMessage");
    if (budget > 0 && totalExpenses > budget){
      alertMessage.textContent = "Alert! Alert! You have exceeded your budget!";
      alertMessage.style.color = "red"
    } else {
      alertMessage.textContent = "You are within your budget";
      alertMessage.style.color = "green";
    }
  }

});


