const config = require("../config/filteredconfig");

function handleIncomingMessage(activity) {
  const { text, channelData } = activity;

  const teamId = channelData?.team?.id;
  const channel = channelData?.channel;

  const teamEntry = config.allowedTeams.find((t) => t.id === teamId);

  const channelAllowed = teamEntry?.allowedChannels.find(
    (c) => c.id === channel.id
  );

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
