// app/dashboard/admin/users/page.tsx
// Este es un Server Component por defecto
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/nextauth"; // Tu configuración de NextAuth.js
import { redirect } from 'next/navigation';
import UserTable from "@/components/UserTable"; // Importa tu Client Component de tabla de usuarios

// Define la interfaz para los datos que esperamos del usuario desde la API
interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  image: string | null;
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  // Protección de la ruta a nivel de Server Component
  if (!session || session.user?.role !== 'admin') {
    redirect('/unauthorized'); // Redirige si no está logueado o no es admin
  }

  let users: UserData[] = [];
  let error: string | null = null;

  try {
    // Llama a tu API Route para obtener la lista de usuarios
    // Importante: En Server Components, las llamadas a API internas deben usar rutas completas o relativas al root.
    // Usar la URL base de tu app desplegada o localhost en desarrollo.
    // Para llamadas internas, puedes usar una ruta relativa si el API Route y el Server Component
    // se despliegan en el mismo host/dominio.
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'; // Usa tu URL de Vercel en producción
    const response = await fetch(`${baseUrl}/api/admin/users`, {
      method: 'GET',
      headers: {
        // En Server Components, la sesión se pasa automáticamente por la misma request del navegador.
        // No necesitas pasar tokens de sesión manualmente aquí para llamadas del mismo origen.
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Asegura que los datos estén siempre actualizados
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Fallo al obtener los usuarios');
    }

    users = await response.json();

  } catch (err: any) {
    console.error("Error fetching users:", err);
    error = `No se pudieron cargar los usuarios: ${err.message}`;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Administración de Usuarios</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      {users.length > 0 ? (
        <UserTable initialUsers={users} />
      ) : (
        !error && <p className="text-gray-600">No hay usuarios registrados en el sistema.</p>
      )}
    </div>
  );
}