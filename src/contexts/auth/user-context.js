'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { logger } from '@/lib/default-logger';
import { createClient as createSupabaseClient } from '@/lib/supabase/client';

const UserContext = React.createContext(undefined);

function UserProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [supabaseClient] = React.useState(createSupabaseClient());

  const [state, setState] = React.useState({
    user: null,
    error: null,
    isLoading: true,
  });

  React.useEffect(() => {
    function handleInitialSession(session) {
      logger.debug('handleInitialSession');
      const user = session?.user;

      if (user) {
        const userResponse = supabaseClient
          .from('users')
          .select('id, firstname, lastname, organization_id, organizations(name)')
          .eq('supabase_auth_id', user.id)
          .single();

        userResponse.then((response) => {
          user.organizationName = response.data.organizations.name.toLowerCase();
          user.organizationId = response.data.organization_id;
          user.firstname = response.data.firstname;
          user.lastname = response.data.lastname;

          setState((prev) => ({
            ...prev,
            user: user
              ? {
                  id: user.id ?? undefined,
                  email: user.email ?? undefined,
                  name: user.user_metadata?.full_name ?? undefined,
                  firstname: user.firstname,
                  lastname: user.lastname,
                  avatar: user.user_metadata?.avatar_url ?? undefined,
                  organizationId: user.organizationId,
                  organizationName: user.organizationName,
                }
              : null,
            error: null,
            isLoading: false,
          }));
          if (pathname === '/') {
            router.replace(`/${user.organizationName}`);
          }

          const splitPath = pathname.split('/');
          const organizationPath = splitPath[1].toLowerCase();
          if (organizationPath !== user.organizationName) {
            router.replace(pathname.replace(organizationPath, user.organizationName));
          }
        });
      } else {
        setState((prev) => ({
          ...prev,
          user: user
            ? {
                id: user.id ?? undefined,
                email: user.email ?? undefined,
                name: user.user_metadata?.full_name ?? undefined,
                avatar: user.user_metadata?.avatar_url ?? undefined,
              }
            : null,
          error: null,
          isLoading: false,
        }));
      }
    }

    function handleSignedIn(session) {
      logger.debug('handleSignedIn');

      const user = session?.user;

      const userResponse = supabaseClient
        .from('users')
        .select('id, firstname, lastname, organization_id, organizations(name)')
        .eq('supabase_auth_id', user.id)
        .single();

      userResponse.then((response) => {
        user.organizationName = response.data.organizations.name.toLowerCase();
        user.organizationId = response.data.organization_id;
        user.firstname = response.data.firstname;
        user.lastname = response.data.lastname;

        setState((prev) => ({
          ...prev,
          user: user
            ? {
                id: user.id ?? undefined,
                email: user.email ?? undefined,
                name: user.user_metadata?.full_name ?? undefined,
                firstname: user.firstname,
                lastname: user.lastname,
                avatar: user.user_metadata?.avatar_url ?? undefined,
                organizationId: user.organizationId,
                organizationName: user.organizationName,
              }
            : null,
          error: null,
          isLoading: false,
        }));
        router.refresh();
      });
    }

    function handleSignedOut() {
      setState((prev) => ({ ...prev, user: null, error: null, isLoading: false }));

      router.refresh();
    }

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      logger.debug('[Auth] onAuthStateChange:', event, session);

      if (event === 'INITIAL_SESSION') {
        handleInitialSession(session);
      }

      if (event === 'SIGNED_IN') {
        handleSignedIn(session);
      }

      if (event === 'SIGNED_OUT') {
        handleSignedOut();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router, supabaseClient, pathname]);

  return <UserContext.Provider value={{ ...state }}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;

export { UserProvider, UserContext };
