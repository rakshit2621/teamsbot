const express = require("express");
const router = express.Router();
const { getAccessToken } = require("../services/auth");
const { listTeams } = require("../services/teams");
const { listChannels } = require("../services/channels");

router.get("/sync", async (req, res) => {
  try {
    const token = await getAccessToken();
    const teams = await listTeams(token);

    const allTeams = [];

    for (const team of teams) {
      const channels = await listChannels(token, team.id);
      const simplifiedChannels = channels.map((channel) => ({
        id: channel.id,
        name: channel.displayName,
      }));

      allTeams.push({
        teamId: team.id,
        teamName: team.displayName,
        channels: simplifiedChannels,
      });
    }

    res.json({ allTeams });
  } catch (error) {
    console.error("❌ Error in /sync route:", error);
    res.status(500).send("Failed to fetch teams and channels");
  }
});

module.exports = router;
