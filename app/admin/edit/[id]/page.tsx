// app/admin/edit/[id]/page.tsx
import type { PageProps } from 'next'; // <-- 1. AÑADE ESTA IMPORTACIÓN
import { getCakeById, updateCake as updateCakeInDb } from '@/lib/actions';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import CakeForm from '@/components/CakeForm';


export default async function EditCakePage({ params }: PageProps<{ params: { id: string } }>) {
  const cake = await getCakeById(params.id);

  if (!cake) {
    notFound();
  }

  // --- NUEVA SERVER ACTION DEFINIDA AQUÍ DENTRO ---
  async function updateCakeAction(formData: FormData) {
    'use server'; // Marcamos esta función interna como una Server Action

    // Llamamos a la función de la base de datos que ya teníamos,
    // pero ahora usamos el 'params.id' directamente desde el scope de la página.
    await updateCakeInDb(params.id, formData);

    // Redirigimos al panel principal después de actualizar
    redirect('/admin');
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">Editar Receta: {cake.name}</h1>
        <Link href="/admin" className="btn btn-secondary">
          Volver al Panel
        </Link>
      </div>
      <div className="card">
        <div className="card-body">
          {/* Ahora el formulario llama directamente a nuestra nueva acción */}
          <CakeForm action={updateCakeAction} cake={cake} />
        </div>
      </div>
    </div>
  );
}