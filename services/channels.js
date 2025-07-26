const axios = require("axios");

async function listChannels(token, teamId) {
  const url = `https://graph.microsoft.com/v1.0/teams/${teamId}/channels`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.value;
}

module.exports = { listChannels };
