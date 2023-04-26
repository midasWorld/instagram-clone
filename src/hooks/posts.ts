import { useCacheKeys } from "@/context/CacheKeysContext";
import { Comment, PagePost, SimplePost } from "@/model/post";
import { useCallback } from "react";
import useSWRInfinite from "swr/infinite";

async function updateLike(id: string, like: boolean) {
  return fetch("/api/likes", {
    method: "PUT",
    body: JSON.stringify({ id, like }),
  }).then((res) => res.json());
}

async function addComment(id: string, comment: string) {
  return fetch("/api/comments", {
    method: "POST",
    body: JSON.stringify({ id, comment }),
  }).then((res) => res.json());
}

export function usePostsPageOf(limit: number = 5) {
  const cacheKeys = useCacheKeys();

  const getKey = (pageIndex: any, previousPageData: PagePost) => {
    if (previousPageData && !previousPageData.data) return null;
    if (pageIndex === 0) return `${cacheKeys.postsKey}?limit=${limit}`;
    if (previousPageData.nextCursor == null) return null;
    return `${cacheKeys.postsKey}?nextCursor=${previousPageData.nextCursor}&limit=${limit}`;
  };

  const {
    data: posts,
    isLoading,
    error,
    setSize,
  } = useSWRInfinite<PagePost>(getKey);

  return { posts, isLoading, error, setSize };
}

export default function usePosts(limit: number = 5) {
  const cacheKeys = useCacheKeys();

  const getKey = (pageIndex: any, previousPageData: PagePost) => {
    if (previousPageData && !previousPageData.data) return null;
    if (pageIndex === 0) return `${cacheKeys.postsKey}?limit=${limit}`;
    if (previousPageData.nextCursor == null) return null;
    return `${cacheKeys.postsKey}?nextCursor=${previousPageData.nextCursor}&limit=${limit}`;
  };

  const {
    data: pages,
    isLoading,
    error,
    mutate,
    setSize,
  } = useSWRInfinite<PagePost>(getKey);

  const setLike = useCallback(
    (post: SimplePost, username: string, like: boolean) => {
      const newPost = {
        ...post,
        likes: like
          ? [...post.likes, username]
          : post.likes.filter((item) => item !== username),
      };
      const newPosts = pages?.map((page) => ({
        data: page.data.map((p) => (p.id === post.id ? newPost : p)),
        nextCursor: page.nextCursor,
      }));

      return mutate(updateLike(post.id, like), {
        optimisticData: newPosts,
        populateCache: false,
        revalidate: false,
        rollbackOnError: true,
      });
    },
    [pages, mutate]
  );

  const postComment = useCallback(
    (post: SimplePost, comment: Comment) => {
      const newPost = {
        ...post,
        comments: post.comments + 1,
      };
      const newPosts = pages?.map((page) => ({
        data: page.data.map((p) => (p.id === post.id ? newPost : p)),
        nextCursor: page.nextCursor,
      }));

      return mutate(addComment(post.id, comment.comment), {
        optimisticData: newPosts,
        populateCache: false,
        revalidate: false,
        rollbackOnError: true,
      });
    },
    [pages, mutate]
  );

  const posts = pages
    ?.map((page) => page.data)
    .reduce((prev, cur) => prev.concat(cur), []);

  return { posts, isLoading, error, setSize, setLike, postComment };
}
