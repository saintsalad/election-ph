import { Breadcrumbs } from "@/components/custom/breadcrumbs";
import { Heading } from "@/components/custom/heading";
import React from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/master" },
  { title: "Candidate", link: "/master/candidate" },
];

function Candidate() {
  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <Heading
        title='Candidate'
        description='Manages election candidates.'></Heading>
    </>
  );
}

export default Candidate;
