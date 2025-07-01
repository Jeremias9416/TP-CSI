// app/login/page.tsx
'use client';
import "bootstrap-icons/font/bootstrap-icons.css";

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card text-center shadow" style={{ width: '22rem' }}>
        <div className="card-body p-4">
          <h5 className="card-title mb-4">Acceso al Panel</h5>
          <p className="card-text">
            Por favor, inicia sesión para administrar el catálogo.
          </p>
          <button
            onClick={() => signIn('google', { callbackUrl: '/admin' })}
            className="btn btn-danger w-100"
          >
            <i className="bi bi-google me-2"></i> Iniciar sesión con Google
          </button>
        </div>
      </div>
    </div>
  );
}