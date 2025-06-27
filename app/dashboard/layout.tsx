// app/dashboard/layout.tsx
import { getServerSession } from "next-auth";
// Ajusta esta ruta a la ubicación exacta de tu archivo nextauth.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/nextauth";
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  if (!session.user?.role || (session.user.role !== 'user' && session.user.role !== 'admin')) {
      redirect('/unauthorized');
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-700">
                Inicio Dashboard
              </Link>
            </li>
            {/* Enlace al panel principal de admin - SIN LA CONDICIÓN TEMPORALMENTE */}
            <li className="mb-2">
              <Link href="/dashboard/admin" className="block p-2 rounded hover:bg-gray-700">
                Admin Panel
              </Link>
            </li >
            {/* Enlace a Administrar Usuarios - SIN LA CONDICIÓN TEMPORALMENTE */}
            <li className="mb-2">
              <Link href="/dashboard/admin/users" className="block p-2 rounded hover:bg-gray-700">
                Administrar Usuarios
              </Link>
            </li>
            <li className="mb-2">
              <LogoutButton />
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-gray-100">
        {children}
      </main>
    </div>
  );
}