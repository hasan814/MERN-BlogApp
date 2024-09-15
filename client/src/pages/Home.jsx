import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
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

  // Framer Motion animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  // ============= Rendering =============
  return (
    <motion.div initial="hidden" animate="visible" className="min-h-screen">
      {/* Welcome Section */}
      <motion.div
        className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl font-bold lg:text-6xl"
          variants={fadeInUp}
        >
          Welcome to my Blog
        </motion.h1>
        <motion.p
          className="text-gray-500 text-xs sm:text-sm text-justify"
          variants={fadeInUp}
        >
          Welcome to My Blog! Dive into a world of insights, tips, and stories
          where I share my journey through tech, web development, and life.
          Explore tutorials, personal experiences, and innovations in coding,
          design, and digital trends. Join the conversation and let&apos;s grow
          together in this exciting space!
        </motion.p>
        <motion.div variants={fadeInUp}>
          <Link
            to="/search"
            className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
          >
            View all Posts
          </Link>
        </motion.div>
      </motion.div>

      {/* Call to Action Section */}
      <motion.div
        initial={{ opacity: 0 }}
        className="p-3 bg-amber-100 dark:bg-slate-700 mx-auto"
        animate={{ opacity: 1, transition: { duration: 0.8 } }}
      >
        <CallToAction />
      </motion.div>

      {/* Posts Section */}
      <motion.div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col gap-6"
          >
            <motion.h2
              className="text-2xl font-semibold text-center mb-2"
              variants={fadeInUp}
            >
              Recent Posts
            </motion.h2>
            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              variants={staggerContainer}
            >
              {posts.map((post) => (
                <motion.div key={uuidv4()} variants={fadeInUp}>
                  <PostCard post={post} />
                </motion.div>
              ))}
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link
                to="/search"
                className="text-lg text-center sm:text-sm text-teal-500 font-bold hover:underline"
              >
                View all Posts
              </Link>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Home;
