// pages/master/election/update.tsx

import { NextPage, NextPageContext } from "next";
import React from "react";

interface UpdateElectionProps {
  query: {
    data?: string;
  };
}

const UpdateElection: NextPage<UpdateElectionProps> = ({ query }) => {
  const data = query?.data ? decodeURIComponent(query.data) : null;
  const electionData = data ? JSON.parse(data) : null;

  console.log("Query Parameters:", electionData);

  return (
    <div>
      <h1>Update Election Details</h1>
      {electionData ? (
        <div>
          <p>ID: {electionData.id}</p>
          <p>Name: {electionData.name}</p>
          {/* Render other properties */}
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

UpdateElection.getInitialProps = async (ctx: NextPageContext) => {
  const { query } = ctx;
  return { query };
};

export default UpdateElection;
