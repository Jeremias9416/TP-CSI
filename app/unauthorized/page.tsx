// app/unauthorized/page.tsx
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
      <p className="text-lg text-gray-700 mb-8">
        No tienes los permisos necesarios para acceder a esta página.
      </p>
      <Link href="/dashboard" className="text-blue-600 hover:underline text-lg">
        Volver al Dashboard
      </Link>
      <p className="mt-2 text-sm text-gray-500">
        Si crees que esto es un error, contacta al soporte.
      </p>
    </div>
  );
}