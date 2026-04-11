import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "langbord-default-secret-change-me"
);

const MODERATORS = [
  {
    username: process.env.ADMIN_USER_1 || "moderator1",
    password: process.env.ADMIN_PASS_1 || "langbord2026",
  },
  {
    username: process.env.ADMIN_USER_2 || "moderator2",
    password: process.env.ADMIN_PASS_2 || "langbord2026",
  },
];

export async function authenticate(
  username: string,
  password: string
): Promise<string | null> {
  const mod = MODERATORS.find(
    (m) => m.username === username && m.password === password
  );
  if (!mod) return null;

  const token = await new SignJWT({ username: mod.username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  return token;
}

export async function verifyAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("langbord-auth")?.value;
    if (!token) return false;
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}
