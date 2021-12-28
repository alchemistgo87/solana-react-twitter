import { PublicKey } from "@solana/web3.js";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTweet } from "../api/get-tweet";
import TweetCard from "../components/TweetCard";
import { WorkspaceContext } from "../hooks/WorkspaceProvider";

export function TweetPage() {
  const [tweetAddress, setTweetAddress] = useState(null);
  let { tweetSlug } = useParams();
  const workspace = useContext(WorkspaceContext);
  const [loading, setLoading] = useState(true);
  const [tweet, setTweet] = useState(null);

  useEffect(() => {
    try {
      setTweetAddress(tweetSlug);
      setLoading(true);
      getTweet(workspace, new PublicKey(tweetAddress))
        .then((tweet) => {
          setTweet(tweet);
        })
        .finally(() => setLoading(false));
    } catch (e) {
      setTweet(null);
    } finally {
      setLoading(false);
    }
  }, [tweetSlug, workspace, tweetAddress]);

  if (loading) {
    return <div className="p-8 text-gray-500 text-center">Loading...</div>;
  }
  if (!tweet) {
    return <div className="p-8 text-gray-500 text-center">Tweet not found</div>;
  }
  return <TweetCard tweet={tweet}></TweetCard>;
}
