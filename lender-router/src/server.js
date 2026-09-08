require('dotenv').config();
const express = require('express');
const { body, validationResult } = require('express-validator');
const { routeApplication } = require('./router');
const { createDraft } = require('./gmail');

const app = express();
app.use(express.json());

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

// Verify webhook secret if configured
function checkSecret(req, res, next) {
  if (!WEBHOOK_SECRET) return next();
  const provided = req.headers['x-webhook-secret'] || req.query.secret;
  if (provided !== WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

const applicationValidators = [
  body('business_name').notEmpty().withMessage('business_name is required'),
  body('owner_name').notEmpty().withMessage('owner_name is required'),
  body('owner_email').isEmail().withMessage('owner_email must be a valid email'),
  body('monthly_revenue').isNumeric().withMessage('monthly_revenue must be a number'),
  body('time_in_business_months').isInt({ min: 0 }).withMessage('time_in_business_months must be a non-negative integer'),
  body('loan_amount_requested').isNumeric().withMessage('loan_amount_requested must be a number'),
];

app.post('/api/apply', checkSecret, applicationValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const application = {
    business_name: req.body.business_name,
    owner_name: req.body.owner_name,
    owner_email: req.body.owner_email,
    owner_phone: req.body.owner_phone || '',
    monthly_revenue: Number(req.body.monthly_revenue),
    time_in_business_months: Number(req.body.time_in_business_months),
    credit_score: req.body.credit_score ? Number(req.body.credit_score) : null,
    loan_amount_requested: Number(req.body.loan_amount_requested),
    industry: req.body.industry || '',
    state: req.body.state || '',
    use_of_funds: req.body.use_of_funds || '',
    additional_notes: req.body.additional_notes || '',
  };

  console.log(`[${new Date().toISOString()}] New application: ${application.business_name} | $${application.loan_amount_requested}`);

  const { matched, lender } = routeApplication(application);

  if (!matched) {
    console.warn(`No lender matched for: ${application.business_name}`);
    return res.status(200).json({
      status: 'no_match',
      message: 'No lender matched this application. Check lenders.json criteria.',
    });
  }

  console.log(`Routed to: ${lender.name} (${lender.contact_email})`);

  try {
    const draft = await createDraft(application, lender);
    console.log(`Gmail draft created: ${draft.draft_id}`);

    return res.status(200).json({
      status: 'draft_created',
      lender: lender.name,
      lender_email: lender.contact_email,
      draft_id: draft.draft_id,
      subject: draft.subject,
    });
  } catch (err) {
    console.error('Gmail draft creation failed:', err.message);
    return res.status(500).json({
      status: 'error',
      message: 'Application routed but Gmail draft failed. Check Gmail auth.',
      lender: lender.name,
      error: err.message,
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backstone Lender Router running on port ${PORT}`);
  console.log(`Webhook endpoint: POST http://localhost:${PORT}/api/apply`);
});
