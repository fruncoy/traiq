import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserBids = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user-bids', userId],
    queryFn: async () => {
      if (!userId) return 0;
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('bids')
          .eq('id', userId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // Profile doesn't exist yet, return 0 bids
            return 0;
          }
          throw error;
        }

        return profile?.bids || 0;
      } catch (error) {
        console.error('Error fetching user bids:', error);
        return 0;
      }
    },
    enabled: !!userId
  });
};