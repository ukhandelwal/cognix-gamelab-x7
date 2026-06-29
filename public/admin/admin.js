/* ============================================
   Cognix GameLab X7 — Admin Panel JS
   ============================================ */

// ===================== CONFIG =====================
const ADMIN_CREDENTIALS = { username: 'admin', password: 'Admin@1234' };
const STORAGE_KEYS = {
  user: 'cognix_user',
  bets: 'cognix_bets',
  deposits: 'cognix_deposits',
  withdrawals: 'cognix_withdrawals',
  wingoHistory: 'cognix_wingo_history',
  adminForce: 'cognix_admin_force',
  adminNotif: 'cognix_admin_notif',
  adminSettings: 'cognix_admin_settings',
};

// ===================== STATE =====================
let state = {
  section: 'overview',
  selectedWingoNum: null,
  editingUser: false,
  notifHistory: [],
  settings: { minWithdraw: 110, payout: 1.96, numMultiplier: 9.0 },
};

// ===================== STORAGE HELPERS =====================
const getLS = (key) => { try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : null; } catch { return null; } };
const setLS = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

// ===================== TOAST =====================
function showToast(msg, type = 'info') {
  const t = document.getElementById('admin-toast');
  t.textContent = msg;
  t.className = `admin-toast ${type}`;
  t.classList.remove('hidden');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add('hidden'), 3500);
}

// ===================== CLOCK =====================
function startClock() {
  const el = document.getElementById('topbar-clock');
  const update = () => { el.textContent = new Date().toLocaleTimeString(); };
  update();
  setInterval(update, 1000);
}

// ===================== AUTH =====================
document.getElementById('login-btn').addEventListener('click', handleLogin);
document.getElementById('admin-user-input').addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });
document.getElementById('admin-pass-input').addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });

function handleLogin() {
  const u = document.getElementById('admin-user-input').value.trim();
  const p = document.getElementById('admin-pass-input').value;
  const errEl = document.getElementById('login-error');
  if (u === ADMIN_CREDENTIALS.username && p === ADMIN_CREDENTIALS.password) {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    startClock();
    loadSection('overview');
  } else {
    errEl.classList.remove('hidden');
  }
}

document.getElementById('logout-btn').addEventListener('click', () => {
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('admin-user-input').value = '';
  document.getElementById('admin-pass-input').value = '';
});

// ===================== NAVIGATION =====================
document.querySelectorAll('.nav-link').forEach(btn => {
  btn.addEventListener('click', () => {
    const sec = btn.dataset.section;
    document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadSection(sec);
  });
});

const SECTION_TITLES = {
  'overview': ['Overview', 'Platform Summary'],
  'users': ['Users', 'Manage Registered Users'],
  'deposits': ['Deposits', 'Deposit Management'],
  'withdrawals': ['Withdrawals', 'Withdrawal Management'],
  'bets': ['Bet History', 'All Bet Records'],
  'game-control': ['Game Control', 'Override Results & Manage Rounds'],
  'notifications': ['Notifications', 'Send In-App Messages'],
  'settings': ['Settings', 'Platform Configuration'],
};

function loadSection(name) {
  state.section = name;
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById(`section-${name}`);
  if (sec) sec.classList.add('active');
  const titles = SECTION_TITLES[name] || [name, ''];
  document.getElementById('page-title').textContent = titles[0];
  document.getElementById('page-subtitle').textContent = titles[1];

  // Render
  const renders = {
    'overview': renderOverview,
    'users': renderUsers,
    'deposits': renderDeposits,
    'withdrawals': renderWithdrawals,
    'bets': renderBets,
    'game-control': renderGameControl,
    'notifications': renderNotifications,
    'settings': renderSettings,
  };
  if (renders[name]) renders[name]();
}

// ===================== DATA HELPERS =====================
function getData() {
  return {
    user: getLS(STORAGE_KEYS.user) || { uid: '10398', phone: '4545454545', balance: 0, deposit: 0, withdraw: 0, vipLevel: 0 },
    bets: getLS(STORAGE_KEYS.bets) || [],
    deposits: getLS(STORAGE_KEYS.deposits) || [],
    withdrawals: getLS(STORAGE_KEYS.withdrawals) || [],
    wingoHistory: getLS(STORAGE_KEYS.wingoHistory) || {},
  };
}

function formatMoney(n) { return '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

function statusChip(s) {
  const map = { 'Success': 'success', 'Failed': 'failed', 'Pending': 'pending' };
  const cls = map[s] || 'pending';
  return `<span class="status-chip status-${cls}">${s}</span>`;
}

// ===================== OVERVIEW =====================
function renderOverview() {
  const { user, bets, deposits, withdrawals } = getData();

  const totalDep = deposits.reduce((a, d) => a + (d.status === 'Success' ? d.amount : 0), 0);
  const totalWith = withdrawals.reduce((a, w) => a + (w.status === 'Success' ? w.amount : 0), 0);
  const totalWinnings = bets.reduce((a, b) => a + (b.status === 'Success' ? b.payout : 0), 0);
  const netProfit = totalDep - totalWith;

  document.getElementById('stat-total-deposit').textContent = formatMoney(totalDep);
  document.getElementById('stat-total-withdraw').textContent = formatMoney(totalWith);
  document.getElementById('stat-total-bets').textContent = bets.length;
  document.getElementById('stat-users').textContent = formatMoney(user.balance);

  document.getElementById('rev-deposit').textContent = formatMoney(totalDep);
  document.getElementById('rev-withdraw').textContent = formatMoney(totalWith);
  document.getElementById('rev-winnings').textContent = formatMoney(totalWinnings);
  document.getElementById('rev-net').textContent = formatMoney(netProfit);

  // Chart
  const won = bets.filter(b => b.status === 'Success').length;
  const lost = bets.filter(b => b.status === 'Failed').length;
  const pending = bets.filter(b => b.status === 'Pending').length;
  const total = won + lost + pending || 1;

  document.getElementById('bar-success').style.height = `${Math.max(4, (won / total) * 140)}px`;
  document.getElementById('bar-failed').style.height = `${Math.max(4, (lost / total) * 140)}px`;
  document.getElementById('bar-pending').style.height = `${Math.max(4, (pending / total) * 140)}px`;
  document.getElementById('legend-won').textContent = won;
  document.getElementById('legend-lost').textContent = lost;
  document.getElementById('legend-pending').textContent = pending;

  renderActivity();
}

function renderActivity() {
  const { bets, deposits, withdrawals } = getData();
  const items = [];
  deposits.slice(0, 5).forEach(d => items.push({ type: 'dep', text: `Deposit ${formatMoney(d.amount)} via ${d.channel}`, time: d.time, status: d.status }));
  withdrawals.slice(0, 5).forEach(w => items.push({ type: 'with', text: `Withdrawal ${formatMoney(w.amount)}`, time: w.time, status: w.status }));
  bets.filter(b => b.status !== 'Pending').slice(0, 5).forEach(b => {
    const type = b.status === 'Success' ? 'bet-win' : 'bet-lose';
    items.push({ type, text: `${b.game} bet on "${b.selection}" — ${b.status}`, time: b.time });
  });

  items.sort((a, b) => new Date(b.time) - new Date(a.time));

  const el = document.getElementById('activity-list');
  if (!items.length) { el.innerHTML = '<div class="activity-empty">No recent activity</div>'; return; }
  el.innerHTML = items.slice(0, 10).map(i => `
    <div class="activity-item">
      <div class="activity-dot ${i.type}"></div>
      <span class="activity-text">${i.text}</span>
      <span class="activity-time">${(i.time || '').substring(11, 19)}</span>
    </div>
  `).join('');
}

document.getElementById('refresh-activity-btn').addEventListener('click', () => { renderOverview(); showToast('Refreshed!', 'success'); });

// ===================== USERS =====================
function renderUsers() {
  const { user } = getData();
  renderUsersTable(user, '');
}

function renderUsersTable(user, filter) {
  const tbody = document.getElementById('users-tbody');
  const f = filter.toLowerCase();
  const show = !f || user.phone?.toLowerCase().includes(f) || user.uid?.toString().includes(f);
  if (!show) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted)">No users found</td></tr>'; return; }

  tbody.innerHTML = `
    <tr>
      <td class="mono">${user.uid || '—'}</td>
      <td>${user.phone || '—'}</td>
      <td class="mono color-gold">${formatMoney(user.balance)}</td>
      <td class="mono">${formatMoney(user.deposit)}</td>
      <td class="mono">${formatMoney(user.withdraw)}</td>
      <td><span class="badge badge-blue">VIP ${user.vipLevel || 0}</span></td>
      <td>
        <button class="action-btn edit" id="edit-user-btn-main">✏ Edit</button>
      </td>
    </tr>
  `;
  document.getElementById('edit-user-btn-main').addEventListener('click', () => openEditUserModal(user));
}

document.getElementById('user-search').addEventListener('input', e => {
  const { user } = getData();
  renderUsersTable(user, e.target.value);
});

// Edit User Modal
function openEditUserModal(user) {
  document.getElementById('edit-balance').value = user.balance;
  document.getElementById('edit-vip').value = user.vipLevel || 0;
  document.getElementById('edit-add-deposit').value = '';
  document.getElementById('edit-user-modal').classList.remove('hidden');
}

document.getElementById('close-edit-modal').addEventListener('click', () => document.getElementById('edit-user-modal').classList.add('hidden'));
document.getElementById('cancel-edit-modal').addEventListener('click', () => document.getElementById('edit-user-modal').classList.add('hidden'));

document.getElementById('save-edit-user').addEventListener('click', () => {
  const user = getLS(STORAGE_KEYS.user) || {};
  const newBalance = parseFloat(document.getElementById('edit-balance').value);
  const newVip = parseInt(document.getElementById('edit-vip').value);
  const addDep = parseFloat(document.getElementById('edit-add-deposit').value) || 0;

  if (!isNaN(newBalance)) user.balance = newBalance;
  if (!isNaN(newVip)) user.vipLevel = Math.max(0, Math.min(10, newVip));
  if (addDep > 0) {
    user.deposit = (user.deposit || 0) + addDep;
    const deps = getLS(STORAGE_KEYS.deposits) || [];
    deps.unshift({ id: 'dep_admin_' + Date.now(), amount: addDep, time: new Date().toISOString().replace('T', ' ').substring(0, 19), channel: 'Admin Credit', status: 'Success' });
    setLS(STORAGE_KEYS.deposits, deps);
  }

  setLS(STORAGE_KEYS.user, user);
  document.getElementById('edit-user-modal').classList.add('hidden');
  showToast('User updated successfully!', 'success');
  renderUsers();
});

// ===================== DEPOSITS =====================
function renderDeposits() {
  const { deposits } = getData();
  renderDepositsTable(deposits, 'all');
}

function renderDepositsTable(deposits, filter) {
  const tbody = document.getElementById('deposits-tbody');
  const filtered = filter === 'all' ? deposits : deposits.filter(d => d.status === filter);
  if (!filtered.length) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted)">No records found</td></tr>'; return; }

  tbody.innerHTML = filtered.map(d => `
    <tr>
      <td class="mono" style="font-size:11px">${d.id}</td>
      <td class="mono color-gold">${formatMoney(d.amount)}</td>
      <td>${d.channel || '—'}</td>
      <td class="mono" style="font-size:11px">${d.time}</td>
      <td>${statusChip(d.status)}</td>
      <td>
        <button class="action-btn delete" data-dep-id="${d.id}">🗑</button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.action-btn.delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.depId;
      const deps = (getLS(STORAGE_KEYS.deposits) || []).filter(d => d.id !== id);
      setLS(STORAGE_KEYS.deposits, deps);
      showToast('Deposit record deleted', 'info');
      renderDeposits();
    });
  });
}

document.getElementById('deposit-status-filter').addEventListener('change', e => {
  const { deposits } = getData();
  renderDepositsTable(deposits, e.target.value);
});

// Add Deposit Modal
document.getElementById('add-deposit-btn').addEventListener('click', () => document.getElementById('add-deposit-modal').classList.remove('hidden'));
document.getElementById('close-dep-modal').addEventListener('click', () => document.getElementById('add-deposit-modal').classList.add('hidden'));
document.getElementById('cancel-dep-modal').addEventListener('click', () => document.getElementById('add-deposit-modal').classList.add('hidden'));

document.getElementById('save-dep-modal').addEventListener('click', () => {
  const amount = parseFloat(document.getElementById('dep-amount').value);
  const channel = document.getElementById('dep-channel').value;
  const status = document.getElementById('dep-status-sel').value;

  if (!amount || amount <= 0) { showToast('Enter a valid amount', 'error'); return; }

  const deps = getLS(STORAGE_KEYS.deposits) || [];
  const newDep = { id: 'dep_' + Date.now(), amount, channel, status, time: new Date().toISOString().replace('T', ' ').substring(0, 19) };
  deps.unshift(newDep);
  setLS(STORAGE_KEYS.deposits, deps);

  // If Success, update user balance
  if (status === 'Success') {
    const user = getLS(STORAGE_KEYS.user) || {};
    user.balance = parseFloat(((user.balance || 0) + amount).toFixed(2));
    user.deposit = (user.deposit || 0) + amount;
    setLS(STORAGE_KEYS.user, user);
  }

  document.getElementById('add-deposit-modal').classList.add('hidden');
  document.getElementById('dep-amount').value = '';
  showToast(`Deposit of ${formatMoney(amount)} added!`, 'success');
  renderDeposits();
});

// ===================== WITHDRAWALS =====================
function renderWithdrawals() {
  const { withdrawals } = getData();
  renderWithdrawalsTable(withdrawals, 'all');
}

function renderWithdrawalsTable(withdrawals, filter) {
  const tbody = document.getElementById('withdrawals-tbody');
  const filtered = filter === 'all' ? withdrawals : withdrawals.filter(w => w.status === filter);
  if (!filtered.length) { tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--text-muted)">No records found</td></tr>'; return; }

  tbody.innerHTML = filtered.map(w => `
    <tr>
      <td class="mono" style="font-size:11px">${w.id}</td>
      <td class="mono color-red">${formatMoney(w.amount)}</td>
      <td class="mono" style="font-size:11px">${w.time}</td>
      <td>${statusChip(w.status)}</td>
      <td>
        <button class="action-btn approve" data-with-id="${w.id}" data-action="Success">✓ Approve</button>
        <button class="action-btn reject" data-with-id="${w.id}" data-action="Failed" style="margin-left:4px">✕ Reject</button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.action-btn.approve, .action-btn.reject').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.withId;
      const action = btn.dataset.action;
      const withs = getLS(STORAGE_KEYS.withdrawals) || [];
      const idx = withs.findIndex(w => w.id === id);
      if (idx !== -1) {
        const prev = withs[idx].status;
        withs[idx].status = action;
        // If rejecting a previously pending withdrawal, refund balance
        if (prev === 'Pending' && action === 'Failed') {
          const user = getLS(STORAGE_KEYS.user) || {};
          user.balance = parseFloat(((user.balance || 0) + withs[idx].amount).toFixed(2));
          setLS(STORAGE_KEYS.user, user);
        }
        setLS(STORAGE_KEYS.withdrawals, withs);
        showToast(`Withdrawal ${action === 'Success' ? 'approved' : 'rejected'}`, action === 'Success' ? 'success' : 'error');
        renderWithdrawals();
      }
    });
  });
}

document.getElementById('withdraw-status-filter').addEventListener('change', e => {
  const { withdrawals } = getData();
  renderWithdrawalsTable(withdrawals, e.target.value);
});

// ===================== BET HISTORY =====================
function renderBets() {
  const { bets } = getData();
  renderBetsTable(bets, 'all', 'all');
}

function renderBetsTable(bets, gameFilter, statusFilter) {
  const tbody = document.getElementById('bets-tbody');
  let filtered = bets;
  if (gameFilter !== 'all') filtered = filtered.filter(b => b.game === gameFilter);
  if (statusFilter !== 'all') filtered = filtered.filter(b => b.status === statusFilter);

  if (!filtered.length) { tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:24px;color:var(--text-muted)">No bets found</td></tr>'; return; }

  tbody.innerHTML = filtered.map(b => `
    <tr>
      <td class="mono" style="font-size:11px">${b.id}</td>
      <td>${b.game}</td>
      <td><span class="badge badge-blue">${b.mode}</span></td>
      <td>${b.selection}</td>
      <td class="mono">${formatMoney(b.amount)}</td>
      <td style="text-align:center">${b.resultNumber !== null ? `<strong>${b.resultNumber}</strong>` : '—'}</td>
      <td class="mono ${b.status === 'Success' ? 'color-green' : ''}">${b.status === 'Success' ? formatMoney(b.payout) : '—'}</td>
      <td>${statusChip(b.status)}</td>
      <td class="mono" style="font-size:11px">${b.time}</td>
    </tr>
  `).join('');
}

document.getElementById('bet-game-filter').addEventListener('change', () => applyBetFilters());
document.getElementById('bet-status-filter').addEventListener('change', () => applyBetFilters());

function applyBetFilters() {
  const { bets } = getData();
  const gf = document.getElementById('bet-game-filter').value;
  const sf = document.getElementById('bet-status-filter').value;
  renderBetsTable(bets, gf, sf);
}

// ===================== GAME CONTROL =====================
let selectedForceNum = null;

function renderGameControl() {
  // Number picker
  document.querySelectorAll('.num-btn').forEach(btn => {
    btn.classList.remove('selected');
    btn.addEventListener('click', () => {
      selectedForceNum = parseInt(btn.dataset.num);
      document.querySelectorAll('.num-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Check existing override
  const existing = getLS(STORAGE_KEYS.adminForce);
  if (existing) {
    const s = document.getElementById('wingo-force-status');
    s.textContent = `⚡ Override Active: ${existing.mode} → Number ${existing.number}`;
    s.className = 'force-status';
    s.classList.remove('hidden');
  }

  renderWingoHistory();
  renderPendingBets();

  // History mode change
  document.getElementById('gc-history-mode').addEventListener('change', renderWingoHistory);
}

document.getElementById('gc-set-wingo').addEventListener('click', () => {
  if (selectedForceNum === null) { showToast('Select a number first!', 'error'); return; }
  const mode = document.getElementById('gc-wingo-mode').value;
  const override = { mode, number: selectedForceNum, setAt: Date.now() };
  setLS(STORAGE_KEYS.adminForce, override);
  const s = document.getElementById('wingo-force-status');
  s.textContent = `⚡ Override Set! ${mode} → Number ${selectedForceNum}`;
  s.className = 'force-status';
  s.classList.remove('hidden');
  showToast(`Override set: ${mode} → ${selectedForceNum}`, 'success');
});

document.getElementById('gc-clear-wingo').addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEYS.adminForce);
  const s = document.getElementById('wingo-force-status');
  s.classList.add('hidden');
  showToast('Override cleared', 'info');
});

function renderWingoHistory() {
  const mode = document.getElementById('gc-history-mode')?.value || '30Sec';
  const history = getLS(STORAGE_KEYS.wingoHistory) || {};
  const records = history[mode] || [];
  const el = document.getElementById('wingo-history-list');

  if (!records.length) { el.innerHTML = '<div class="activity-empty">No history for this mode</div>'; return; }

  el.innerHTML = records.slice(0, 20).map(r => {
    const cls = r.color === 'red-violet' ? 'red-violet' : r.color === 'green-violet' ? 'green-violet' : r.color;
    return `
      <div class="history-item">
        <div class="history-num ${cls}">${r.number}</div>
        <span class="history-period">${r.period}</span>
        <span class="history-bs ${r.bigSmall?.toLowerCase()}">${r.bigSmall}</span>
      </div>
    `;
  }).join('');
}

function renderPendingBets() {
  const { bets } = getData();
  const pending = bets.filter(b => b.status === 'Pending');
  document.getElementById('pending-count-badge').textContent = `${pending.length} Pending`;

  const tbody = document.getElementById('pending-bets-tbody');
  if (!pending.length) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted)">No pending bets</td></tr>'; return; }

  tbody.innerHTML = pending.map(b => `
    <tr>
      <td class="mono" style="font-size:11px">${b.id}</td>
      <td>${b.game}</td>
      <td>${b.selection}</td>
      <td class="mono">${formatMoney(b.amount)}</td>
      <td class="mono" style="font-size:11px">${b.period}</td>
      <td>
        <button class="action-btn win" data-bet-id="${b.id}" data-result="win">✓ Win</button>
        <button class="action-btn lose" data-bet-id="${b.id}" data-result="lose" style="margin-left:4px">✕ Lose</button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.betId;
      const result = btn.dataset.result;
      overridePendingBet(id, result);
    });
  });
}

function overridePendingBet(betId, result) {
  let bets = getLS(STORAGE_KEYS.bets) || [];
  const idx = bets.findIndex(b => b.id === betId);
  if (idx === -1) return;

  const bet = bets[idx];
  const settings = getLS(STORAGE_KEYS.adminSettings) || state.settings;
  const payoutRatio = settings.payout || 1.96;

  if (result === 'win') {
    const payout = parseFloat((bet.amount * payoutRatio).toFixed(2));
    bets[idx] = { ...bet, status: 'Success', payout, resultNumber: 5 };
    const user = getLS(STORAGE_KEYS.user) || {};
    user.balance = parseFloat(((user.balance || 0) + payout).toFixed(2));
    setLS(STORAGE_KEYS.user, user);
    showToast(`Bet ${betId.substring(0, 12)} forced WIN (₹${payout} paid)`, 'success');
  } else {
    bets[idx] = { ...bet, status: 'Failed', payout: 0, resultNumber: 2 };
    showToast(`Bet ${betId.substring(0, 12)} forced LOSE`, 'error');
  }

  setLS(STORAGE_KEYS.bets, bets);
  renderPendingBets();
}

// ===================== NOTIFICATIONS =====================
function renderNotifications() {
  const history = state.notifHistory;
  const el = document.getElementById('notif-history');
  if (!history.length) { el.innerHTML = '<div class="activity-empty">No notifications sent yet</div>'; return; }
  el.innerHTML = history.map(n => `
    <div class="activity-item">
      <div class="activity-dot ${n.type === 'success' ? 'bet-win' : n.type === 'error' ? 'bet-lose' : 'dep'}"></div>
      <span class="activity-text">${n.message}</span>
      <span class="activity-time">${n.time}</span>
    </div>
  `).join('');
}

document.getElementById('send-notif-btn').addEventListener('click', () => {
  const msg = document.getElementById('notif-message').value.trim();
  const type = document.getElementById('notif-type').value;
  if (!msg) { showToast('Enter a message', 'error'); return; }

  // Save to LS for the app to pick up
  setLS(STORAGE_KEYS.adminNotif, { message: msg, type, sentAt: Date.now() });

  // Log
  const time = new Date().toLocaleTimeString();
  state.notifHistory.unshift({ message: msg, type, time });
  document.getElementById('notif-message').value = '';

  const s = document.getElementById('notif-status');
  s.textContent = `✓ Notification queued. It will appear in the app on next render.`;
  s.className = 'force-status';
  s.classList.remove('hidden');
  setTimeout(() => s.classList.add('hidden'), 4000);

  showToast('Notification sent!', 'success');
  renderNotifications();
});

// ===================== SETTINGS =====================
function renderSettings() {
  const saved = getLS(STORAGE_KEYS.adminSettings);
  if (saved) {
    document.getElementById('setting-min-withdraw').value = saved.minWithdraw || 110;
    document.getElementById('setting-payout').value = saved.payout || 1.96;
    document.getElementById('setting-num-mult').value = saved.numMultiplier || 9.0;
  }
}

document.getElementById('save-settings-btn').addEventListener('click', () => {
  const settings = {
    minWithdraw: parseFloat(document.getElementById('setting-min-withdraw').value) || 110,
    payout: parseFloat(document.getElementById('setting-payout').value) || 1.96,
    numMultiplier: parseFloat(document.getElementById('setting-num-mult').value) || 9.0,
  };
  setLS(STORAGE_KEYS.adminSettings, settings);
  state.settings = settings;
  const s = document.getElementById('settings-status');
  s.textContent = '✓ Settings saved successfully!';
  s.className = 'force-status';
  s.classList.remove('hidden');
  setTimeout(() => s.classList.add('hidden'), 3000);
  showToast('Settings saved!', 'success');
});

// Data Management
document.getElementById('clear-bets-btn').addEventListener('click', () => {
  if (!confirm('Clear ALL bet records? This cannot be undone.')) return;
  setLS(STORAGE_KEYS.bets, []);
  showToast('All bets cleared', 'info');
});

document.getElementById('clear-history-btn').addEventListener('click', () => {
  if (!confirm('Clear ALL game history? This cannot be undone.')) return;
  setLS(STORAGE_KEYS.wingoHistory, {});
  showToast('Game history cleared', 'info');
});

document.getElementById('reset-balance-btn').addEventListener('click', () => {
  if (!confirm('Reset user balance to ₹0? This cannot be undone.')) return;
  const user = getLS(STORAGE_KEYS.user) || {};
  user.balance = 0;
  setLS(STORAGE_KEYS.user, user);
  showToast('User balance reset to ₹0', 'info');
});

document.getElementById('full-reset-btn').addEventListener('click', () => {
  if (!confirm('⚠ FULL RESET: This will delete ALL app data (bets, deposits, withdrawals, user, game history). Proceed?')) return;
  [STORAGE_KEYS.user, STORAGE_KEYS.bets, STORAGE_KEYS.deposits, STORAGE_KEYS.withdrawals, STORAGE_KEYS.wingoHistory].forEach(k => localStorage.removeItem(k));
  showToast('Full reset complete. App data wiped.', 'error');
});

// ===================== INIT =====================
// Show login screen by default — nothing to auto-init
console.log('%cCognix Admin Panel Loaded', 'color: #f7a12a; font-size: 16px; font-weight: bold;');
