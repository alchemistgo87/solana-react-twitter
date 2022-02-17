import { useContext, useEffect, useState } from "react";
import { fetchTweets } from "../api/fetch-tweets";
import TweetForm from "../components/TweetForm";
import TweetList from "../components/TweetList";
import { WorkspaceContext } from "../hooks/WorkspaceProvider";

export const Home = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const addTweet = (tweet) => setTweets([...tweets, tweet]);
  const workspace = useContext(WorkspaceContext);
  const removeTweet = (deletedTweet) =>
    setTweets(
      tweets.filter(
        (tweet) =>
          tweet.publicKey.toBase58() !== deletedTweet.publicKey.toBase58()
      )
    );
  useEffect(() => {
    fetchTweets(workspace)
      .then((fetchedTweets) => setTweets(fetchedTweets))
      .finally(() => setLoading(false));
  }, [workspace]);

  return (
    <div>
      <TweetForm added={addTweet}></TweetForm>
      <TweetList
        remove={removeTweet}
        tweets={tweets}
        loading={loading}
      ></TweetList>
    </div>
  );
};
