import Link from 'next/link';
import ContainerComponent from '../../shared/ui/container.component';

export default function NotFound() {
  return (
    <ContainerComponent className="w-full py-16">
      <div>
        <h1>Book Not Found</h1>
        <p>The book you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/" className="text-blue-500">
          Back to Home
        </Link>
      </div>
    </ContainerComponent>
  );
}