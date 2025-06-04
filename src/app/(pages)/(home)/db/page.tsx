import { getUserFromToken, list } from "@/app/lib/data";
import DbForm from "@/app/ui/db/db-form";
import List from "@/app/ui/db/list";
import { redirect } from "next/navigation";

export default async function DbPage() {
  const user = await getUserFromToken();

  if (!user) {
    redirect("/");
  }
  const data = await list(user.username);

  return (
    <div className="min-h-screen bg-[#fbfbfd] pb-34">
      <List data={data} />
      <DbForm />
    </div>
  );
}
