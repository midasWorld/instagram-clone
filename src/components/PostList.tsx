"use client";

import usePosts from "@/hooks/posts";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PostListCard from "./PostListCard";
import GridSpinner from "./ui/GridSpinner";

export default function PostList() {
  const { posts, loading, isReachedEnd, error, setSize } = usePosts();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !isReachedEnd) {
      console.log(`✨ Get more movies (Infinite Scroll: ${inView})`);
      setSize((prev) => prev + 1);
    }
  }, [inView, setSize, isReachedEnd]);

  return (
    <section>
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
      {loading && (
        <div className="text-center mt-32">
          <GridSpinner color="red" />
        </div>
      )}
    </section>
  );
}
