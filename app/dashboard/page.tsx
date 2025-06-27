// app/dashboard/page.tsx
// Este componente puede ser un Server Component (por defecto)
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/nextauth"; // Ajusta la ruta

export default async function DashboardHomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Bienvenido a tu Dashboard, {session?.user?.name}!</h1>
      <p>Tu rol actual es: <span className="font-semibold text-blue-600">{session?.user?.role}</span></p>
      <p className="mt-4">
        Este es el contenido principal de tu dashboard. Accesible para todos los usuarios logueados.
      </p>
    </div>
  );
}