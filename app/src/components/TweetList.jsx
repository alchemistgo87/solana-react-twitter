import TweetCard from "./TweetCard";

const TweetList = (props) => {
  const { tweets, loading } = props;
  const orderedTweets = tweets.sort((a, b) => b.timestamp - a.timestamp);

  if (loading) {
    return <div className="p-8 text-gray-500 text-center">Loading...</div>;
  }

  return (
    <div className="divide-y">
      {orderedTweets.map((tweet) => (
        <TweetCard key={tweet.key} tweet={tweet}></TweetCard>
      ))}
    </div>
  );
};

export default TweetList;
