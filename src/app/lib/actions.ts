"use server";

import { cookies } from "next/headers";
import { createClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { getUserFromToken } from "./data";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d";

export async function login(
  _prevState: { message: string } | null,
  formData: FormData
) {
  const supabase = await createClient();
  const username = formData.get("username");
  const password = formData.get("password");

  if (!username || !password) {
    return {
      message: "아이디와 비밀번호를 모두 입력해주세요.",
    };
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !user) {
    console.log(error);
    return {
      message: "아이디가 일치하지 않습니다.",
    };
  }

  if (user.password !== password) {
    return {
      message: "비밀번호가 일치하지 않습니다.",
      input: String(username),
    };
  }

  const token = jwt.sign(
    {
      user_id: user.id,
      username: user.username,
      created_at: user.created_at,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/db");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}

export async function post(
  _prevState: { message: string } | null,
  formData: FormData
) {
  const supabase = await createClient();
  const user = await getUserFromToken();
  const userId = user?.user_id;
  const text = formData.get("text");
  const file = formData.get("attachment") as File;

  let fileUrl: string | null = null;

  if (file instanceof File && file.size > 0) {
    const timeStamp = Date.now();
    const filePath = `${user?.user_id}/${timeStamp}`;

    const { error: uploadError } = await supabase.storage
      .from("attachments")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("파일 업로드 실패", uploadError);
      return { message: "파일 업로드에 실패했습니다." };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("attachments").getPublicUrl(filePath);
    fileUrl = publicUrl;
  }

  const { error } = await supabase.from("list").insert({
    user_id: userId,
    username: user?.username,
    text,
    attachments: fileUrl ? [fileUrl] : [],
  });

  if (error) {
    console.error("등록 실패 ", error);
    return { message: "에러 발생" };
  }

  redirect("/db");
}
