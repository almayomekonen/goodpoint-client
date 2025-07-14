import { QueryClient } from '@tanstack/react-query';

/**
 * the  default query client v4 Configurations area
 */

export const defaultQueryConfig = { staleTime: 60000 };

export const queryClient = new QueryClient({
    defaultOptions: { queries: defaultQueryConfig },
});
