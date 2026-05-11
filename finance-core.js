(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  /* node:coverage ignore next 3 */
  } else {
    root.FinanceCore = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  "use strict";

  const categories = [
    "Salary",
    "Business",
    "Investments",
    "Housing",
    "Food",
    "Transport",
    "Health",
    "Entertainment",
    "Education",
    "Other",
  ];

  const translations = {
    en: {
      "document.title": "Advanced Personal Finance Tracker",
      "nav.skip": "Skip to main content",
      "app.eyebrow": "Personal Finance",
      "app.title": "Advanced Finance Tracker",
      "app.subtitle": "Track income, expenses, and your balance with clarity.",
      "actions.controls": "Application controls",
      "actions.languageToggle": "Switch language",
      "actions.languageTarget": "中文",
      "actions.themeToggle": "Dark Mode",
      "actions.themeAria": "Toggle color theme",
      "actions.export": "Export CSV",
      "actions.resetFilters": "Reset Filters",
      "summary.heading": "Finance summary",
      "summary.balance": "Total Balance",
      "summary.income": "Total Income",
      "summary.expenses": "Total Expenses",
      "chart.title": "Cash Flow Overview",
      "chart.meta": "Income vs Expense",
      "chart.fallback": "Cash flow chart comparing total income and total expenses.",
      "chart.aria": "Cash flow chart. Income: {income}. Expenses: {expenses}.",
      "form.title": "Add Transaction",
      "form.titleEditing": "Edit Transaction",
      "form.hint": "* Indicates a required field",
      "form.titleLabel": "Title",
      "form.titlePlaceholder": "e.g., Freelance Payment",
      "form.amountLabel": "Amount",
      "form.amountPlaceholder": "e.g., 1200 or -45",
      "form.categoryLabel": "Category",
      "form.dateLabel": "Date",
      "form.add": "Add Transaction",
      "form.save": "Save Changes",
      "form.cancelEdit": "Cancel Edit",
      "filters.title": "Filters & Search",
      "filters.category": "Category",
      "filters.type": "Type",
      "filters.search": "Search by title",
      "filters.searchPlaceholder": "Start typing...",
      "category.placeholder": "Select category",
      "category.all": "All categories",
      "category.Salary": "Salary",
      "category.Business": "Business",
      "category.Investments": "Investments",
      "category.Housing": "Housing",
      "category.Food": "Food",
      "category.Transport": "Transport",
      "category.Health": "Health",
      "category.Entertainment": "Entertainment",
      "category.Education": "Education",
      "category.Other": "Other",
      "type.all": "All",
      "type.income": "Income",
      "type.expense": "Expense",
      "transactions.title": "Transactions",
      "transactions.results": "{count} results",
      "transactions.empty": "No transactions yet. Add your first one to get started.",
      "transactions.emptyAction": "Add First Transaction",
      "transactions.edit": "Edit",
      "transactions.delete": "Delete",
      "transactions.editAria": "Edit {title}",
      "transactions.deleteAria": "Delete {title}",
      "modal.title": "Delete transaction?",
      "modal.text": "This action cannot be undone.",
      "modal.cancel": "Cancel",
      "modal.delete": "Delete",
      "toast.fixFields": "Please fix the highlighted fields.",
      "toast.updated": "Transaction updated.",
      "toast.added": "Transaction added.",
      "toast.editing": "Editing mode enabled.",
      "toast.deleted": "Transaction deleted.",
      "toast.noExport": "No data to export.",
      "toast.exported": "CSV exported.",
      "toast.cookieAccepted": "Cookie preference saved.",
      "toast.cookieDeclined": "Non-essential cookies declined.",
      "validation.titleRequired": "Title is required.",
      "validation.amountRequired": "Enter a valid non-zero amount.",
      "validation.categoryRequired": "Select a category.",
      "validation.dateRequired": "Pick a date.",
      "privacy.title": "Privacy choices",
      "privacy.text":
        "This tracker stores transactions, theme, language, and cookie preference in your browser only. No analytics cookies are used.",
      "privacy.accept": "Accept",
      "privacy.decline": "Decline",
      "privacy.link": "Privacy Policy",
      "footer.note": "Your finance data stays in this browser.",
      "month.locale": "en-US",
    },
    zh: {
      "document.title": "高级个人财务记录器",
      "nav.skip": "跳到主要内容",
      "app.eyebrow": "个人财务",
      "app.title": "高级财务记录器",
      "app.subtitle": "清晰记录收入、支出和余额。",
      "actions.controls": "应用控制",
      "actions.languageToggle": "切换语言",
      "actions.languageTarget": "English",
      "actions.themeToggle": "深色模式",
      "actions.themeAria": "切换颜色主题",
      "actions.export": "导出 CSV",
      "actions.resetFilters": "重置筛选",
      "summary.heading": "财务概览",
      "summary.balance": "总余额",
      "summary.income": "总收入",
      "summary.expenses": "总支出",
      "chart.title": "现金流概览",
      "chart.meta": "收入与支出",
      "chart.fallback": "展示总收入和总支出的现金流图表。",
      "chart.aria": "现金流图表。收入：{income}。支出：{expenses}。",
      "form.title": "添加交易",
      "form.titleEditing": "编辑交易",
      "form.hint": "* 表示必填字段",
      "form.titleLabel": "标题",
      "form.titlePlaceholder": "例如：自由职业收入",
      "form.amountLabel": "金额",
      "form.amountPlaceholder": "例如：1200 或 -45",
      "form.categoryLabel": "类别",
      "form.dateLabel": "日期",
      "form.add": "添加交易",
      "form.save": "保存修改",
      "form.cancelEdit": "取消编辑",
      "filters.title": "筛选与搜索",
      "filters.category": "类别",
      "filters.type": "类型",
      "filters.search": "按标题搜索",
      "filters.searchPlaceholder": "开始输入...",
      "category.placeholder": "选择类别",
      "category.all": "全部类别",
      "category.Salary": "工资",
      "category.Business": "业务",
      "category.Investments": "投资",
      "category.Housing": "住房",
      "category.Food": "餐饮",
      "category.Transport": "交通",
      "category.Health": "健康",
      "category.Entertainment": "娱乐",
      "category.Education": "教育",
      "category.Other": "其他",
      "type.all": "全部",
      "type.income": "收入",
      "type.expense": "支出",
      "transactions.title": "交易记录",
      "transactions.results": "{count} 条结果",
      "transactions.empty": "还没有交易记录。添加第一笔交易即可开始。",
      "transactions.emptyAction": "添加第一笔交易",
      "transactions.edit": "编辑",
      "transactions.delete": "删除",
      "transactions.editAria": "编辑 {title}",
      "transactions.deleteAria": "删除 {title}",
      "modal.title": "删除这笔交易？",
      "modal.text": "此操作无法撤销。",
      "modal.cancel": "取消",
      "modal.delete": "删除",
      "toast.fixFields": "请修正高亮字段。",
      "toast.updated": "交易已更新。",
      "toast.added": "交易已添加。",
      "toast.editing": "已进入编辑模式。",
      "toast.deleted": "交易已删除。",
      "toast.noExport": "没有可导出的数据。",
      "toast.exported": "CSV 已导出。",
      "toast.cookieAccepted": "Cookie 偏好已保存。",
      "toast.cookieDeclined": "已拒绝非必要 Cookie。",
      "validation.titleRequired": "请输入标题。",
      "validation.amountRequired": "请输入有效且非零的金额。",
      "validation.categoryRequired": "请选择类别。",
      "validation.dateRequired": "请选择日期。",
      "privacy.title": "隐私选择",
      "privacy.text":
        "此记录器仅在你的浏览器中保存交易、主题、语言和 Cookie 偏好；不会使用分析 Cookie。",
      "privacy.accept": "接受",
      "privacy.decline": "拒绝",
      "privacy.link": "隐私政策",
      "footer.note": "你的财务数据仅保存在当前浏览器中。",
      "month.locale": "zh-CN",
    },
  };

  const normalizeLanguage = (language) => {
    return Object.prototype.hasOwnProperty.call(translations, language)
      ? language
      : "en";
  };

  const interpolate = (template, values) => {
    return String(template).replace(/\{(\w+)\}/g, (match, key) =>
      Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match,
    );
  };

  const t = (language, key, values = {}) => {
    const lang = normalizeLanguage(language);
    const template = translations[lang][key] || translations.en[key] || key;
    return interpolate(template, values);
  };

  const parseAmount = (value) => {
    if (typeof value === "string" && value.trim() === "") {
      return Number.NaN;
    }

    return Number(value);
  };

  const validateTransactionInput = (input, language = "en") => {
    const title = String(input.title || "").trim();
    const amount = parseAmount(input.amount);
    const category = String(input.category || "");
    const date = String(input.date || "");
    const errors = {};

    if (!title) {
      errors.title = t(language, "validation.titleRequired");
    }

    if (!Number.isFinite(amount) || amount === 0) {
      errors.amount = t(language, "validation.amountRequired");
    }

    if (!category || !categories.includes(category)) {
      errors.category = t(language, "validation.categoryRequired");
    }

    if (!date) {
      errors.date = t(language, "validation.dateRequired");
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      values: { title, amount, category, date },
    };
  };

  const summarizeTransactions = (transactions) => {
    return transactions.reduce(
      (summary, tx) => {
        const amount = Number(tx.amount) || 0;

        if (amount > 0) {
          summary.income += amount;
        }

        if (amount < 0) {
          summary.expenses += Math.abs(amount);
        }

        summary.balance += amount;
        return summary;
      },
      { income: 0, expenses: 0, balance: 0 },
    );
  };

  const filterTransactions = (transactions, filters) => {
    const category = filters.category || "all";
    const type = filters.type || "all";
    const search = String(filters.search || "").trim().toLowerCase();

    return transactions.filter((tx) => {
      const amount = Number(tx.amount) || 0;
      const matchesCategory = category === "all" || tx.category === category;
      const matchesType =
        type === "all" ||
        (type === "income" && amount > 0) ||
        (type === "expense" && amount < 0);
      const matchesSearch = String(tx.title || "")
        .toLowerCase()
        .includes(search);

      return matchesCategory && matchesType && matchesSearch;
    });
  };

  const toLocalDate = (dateString) => {
    return new Date(`${dateString}T00:00:00`);
  };

  const groupTransactionsByMonth = (transactions, language = "en") => {
    const locale = t(language, "month.locale");
    const sorted = [...transactions].sort(
      (a, b) => toLocalDate(b.date) - toLocalDate(a.date),
    );
    const groups = [];
    const lookup = new Map();

    sorted.forEach((tx) => {
      const label = toLocalDate(tx.date).toLocaleDateString(locale, {
        month: "long",
        year: "numeric",
      });

      if (!lookup.has(label)) {
        lookup.set(label, { label, items: [] });
        groups.push(lookup.get(label));
      }

      lookup.get(label).items.push(tx);
    });

    return groups;
  };

  const formatCurrency = (amount, language = "en") => {
    const locale = language === "zh" ? "zh-CN" : "en-US";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
    }).format(Number(amount) || 0);
  };

  const formatDate = (dateString, language = "en") => {
    const locale = language === "zh" ? "zh-CN" : "en-US";

    return toLocalDate(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryLabel = (category, language = "en") => {
    return t(language, `category.${category}`);
  };

  const escapeHtml = (value) => {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  };

  const createCsv = (transactions) => {
    const headers = ["Title", "Amount", "Category", "Date"];
    const rows = transactions.map((tx) => [
      tx.title,
      tx.amount,
      tx.category,
      tx.date,
    ]);

    return [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
  };

  return {
    categories,
    translations,
    normalizeLanguage,
    t,
    validateTransactionInput,
    summarizeTransactions,
    filterTransactions,
    groupTransactionsByMonth,
    formatCurrency,
    formatDate,
    getCategoryLabel,
    escapeHtml,
    createCsv,
  };
});
