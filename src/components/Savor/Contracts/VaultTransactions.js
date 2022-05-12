import React, { useState } from "react";
import { useMoralisQuery } from "react-moralis";



function VaultTransactions() {
  console.log("VaultTransactions");


  const [limit, setLimit] = useState(100);
  const { data, error, isLoading } = useMoralisQuery(
    "VaultEvents",
    query =>
      query
        .limit(limit),
    [limit],
    {
      live: true,
    },
  );

  if (error) {
    return <span>{error}</span>;
  }

  if (isLoading) {
    return <span>🙄</span>;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;

}

export default VaultTransactions;
