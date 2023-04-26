"use client";

import usePosts from "@/hooks/posts";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PostListCard from "./PostListCard";
import GridSpinner from "./ui/GridSpinner";

export default function PostList() {
  const { posts, isLoading: loading, error, setSize } = usePosts();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      console.log(`✨ Get more movies (Infinite Scroll: ${inView})`);
      setSize((prev) => prev + 1);
    }
  }, [inView, setSize]);

  return (
    <section>
      {loading && (
        <div className="text-center mt-32">
          <GridSpinner color="red" />
        </div>
      )}
      {posts && (
        <ul>
          {posts.map((post, index) => (
            <li
              key={post.id}
              className="mb-4"
              ref={index === posts.length - 1 ? ref : null}
            >
              <PostListCard post={post} priority={index < 2} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
