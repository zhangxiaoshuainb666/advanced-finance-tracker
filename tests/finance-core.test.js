const test = require("node:test");
const assert = require("node:assert/strict");

const {
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
} = require("../finance-core");

const sampleTransactions = [
  {
    id: "tx_1",
    title: "Salary",
    amount: 3000,
    category: "Salary",
    date: "2026-05-10",
  },
  {
    id: "tx_2",
    title: "Rent",
    amount: -1200,
    category: "Housing",
    date: "2026-05-02",
  },
  {
    id: "tx_3",
    title: "Coffee",
    amount: -6.5,
    category: "Food",
    date: "2026-04-29",
  },
];

test("normalizes unsupported language codes to English", () => {
  assert.equal(normalizeLanguage("zh"), "zh");
  assert.equal(normalizeLanguage("fr"), "en");
});

test("translates keys and interpolates values", () => {
  assert.equal(t("en", "transactions.results", { count: 2 }), "2 results");
  assert.equal(t("zh", "category.Food"), "餐饮");
  assert.equal(t("en", "missing.key"), "missing.key");
});

test("validates transaction input and returns normalized values", () => {
  const result = validateTransactionInput({
    title: "  Bonus  ",
    amount: "250",
    category: "Business",
    date: "2026-05-11",
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
  assert.deepEqual(result.values, {
    title: "Bonus",
    amount: 250,
    category: "Business",
    date: "2026-05-11",
  });
});

test("treats blank and non-finite amounts as invalid", () => {
  const blank = validateTransactionInput({
    title: "Lunch",
    amount: "   ",
    category: "Food",
    date: "2026-05-11",
  });
  const infinity = validateTransactionInput({
    title: "Bad amount",
    amount: "Infinity",
    category: "Other",
    date: "2026-05-11",
  });

  assert.equal(blank.isValid, false);
  assert.equal(infinity.isValid, false);
  assert.ok(blank.errors.amount);
  assert.ok(infinity.errors.amount);
});

test("reports all invalid transaction fields", () => {
  const result = validateTransactionInput({
    title: " ",
    amount: "0",
    category: "Unknown",
    date: "",
  });

  assert.equal(result.isValid, false);
  assert.match(result.errors.title, /required/i);
  assert.match(result.errors.amount, /non-zero/i);
  assert.match(result.errors.category, /category/i);
  assert.match(result.errors.date, /date/i);
});

test("summarizes income, expenses, and balance", () => {
  assert.deepEqual(summarizeTransactions(sampleTransactions), {
    income: 3000,
    expenses: 1206.5,
    balance: 1793.5,
  });
});

test("summarizes invalid numeric values as zero", () => {
  assert.deepEqual(
    summarizeTransactions([{ title: "Unknown", amount: "bad" }]),
    { income: 0, expenses: 0, balance: 0 },
  );
});

test("filters transactions by category, type, and search", () => {
  const expenses = filterTransactions(sampleTransactions, {
    category: "all",
    type: "expense",
    search: "",
  });
  assert.deepEqual(
    expenses.map((tx) => tx.id),
    ["tx_2", "tx_3"],
  );

  const foodSearch = filterTransactions(sampleTransactions, {
    category: "Food",
    type: "all",
    search: "cof",
  });
  assert.deepEqual(
    foodSearch.map((tx) => tx.id),
    ["tx_3"],
  );
});

test("uses default filters when filter values are missing", () => {
  const filtered = filterTransactions(
    [{ id: "tx_4", title: null, amount: "not-a-number", category: "Other" }],
    {},
  );

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, "tx_4");
});

test("groups transactions by month in descending date order", () => {
  const groups = groupTransactionsByMonth(sampleTransactions, "en");

  assert.equal(groups.length, 2);
  assert.equal(groups[0].label, "May 2026");
  assert.deepEqual(
    groups[0].items.map((tx) => tx.id),
    ["tx_1", "tx_2"],
  );
  assert.equal(groups[1].label, "April 2026");
});

test("formats currency, dates, and category labels by language", () => {
  assert.match(formatCurrency(12.5, "en"), /^\$12\.50$/);
  assert.match(formatCurrency(12.5, "zh"), /12\.50/);
  assert.equal(formatDate("2026-05-11", "en"), "May 11, 2026");
  assert.equal(getCategoryLabel("Transport", "zh"), "交通");
});

test("escapes HTML before rendering user-controlled values", () => {
  assert.equal(
    escapeHtml(`<img src=x onerror="alert('x')">`),
    "&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;",
  );
});

test("creates escaped CSV output", () => {
  const csv = createCsv([
    {
      title: 'Client "A"',
      amount: 100,
      category: "Business",
      date: "2026-05-11",
    },
  ]);

  assert.equal(
    csv,
    '"Title","Amount","Category","Date"\n"Client ""A""","100","Business","2026-05-11"',
  );
});
