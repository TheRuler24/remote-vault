import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, type } = await req.json();

    if (!name || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create the device
    const device = await prisma.device.create({
      data: {
        name,
        type,
        ownerId: user.id,
        provisioningKey: uuidv4().split('-')[0]?.toUpperCase() || uuidv4().substring(0, 8).toUpperCase(),
        status: 'OFFLINE',
        capabilities: {
          files: true,
          shell: false,
          notifications: type === 'MOBILE',
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      key: device.provisioningKey,
      deviceId: device.id 
    });

  } catch (error) {
    console.error('Device registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const devices = await prisma.device.findMany({
      where: {
        owner: { email: session.user.email }
      },
      orderBy: { lastSeen: 'desc' }
    });

    return NextResponse.json(devices);
  } catch (error) {
    console.error('Fetch devices error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
