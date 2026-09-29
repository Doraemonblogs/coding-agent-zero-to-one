// 小账本逻辑脚本：负责记账、汇总、明细、删除和本地保存

// ---------- 常量 ----------

// localStorage 的键名，所有记录都存在这个键下
const STORAGE_KEY = "xiaozhangben_records";

// 支出和收入的分类列表
const EXPENSE_CATEGORIES = ["餐饮", "交通", "购物", "娱乐", "学习", "居住", "其他"];
const INCOME_CATEGORIES = ["工资", "兼职", "红包", "其他"];

// 当前页面状态
const state = {
  currentMonth: "", // 当前查看的月份，格式 YYYY-MM（例如 2026-09）
  type: "expense", // 表单当前选的收支类型
};

// 页面元素的引用，init 里统一获取
let amountInput;
let categorySelect;
let dateInput;
let noteInput;
let formError;
let typeExpenseBtn;
let typeIncomeBtn;
let summaryIncome;
let summaryExpense;
let summaryBalance;
let recordListEl;
let monthLabel;
let prevMonthBtn;
let nextMonthBtn;
let chartEl;

// ---------- 数据层 ----------

// 从 localStorage 读出全部记录。
// 返回前过滤掉字段不全的坏记录（比如 localStorage 被手动改坏），
// 保证后面的代码放心使用每一条，页面不会因为脏数据卡死
function loadRecords() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(data)) {
      return [];
    }
    return data.filter(function (r) {
      return r && typeof r.id === "string"
        && (r.type === "expense" || r.type === "income")
        && typeof r.amountFen === "number" && r.amountFen > 0
        && typeof r.category === "string" && r.category !== ""
        && typeof r.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.date);
    });
  } catch (e) {
    return [];
  }
}

// 把记录数组写回 localStorage；返回 true 表示保存成功，false 表示浏览器没存上
function saveRecords(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return true;
  } catch (e) {
    return false;
  }
}

// ---------- 工具函数 ----------

// 把 Date 对象转成本地时区的 YYYY-MM-DD 字符串（不能用 toISOString，它是 UTC 时区，晚上 8 点后会差一天）
function formatLocalDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

// 把「分」转成显示用的「元」字符串，例如 1234 -> "12.34"
function formatFen(fen) {
  return (fen / 100).toFixed(2);
}

// 生成一条记录的唯一 id，删除时靠它定位
function makeId() {
  return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

// 校验金额输入：合法返回 { ok: true, fen }，不合法返回 { ok: false, error }
function validateAmount(raw) {
  const text = raw.trim();
  if (text === "") {
    return { ok: false, error: "请输入金额" };
  }
  // 只允许数字加最多两位小数；负数、字母、超过两位小数都会被这个正则拒绝
  if (!/^\d+(\.\d{1,2})?$/.test(text)) {
    return { ok: false, error: "金额格式不对：请输入大于 0 的数字，最多两位小数" };
  }
  const fen = Math.round(Number(text) * 100);
  if (fen <= 0) {
    return { ok: false, error: "金额必须大于 0" };
  }
  return { ok: true, fen: fen };
}

// 把 "2026-09" 这样的月份格式化成 "2026年9月" 显示
function formatMonthLabel(ym) {
  const parts = ym.split("-");
  return parts[0] + "年" + Number(parts[1]) + "月";
}

// ---------- 计算 ----------

// 取出当前查看月份的所有记录
function getMonthRecords() {
  return loadRecords().filter((r) => r.date.slice(0, 7) === state.currentMonth);
}

// 汇总一个月的收入和支出（单位都是分，整数运算没有浮点误差），结余 = 收入 - 支出
function getMonthSummary(records) {
  let income = 0;
  let expense = 0;
  for (const r of records) {
    if (r.type === "income") {
      income += r.amountFen;
    } else {
      expense += r.amountFen;
    }
  }
  return { income: income, expense: expense, balance: income - expense };
}

// 统计本月各支出分类的金额和百分比，按金额从高到低排序。
// 没有支出记录时返回空数组（内部不会做除法，也就不会出现除零问题）
function getCategoryStats(records) {
  const totals = new Map();
  let totalExpense = 0;
  for (const r of records) {
    if (r.type !== "expense") {
      continue; // 占比只统计支出
    }
    totals.set(r.category, (totals.get(r.category) || 0) + r.amountFen);
    totalExpense += r.amountFen;
  }
  const stats = [];
  for (const [category, fen] of totals) {
    stats.push({ category: category, fen: fen, percent: (fen / totalExpense) * 100 });
  }
  stats.sort((a, b) => b.fen - a.fen); // 从高到低
  return stats;
}

// ---------- 渲染 ----------

// 渲染入口：取一次当月数据，交给下面的渲染函数，保证各区块永远同步
function renderAll() {
  const monthRecords = getMonthRecords();
  renderSummary(getMonthSummary(monthRecords));
  renderCategories(getCategoryStats(monthRecords));
  renderList(monthRecords);
}

// 渲染支出分类占比横条图：一条占比 = 分类名 + 灰色轨道 + 红色填充条 + 百分比和金额
function renderCategories(stats) {
  chartEl.innerHTML = ""; // 先清空旧内容
  if (stats.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-hint";
    empty.textContent = "本月暂无支出";
    chartEl.appendChild(empty);
    return;
  }
  for (const s of stats) {
    chartEl.appendChild(buildChartRow(s));
  }
}

// 构建一行占比条。分类名是固定分类列表里的值，但同样走 textContent 填充，保持渲染安全
function buildChartRow(s) {
  const row = document.createElement("div");
  row.className = "chart-row";

  const name = document.createElement("span");
  name.className = "chart-name";
  name.textContent = s.category;
  row.appendChild(name);

  const track = document.createElement("div");
  track.className = "chart-track";
  const fill = document.createElement("div");
  fill.className = "chart-fill";
  fill.style.width = s.percent.toFixed(1) + "%"; // 条长按百分比
  track.appendChild(fill);
  row.appendChild(track);

  const meta = document.createElement("span");
  meta.className = "chart-meta";
  meta.textContent = s.percent.toFixed(1) + "% · ¥" + formatFen(s.fen);
  row.appendChild(meta);

  return row;
}

// 渲染本月汇总三个卡片
function renderSummary(summary) {
  summaryIncome.textContent = "¥" + formatFen(summary.income);
  summaryExpense.textContent = "¥" + formatFen(summary.expense);
  summaryBalance.textContent = "¥" + formatFen(summary.balance);
  // 结余为负数时标红提醒，否则恢复默认颜色
  summaryBalance.classList.toggle("expense", summary.balance < 0);
}

// 渲染明细列表：按日期分组，日期新的在上面
function renderList(records) {
  recordListEl.innerHTML = ""; // 先清空旧内容
  if (records.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-hint";
    empty.textContent = "本月还没有记录";
    recordListEl.appendChild(empty);
    return;
  }
  // 用 Map 按日期分组，键是 YYYY-MM-DD
  const groups = new Map();
  for (const rec of records) {
    if (!groups.has(rec.date)) {
      groups.set(rec.date, []);
    }
    groups.get(rec.date).push(rec);
  }
  // 日期字符串按从大到小排，新的在上面
  const dates = [...groups.keys()].sort((a, b) => (a < b ? 1 : -1));
  for (const date of dates) {
    recordListEl.appendChild(buildDateGroup(date, groups.get(date)));
  }
}

// 构建一个日期分组：日期标题 + 该日期的若干条记录
function buildDateGroup(date, dayRecords) {
  const group = document.createElement("div");
  group.className = "date-group";

  const title = document.createElement("div");
  title.className = "date-title";
  title.textContent = date;
  group.appendChild(title);

  for (const rec of dayRecords) {
    group.appendChild(buildRecordRow(rec));
  }
  return group;
}

// 构建一条记录行。
// 安全规则：用户输入（分类、备注）一律用 textContent 填入，
// 这样备注里输入 <b> 之类的字符只会原样显示，不会被当成 HTML 变成粗体。
function buildRecordRow(rec) {
  const row = document.createElement("div");
  row.className = "record-row";

  const info = document.createElement("div");
  info.className = "record-info";
  const category = document.createElement("span");
  category.className = "record-category";
  category.textContent = rec.category;
  info.appendChild(category);
  if (rec.note !== "") {
    const note = document.createElement("span");
    note.className = "record-note";
    note.textContent = rec.note;
    info.appendChild(note);
  }
  row.appendChild(info);

  const right = document.createElement("div");
  right.className = "record-right";
  const amount = document.createElement("span");
  amount.className = "record-amount " + (rec.type === "income" ? "income" : "expense");
  const sign = rec.type === "income" ? "+¥" : "-¥";
  amount.textContent = sign + formatFen(rec.amountFen);
  right.appendChild(amount);

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "删除";
  deleteBtn.addEventListener("click", function () {
    deleteRecord(rec.id);
  });
  right.appendChild(deleteBtn);

  row.appendChild(right);
  return row;
}

// ---------- 交互 ----------

// 表单提交：校验金额，合法就存一条记录并刷新页面显示
function handleSubmit(e) {
  e.preventDefault(); // 阻止表单默认的提交刷新页面行为

  const result = validateAmount(amountInput.value);
  if (!result.ok) {
    showError(result.error);
    return; // 不合法：只提示错误，不添加记录
  }
  // 日期不能为空：日期框被手动清空时，会存进一条任何月份都看不到的记录
  if (dateInput.value === "") {
    showError("请选择日期");
    return;
  }
  const record = {
    id: makeId(),
    type: state.type,
    amountFen: result.fen,
    category: categorySelect.value,
    date: dateInput.value,
    note: noteInput.value.trim(),
  };
  const records = loadRecords();
  records.unshift(record); // 新记录放在数组最前面
  if (!saveRecords(records)) {
    alert("保存失败：浏览器没有存上这条记录，请检查浏览器设置或存储空间");
    return;
  }
  // 记完后自动切到记录所在的月份，避免切月查看时"刚记的账看不到"
  state.currentMonth = record.date.slice(0, 7);
  monthLabel.textContent = formatMonthLabel(state.currentMonth);
  renderAll();

  // 添加成功后重置表单：清空金额和备注，日期回到今天
  amountInput.value = "";
  noteInput.value = "";
  dateInput.value = formatLocalDate(new Date());
  hideError();
}

// 切换收支类型：更新按钮高亮，并把分类下拉换成对应的分类
function setType(type) {
  state.type = type;
  typeExpenseBtn.classList.toggle("selected", type === "expense");
  typeIncomeBtn.classList.toggle("selected", type === "income");

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  categorySelect.innerHTML = "";
  for (const cat of categories) {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  }
}

// 切换查看的月份：delta 传 1 看下个月，传 -1 看上个月。
// 用 new Date 计算，跨年（12月→1月）由浏览器自动处理
function switchMonth(delta) {
  const parts = state.currentMonth.split("-");
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1 + delta, 1);
  state.currentMonth = formatLocalDate(d).slice(0, 7);
  monthLabel.textContent = formatMonthLabel(state.currentMonth);
  renderAll(); // 汇总、占比、明细一起跟着当前月份刷新
}

// 删除一条记录：先弹窗确认，确认后才删除
function deleteRecord(id) {
  if (!confirm("确定删除这条记录吗？")) {
    return;
  }
  const records = loadRecords().filter((r) => r.id !== id);
  if (!saveRecords(records)) {
    alert("删除失败：浏览器没有保存这次修改");
    return;
  }
  renderAll();
}

// 在表单下方显示红色错误提示
function showError(message) {
  formError.textContent = message;
  formError.hidden = false;
}

// 隐藏错误提示
function hideError() {
  formError.hidden = true;
}

// 页面加载时的初始化：填默认日期、绑定事件、首次渲染
function init() {
  // 获取所有要操作的页面元素
  const form = document.getElementById("entry-form");
  amountInput = document.getElementById("amount-input");
  categorySelect = document.getElementById("category-select");
  dateInput = document.getElementById("date-input");
  noteInput = document.getElementById("note-input");
  formError = document.getElementById("form-error");
  typeExpenseBtn = document.getElementById("type-expense");
  typeIncomeBtn = document.getElementById("type-income");
  summaryIncome = document.getElementById("summary-income");
  summaryExpense = document.getElementById("summary-expense");
  summaryBalance = document.getElementById("summary-balance");
  recordListEl = document.getElementById("record-list");
  monthLabel = document.getElementById("month-label");
  prevMonthBtn = document.getElementById("prev-month-btn");
  nextMonthBtn = document.getElementById("next-month-btn");
  chartEl = document.getElementById("category-chart");

  // 日期默认填今天，默认查看当前月份
  const today = formatLocalDate(new Date());
  dateInput.value = today;
  state.currentMonth = today.slice(0, 7);
  monthLabel.textContent = formatMonthLabel(state.currentMonth);

  // 初始化分类下拉（默认支出分类）
  setType("expense");

  // 绑定事件
  form.addEventListener("submit", handleSubmit);
  typeExpenseBtn.addEventListener("click", function () {
    setType("expense");
  });
  typeIncomeBtn.addEventListener("click", function () {
    setType("income");
  });
  prevMonthBtn.addEventListener("click", function () {
    switchMonth(-1);
  });
  nextMonthBtn.addEventListener("click", function () {
    switchMonth(1);
  });

  // 其他标签页改了记录时（比如两个标签页同时开着记账），
  // 本页面自动重新渲染，保持两边显示一致，减少互相覆盖的机会
  window.addEventListener("storage", function (e) {
    if (e.key === STORAGE_KEY) {
      renderAll();
    }
  });

  // 第一次渲染页面
  renderAll();
}

// script 放在 body 末尾，此时页面元素已全部就绪，可以直接初始化
init();
