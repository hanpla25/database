import { getUserFromToken } from "../lib/data";
import { LogoutButton } from "./buttons";

export default async function Header() {
  const user = await getUserFromToken();

  return (
    <header className="px-4 py-3 border-b">
      <div className="flex justify-between max-w-6xl mx-auto">
        <h1 className="text-xl font-semibold">데이터베이스</h1>
        {user && <LogoutButton />}
      </div>
    </header>
  );
}
