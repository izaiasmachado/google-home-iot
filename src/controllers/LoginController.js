async function redirectToConsentPage(req, res) {
  const consentPageUrl = req.body.responseurl || req.query.responseurl;
  const decodedConsentPageUrl = decodeURIComponent(consentPageUrl);
  return res.redirect(decodedConsentPageUrl);
}

module.exports = { redirectToConsentPage };
