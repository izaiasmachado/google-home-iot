function getAccessToken(grantType) {
  const secondsInDay = 86400;
  const token = {
    token_type: "bearer",
    access_token: "123access",
    expires_in: secondsInDay,
  };

  if (grantType === "authorization_code") {
    token.refresh_token = "123refresh";
  }

  return token;
}

module.exports = { getAccessToken };
