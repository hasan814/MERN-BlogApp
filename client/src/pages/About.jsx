import { motion } from "framer-motion";

const About = () => {
  // ============= Animation variants ===================
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2 } },
  };

  const paragraphVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, delay: 0.4 } },
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="max-w-2xl mx-auto p-3" variants={textVariants}>
        <div>
          <motion.h1
            className="text-3xl font-semibold text-center my-6"
            variants={textVariants}
          >
            About Blog App
          </motion.h1>
          <motion.div
            className="text-justify text-md text-gray-500 flex flex-col gap-6"
            variants={paragraphVariants}
          >
            <motion.p>
              A Blog App serves as an essential platform for both content
              creators and readers to share and engage with written material. It
              allows authors to publish blog posts on a variety of topics,
              ranging from personal experiences to in-depth technical tutorials.
              Equipped with a user-friendly interface, it typically provides
              features like rich text formatting, media insertion, and
              categorization, allowing authors to structure their posts for
              optimal readability. Users can easily navigate the app through
              search functions and filters, finding relevant posts by category,
              tags, or keywords, while readers can also interact with posts by
              leaving comments, starting discussions, or sharing content across
              social media platforms.
            </motion.p>
            <motion.p>
              For authors and admins, the app offers comprehensive tools to
              manage content and engage with their audience effectively. An
              admin dashboard allows users with the necessary privileges to
              monitor post performance, manage comments, and moderate user
              interactions. In many cases, the app supports post scheduling,
              letting authors plan their content releases in advance. Comment
              moderation is a key feature, ensuring that discussions remain
              constructive while maintaining control over spam or inappropriate
              content. Additionally, advanced features like role-based access,
              SEO optimization, and analytics can help authors increase
              visibility and measure the impact of their posts.
            </motion.p>
            <motion.p>
              From a technical perspective, Blog Apps are often built using
              modern web technologies like React.js and Next.js for their
              dynamic and responsive frontend, paired with backend technologies
              like Node.js and MongoDB to manage data and serve content
              efficiently. Authentication systems such as JWT ensure secure
              access, especially for multi-role systems where some users may
              have administrative privileges. The app&apos;s design typically
              focuses on a responsive, mobile-friendly experience that allows
              users to enjoy the platform across different devices. Furthermore,
              with cloud-based solutions for media hosting and scalability, Blog
              Apps offer flexibility and efficiency in managing large amounts of
              content and traffic.
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default About;
