const TokenService = require("../services/TokenService");

async function create(req, res) {
  const grantType = req.query.grant_type
    ? req.query.grant_type
    : req.body.grant_type;

  const token = TokenService.getAccessToken(grantType);
  return await res.json(token);
}

module.exports = { create };
