import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Duotech Next.js</h1>
      <p className="text-gray-600">
        Kiến trúc chuẩn đã sẵn sàng. Bắt đầu bằng cách sửa{' '}
        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">src/app/page.tsx</code>.
      </p>
      <Button>Bắt đầu code</Button>
    </main>
  );
}
