// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/nextauth"; // Tu configuración de NextAuth.js

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/"); // Redirige si no hay sesión
  }

  // Asegúrate de que el usuario tenga un rol, si no, redirige
  if (!session.user?.role) {
    redirect("/unauthorized"); // O a una página de error
  }

  // Obtener el ID y el Rol del usuario de la sesión
  const userId = session.user.id;
  const userRole = session.user.role;
  const userName = session.user.name;
  const userEmail = session.user.email;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Bienvenido a tu Dashboard, {userName || userEmail}!
      </h1>
      <p className="text-lg text-gray-700 mb-4">
        Aquí puedes ver un resumen de tus actividades y accesos.
      </p>

      {/* Información temporal para depuración */}
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4">
        <strong className="font-bold">
          Información de Usuario Actual (SOLO PARA DEBUG):
        </strong>
        <p>
          <strong>ID de Usuario:</strong> <code>{userId}</code>
        </p>
        <p>
          <strong>Rol:</strong> <code>{userRole}</code>
        </p>
        <p className="text-sm mt-2">
          Copia el ID de usuario de arriba para cambiar tu rol a
          &apos;admin&apos; en MongoDB Atlas.
        </p>{" "}
        <p className="text-sm">
          ¡Recuerda eliminar esta sección de tu código una vez que termines de
          depurar!
        </p>
      </div>
      {/* Fin de la información temporal */}

      {/* Aquí podrías añadir más contenido específico del dashboard del usuario */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Mis Secciones
        </h2>
        <p className="text-gray-600">
          Contenido del dashboard específico para usuarios.
        </p>
      </div>
    </div>
  );
}
