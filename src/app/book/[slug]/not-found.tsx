'use client';

import { Card, CardBody, Button } from '@heroui/react';
import Link from 'next/link';
import ContainerComponent from '../../shared/ui/container.component';

export default function NotFound() {
  return (
    <ContainerComponent className="w-full py-16">
      <Card className="max-w-md mx-auto">
        <CardBody className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Book Not Found</h1>
          <p className="text-gray-600">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/">
            <Button color="primary" variant="solid">
              Back to Home
            </Button>
          </Link>
        </CardBody>
      </Card>
    </ContainerComponent>
  );
}
