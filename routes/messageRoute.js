// routes/messageRoute.js

const express = require("express");
const router = express.Router();
const handleIncomingMessage = require("../messageHandler/handleIncomingMessage");

router.post("/messages", async (req, res) => {
  const activity = req.body;

  const result = handleIncomingMessage(activity);

  if (!result) {
    return res.status(200).send("Unauthorized or irrelevant message.");
  }

  console.log(
    `📩 Message from [${result.teamName} > ${result.channelName}]: ${result.replyText}`
  );

  // If using bot framework adapter, you’d send a reply here
  // await adapter.continueConversation(...)

  res.status(200).send("Message processed.");
});

module.exports = router;
