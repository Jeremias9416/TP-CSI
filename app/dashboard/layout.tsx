// app/dashboard/layout.tsx
import { getServerSession } from "next-auth";
// Ajusta esta ruta a la ubicación exacta de tu archivo nextauth.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/nextauth";
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Si no hay sesión, redirige a la página principal
  if (!session) {
    redirect('/');
  }

  // Si la sesión existe, pero no tiene un rol, o tiene un rol que no es 'user' o 'admin'
  // Puedes ajustar esta lógica según tus necesidades de roles básicos
  if (!session.user?.role || (session.user.role !== 'user' && session.user.role !== 'admin')) {
      // Podrías redirigir a una página de "acceso denegado" más específica
      redirect('/unauthorized');
  }

  return (
    <div className="flex min-h-screen">
      {/* Barra lateral del Dashboard */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-700">
                Inicio Dashboard
              </Link>
            </li>
            {/* Solo muestra el enlace a /dashboard/admin si el usuario es 'admin' */}
            {session.user.role === 'admin' && (
              <li className="mb-2">
                <Link href="/dashboard/admin" className="block p-2 rounded hover:bg-gray-700">
                  Admin Panel
                </Link>
              </li >
            )}
            <li className="mb-2">
              <Link href="#" className="block p-2 rounded hover:bg-gray-700" onClick={() => { /* Lógica de logout */ }}>
                Cerrar Sesión
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenido principal del Dashboard */}
      <main className="flex-1 p-8 bg-gray-100">
        {children}
      </main>
    </div>
  );
}