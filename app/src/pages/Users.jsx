import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authorFilter, fetchTweets } from "../api/fetch-tweets";
import TweetList from "../components/TweetList";
import { TweetSearch } from "../components/TweetSearch";
import { WorkspaceContext } from "../hooks/WorkspaceProvider";

export function Users() {
  const navigate = useNavigate();
  const workspace = useContext(WorkspaceContext);
  let { authorSlug } = useParams();

  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState(authorSlug);
  const [viewedAuthor, setViewedAuthor] = useState("");

  // Actions.
  const search = (newAuthor) => {
    setAuthor(newAuthor);
    navigate(`/users/${newAuthor}`);
  };

  useEffect(() => {
    const fetchAuthorTweets = async () => {
      if (author === viewedAuthor) return;
      try {
        setLoading(true);
        const fetchedTweets = await fetchTweets(workspace, [
          authorFilter(author),
        ]);
        setTweets(fetchedTweets);
        setViewedAuthor(author);
      } finally {
        setLoading(false);
      }
    };
    if (author) {
      fetchAuthorTweets();
    } else {
      setTweets([]);
      setViewedAuthor(null);
    }
  }, [author, viewedAuthor, workspace]);

  return (
    <div>
      <TweetSearch
        placeholder="public key"
        modelValue={author}
        search={search}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        }
      ></TweetSearch>
      {viewedAuthor && (
        <div>
          <TweetList tweets={tweets} loading={loading}></TweetList>
          {tweets.length === 0 && (
            <div className="p-8 text-gray-500 text-center">
              User not found...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
