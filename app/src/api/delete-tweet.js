export const deleteTweet = async ({ wallet, program }, tweet) => {
  await program.rpc.deleteTweet({
    accounts: {
      author: wallet.publicKey,
      tweet: tweet.publicKey,
    },
  });
};
