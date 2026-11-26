// HomeLedger router + planner state (persisted in localStorage).
import { DEFAULT_STATE, CATEGORIES, TEMPLATES } from "./data.js";
import { viewHome, viewPlanner, viewTemplates, viewSavings, viewBills, viewGuides, renderPlannerSummary } from "./views.js";

const KEY = "homeledger-budget-v1";
const app = document.getElementById("app");

function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const s = JSON.parse(raw);
    if (typeof s.income !== "number" || typeof s.amounts !== "object") return structuredClone(DEFAULT_STATE);
    for (const c of CATEGORIES) if (typeof s.amounts[c.id] !== "number") s.amounts[c.id] = c.def;
    return s;
  } catch { return structuredClone(DEFAULT_STATE); }
}
let state = loadState();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode */ } };

function render() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [route, qs] = raw.split("?");
  const params = new URLSearchParams(qs || "");
  let nav = route || "home";
  if (route === "" || route === "home") app.innerHTML = viewHome(state);
  else if (route === "planner") { app.innerHTML = viewPlanner(state); wirePlanner(); }
  else if (route === "templates") { app.innerHTML = viewTemplates(); wireTemplates(); }
  else if (route === "savings") { app.innerHTML = viewSavings(params); wireSavings(params); }
  else if (route === "bills") app.innerHTML = viewBills();
  else if (route === "guides") app.innerHTML = viewGuides();
  else { app.innerHTML = viewHome(state); nav = "home"; }
  document.querySelectorAll(".mainnav a").forEach((a) => a.classList.toggle("active", a.dataset.nav === nav));
  window.scrollTo(0, 0);
}

function wirePlanner() {
  renderPlannerSummary(state);
  const income = document.getElementById("incomeInp");
  income.addEventListener("input", () => { state.income = Number(income.value) || 0; save(); renderPlannerSummary(state); });
  app.querySelectorAll("input[data-cat]").forEach((inp) => {
    inp.addEventListener("input", () => { state.amounts[inp.dataset.cat] = Number(inp.value) || 0; save(); renderPlannerSummary(state); });
  });
  document.getElementById("resetBtn").addEventListener("click", () => { state = structuredClone(DEFAULT_STATE); save(); render(); });
  document.getElementById("tplSel").addEventListener("change", (e) => {
    const t = TEMPLATES.find((x) => x.id === e.target.value);
    if (!t) return;
    state = { income: t.income, amounts: { ...t.amounts } };
    save(); render();
  });
}

function wireTemplates() {
  app.querySelectorAll("[data-load]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const t = TEMPLATES.find((x) => x.id === btn.dataset.load);
      if (!t) return;
      state = { income: t.income, amounts: { ...t.amounts } };
      save();
      location.hash = "#/planner";
    });
  });
}

function wireSavings(params) {
  const ids = { goalInp: "goal", haveInp: "have", monthsInp: "months", rateInp: "rate" };
  for (const [id, key] of Object.entries(ids)) {
    const el = document.getElementById(id);
    el.addEventListener("change", () => {
      const next = new URLSearchParams(params);
      next.set(key, el.value || "0");
      history.replaceState(null, "", `#/savings?${next}`);
      render();
    });
  }
}

window.addEventListener("hashchange", render);
render();
