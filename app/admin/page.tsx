import { auth, signOut } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCakes, createCake, deleteCake } from '@/lib/actions';
import CakeForm from '@/components/CakeForm'; // Importamos el formulario reutilizable

// Componente de cliente para el botón de cerrar sesión
function SignOutButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut({ redirectTo: '/' });
      }}
    >
      <button type="submit" className="btn btn-secondary">
        Cerrar Sesión
      </button>
    </form>
  );
}

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const cakes = await getCakes();

  return (
    <div className="container mt-5 mb-5">
      <header className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="h2">Panel de Recetas</h1>
          <p className="text-muted">Bienvenido, {session.user.name}</p>
        </div>
        <SignOutButton />
      </header>

      {/* Formulario para Crear usando el componente reutilizable */}
      <div className="card mb-5">
        <div className="card-header">Añadir Nueva Receta de Torta</div>
        <div className="card-body">
          <CakeForm action={createCake} />
        </div>
      </div>

      {/* Lista de Recetas */}
      <h2 className="h4">Catálogo de Recetas</h2>
      <div className="row g-4">
        {cakes?.map((cake) => (
          <div key={cake.id} className="col-md-6 col-lg-4">
            <div className="card h-100">
              {cake.imageUrl && <img src={cake.imageUrl} className="card-img-top" alt={cake.name} style={{ height: '200px', objectFit: 'cover' }} />}
              <div className="card-body">
                <h5 className="card-title">{cake.name}</h5>
                <p className="card-text text-success fw-bold">${cake.price.toFixed(2)}</p>
                <p className="card-text text-muted">{cake.description}</p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <Link href={`/admin/edit/${cake.id}`} className="btn btn-outline-primary btn-sm">
                  Editar
                </Link>
                <form action={deleteCake} className="d-inline">
                  <input type="hidden" name="id" value={cake.id} />
                  <button type="submit" className="btn btn-outline-danger btn-sm">
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}