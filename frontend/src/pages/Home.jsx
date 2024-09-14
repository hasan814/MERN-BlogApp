import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";

import CallToAction from "../components/modules/CallToAction";
import PostCard from "../components/modules/PostCard";

const Home = () => {
  // ============= State =============
  const [posts, setPosts] = useState([]);

  // ============= Effect =============
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/post/getPosts");
        const responseData = await response.json();
        setPosts(responseData.posts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, []);

  // ============= Rendering =============
  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm text-justify">
          Welcome to My Blog! Dive into a world of insights, tips, and stories
          where I share my journey through tech, web development, and life.
          Explore tutorials, personal experiences, and innovations in coding,
          design, and digital trends. Join the conversation and let&apos;s grow
          together in this exciting space!
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all Posts
        </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center mb-2">
              Recent Posts
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {posts.map((post) => (
                <PostCard key={uuidv4()} post={post} />
              ))}
            </div>
            <Link
              to="/search"
              className="text-lg text-center sm:text-sm text-teal-500 font-bold hover:underline"
            >
              View all Posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
