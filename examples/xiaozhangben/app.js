// 小账本：记录收支，按月统计，数据保存在浏览器的 localStorage 里

const STORAGE_KEY = 'xiaozhangben.records';

// 分类及对应的图标
const CATEGORIES = {
  expense: [
    { name: '餐饮', icon: '🍜' },
    { name: '交通', icon: '🚌' },
    { name: '购物', icon: '🛍️' },
    { name: '娱乐', icon: '🎮' },
    { name: '居住', icon: '🏠' },
    { name: '其他', icon: '📦' },
  ],
  income: [
    { name: '工资', icon: '💼' },
    { name: '兼职', icon: '🧾' },
    { name: '红包', icon: '🧧' },
    { name: '其他', icon: '💰' },
  ],
};

// 当前查看的月份（年、月）
const today = new Date();
let viewYear = today.getFullYear();
let viewMonth = today.getMonth(); // 0 表示 1 月

let records = loadRecords();

const form = document.getElementById('record-form');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const dateInput = document.getElementById('date');
const noteInput = document.getElementById('note');
const formError = document.getElementById('form-error');

// 从 localStorage 读取记录，读取失败时返回空列表
function loadRecords() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// 把记录保存到 localStorage
function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// 把日期格式化成 YYYY-MM-DD
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 金额显示成 ¥1,234.50
function formatMoney(value) {
  return '¥' + value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// 当前选中的收支类型
function currentType() {
  return form.querySelector('input[name="type"]:checked').value;
}

// 根据收支类型刷新分类下拉框
function renderCategoryOptions() {
  const options = CATEGORIES[currentType()];
  categorySelect.innerHTML = options
    .map((c) => `<option value="${c.name}">${c.icon} ${c.name}</option>`)
    .join('');
}

// 查找分类图标
function iconOf(type, category) {
  const found = CATEGORIES[type].find((c) => c.name === category);
  return found ? found.icon : '📌';
}

// 检查金额输入：必须是大于 0、最多两位小数的数字
function parseAmount(text) {
  const value = text.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return null;
  const amount = Number(value);
  if (amount <= 0 || amount > 10000000) return null;
  return amount;
}

// 当前查看月份的记录
function recordsOfViewMonth() {
  const prefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
  return records.filter((r) => r.date.startsWith(prefix));
}

// 渲染本月收入、支出、结余
function renderSummary(list) {
  const income = list.filter((r) => r.type === 'income').reduce((s, r) => s + r.amount, 0);
  const expense = list.filter((r) => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
  document.getElementById('sum-income').textContent = formatMoney(income);
  document.getElementById('sum-expense').textContent = formatMoney(expense);
  const balanceEl = document.getElementById('sum-balance');
  balanceEl.textContent = formatMoney(income - expense);
  balanceEl.className = income - expense < 0 ? 'expense' : '';
}

// 渲染支出分类占比条
function renderCategoryBars(list) {
  const container = document.getElementById('category-bars');
  const expenses = list.filter((r) => r.type === 'expense');
  const total = expenses.reduce((s, r) => s + r.amount, 0);
  if (total === 0) {
    container.innerHTML = '<p class="empty">本月还没有支出</p>';
    return;
  }
  const byCategory = {};
  for (const r of expenses) {
    byCategory[r.category] = (byCategory[r.category] || 0) + r.amount;
  }
  container.innerHTML = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => {
      const percent = Math.round((value / total) * 100);
      return `
        <div class="bar-row">
          <span>${iconOf('expense', name)} ${name}</span>
          <div class="bar-track"><div class="bar-fill" style="width:${percent}%"></div></div>
          <span class="bar-value">${percent}%</span>
        </div>`;
    })
    .join('');
}

// 转义用户输入，防止备注里的特殊字符破坏页面
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 渲染按日期分组的明细列表
function renderList(list) {
  const container = document.getElementById('record-list');
  if (list.length === 0) {
    container.innerHTML = '<p class="empty">这个月还没有记录，在上面记一笔吧</p>';
    return;
  }
  const sorted = [...list].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  const groups = {};
  for (const r of sorted) {
    (groups[r.date] = groups[r.date] || []).push(r);
  }
  container.innerHTML = Object.entries(groups)
    .map(([date, items]) => {
      const dayTotal = items.reduce((s, r) => s + (r.type === 'income' ? r.amount : -r.amount), 0);
      const rows = items
        .map(
          (r) => `
          <div class="record">
            <span class="record-icon">${iconOf(r.type, r.category)}</span>
            <span class="record-text">
              <span class="cat">${r.category}</span>
              ${r.note ? `<span class="note">${escapeHtml(r.note)}</span>` : ''}
            </span>
            <span class="record-amount ${r.type}">${r.type === 'income' ? '+' : '-'}${formatMoney(r.amount)}</span>
            <button class="delete-btn" data-id="${r.id}" aria-label="删除这条记录">✕</button>
          </div>`
        )
        .join('');
      return `<div class="day-title"><span>${date.slice(5).replace('-', ' 月 ')} 日</span><span>${dayTotal >= 0 ? '+' : '-'}${formatMoney(Math.abs(dayTotal))}</span></div>${rows}`;
    })
    .join('');
}

// 刷新整个页面的数据显示
function render() {
  document.getElementById('month-label').textContent = `${viewYear} 年 ${viewMonth + 1} 月`;
  const list = recordsOfViewMonth();
  renderSummary(list);
  renderCategoryBars(list);
  renderList(list);
}

// 提交表单：检查输入，添加一条记录
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const amount = parseAmount(amountInput.value);
  if (amount === null) {
    formError.textContent = '请输入大于 0 的金额，最多两位小数';
    amountInput.focus();
    return;
  }
  if (!dateInput.value) {
    formError.textContent = '请选择日期';
    return;
  }
  formError.textContent = '';
  records.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    type: currentType(),
    amount,
    category: categorySelect.value,
    date: dateInput.value,
    note: noteInput.value.trim(),
    createdAt: Date.now(),
  });
  saveRecords();
  // 跳到新记录所在的月份
  const [y, m] = dateInput.value.split('-').map(Number);
  viewYear = y;
  viewMonth = m - 1;
  amountInput.value = '';
  noteInput.value = '';
  render();
});

// 删除记录（先确认）
document.getElementById('record-list').addEventListener('click', (event) => {
  const button = event.target.closest('.delete-btn');
  if (!button) return;
  if (!confirm('确定删除这条记录吗？')) return;
  records = records.filter((r) => r.id !== button.dataset.id);
  saveRecords();
  render();
});

// 切换收支类型时，更新分类选项
form.querySelectorAll('input[name="type"]').forEach((radio) => {
  radio.addEventListener('change', renderCategoryOptions);
});

// 切换月份
document.getElementById('prev-month').addEventListener('click', () => {
  viewMonth -= 1;
  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear -= 1;
  }
  render();
});

document.getElementById('next-month').addEventListener('click', () => {
  viewMonth += 1;
  if (viewMonth > 11) {
    viewMonth = 0;
    viewYear += 1;
  }
  render();
});

// 初始化
dateInput.value = formatDate(today);
renderCategoryOptions();
render();
