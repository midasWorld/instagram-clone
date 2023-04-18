"use client";

import { SearchUser } from "@/model/user";
import { useState } from "react";
import useSWR from "swr";

export default function UserSearch() {
  const [keyword, setKeyword] = useState("");
  const { data, isLoading, error } = useSWR<SearchUser>(
    `/api/search/${keyword}`
  );

  console.log(data);
  return <></>;
}
