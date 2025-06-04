import { logout } from "../lib/actions";

export function LogoutButton() {
  return (
    <form action={logout} className="ml-auto">
      <button type="submit" className="text-sm text-gray-600 hover:text-black">
        로그아웃
      </button>
    </form>
  );
}
