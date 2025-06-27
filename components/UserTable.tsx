// components/UserTable.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react'; // Para obtener el ID del usuario actual
import Image from 'next/image';
// Importa tus componentes de HeroUI si tienes una tabla o selectores específicos
// import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table';
// import { Select, SelectItem } from '@heroui/select';
// import { Button } from '@heroui/button'; // Si necesitas botones para acciones

// Define una interfaz para el tipo de usuario que recibimos
interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  image: string | null;
}

interface UserTableProps {
  initialUsers: UserData[];
}

export default function UserTable({ initialUsers }: UserTableProps) {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null); // Para mostrar estado de carga por usuario
  const { data: session } = useSession(); // Para saber quién es el usuario logueado

  const handleRoleChange = async (userId: string, newRole: string) => {
    // Evitar que un admin cambie su propio rol accidentalmente desde la UI
    // La protección principal debe estar en el backend, pero esto mejora la UX
    if (session?.user?.id === userId && newRole !== 'admin') {
      alert("No puedes cambiar tu propio rol de administrador desde aquí.");
      return;
    }

    setLoadingUserId(userId);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el rol');
      }

      const updatedUser = await response.json();

      // Actualizar el estado de los usuarios para reflejar el cambio
      setUsers(prevUsers =>
        prevUsers.map(user => (user.id === updatedUser.id ? updatedUser : user))
      );
      alert(`Rol de ${updatedUser.name || updatedUser.email} actualizado a ${updatedUser.role}.`);

    } catch (error: any) {
      console.error("Error al actualizar el rol:", error);
      alert(`Fallo al actualizar el rol: ${error.message}`);
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Usuarios del Sistema</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Avatar
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rol
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.image && (
                  <Image
                    src={user.image}
                    alt={user.name || 'User Avatar'}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  // Deshabilitar el selector para el usuario actualmente logueado si no quieres que se cambie a sí mismo
                  disabled={loadingUserId === user.id || session?.user?.id === user.id}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
                {loadingUserId === user.id && <span className="ml-2 text-blue-500">Actualizando...</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {/* Puedes añadir botones de eliminar aquí si lo deseas */}
                {/* <button className="text-red-600 hover:text-red-900 ml-4">Eliminar</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}