const STORAGE_KEY = "expenseTrackerTransactions";
const form = document.getElementById("transactionForm");
const list = document.getElementById("transactionList");
const searchInput = document.getElementById("search");
const filterType = document.getElementById("filterType");
let transactions = loadTransactions();
let chart = null;
let toastTimer;

document.getElementById("todayDate").textContent = new Intl.DateTimeFormat("en-IN", {
  weekday: "short", day: "numeric", month: "short", year: "numeric"
}).format(new Date());
document.getElementById("date").value = new Date().toISOString().slice(0, 10);

function loadTransactions() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}
function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}
function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}
function updateSummary() {
  const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  document.getElementById("income").textContent = money(income);
  document.getElementById("expense").textContent = money(expense);
  document.getElementById("balance").textContent = money(income - expense);
  document.getElementById("transactionCount").textContent =
    `${transactions.length} transaction${transactions.length === 1 ? "" : "s"}`;
}
function renderTransactions() {
  const query = searchInput.value.trim().toLowerCase();
  const type = filterType.value;
  const filtered = [...transactions]
    .filter(t => (type === "all" || t.type === type))
    .filter(t => `${t.description} ${t.category}`.toLowerCase().includes(query))
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);

  list.innerHTML = filtered.map(t => `
    <tr>
      <td><strong>${escapeHTML(t.description)}</strong></td>
      <td>${escapeHTML(t.category)}</td>
      <td>${new Date(`${t.date}T00:00:00`).toLocaleDateString("en-IN")}</td>
      <td><span class="type-pill ${t.type}">${t.type === "income" ? "Income" : "Expense"}</span></td>
      <td class="amount ${t.type === "income" ? "positive" : "negative"}">${t.type === "income" ? "+" : "−"}${money(t.amount)}</td>
      <td><button class="delete-button" data-id="${t.id}" aria-label="Delete ${escapeHTML(t.description)}" title="Delete">×</button></td>
    </tr>`).join("");

  const empty = document.getElementById("emptyState");
  empty.style.display = filtered.length ? "none" : "block";
  empty.textContent = transactions.length ? "No transactions match your search or filter." :
    "No transactions yet. Add your first transaction above.";
}
function updateChart() {
  const totals = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    totals[t.category] = (totals[t.category] || 0) + t.amount;
  });
  const labels = Object.keys(totals);
  const values = Object.values(totals);
  document.getElementById("chartEmpty").style.display = labels.length ? "none" : "block";
  const canvas = document.getElementById("categoryChart");
  if (chart) chart.destroy();
  if (!labels.length) return;
  chart = new Chart(canvas, {
    type: "doughnut",
    data: { labels, datasets: [{ data: values, backgroundColor: [
      "#4f46e5", "#0f9f6e", "#f59e0b", "#e05252", "#3b82f6", "#a855f7", "#14b8a6", "#f97316"
    ], borderWidth: 0, hoverOffset: 5 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: {
      legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 7, padding: 16, font: { size: 10 } } }
    }, cutout: "68%" }
  });
}
function render() {
  updateSummary();
  renderTransactions();
  updateChart();
}
form.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(form);
  const description = String(data.get("description")).trim();
  const amount = Number(data.get("amount"));
  const date = String(data.get("date"));
  if (!description || !Number.isFinite(amount) || amount <= 0 || !date) {
    showToast("Please enter valid transaction details.");
    return;
  }
  transactions.push({
    id: (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
    description, amount, type: String(data.get("type")),
    category: String(data.get("category")), date, createdAt: Date.now()
  });
  saveTransactions();
  form.reset();
  document.getElementById("date").value = new Date().toISOString().slice(0, 10);
  render();
  showToast("Transaction added successfully.");
});
list.addEventListener("click", event => {
  const button = event.target.closest("[data-id]");
  if (!button) return;
  transactions = transactions.filter(t => t.id !== button.dataset.id);
  saveTransactions();
  render();
  showToast("Transaction deleted.");
});
searchInput.addEventListener("input", renderTransactions);
filterType.addEventListener("change", renderTransactions);
document.getElementById("clearAll").addEventListener("click", () => {
  if (!transactions.length) { showToast("There is no data to clear."); return; }
  if (!confirm("Delete all transactions? This cannot be undone.")) return;
  transactions = [];
  saveTransactions();
  render();
  showToast("All transactions cleared.");
});
render();
