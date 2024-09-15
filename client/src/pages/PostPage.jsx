import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { HashLoader } from "react-spinners";
import { Button } from "flowbite-react";
import { motion } from "framer-motion"; // Import framer-motion

import CommentSection from "../components/modules/CommentSection";
import CallToAction from "../components/modules/CallToAction";
import PostCard from "../components/modules/PostCard";

const PostPage = () => {
  // ============== State ===============
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  // ============== Params ===============
  const { postSlug } = useParams();

  // ============== Effect ===============
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const responseData = await response.json();
        if (!response.ok) {
          setLoading(false);
          return;
        }
        if (response.ok) {
          setPost(responseData.posts[0]);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPost = async () => {
        const response = await fetch(`/api/post/getposts?limit=3`);
        const responseData = await response.json();
        if (response.ok) {
          setRecentPosts(responseData.posts);
        }
      };
      fetchRecentPost();
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Framer Motion Variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  // ============== Rendering ===============
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <HashLoader color="#25bc58" />
      </div>
    );
  return (
    <motion.main
      className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.h1
        className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl"
        variants={fadeIn}
      >
        {post && post.title}
      </motion.h1>
      <motion.div className="self-center mt-5" variants={fadeIn}>
        <Link to={`/search?category=${post && post.category}`}>
          <Button color="gray" pill className="capitalize" size="xs">
            {post && post.category}
          </Button>
        </Link>
      </motion.div>
      <motion.img
        variants={fadeIn}
        src={post && post.image}
        alt={post && post.title}
        className="rounded-md shadow-lg mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <motion.div
        className="p-3 flex justify-between border-b border-slate-500 mx-auto w-full max-w-2xl text-xs"
        variants={fadeIn}
      >
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </motion.div>
      <motion.div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
        variants={fadeIn}
      ></motion.div>
      <motion.div className="max-w-4xl mx-auto w-full" variants={fadeIn}>
        <CallToAction />
      </motion.div>
      <CommentSection postId={post._id} />
      <motion.div
        className="flex flex-col justify-center items-center mb-5"
        variants={staggerContainer}
      >
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {recentPosts &&
            recentPosts.map((post) => (
              <motion.div key={uuidv4()} variants={fadeIn}>
                <PostCard post={post} />
              </motion.div>
            ))}
        </div>
      </motion.div>
    </motion.main>
  );
};

export default PostPage;
