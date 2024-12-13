import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { TaskCategory } from "@/types/task";

export const useTaskUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            if (!e.target?.result) {
              throw new Error('Failed to read file');
            }

            const data = new Uint8Array(e.target.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            
            if (!workbook.SheetNames.length) {
              throw new Error('Excel file is empty');
            }

            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if (!jsonData.length) {
              throw new Error('No data found in Excel file');
            }

            const processedTasks = jsonData.map((row: any, index: number) => {
              // Validate required fields
              if (!row.UniqueCode) {
                throw new Error(`Missing UniqueCode in row ${index + 1}`);
              }
              if (!row.Title) {
                throw new Error(`Missing Title in row ${index + 1}`);
              }
              if (!row.Category) {
                throw new Error(`Missing Category in row ${index + 1}`);
              }

              const category = row.Category?.toLowerCase();
              if (category !== 'genai' && category !== 'creai') {
                throw new Error(`Invalid Category "${row.Category}" in row ${index + 1}. Must be either "genai" or "creai"`);
              }

              return {
                code: row.UniqueCode,
                title: row.Title,
                description: row.Description || '',
                category: category as TaskCategory,
                payout: category === 'genai' ? 500 : 250,
                tasker_payout: category === 'genai' ? 400 : 200,
                platform_fee: category === 'genai' ? 100 : 50,
                bids_needed: category === 'genai' ? 10 : 5,
                max_bidders: 10,
                current_bids: 0,
                deadline: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
                status: "pending"
              };
            });

            const { error: insertError } = await supabase
              .from('tasks')
              .insert(processedTasks);

            if (insertError) {
              console.error('Insert error:', insertError);
              throw new Error(`Failed to insert tasks: ${insertError.message}`);
            }

            return processedTasks.length;
          } catch (error) {
            console.error('Processing error:', error);
            reject(error);
          }
        };

        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };

        reader.readAsArrayBuffer(file);
      });
    },
    onSuccess: (tasksCount) => {
      queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
      toast.success(`Successfully uploaded ${tasksCount} tasks`);
    },
    onError: (error: Error) => {
      console.error('Upload error:', error);
      toast.error(error.message || "Failed to upload tasks");
    }
  });
};