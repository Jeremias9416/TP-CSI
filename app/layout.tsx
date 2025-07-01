// app/layout.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthProvider from '@/components/AuthProvider'; // Importa tu nuevo componente

export const metadata = {
  title: 'Pastelería Deliciosa',
  description: 'Las mejores tortas de la ciudad',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}