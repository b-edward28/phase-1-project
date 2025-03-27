document.addEventListener("DOMContentLoaded", () => {
  let budget = 0;

  fetch("http://localhost:3000/budget")
  .then(response => response.json())
  .then(data => {
    budget = data.amount || 0;
    document.querySelector("#budgetDisplay").textContent = budget;
  })

});


