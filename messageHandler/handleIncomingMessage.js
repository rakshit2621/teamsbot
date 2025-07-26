// messageHandler/handleIncomingMessage.js

const config = require("../config/filteredconfig");

function handleIncomingMessage(activity) {
  const { from, text, channelId, conversation, team, channelData } = activity;

  const teamId = channelData?.team?.id;
  const channel = channelData?.channel;

  // Validate the teamId and channel.id are allowed
  const teamEntry = config.teams.find((t) => t.id === teamId);
  const channelAllowed = teamEntry?.channels.find((c) => c.id === channel.id);

  if (!teamEntry || !channelAllowed) {
    console.log("🔒 Ignoring message from unauthorized team/channel.");
    return null;
  }

  const responseText = `[AI] ${text}`;

  return {
    replyText: responseText,
    teamName: teamEntry.name,
    channelName: channel.name,
    channelId: channel.id,
  };
}

module.exports = handleIncomingMessage;
