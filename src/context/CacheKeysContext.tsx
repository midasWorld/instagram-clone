import { createContext, useContext } from "react";

type CacheKeysValue = {
  postsKey: string;
  limit: number;
};

export const CacheKeysContext = createContext<CacheKeysValue>({
  postsKey: "/api/posts",
  limit: 5,
});

export const useCacheKeys = () => useContext(CacheKeysContext);
