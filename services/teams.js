const axios = require("axios");

async function listTeams(token) {
  const response = await axios.get(
    "https://graph.microsoft.com/v1.0/groups?$filter=resourceProvisioningOptions/Any(x:x eq 'Team')",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.value;
}

module.exports = { listTeams };
