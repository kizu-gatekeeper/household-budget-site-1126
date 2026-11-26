// Views for HomeLedger. The planner is fully interactive: amounts persist in
// localStorage, totals / split / verdict recompute on every keystroke.
import { CATEGORIES, TEMPLATES, BILLS, GUIDES, FAQS } from "./data.js";

export const money = (n) => "$" + Math.round(n).toLocaleString("en-US");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export function groupTotals(state) {
  const t = { Needs: 0, Wants: 0, Savings: 0 };
  for (const c of CATEGORIES) t[c.group] += Number(state.amounts[c.id]) || 0;
  t.total = t.Needs + t.Wants + t.Savings;
  t.left = state.income - t.total;
  return t;
}

export function viewHome(state) {
  const t = groupTotals(state);
  return `
  <div class="hero"><div class="kicker">Household budgeting, made calm</div>
    <h1>Know where every dollar goes — before the month starts.</h1>
    <p class="lede">HomeLedger is a working household budget planner: an editable monthly budget across 15 real categories, a 50/30/20 analyser that grades your split, ready-made templates for four household situations, a savings-goal calculator and a bill calendar. Your numbers never leave this browser.</p></div>
  <div class="grid cards">
    <article class="card"><div class="label">Your monthly income</div><div class="value">${money(state.income)}</div><p class="note">Take-home, after tax — the only honest starting point.</p></article>
    <article class="card"><div class="label">Planned spending + saving</div><div class="value">${money(t.total)}</div><p class="note">${t.left >= 0 ? `<span class="pos">${money(t.left)} unassigned</span> — give it a job.` : `<span class="neg">${money(-t.left)} over budget</span> — trim before payday.`}</p></article>
    <article class="card"><div class="label">Savings rate</div><div class="value">${state.income ? Math.round((t.Savings / state.income) * 100) : 0}%</div><p class="note">Benchmark: 20%. Every point is about ${money(state.income / 100)} a month.</p></article>
    <article class="card"><div class="label">Emergency cover</div><div class="value">${t.Needs ? (t.Savings / t.Needs).toFixed(1) + " mo" : "—"}</div><p class="note">Months of needs your monthly savings could rebuild, per month saved.</p></article>
  </div>
  <section class="block"><h2>Start in two minutes</h2>
    <div class="two-col">
      <div class="panel"><h3>1 · Open the planner</h3><p>The starter budget is pre-filled with realistic figures for a ${money(5200)} take-home income. Change the income, edit any amount, and watch totals, the needs/wants/savings split and the verdict update instantly.</p><p><a href="#/planner">Open the Budget Planner →</a></p></div>
      <div class="panel"><h3>2 · Or steal a template</h3><p>Four complete budgets — family of four, city couple, first job, tight month — each with a note on the thinking behind it. Load one, then make it yours.</p><p><a href="#/templates">Browse templates →</a></p></div>
    </div></section>
  <section class="block"><h2>The one-page method</h2>
    <div class="two-col">
      <div class="panel"><h3>Give every dollar a job</h3><p>A budget is finished only when income minus planned equals zero — not because you must spend it all, but because 'left unassigned' money quietly evaporates. In the planner, aim the leftover at a savings category until the unassigned line reads $0.</p></div>
      <div class="panel"><h3>Review little, review often</h3><p>Twenty minutes on payday beats a January spreadsheet marathon. Check the three categories that drifted most, move one number, and close the tab. The planner saves as you type, so there is nothing to file.</p></div>
    </div></section>
  <section class="block"><h2>Then set one goal</h2>
    <div class="callout"><p><strong>A budget without a goal is just accounting.</strong> Pick a target — a house deposit, a debt-free date, three months of expenses — and the <a href="#/savings">Savings Goal calculator</a> turns it into one monthly number you can paste straight into the planner.</p></div></section>`;
}

export function viewPlanner(state) {
  const rows = CATEGORIES.map((c) => `
    <tr><td>${esc(c.name)}</td>
      <td><span class="pill ${c.group.toLowerCase()}">${c.group}</span></td>
      <td class="num"><input type="number" min="0" step="10" data-cat="${c.id}" value="${Number(state.amounts[c.id]) || 0}" aria-label="${esc(c.name)} amount"></td>
      <td class="num" data-share="${c.id}">—</td></tr>`).join("");
  return `
  <div class="hero"><div class="kicker">Budget Planner</div><h1>Your month, planned</h1>
  <p class="lede">Edit any amount — totals, shares and the 50/30/20 verdict update as you type, and everything is saved in this browser automatically.</p></div>
  <div class="controls">
    <label>Monthly take-home income ($) <input id="incomeInp" type="number" min="0" step="50" value="${state.income}"></label>
    <label>Load a template <select id="tplSel"><option value="">Choose…</option>${TEMPLATES.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join("")}</select></label>
    <button class="btn ghost" id="resetBtn" type="button">Reset to starter budget</button>
  </div>
  <div class="panel" style="overflow-x:auto"><table class="data">
    <thead><tr><th>Category</th><th>Type</th><th class="num">Per month</th><th class="num">Share of income</th></tr></thead>
    <tbody>${rows}
    <tr class="total"><td colspan="2">Total planned</td><td class="num" id="totalCell">—</td><td class="num" id="totalShare">—</td></tr>
    <tr class="total"><td colspan="2">Left unassigned</td><td class="num" id="leftCell">—</td><td class="num"></td></tr>
    </tbody></table></div>
  <section class="block"><h2>The 50/30/20 check</h2>
    <div class="panel">
      <div class="splitbar" id="splitBar" aria-hidden="true"></div>
      <div id="splitText" style="margin-top:.8rem"></div>
      <div id="verdictBox" style="margin-top:1rem"></div>
    </div></section>`;
}

export function renderPlannerSummary(state) {
  const t = groupTotals(state);
  const inc = state.income || 0;
  const pct = (v) => (inc ? Math.round((v / inc) * 1000) / 10 : 0);
  document.getElementById("totalCell").textContent = money(t.total);
  document.getElementById("totalShare").textContent = inc ? pct(t.total) + "%" : "—";
  const left = document.getElementById("leftCell");
  left.textContent = money(t.left);
  left.className = "num " + (t.left >= 0 ? "pos" : "neg");
  for (const c of CATEGORIES) {
    const cell = document.querySelector(`[data-share="${c.id}"]`);
    if (cell) cell.textContent = inc ? pct(Number(state.amounts[c.id]) || 0) + "%" : "—";
  }
  const bar = document.getElementById("splitBar");
  bar.innerHTML = inc && t.total ? `
    <span style="width:${(t.Needs / t.total) * 100}%;background:#1d4ed8"></span>
    <span style="width:${(t.Wants / t.total) * 100}%;background:#b45309"></span>
    <span style="width:${(t.Savings / t.total) * 100}%;background:#15803d"></span>` : "";
  document.getElementById("splitText").innerHTML =
    `<div class="factline"><span>Needs — target ≈50%</span><b>${money(t.Needs)} · ${pct(t.Needs)}%</b></div>
     <div class="factline"><span>Wants — target ≈30%</span><b>${money(t.Wants)} · ${pct(t.Wants)}%</b></div>
     <div class="factline"><span>Savings — target ≈20%</span><b>${money(t.Savings)} · ${pct(t.Savings)}%</b></div>`;
  const box = document.getElementById("verdictBox");
  let cls = "", msg = "";
  if (!inc) { cls = "warn"; msg = "Enter your take-home income above to grade the split."; }
  else if (t.left < 0) { cls = "warn"; msg = `You are ${money(-t.left)} over income. Cut wants first — dining, shopping and travel are the usual leaks — before touching savings.`; }
  else if (pct(t.Savings) >= 20) msg = `Excellent: savings at ${pct(t.Savings)}% meets the 20% benchmark, and needs sit at ${pct(t.Needs)}%. This budget funds its own future.`;
  else if (pct(t.Needs) > 65) { cls = "warn"; msg = `Needs consume ${pct(t.Needs)}% of income — housing is almost certainly the driver. The fix is structural (rent, refinancing, location), not skipping coffee.`; }
  else msg = `Workable, with room to grow: savings are ${pct(t.Savings)}% against a 20% benchmark. Moving ${money(Math.max(0, inc * 0.2 - t.Savings))} a month from wants would close the gap.`;
  box.innerHTML = `<div class="callout ${cls}"><p>${msg}</p></div>`;
}

export function viewTemplates() {
  return `
  <div class="hero"><div class="kicker">Templates</div><h1>Four real budgets, ready to steal</h1>
  <p class="lede">Each template is a complete, internally consistent month. Load one into the planner, then adjust the three or four numbers that differ in your life.</p></div>
  <section class="block"><div class="grid cards" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">
    ${TEMPLATES.map((t) => {
      const total = Object.values(t.amounts).reduce((a, b) => a + b, 0);
      const sav = t.amounts.emergency + t.amounts.retirement + t.amounts.goals;
      return `<article class="card"><div class="label">${esc(t.name)}</div>
        <div class="value">${money(t.income)}<span style="font-size:.95rem;color:var(--muted)"> /mo</span></div>
        <p class="note">${esc(t.blurb)}</p>
        <p class="note">Planned: ${money(total)} · Savings: ${money(sav)} (${Math.round((sav / t.income) * 100)}%) · Left: ${money(t.income - total)}</p>
        <p><button class="btn" type="button" data-load="${t.id}">Load into planner</button></p></article>`;
    }).join("")}
  </div></section>`;
}

export function viewSavings(params) {
  const goal = Number(params.get("goal")) || 12000;
  const have = Number(params.get("have")) || 1500;
  const months = Number(params.get("months")) || 24;
  const rate = Number(params.get("rate")) || 4;
  const need = Math.max(goal - have, 0);
  const r = rate / 100 / 12;
  const pmt = need <= 0 ? 0 : r > 0 ? (need * r) / ((1 + r) ** months - 1) : need / months;
  const grown = pmt * months;
  return `
  <div class="hero"><div class="kicker">Savings Goal Calculator</div><h1>Turn a dream into a monthly number</h1>
  <p class="lede">House deposit, wedding, debt-free cushion, the big trip — set the target and the date, and get the exact monthly amount, including interest working for you.</p></div>
  <div class="controls">
    <label>Goal amount ($) <input id="goalInp" type="number" min="0" step="100" value="${goal}"></label>
    <label>Already saved ($) <input id="haveInp" type="number" min="0" step="100" value="${have}"></label>
    <label>Months to save <input id="monthsInp" type="number" min="1" max="600" step="1" value="${months}"></label>
    <label>Account interest (%/yr) <input id="rateInp" type="number" min="0" max="20" step="0.25" value="${rate}"></label>
  </div>
  <div class="two-col">
    <div class="panel"><h3>Save this much, monthly</h3><div class="big pos">${money(pmt)}</div>
      <p class="sr-note">Over ${months} months you contribute ${money(grown)}; interest adds about ${money(Math.max(need - grown, 0))} toward the remaining ${money(need)}.</p></div>
    <div class="panel"><h3>What that buys you</h3>
      <div class="factline"><span>After 6 months</span><b>${money(have + pmt * 6)}</b></div>
      <div class="factline"><span>After 12 months</span><b>${money(have + pmt * 12)}</b></div>
      <div class="factline"><span>Halfway there</span><b>${money(have + need / 2)} at month ${Math.ceil(months / 2)}</b></div>
      <div class="factline"><span>Goal reached</span><b>${money(goal)} at month ${months}</b></div>
      <p class="sr-note">Paste ${money(pmt)} into the planner's savings categories and the goal is funded by construction.</p></div>
  </div>
  <section class="block"><h2>Milestone ladder — building an emergency fund</h2>
    <div class="panel">${[["Starter cushion", 1000], ["One month of typical needs", 3400], ["Three months of needs", 10200], ["Six months of needs", 20400]].map(([n, v]) => `
      <div class="bar-row"><span>${n}</span><span class="bar-track"><span class="bar-fill" style="display:block;width:${Math.min((have / v) * 100, 100)}%"></span></span><span class="bar-val">${money(v)}</span></div>`).join("")}
    <p class="sr-note">Bars show your 'already saved' against each rung. Needs figures use the typical-needs example from the guides.</p></div></section>`;
}

export function viewBills() {
  const total = BILLS.reduce((a, b) => a + b.amount, 0);
  const rows = [...BILLS].sort((a, b) => a.day - b.day).map((b) => `
    <div class="bar-row"><span>${esc(b.name)} · due day ${b.day}</span>
    <span class="bar-track"><span class="bar-fill" style="display:block;width:${Math.round((b.day / 31) * 100)}%"></span></span>
    <span class="bar-val">${money(b.amount)}</span></div>`).join("");
  return `
  <div class="hero"><div class="kicker">Bill Calendar</div><h1>Never let a due date ambush you</h1>
  <p class="lede">A typical household's fixed bills, laid across the month. The bar shows when in the month each bill lands; the trick is making sure payday arrives before the cluster does.</p></div>
  <section class="block"><div class="panel">${rows}
    <div class="factline"><span><strong>Total fixed bills</strong></span><b>${money(total)} / month</b></div>
    <p class="sr-note">First-half bills (days 1–15): ${money(BILLS.filter((b) => b.day <= 15).reduce((a, b) => a + b.amount, 0))} · Second-half: ${money(BILLS.filter((b) => b.day > 15).reduce((a, b) => a + b.amount, 0))}. If most bills land before mid-month but you're paid on the 25th, ask providers to move due dates — most will, free, once.</p></div></section>
  <section class="block"><div class="callout"><p><strong>The two-account trick:</strong> route a fixed 'bills amount' into a separate account on payday and let every direct debit leave from there. Your spending account can then hit zero without a bill ever bouncing.</p></div></section>`;
}

export function viewGuides() {
  return `
  <div class="hero"><div class="kicker">Guides &amp; FAQ</div><h1>The short library of household money</h1>
  <p class="lede">Five plain-language guides covering the ideas the planner is built on — then the questions every household asks.</p></div>
  ${GUIDES.map((g) => `<section class="block"><h2>${esc(g.title)}</h2><div class="panel"><p style="margin:.2rem 0">${esc(g.body)}</p></div></section>`).join("")}
  <section class="block"><h2>Frequently asked questions</h2><div class="panel">
    ${FAQS.map((f) => `<details class="faq"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}
  </div></section>`;
}
