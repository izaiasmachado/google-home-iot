const util = require("util");

async function redirectToLoginPage(req, res) {
  const responsurl = util.format(
    "%s?code=%s&state=%s",
    decodeURIComponent(req.query.redirect_uri),
    "123456",
    req.query.state
  );

  console.log(`Set redirect to ${responsurl}`);
  return res.redirect(`/login?responseurl=${encodeURIComponent(responsurl)}`);
}

module.exports = { redirectToLoginPage };
