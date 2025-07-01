// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <div className="text-center p-5 bg-light rounded-3 shadow">
        <h1 className="display-4 fw-bold">Pastelería Deliciosa</h1>
        <p className="lead my-4">
          Bienvenido a nuestro rincón dulce. Administra nuestro catálogo de tortas
          ingresando al panel de control.
        </p>
        <Link href="/admin" className="btn btn-primary btn-lg">
          Ir al Panel de Admin
        </Link>
      </div>
    </div>
  );
}