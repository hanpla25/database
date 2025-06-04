"use client";
import { login } from "@/app/lib/actions";
import { useActionState } from "react";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <form
      action={formAction}
      className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">로그인</h2>

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          이름
        </label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="이름을 입력해주세요"
          required
          defaultValue={typeof state?.input === "string" ? state.input : ""}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          비밀번호
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="비밀번호를 입력해주세요"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition disabled:opacity-50"
      >
        {isPending ? "로그인중..." : "로그인"}
      </button>

      {state?.message && (
        <div className="text-center text-sm text-red-500">{state.message}</div>
      )}
    </form>
  );
}
