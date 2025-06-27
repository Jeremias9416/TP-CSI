// components/LogoutButton.tsx
'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@heroui/button'; // O tu ruta correcta a HeroUI Button

export default function LogoutButton() {
  return (
    <Button
      variant="ghost" // Mantén la variante ghost, que es buena para la navegación
      // ELIMINAR LA PROPIEDAD 'color="white"'
      onClick={() => signOut({ callbackUrl: '/' })}
      // Asegúrate de que text-white esté aquí para forzar el color del texto si no lo hereda bien
      className="w-full justify-start !p-2 !rounded !hover:bg-gray-700 text-white" // Añadido text-white aquí
    >
      Cerrar Sesión
    </Button>
  );
}