import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserBids = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user-bids', userId],
    queryFn: async () => {
      if (!userId) return 0;
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('bids')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user bids:', error);
        return 0;
      }

      return profile?.bids || 0;
    },
    enabled: !!userId
  });
};