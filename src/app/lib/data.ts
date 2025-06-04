"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { createClient } from "../utils/supabase/server";

const JWT_SECRET = process.env.JWT_SECRET!;

type UserPayload = {
  user_id: string;
  username: string;
  created_at: string;
};

export async function getUserFromToken(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return {
      user_id: decoded.user_id,
      username: decoded.username,
      created_at: decoded.created_at,
    };
  } catch {
    return null;
  }
}

export async function list(username: string) {
  if (!username) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("list")
    .select("*")
    .eq("username", username)
    .order("id", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return null;
  }
  return data;
}
