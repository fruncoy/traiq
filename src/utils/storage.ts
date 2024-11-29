import { supabase } from "@/integrations/supabase/client";

export const createTaskSubmissionsBucket = async () => {
  const { data, error } = await supabase
    .storage
    .createBucket('task-submissions', {
      public: false,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['application/pdf', 'application/msword', 'text/plain']
    });

  if (error) {
    console.error('Error creating bucket:', error);
    throw error;
  }

  return data;
};