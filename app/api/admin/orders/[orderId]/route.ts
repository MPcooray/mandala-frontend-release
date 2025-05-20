import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: any, context: any) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${context.params.orderId}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return new NextResponse('Order not found', { status: 404 });
      }
      throw new Error('Failed to fetch order');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching order:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: any, context: any) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${context.params.orderId}/status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      return new NextResponse('Failed to update status', { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating order status:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
