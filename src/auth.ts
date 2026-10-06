import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const credentialsSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Demo credentials",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const expectedEmail = process.env.DEMO_USER_EMAIL ?? "demo@liveanywhere.consulting";
        const expectedPassword = process.env.DEMO_USER_PASSWORD ?? "DemoMove2027!";
        if (parsed.data.email !== expectedEmail || parsed.data.password !== expectedPassword) return null;
        return { id: "demo-user", email: expectedEmail, name: "Demo customer" };
      },
    }),
  ],
  pages: { signIn: "/sign-in" },
});
