import { Breadcrumbs } from "@/components/custom/breadcrumbs";
import { Heading } from "@/components/custom/heading";

const breadcrumbItems = [{ title: "Dashboard", link: "/master" }];

function Dashboard() {
  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <Heading
        title='Dashboard'
        description='App overview & analytics. 📈'></Heading>
    </>
  );
}

export default Dashboard;
