const fs = require('fs');
const path = require('path');

function loadLenders() {
  const configPath = path.join(__dirname, '../config/lenders.json');
  const raw = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(raw).lenders;
}

function matchesAllCriteria(app, criteria) {
  const {
    monthly_revenue_min,
    monthly_revenue_max,
    time_in_business_months_min,
    credit_score_min,
    credit_score_max,
    loan_amount_min,
    loan_amount_max,
    industries_allowed,
    industries_blocked,
    states_allowed,
    states_blocked,
  } = criteria;

  if (monthly_revenue_min && app.monthly_revenue < monthly_revenue_min) return false;
  if (monthly_revenue_max && app.monthly_revenue > monthly_revenue_max) return false;
  if (time_in_business_months_min && app.time_in_business_months < time_in_business_months_min) return false;
  if (credit_score_min && app.credit_score < credit_score_min) return false;
  if (credit_score_max && app.credit_score > credit_score_max) return false;
  if (loan_amount_min && app.loan_amount_requested < loan_amount_min) return false;
  if (loan_amount_max && app.loan_amount_requested > loan_amount_max) return false;

  const industry = (app.industry || '').toLowerCase();
  if (industries_blocked.length && industries_blocked.some(b => industry.includes(b.toLowerCase()))) return false;
  if (industries_allowed.length && !industries_allowed.some(a => industry.includes(a.toLowerCase()))) return false;

  const state = (app.state || '').toUpperCase();
  if (states_blocked.length && states_blocked.includes(state)) return false;
  if (states_allowed.length && !states_allowed.includes(state)) return false;

  return true;
}

function routeApplication(application) {
  const lenders = loadLenders();

  for (const lender of lenders) {
    if (matchesAllCriteria(application, lender.criteria)) {
      return { matched: true, lender };
    }
  }

  return { matched: false, lender: null };
}

module.exports = { routeApplication };
