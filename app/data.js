// Household Budget Planner — starter data, categories, templates and guides.
// All amounts in US dollars per month unless a template says otherwise.

export const CATEGORIES = [
  { id: "housing", name: "Housing (rent / mortgage)", group: "Needs", def: 1450 },
  { id: "utilities", name: "Utilities (power, water, internet, phone)", group: "Needs", def: 285 },
  { id: "groceries", name: "Groceries", group: "Needs", def: 620 },
  { id: "transport", name: "Transport (fuel, transit, car costs)", group: "Needs", def: 340 },
  { id: "insurance", name: "Insurance & health", group: "Needs", def: 260 },
  { id: "childcare", name: "Childcare & school", group: "Needs", def: 300 },
  { id: "debt", name: "Debt payments (minimums)", group: "Needs", def: 210 },
  { id: "dining", name: "Dining out & coffee", group: "Wants", def: 240 },
  { id: "entertainment", name: "Entertainment & streaming", group: "Wants", def: 95 },
  { id: "shopping", name: "Shopping & personal care", group: "Wants", def: 220 },
  { id: "travel", name: "Travel & holidays", group: "Wants", def: 200 },
  { id: "hobbies", name: "Hobbies, gym & pets", group: "Wants", def: 110 },
  { id: "emergency", name: "Emergency fund", group: "Savings", def: 250 },
  { id: "retirement", name: "Retirement & investing", group: "Savings", def: 300 },
  { id: "goals", name: "Other savings goals", group: "Savings", def: 150 },
];

export const DEFAULT_STATE = {
  income: 5200,
  amounts: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.def])),
};

export const TEMPLATES = [
  {
    id: "family", name: "Family of four, one income", income: 6800,
    blurb: "Mortgage, two kids in school, one car. Savings squeezed but protected.",
    amounts: { housing: 1750, utilities: 360, groceries: 950, transport: 420, insurance: 390, childcare: 650, debt: 260, dining: 260, entertainment: 120, shopping: 260, travel: 220, hobbies: 130, emergency: 300, retirement: 450, goals: 180 },
  },
  {
    id: "couple", name: "Couple renting in the city", income: 7400,
    blurb: "Two incomes, no kids yet, aggressive investing while rent is the big bill.",
    amounts: { housing: 1900, utilities: 240, groceries: 640, transport: 300, insurance: 240, childcare: 0, debt: 0, dining: 420, entertainment: 160, shopping: 380, travel: 450, hobbies: 180, emergency: 500, retirement: 1100, goals: 400 },
  },
  {
    id: "single", name: "Single, first job", income: 3100,
    blurb: "Shared flat, student loan, small but real emergency fund from month one.",
    amounts: { housing: 850, utilities: 130, groceries: 340, transport: 180, insurance: 110, childcare: 0, debt: 240, dining: 170, entertainment: 70, shopping: 140, travel: 90, hobbies: 70, emergency: 200, retirement: 250, goals: 100 },
  },
  {
    id: "tight", name: "Tight month, minimum viable budget", income: 2600,
    blurb: "Income dropped — wants are paused, needs are trimmed, savings shrink but never hit zero.",
    amounts: { housing: 950, utilities: 170, groceries: 430, transport: 150, insurance: 130, childcare: 120, debt: 150, dining: 40, entertainment: 25, shopping: 60, travel: 0, hobbies: 30, emergency: 75, retirement: 0, goals: 0 },
  },
];

export const BILLS = [
  { name: "Rent / mortgage", day: 1, amount: 1450 },
  { name: "Electricity", day: 8, amount: 118 },
  { name: "Internet", day: 12, amount: 65 },
  { name: "Phone plans", day: 15, amount: 84 },
  { name: "Car insurance", day: 18, amount: 142 },
  { name: "Water", day: 21, amount: 52 },
  { name: "Streaming bundle", day: 24, amount: 38 },
  { name: "Loan minimum", day: 27, amount: 210 },
];

export const GUIDES = [
  {
    id: "503020", title: "The 50/30/20 rule, explained",
    body: "Senator Elizabeth Warren popularised the rule in 'All Your Worth': after tax, aim for roughly 50% of income on needs, 30% on wants and 20% on savings and extra debt payoff. It is a compass, not a law — in a high-rent city, needs at 60% with savings still at 15% beats needs at 50% achieved by saving nothing. Use the analyser on the Planner page: it grades your split and shows exactly which category to move first.",
  },
  {
    id: "emergency", title: "Build an emergency fund that actually works",
    body: "Target one month of essential spending first (needs only — the Planner total for Needs is your number), then three months, then six if your income is variable or single-source. Keep it in a separate, boring, instantly accessible savings account. It is not an investment; its job is to turn a crisis (job loss, boiler, car gearbox) into an inconvenience. The Savings Goal calculator shows the monthly amount for any target and date.",
  },
  {
    id: "sinking", title: "Sinking funds: kill the 'surprise' bills",
    body: "Car insurance every six months, Christmas, annual subscriptions, the car service — none of these are surprises, they are just infrequent. Divide each annual cost by 12 and save that monthly into a labelled pot. A $1,200 insurance premium becomes a calm $100 a month instead of a December panic. Add your own sinking-fund lines to the 'Other savings goals' category.",
  },
  {
    id: "payday", title: "The 20-minute payday routine",
    body: "On payday: (1) move the savings amount out first — pay yourself before shops can bid for it; (2) check the bill calendar so this month's due dates are covered; (3) glance at the three categories that drifted most last month; (4) adjust one number, not twelve. Budgets fail from neglect, not arithmetic. Twenty minutes a month beats a perfect spreadsheet you open once.",
  },
  {
    id: "debt", title: "Avalanche vs snowball: paying off debt",
    body: "List every debt with its balance and interest rate. The avalanche method pays minimums on all, then throws every spare dollar at the highest rate — mathematically cheapest. The snowball pays the smallest balance first — psychologically stickiest, and studies show people who use it are more likely to finish. Either beats neither: pick the one you will still be doing in month six, and model it by raising 'Debt payments' above the minimum in the planner.",
  },
];

export const FAQS = [
  { q: "How much should a household save each month?", a: "The common benchmark is 20% of take-home pay (the 50/30/20 rule), but the right number is the largest one you can sustain: 10% kept for a year beats 25% abandoned in February. Start where you are, then raise it 1% each quarter." },
  { q: "What counts as a 'need'?", a: "Anything you must pay to live and work: housing, utilities, basic groceries, transport to work, insurance, minimum debt payments, essential childcare. The honest test: if you lost your income tomorrow, would this bill still arrive? If yes, it is a need." },
  { q: "Our income changes every month. How do we budget?", a: "Budget from your lowest typical month, not the average. In better months, sweep the extra into a buffer account until it holds one month of spending — from then on you effectively pay yourself a steady salary." },
  { q: "Should we pay off debt or save first?", a: "Both, in sequence: build a starter emergency fund of about one month of needs, then attack high-interest debt (anything above ~8–10%), then finish the emergency fund. Saving while a 24% card balance grows is filling a bath with the plug out." },
  { q: "How do couples budget without arguing?", a: "One shared account for shared bills, proportional contributions if incomes differ, and a no-questions personal allowance for each partner. Most money fights are about control, not amounts — the allowance removes the battleground." },
];
