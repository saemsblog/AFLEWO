/**
 * POST /api/checkin
 *
 * Skeleton ticketing check-in endpoint.
 * Ushers open /admin/attendance on their phones and type a ticket_ref or phone.
 * This route marks the registration as checked_in = true.
 * Works offline via localStorage cache + sync (handled on the client).
 */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const body = await request.json();
    const { query, eventId } = body; // query = ticket_ref OR phone_number

    if (!query || !eventId) {
      return NextResponse.json(
        { error: 'query and eventId are required' },
        { status: 400 }
      );
    }

    // Authenticate the usher
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Verify usher has the right role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['chapter_admin', 'super_admin', 'volunteer'].includes(profile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Find registration by ticket_ref or phone
    const { data: registration, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('event_id', eventId)
      .or(`ticket_ref.eq.${query.toUpperCase()},phone_number.eq.${query}`)
      .single();

    if (error || !registration) {
      return NextResponse.json(
        { error: 'No registration found with that ticket or phone number.' },
        { status: 404 }
      );
    }

    if (registration.checked_in) {
      return NextResponse.json(
        {
          error: 'Already checked in',
          name: registration.full_name,
          checked_in_at: registration.checked_in_at,
        },
        { status: 409 }
      );
    }

    // Mark as checked in
    const { error: updateError } = await supabase
      .from('registrations')
      .update({
        checked_in: true,
        checked_in_at: new Date().toISOString(),
        checked_in_by: user.id,
      })
      .eq('id', registration.id);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      name: registration.full_name,
      ticket_ref: registration.ticket_ref,
      message: `${registration.full_name} checked in successfully.`,
    });

  } catch (error) {
    console.error('[api/checkin] Error:', error);
    return NextResponse.json(
      { error: 'Check-in failed. Please try again.' },
      { status: 500 }
    );
  }
}
