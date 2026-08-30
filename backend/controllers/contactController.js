const { submitToGoogleScript } = require('../services/googleScriptService');

/**
 * Controller to handle contact and quote request submissions
 */
async function handleContactSubmission(req, res) {
  try {
    const data = req.normalizedData;

    // Send to Google Apps Script / Sheet in background or awaited
    const isSaved = await submitToGoogleScript(data);

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      saved: isSaved
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong processing your request'
    });
  }
}

module.exports = {
  handleContactSubmission
};
