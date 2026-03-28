import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <main className="px-4 py-6 max-w-md mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
