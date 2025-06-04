import { getUserFromToken } from "@/app/lib/data";
import LoginForm from "@/app/ui/home/loginform";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUserFromToken();

  if (user) redirect("/db");
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm />
    </div>
  );
}
