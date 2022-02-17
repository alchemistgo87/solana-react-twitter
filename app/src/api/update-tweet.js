export const updateTweet = async (
  { wallet, program },
  tweet,
  topic,
  content
) => {
  await program.rpc.updateTweet(topic, content, {
    accounts: {
      author: wallet.publicKey,
      tweet: tweet.publicKey,
    },
  });

  tweet.topic = topic;
  tweet.content = content;
};
