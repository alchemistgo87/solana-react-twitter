import { useContext, useEffect, useState } from "react";
import { authorFilter, fetchTweets } from "../api/fetch-tweets";
import TweetForm from "../components/TweetForm";
import TweetList from "../components/TweetList";
import { WorkspaceContext } from "../hooks/WorkspaceProvider";

export function Profile() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const workspace = useContext(WorkspaceContext);
  const { wallet } = workspace;

  useEffect(() => {
    if (!wallet) return;
    fetchTweets(workspace, [authorFilter(wallet.publicKey.toBase58())])
      .then((fetchedTweets) => setTweets(fetchedTweets))
      .finally(() => setLoading(false));
  }, [wallet, workspace]);

  const addTweet = (tweet) => setTweets([...tweets, tweet]);

  return (
    <>
      {wallet && (
        <div className="border-b px-8 py-4 bg-gray-50">
          {wallet.publicKey.toBase58()}
        </div>
      )}
      <TweetForm added={addTweet} />
      <TweetList tweets={tweets} loading={loading} />
    </>
  );
}
