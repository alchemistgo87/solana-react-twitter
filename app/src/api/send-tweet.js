import { web3 } from "@project-serum/anchor";
import { Tweet } from "../models/Tweet";

// 1. Define the sendTweet endpoint.
export const sendTweet = async ({ wallet, program }, topic, content) => {
  // 2. Generate a new Keypair for our new tweet account.
  const tweet = web3.Keypair.generate();

  // 3. Send a "SendTweet" instruction with the right data and the right accounts.
  await program.rpc.sendTweet(topic, content, {
    accounts: {
      author: wallet.publicKey,
      tweet: tweet.publicKey,
      systemProgram: web3.SystemProgram.programId,
    },
    signers: [tweet],
  });

  // 4. Fetch the newly created account from the blockchain.
  const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);

  // 5. Wrap the fetched account in a Tweet model so our frontend can display it.
  return new Tweet(tweet.publicKey, tweetAccount);
};
