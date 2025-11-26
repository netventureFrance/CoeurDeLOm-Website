import { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Admin - Cœur de l\'OM',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
