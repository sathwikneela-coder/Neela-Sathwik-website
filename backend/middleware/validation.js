/**
 * Middleware to validate incoming contact and quote request payloads
 */
function validateContactPayload(req, res, next) {
  const body = req.body || {};

  // Support both camelCase, PascalCase and snake_case field names from forms
  const name = body.name || body.Name;
  const email = body.email || body.Email;
  const details = body.details || body.Details || body.message || body.Message;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid name'
    });
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  // Basic email pattern check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email format'
    });
  }

  if (!details || typeof details !== 'string' || !details.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Please provide project details or message'
    });
  }

  // Attach normalized fields for downstream handlers
  req.normalizedData = {
    name: name.trim(),
    email: email.trim(),
    phone: (body.phone || body.Phone || '').toString().trim(),
    service: (body.service || body.Service || 'General Contact').toString().trim(),
    business: (body.business || body.Business || '').toString().trim(),
    details: details.trim()
  };

  next();
}

module.exports = {
  validateContactPayload
};
