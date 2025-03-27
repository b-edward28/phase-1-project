document.addEventListener("DOMContentLoaded", () => {
  let budget = 0;
  let expenses = [];

  fetch("http://localhost:3000/budget")
  .then(response => response.json())
  .then(data => {
    budget = data.amount || 0;
    document.querySelector("#budgetDisplay").textContent = budget;
  })

  fetch("http://localhost:3000/expenses")
  .then(response => response.json())
  .then(data => {
    expenses = data;
    renderExpenses();
  });

  document.querySelector("#setBudgetBtn").addEventListener("click", () => {
    const budgetInput = parseFloat(document.querySelector("#budgetInput").value) || 0;

    if(budgetInput > 0) {
      budget = budgetInput;
      document.querySelector("#budgetDisplay").textContent = budget ;

      fetch("http://localhost:3000/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount: budget})
      })
      .then(response => {
        if(!response.ok){
          throw new Error("Failed to save Budget");
        }
        return response.json();
      })
      .then(() => console.log("Budget saved successfully"))
      .catch(error => console.error("Error saving budget:", error));
    } else {
      alert("Please enter valid budget");
    }
  });

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


