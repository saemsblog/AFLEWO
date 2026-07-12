import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, generateAlumniEmailHtml } from '@/lib/email';

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    const body = await request.json();
    const { name, email, chapter, years, role } = body;

    if (!name || !email || !chapter || !years) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: chapterData, error: chapterError } = await supabase
      .from('chapters')
      .select('id')
      .eq('name', chapter)
      .single();

    if (!chapterError && chapterData) {
      // Create a volunteer audition record to capture the alumni data
      const { data: profile } = await supabase.from('profiles').select('id').eq('email', email).single();
      if (profile) {
          await supabase.from('auditions').insert({
              user_id: profile.id,
              chapter_id: chapterData.id,
              category: 'volunteer_hospitality',
              notes: `ALUMNI REGISTRATION - Years: ${years}, Role: ${role}`,
              status: 'pending'
          });
      }
    }

    // Send confirmation email via Resend
    await sendEmail({
      to: email,
      subject: "Welcome Back to AFLEWO",
      html: generateAlumniEmailHtml(name, chapter),
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[api/alumni] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process alumni registration.' },
      { status: 500 }
    );
  }
}
