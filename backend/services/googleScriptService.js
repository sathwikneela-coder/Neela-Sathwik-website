const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxpsmKj8r6Qr-x6iDdOWo4sbss5qQJrC1PZKVpDzmzyQmOjvtIEBBQVcL5qrVDC3rvhEA/exec';

/**
 * Service to forward contact submissions to Google Apps Script / Google Sheets
 * @param {Object} data - Normalized contact data
 * @returns {Promise<boolean>}
 */
async function submitToGoogleScript(data) {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL || DEFAULT_SCRIPT_URL;

  if (!scriptUrl) {
    console.warn('⚠️ No GOOGLE_SCRIPT_URL configured. Skipping Google Sheets forwarding.');
    return false;
  }

  const payload = {
    name: data.name,
    Name: data.name,
    email: data.email,
    Email: data.email,
    phone: data.phone || '',
    Phone: data.phone || '',
    service: data.service || 'General Contact',
    Service: data.service || 'General Contact',
    business: data.business || '',
    Business: data.business || '',
    details: data.details,
    Details: data.details,
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    // Google Apps Script redirects or returns 200/302 text
    return response.ok || response.status === 302 || response.status === 200;
  } catch (error) {
    console.error('Error forwarding to Google Script:', error.message);
    // Don't crash backend if external webhook is unreachable; log and handle gracefully
    return false;
  }
}

module.exports = {
  submitToGoogleScript
};
