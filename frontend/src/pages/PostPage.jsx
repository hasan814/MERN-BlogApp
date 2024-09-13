import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { Button } from "flowbite-react";
import CallToAction from "../components/modules/CallToAction";

const PostPage = () => {
  // ============== State ===============
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);

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
          setError(true);
          setLoading(false);
          return;
        }
        if (response.ok) {
          setPost(responseData.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        console.log(error);
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  // ============== Rendering ===============
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <HashLoader color="#25bc58" />
      </div>
    );
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill className="capitalize" size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.image}
        className="rounded-md shadow-lg mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="p-3 flex justify-between border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
    </main>
  );
};

export default PostPage;
