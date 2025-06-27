// app/api/admin/users/route.ts
export const runtime = 'nodejs'; // <-- ¡AÑADE ESTA LÍNEA!
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/nextauth"; // Tu configuración de NextAuth.js
import prisma from "@/lib/prisma"; // Tu instancia de Prisma Client

// GET /api/admin/users - Para obtener la lista de todos los usuarios
export async function GET() {
  const session = await getServerSession(authOptions);

  // ¡AÑADE ESTA LÍNEA PARA DEPURAR!
  console.log('DEBUG (GET): Sesión recibida en /api/admin/users:', session);

  // 1. Verificar autenticación y rol de administrador
  if (!session || session.user?.role !== "admin") {
    // ¡AÑADE ESTA LÍNEA PARA DEPURAR!
    console.log('DEBUG (GET): Intento de acceso no autorizado a /api/admin/users.');
    return new NextResponse(
      JSON.stringify({ message: "Acceso no autorizado" }),
      { status: 401 },
    );
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true, // Incluye la imagen si quieres mostrarla
      },
      orderBy: {
        name: "asc", // Ordena por nombre para una mejor visualización
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);

    return new NextResponse(
      JSON.stringify({
        message: "Error interno del servidor al obtener usuarios",
      }),
      { status: 500 },
    );
  }
}

// PATCH /api/admin/users - Para actualizar el rol de un usuario específico
// Espera un cuerpo JSON como: { id: "user_id_a_actualizar", role: "nuevo_rol" }
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  // ¡AÑADE ESTA LÍNEA PARA DEPURAR!
  console.log('DEBUG (PATCH): Sesión recibida en /api/admin/users:', session);

  // 1. Verificar autenticación y rol de administrador
  if (!session || session.user?.role !== "admin") {
    // ¡AÑADE ESTA LÍNEA PARA DEPURAR!
    console.log('DEBUG (PATCH): Intento de acceso no autorizado a /api/admin/users.');
    return new NextResponse(
      JSON.stringify({ message: "Acceso no autorizado" }),
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const { id, role } = body;

    // 2. Validar los datos recibidos
    if (!id || !role || (role !== "user" && role !== "admin")) {
      return new NextResponse(
        JSON.stringify({ message: "ID de usuario o rol no válidos" }),
        { status: 400 },
      );
    }

    // Opcional: Prevenir que un admin cambie su propio rol accidentalmente o se quede sin admin
    if (session.user?.id === id && role !== "admin") {
      // Podrías añadir lógica para asegurar que siempre haya al menos un admin
      // Por simplicidad, aquí solo prevenimos que el admin activo se quite a sí mismo el rol de admin
      // sin una interfaz de seguridad más robusta.
      return new NextResponse(
        JSON.stringify({
          message:
            "No puedes cambiar tu propio rol de administrador directamente.",
        }),
        { status: 403 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: { role: role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);

    return new NextResponse(
      JSON.stringify({
        message: "Error interno del servidor al actualizar usuario",
      }),
      { status: 500 },
    );
  }
}