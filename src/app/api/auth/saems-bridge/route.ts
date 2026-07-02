import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as jose from 'jose';

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // 1. Authenticate the user from the Bearer token
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // 2. Get the user's role and profile details
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name, email')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // 3. Generate a secure, short-lived JWT (expires in 5 minutes)
    const secret = new TextEncoder().encode(
      process.env.SAEMS_TUNES_JWT_SECRET || 'fallback_secret'
    );
    
    const alg = 'HS256';
    
    const jwt = await new jose.SignJWT({
      source: 'aflewo',
      uid: user.id,
      role: profile.role,
      name: profile.full_name,
      email: profile.email
    })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer('aflewo-portal')
      .setAudience('saemstunes')
      .setExpirationTime('5m') // Extremely short lived for security
      .sign(secret);

    // 4. Return the secure handoff URL
    const handoffUrl = `https://saemstunes.com/auth-bridge?token=${jwt}`;
    
    return NextResponse.json({ url: handoffUrl });

  } catch (error) {
    console.error('[api/auth/saems-bridge] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate secure handoff token' },
      { status: 500 }
    );
  }
}
