import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { WorkspaceContext } from "../hooks/WorkspaceProvider";

const TweetCard = (props) => {
  const { tweet } = props;
  const { wallet } = useContext(WorkspaceContext);
  const authorRoute = useMemo(() => {
    if (wallet && wallet.publicKey.toBase58() === tweet.author.toBase58()) {
      return { name: "/profile", params: { author: "" } };
    } else {
      return {
        name: "/users",
        params: { author: tweet.author.toBase58() },
      };
    }
  }, [wallet, tweet]);

  return (
    <div className="px-8 py-4">
      <div>
        <h3 className="inline font-semibold" title="tweet.author">
          {/* Link to author page or the profile page if it's our own tweet */}
          <Link
            to={`${authorRoute.name}/${authorRoute.params.author}`}
            className="hover:underline"
          >
            {tweet.author_display}
          </Link>
        </h3>
        <span className="text-gray-500"> • </span>
        <time className="text-gray-500 text-sm" title="tweet.created_at">
          {/* Link to the tweet page. */}
          <Link
            to={`/tweet/${tweet.publicKey.toBase58()}`}
            className="hover:underline"
          >
            {tweet.created_ago}
          </Link>
        </time>
      </div>
      <p className="whitespace-pre-wrap">{tweet.content}</p>
      {/* Link to the topic page.  */}
      {tweet.topic && (
        <Link
          to={`/topics/${tweet.topic}`}
          className="inline-block mt-2 text-primary-light hover:underline"
        >
          #{tweet.topic}
        </Link>
      )}
    </div>
  );
};
export default TweetCard;
