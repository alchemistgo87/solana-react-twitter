import { useState } from "react";
import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { deleteTweet } from "../api/delete-tweet";
import { WorkspaceContext } from "../hooks/WorkspaceProvider";
import TweetFormUpdate from "./TweetFormUpdate";

const TweetCard = (props) => {
  const { tweet, remove } = props;
  const workspace = useContext(WorkspaceContext);
  const [isEditing, setIsEditing] = useState(false);
  const { wallet } = workspace;
  const isMyTweet = () =>
    wallet && wallet.publicKey.toBase58() === tweet.author.toBase58();
  const onDelete = async () => {
    await deleteTweet(workspace, tweet);
    // emit('delete', tweet.value)
    remove(tweet);
  };
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

  if (isEditing) {
    return <TweetFormUpdate tweet={tweet} close={() => setIsEditing(false)} />;
  }

  return (
    <div className="px-8 py-4">
      <div className="flex justify-between">
        <div className="py-1">
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
        {isMyTweet() && (
          <div className="flex">
            <button
              className="flex px-2 rounded-full text-gray-500 hover:text-pink-500 hover:bg-gray-100"
              title="Update tweet"
              onClick={() => setIsEditing(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 m-auto"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path
                  fillRule="evenodd"
                  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete()}
              className="flex px-2 rounded-full text-gray-500 hover:text-pink-500 hover:bg-gray-100"
              title="Delete tweet"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 m-auto"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
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
