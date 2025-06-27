// app/dashboard/admin/page.tsx
// Este componente también es un Server Component por defecto
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/nextauth"; // Esto es correcto para esa estructura

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Doble verificación del rol en el servidor para mayor seguridad
  if (!session || session.user?.role !== "admin") {
    redirect("/unauthorized"); // Redirige si no es admin
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-red-700">
        Panel de Administración Secreto
      </h1>
      <p>
        Bienvenido, **{session.user.name}**, solo los administradores tienen
        acceso aquí.
      </p>
      <p className="mt-4">
        Aquí puedes gestionar usuarios, configuraciones sensibles, etc.
      </p>
    </div>
  );
}
