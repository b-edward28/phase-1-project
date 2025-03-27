document.addEventListener("DOMContentLoaded", () => {
  let budget = 0;
  let expenses = [];

  fetch("http://localhost:3000/budget")
  .then(response => response.json())
  .then(data => {
    budget = data.amount || 0;
    document.querySelector("#budgetDisplay").textContent = budget;
  });

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
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify()
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

  document.querySelector("#expenseForm").addEventListener("submit", function(event){
    event.preventDefault();
    const name = document.querySelector("#expenseName").value;
    const category = document.querySelector("#expenseCategory").value;
    const amount = document.querySelector("#expenseAmount").value || 0;

    if(name && category && amount) {
      const newExpense = {id: Date.now(), name, category, amount};

      fetch("http://localhost:3000/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newExpense)
      })
      .then(response => {
        if (!response.ok) throw new Error("Failed to save expense");
        return response.json();
      })
      .then (savedExpense => {
        expenses.push(savedExpense);
        renderExpenses();
      })
      .catch(error => console.error("Error saving expense:", error))

      this.reset();
    } else {
      alert("Please enter valid expense details");
    }
    
  });

  function renderExpenses() {
    const expenseList = document.querySelector("#expenseList");
    expenseList.innerHTML = "";
    let totalExpenses = 0;

    expenses.forEach(expense => {
      totalExpenses += Number(expense.amount); 
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${expense.name}</td>
        <td>${expense.category}</td>
        <td>${expense.amount}</td>
        <td><button class="btn-delete" data-id="${expense.id}">Delete</button></td>
      `;
      expenseList.appendChild(row);
      
    });
  
    document.querySelector("#totalExpenses").textContent = totalExpenses;
    checkBudgetAlert(); 
  }
    
    document.querySelector("#expenseList").addEventListener("click", function (event) {
  
      if (event.target.classList.contains("btn-delete")) {
        const expenseId = event.target.dataset.id;
        console.log("Delete button clicked", expenseId);
        deleteExpense(expenseId);
      }
    });
  


  function deleteExpense(expenseId){
    fetch(`http://localhost:3000/expenses/${expenseId}`, {
      method: "DELETE"
    })
    .then(response => {
      if(!response.ok) throw new Error("Error deleting");
      return response.text();
    })
    .then(() => {
      expenses = expenses.filter(expense => expense.id !== expenseId);
      renderExpenses();
    })
  
    .catch(error => console.error("Error deleting expense:", error));
  }

  function checkBudgetAlert() {
    const alertMessage = document.querySelector("#alertMessage");
    const totalExpenses = expenses.reduce ((sum, expense) => sum + Number(expense.amount), 0);

    if (budget > 0 && totalExpenses > budget) {
      alertMessage.textContent = "Alert! You have exceeded your budget";
      alertMessage.style.color = "red";
    } else {
      alertMessage.textContent = "You are within your budget.";
      alertMessage.style.color = "green";
    }
  }

});


