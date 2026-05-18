"use strict";

const {
  validateTransactionInput,
  summarizeTransactions,
  filterTransactions: filterTransactionData,
  groupTransactionsByMonth,
  formatCurrency,
  formatDate,
  getCategoryLabel,
  escapeHtml,
  createCsv,
  normalizeLanguage,
  t,
} = window.FinanceCore;

const STORAGE_KEY = "financeTrackerData";
const THEME_KEY = "financeTrackerTheme";
const LANGUAGE_KEY = "financeTrackerLanguage";
const COOKIE_CONSENT_KEY = "financeTrackerCookieConsent";

const state = {
  transactions: [],
  filters: {
    category: "all",
    type: "all",
    search: "",
  },
  editingId: null,
  pendingDeleteId: null,
  theme: "dark",
  language: "en",
};

let lastFocusedElement = null;

const dom = {
  form: document.getElementById("transactionForm"),
  formTitle: document.getElementById("formTitle"),
  titleInput: document.getElementById("titleInput"),
  amountInput: document.getElementById("amountInput"),
  categoryInput: document.getElementById("categoryInput"),
  dateInput: document.getElementById("dateInput"),
  titleError: document.getElementById("titleError"),
  amountError: document.getElementById("amountError"),
  categoryError: document.getElementById("categoryError"),
  dateError: document.getElementById("dateError"),
  submitBtn: document.getElementById("submitBtn"),
  cancelEditBtn: document.getElementById("cancelEditBtn"),
  filterCategory: document.getElementById("filterCategory"),
  filterType: document.getElementById("filterType"),
  searchInput: document.getElementById("searchInput"),
  resetFiltersBtn: document.getElementById("resetFiltersBtn"),
  exportCsvBtn: document.getElementById("exportCsvBtn"),
  languageToggleBtn: document.getElementById("languageToggleBtn"),
  themeToggleBtn: document.getElementById("themeToggleBtn"),
  transactionsList: document.getElementById("transactionsList"),
  resultsCount: document.getElementById("resultsCount"),
  totalBalance: document.getElementById("totalBalance"),
  totalIncome: document.getElementById("totalIncome"),
  totalExpenses: document.getElementById("totalExpenses"),
  financeChart: document.getElementById("financeChart"),
  confirmModal: document.getElementById("confirmModal"),
  modalContent: document.querySelector(".modal__content"),
  confirmDeleteBtn: document.getElementById("confirmDeleteBtn"),
  cancelDeleteBtn: document.getElementById("cancelDeleteBtn"),
  toastContainer: document.getElementById("toastContainer"),
  skeleton: document.getElementById("skeleton"),
  cookieBanner: document.getElementById("cookieBanner"),
  cookieAcceptBtn: document.getElementById("cookieAcceptBtn"),
  cookieDeclineBtn: document.getElementById("cookieDeclineBtn"),
};

const translate = (key, values = {}) => t(state.language, key, values);

const generateID = () => {
  return `tx_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const saveToLocalStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
};

const loadFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    state.transactions = stored ? JSON.parse(stored) : [];
  } catch (error) {
    state.transactions = [];
    localStorage.removeItem(STORAGE_KEY);
  }
};

const saveTheme = () => {
  localStorage.setItem(THEME_KEY, state.theme);
};

const saveLanguage = () => {
  localStorage.setItem(LANGUAGE_KEY, state.language);
};

const updateThemeButton = () => {
  dom.themeToggleBtn.textContent = translate("actions.themeToggle");
  dom.themeToggleBtn.setAttribute("aria-pressed", state.theme === "dark");
  dom.themeToggleBtn.setAttribute("aria-label", translate("actions.themeAria"));
};

const setTheme = (theme) => {
  state.theme = theme === "light" ? "light" : "dark";
  document.body.classList.toggle("theme-light", state.theme === "light");
  updateThemeButton();
  saveTheme();
  renderChart();
};

const loadTheme = () => {
  const storedTheme = localStorage.getItem(THEME_KEY);
  setTheme(storedTheme || "dark");
};

const setLanguage = (language) => {
  state.language = normalizeLanguage(language);
  saveLanguage();
  applyTranslations();
  renderApp();
};

const loadLanguage = () => {
  state.language = normalizeLanguage(localStorage.getItem(LANGUAGE_KEY) || "en");
  applyTranslations();
};

const applyTranslations = () => {
  document.documentElement.lang = state.language === "zh" ? "zh-CN" : "en";
  document.title = translate("document.title");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute(
      "placeholder",
      translate(element.dataset.i18nPlaceholder),
    );
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel));
  });

  document.querySelectorAll("[data-category]").forEach((option) => {
    option.textContent = getCategoryLabel(
      option.dataset.category,
      state.language,
    );
  });

  dom.languageToggleBtn.textContent = translate("actions.languageTarget");
  updateThemeButton();
  syncEditingLabels();
};

const showToast = (message, variant = "success") => {
  const toast = document.createElement("div");
  toast.className = `toast${variant === "error" ? " toast--error" : ""}`;
  toast.textContent = message;
  dom.toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 2400);
};

const clearErrors = () => {
  const fields = [
    { input: dom.titleInput, error: dom.titleError },
    { input: dom.amountInput, error: dom.amountError },
    { input: dom.categoryInput, error: dom.categoryError },
    { input: dom.dateInput, error: dom.dateError },
  ];

  fields.forEach(({ input, error }) => {
    input.classList.remove("is-invalid");
    input.setAttribute("aria-invalid", "false");
    error.textContent = "";
  });
};

const setError = (input, errorEl, message) => {
  input.classList.add("is-invalid");
  input.setAttribute("aria-invalid", "true");
  errorEl.textContent = message;
};

const getFormInput = () => {
  return {
    title: dom.titleInput.value,
    amount: dom.amountInput.value,
    category: dom.categoryInput.value,
    date: dom.dateInput.value,
  };
};

const validateForm = () => {
  clearErrors();

  const validation = validateTransactionInput(getFormInput(), state.language);

  if (validation.errors.title) {
    setError(dom.titleInput, dom.titleError, validation.errors.title);
  }

  if (validation.errors.amount) {
    setError(dom.amountInput, dom.amountError, validation.errors.amount);
  }

  if (validation.errors.category) {
    setError(dom.categoryInput, dom.categoryError, validation.errors.category);
  }

  if (validation.errors.date) {
    setError(dom.dateInput, dom.dateError, validation.errors.date);
  }

  return validation;
};

const syncEditingLabels = () => {
  dom.formTitle.textContent = state.editingId
    ? translate("form.titleEditing")
    : translate("form.title");
  dom.submitBtn.textContent = state.editingId
    ? translate("form.save")
    : translate("form.add");
};

const resetFormState = () => {
  dom.form.reset();
  state.editingId = null;
  dom.cancelEditBtn.hidden = true;
  clearErrors();
  syncEditingLabels();
};

const addTransaction = () => {
  const validation = validateForm();

  if (!validation.isValid) {
    showToast(translate("toast.fixFields"), "error");
    const firstInvalid = dom.form.querySelector(".is-invalid");
    firstInvalid?.focus();
    return;
  }

  const { title, amount, category, date } = validation.values;

  if (state.editingId) {
    state.transactions = state.transactions.map((tx) =>
      tx.id === state.editingId ? { ...tx, title, amount, category, date } : tx,
    );
    showToast(translate("toast.updated"));
  } else {
    const newTransaction = {
      id: generateID(),
      title,
      amount,
      category,
      date,
    };

    state.transactions = [newTransaction, ...state.transactions];
    showToast(translate("toast.added"));
  }

  resetFormState();
  saveToLocalStorage();
  renderApp();
};

const startEditing = (id) => {
  const transaction = state.transactions.find((tx) => tx.id === id);
  if (!transaction) return;

  dom.titleInput.value = transaction.title;
  dom.amountInput.value = transaction.amount;
  dom.categoryInput.value = transaction.category;
  dom.dateInput.value = transaction.date;

  state.editingId = id;
  dom.cancelEditBtn.hidden = false;
  clearErrors();
  syncEditingLabels();
  dom.titleInput.focus();
  showToast(translate("toast.editing"));
};

const deleteTransaction = (id) => {
  state.transactions = state.transactions.filter((tx) => tx.id !== id);
  saveToLocalStorage();
  renderApp();
  showToast(translate("toast.deleted"));
};

const openConfirmModal = (id) => {
  state.pendingDeleteId = id;
  lastFocusedElement = document.activeElement;
  dom.confirmModal.classList.add("is-open");
  dom.confirmModal.setAttribute("aria-hidden", "false");
  dom.cancelDeleteBtn.focus();
};

const closeConfirmModal = () => {
  state.pendingDeleteId = null;
  dom.confirmModal.classList.remove("is-open");
  dom.confirmModal.setAttribute("aria-hidden", "true");
  lastFocusedElement?.focus();
};

const renderSummary = () => {
  const summary = summarizeTransactions(state.transactions);

  dom.totalIncome.textContent = formatCurrency(summary.income, state.language);
  dom.totalExpenses.textContent = formatCurrency(
    summary.expenses,
    state.language,
  );
  dom.totalBalance.textContent = formatCurrency(summary.balance, state.language);
};

const renderTransactions = () => {
  const filtered = filterTransactionData(state.transactions, state.filters);

  dom.resultsCount.textContent = translate("transactions.results", {
    count: filtered.length,
  });

  if (filtered.length === 0) {
    dom.transactionsList.innerHTML = `
      <div class="transactions__empty" role="listitem">
        <div class="empty__icon" aria-hidden="true">+</div>
        <p>${escapeHtml(translate("transactions.empty"))}</p>
        <button class="btn btn--accent empty-add-btn" type="button">
          ${escapeHtml(translate("transactions.emptyAction"))}
        </button>
      </div>
    `;
    return;
  }

  const groups = groupTransactionsByMonth(filtered, state.language);

  dom.transactionsList.innerHTML = groups
    .map(
      (group) => `
        <div class="month-group" role="listitem">
          <p class="month-title">${escapeHtml(group.label)}</p>
          ${group.items.map(renderTransactionItem).join("")}
        </div>
      `,
    )
    .join("");
};

const renderTransactionItem = (tx) => {
  const typeClass = tx.amount >= 0 ? "amount--income" : "amount--expense";
  const formattedAmount = formatCurrency(tx.amount, state.language);
  const formattedDate = formatDate(tx.date, state.language);
  const safeTitle = escapeHtml(tx.title);
  const categoryLabel = escapeHtml(getCategoryLabel(tx.category, state.language));
  const editLabel = escapeHtml(
    translate("transactions.editAria", { title: tx.title }),
  );
  const deleteLabel = escapeHtml(
    translate("transactions.deleteAria", { title: tx.title }),
  );

  return `
    <article class="transaction">
      <div>
        <h3 class="transaction__title">${safeTitle}</h3>
        <div class="transaction__meta">
          <span class="badge">${categoryLabel}</span>
          <span>${escapeHtml(formattedDate)}</span>
        </div>
      </div>
      <div>
        <p class="amount ${typeClass}">${escapeHtml(formattedAmount)}</p>
        <button class="edit-btn" data-id="${escapeHtml(tx.id)}" aria-label="${editLabel}">
          ${escapeHtml(translate("transactions.edit"))}
        </button>
        <button class="delete-btn" data-id="${escapeHtml(tx.id)}" aria-label="${deleteLabel}">
          ${escapeHtml(translate("transactions.delete"))}
        </button>
      </div>
    </article>
  `;
};

const renderChart = () => {
  const canvas = dom.financeChart;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = canvas.clientWidth || 800;
  const displayHeight = 260;

  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const width = displayWidth;
  const height = displayHeight;

  ctx.clearRect(0, 0, width, height);

  const summary = summarizeTransactions(state.transactions);
  const maxValue = Math.max(summary.income, summary.expenses, 1);
  const availableWidth = Math.max(width - 100, 220);
  const barWidth = Math.min(120, Math.max(54, availableWidth / 4));
  const gap = Math.min(80, Math.max(34, availableWidth / 5));
  const startX = Math.max(40, (width - (barWidth * 2 + gap)) / 2);
  const baseY = height - 44;

  const incomeHeight = (summary.income / maxValue) * (height - 90);
  const expenseHeight = (summary.expenses / maxValue) * (height - 90);
  const styles = getComputedStyle(document.body);
  const textColor = styles.getPropertyValue("--text").trim() || "#f8fafc";
  const borderColor =
    styles.getPropertyValue("--border").trim() || "rgba(255,255,255,0.12)";

  ctx.strokeStyle = borderColor;
  ctx.beginPath();
  ctx.moveTo(30, baseY);
  ctx.lineTo(width - 30, baseY);
  ctx.stroke();

  ctx.fillStyle = styles.getPropertyValue("--income").trim() || "#22c55e";
  ctx.fillRect(startX, baseY - incomeHeight, barWidth, incomeHeight);

  ctx.fillStyle = styles.getPropertyValue("--expense").trim() || "#f43f5e";
  ctx.fillRect(startX + barWidth + gap, baseY - expenseHeight, barWidth, expenseHeight);

  ctx.fillStyle = textColor;
  ctx.font = "14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    translate("type.income"),
    startX + barWidth / 2,
    baseY + 24,
  );
  ctx.fillText(
    translate("type.expense"),
    startX + barWidth + gap + barWidth / 2,
    baseY + 24,
  );

  ctx.fillText(
    formatCurrency(summary.income, state.language),
    startX + barWidth / 2,
    Math.max(18, baseY - incomeHeight - 10),
  );
  ctx.fillText(
    formatCurrency(summary.expenses, state.language),
    startX + barWidth + gap + barWidth / 2,
    Math.max(18, baseY - expenseHeight - 10),
  );

  canvas.setAttribute(
    "aria-label",
    translate("chart.aria", {
      income: formatCurrency(summary.income, state.language),
      expenses: formatCurrency(summary.expenses, state.language),
    }),
  );
};

const renderApp = () => {
  syncEditingLabels();
  renderSummary();
  renderTransactions();
  renderChart();
};

const exportToCSV = () => {
  if (state.transactions.length === 0) {
    showToast(translate("toast.noExport"), "error");
    return;
  }

  const csv = createCsv(state.transactions);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "transactions.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  showToast(translate("toast.exported"));
};

const syncCookieBanner = () => {
  if (!dom.cookieBanner) return;

  let hasChoice = false;

  try {
    hasChoice = Boolean(localStorage.getItem(COOKIE_CONSENT_KEY));
  } catch (error) {
    hasChoice = false;
  }

  dom.cookieBanner.hidden = hasChoice;
  dom.cookieBanner.classList.toggle("is-hidden", hasChoice);
  dom.cookieBanner.setAttribute("aria-hidden", String(hasChoice));
  dom.cookieBanner.style.display = hasChoice ? "none" : "";
};

const saveCookieChoice = (choice) => {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, choice);
  } catch (error) {
    dom.cookieBanner.dataset.cookieChoice = choice;
  }

  syncCookieBanner();
  showToast(
    choice === "accepted"
      ? translate("toast.cookieAccepted")
      : translate("toast.cookieDeclined"),
  );
};

const initializeApp = () => {
  loadFromLocalStorage();
  loadLanguage();
  loadTheme();
  renderApp();
  syncCookieBanner();

  setTimeout(() => {
    dom.skeleton.classList.add("is-hidden");
  }, 300);

  dom.form.addEventListener("submit", (e) => {
    e.preventDefault();
    addTransaction();
  });

  dom.cancelEditBtn.addEventListener("click", () => {
    resetFormState();
  });

  dom.transactionsList.addEventListener("click", (e) => {
    const deleteButton = e.target.closest(".delete-btn");
    const editButton = e.target.closest(".edit-btn");
    const emptyAdd = e.target.closest(".empty-add-btn");

    const deleteId = deleteButton?.dataset?.id;
    const editId = editButton?.dataset?.id;

    if (deleteId) {
      openConfirmModal(deleteId);
    }

    if (editId) {
      startEditing(editId);
    }

    if (emptyAdd) {
      dom.titleInput.focus();
    }
  });

  dom.filterCategory.addEventListener("change", (e) => {
    state.filters.category = e.target.value;
    renderTransactions();
  });

  dom.filterType.addEventListener("change", (e) => {
    state.filters.type = e.target.value;
    renderTransactions();
  });

  dom.searchInput.addEventListener("input", (e) => {
    state.filters.search = e.target.value;
    renderTransactions();
  });

  dom.resetFiltersBtn.addEventListener("click", () => {
    state.filters = { category: "all", type: "all", search: "" };
    dom.filterCategory.value = "all";
    dom.filterType.value = "all";
    dom.searchInput.value = "";
    renderTransactions();
  });

  dom.exportCsvBtn.addEventListener("click", exportToCSV);

  dom.languageToggleBtn.addEventListener("click", () => {
    setLanguage(state.language === "en" ? "zh" : "en");
  });

  dom.themeToggleBtn.addEventListener("click", () => {
    setTheme(state.theme === "dark" ? "light" : "dark");
  });

  dom.confirmDeleteBtn.addEventListener("click", () => {
    if (state.pendingDeleteId) {
      deleteTransaction(state.pendingDeleteId);
    }
    closeConfirmModal();
  });

  dom.cancelDeleteBtn.addEventListener("click", closeConfirmModal);

  dom.confirmModal.addEventListener("click", (e) => {
    if (e.target.dataset.close) {
      closeConfirmModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && dom.confirmModal.classList.contains("is-open")) {
      closeConfirmModal();
    }
  });

  dom.cookieAcceptBtn.addEventListener("click", () => {
    saveCookieChoice("accepted");
  });

  dom.cookieDeclineBtn.addEventListener("click", () => {
    saveCookieChoice("declined");
  });

  window.addEventListener("resize", renderChart);
};

initializeApp();
