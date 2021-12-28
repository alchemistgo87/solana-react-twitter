import { Tweet } from "../models/Tweet";

export const getTweet = async ({ program }, publicKey) => {
  const account = await program.account.tweet.fetch(publicKey);
  return new Tweet(publicKey, account);
};
