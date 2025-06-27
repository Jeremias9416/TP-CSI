"use client";

import { signIn } from "next-auth/react";
import { Button } from "@heroui/button";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-6">Iniciar sesión</h1>
      <Button
        variant="solid"
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
      >
        Iniciar sesión con GitHub
      </Button>
    </div>
  );
}
