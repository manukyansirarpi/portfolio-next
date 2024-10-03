import { createClient as createSupabaseClient } from '@/lib/supabase/client';

export const apiRoutes = {
  events: {
    generate: '/events/generate',
  },
};

export async function authenticatedPostRequest(apiRoute, body) {
  const supabase = createSupabaseClient();

  const { data } = await supabase.auth.getSession();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiRoute}`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: `Bearer ${data.session.access_token}`,
    },
  });

  return response;
}
