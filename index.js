const express = require("express");
require("dotenv").config();

const { getAccessToken } = require("./services/auth");
const { listTeams } = require("./services/teams");
const { listChannels } = require("./services/channels");
const { allowedTeams } = require("./config");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", async (req, res) => {
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

// ✅ NEW: /sync route to list all teams and their channels
app.get("/sync", async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`🚀 Server ready on http://localhost:${PORT}`);
});
