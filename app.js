document.addEventListener("DOMContentLoaded", () => {
  let budget = 0;

  fetch("http://localhost:3000/budget")
  .then(response => response.json())
  .then(data => {
    budget = data.amount || 0;
    document.querySelector("#budgetDisplay").textContent = budget;
  })

  fetch("http://localhost:3000/expenses")
  .then(response => response.json())
  .then(data => {
    expense = data;
    renderExpenses();
  })

  function renderExpenses() {
    const expenseList = document.querySelector("#expenseList");
    expenseList.innerHTML = "";
    let totalExpenses = 0;

    expenses.forEach(expense => {
      totalExpenses += expense.amount;
      expenseList.innerHTML+=  `
      <tr>
                  <td>${expense.name}</td>
                  <td>${expense.category}</td>
                  <td>${expense.amount}</td>
                  <td>
                      <button class="btn-delete" data-id="${expense.id}">Delete</button>
                  </td>
              </tr>
              `;
    });

    document.querySelector("#totalExpenses").textContent = totalExpenses;

  }

});


