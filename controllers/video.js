const { StreamClient } = require('@stream-io/node-sdk');

const client = new StreamClient(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);

const getToken = (req, res) => {
  try {
    const userId = req.user._id.toString();
    const token = client.createToken(userId);
    res.status(200).json({ token, apiKey: process.env.STREAM_API_KEY, userId });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = { getToken };