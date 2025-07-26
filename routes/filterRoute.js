const express = require("express");
const router = express.Router();
const { getAccessToken } = require("../services/auth");
const { listTeams } = require("../services/teams");
const { listChannels } = require("../services/channels");
const { allowedTeams } = require("../config/filteredconfig");

router.get("/", async (req, res) => {
  try {
    const token = await getAccessToken();
    const teams = await listTeams(token);

    const filtered = [];

    for (const team of teams) {
      const matchTeam = allowedTeams.find((t) => t.id === team.id);
      if (!matchTeam) continue;

      const channels = await listChannels(token, team.id);
      const filteredChannels = channels.filter((channel) =>
        matchTeam.allowedChannels.some((c) => c.id === channel.id)
      );

      filtered.push({
        teamId: team.id,
        teamName: team.displayName,
        channels: filteredChannels,
      });
    }

    res.json({ filtered });
  } catch (error) {
    console.error("❌ Error in / route:", error);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
