'use client';

import { Button } from '@heroui/button';
import { signIn } from 'next-auth/react';

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl mb-6">Iniciar sesión</h1>
      <Button
        variant="solid"
        size="md"
        onClick={() => signIn('github')}
      >
        Iniciar sesión con GitHub
      </Button>
    </div>
  );
}
