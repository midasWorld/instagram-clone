import usePosts from "@/hooks/posts";
import PostGridCard from "./PostGridCard";
import GridSpinner from "./ui/GridSpinner";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function PostGrid() {
  const { posts, isLoading: loading, setSize } = usePosts();
  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      console.log(`✨ Get more movies (Infinite Scroll: ${inView})`);
      setSize((prev) => prev + 1);
    }
  }, [inView, setSize]);

  return (
    <div className="w-full text-center">
      {loading && <GridSpinner />}
      <ul className="grid grid-cols-3 gap-4 py-4 px-8">
        {posts &&
          posts.map((post, index) => (
            <li key={post.id} ref={index === posts.length - 1 ? ref : null}>
              <PostGridCard post={post} priority={index < 6} />
            </li>
          ))}
      </ul>
    </div>
  );
}
