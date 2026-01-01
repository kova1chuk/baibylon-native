import { supabase } from '@/lib/supabase';

export interface SupabaseRpcError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

export interface SupabaseRpcArgs {
  functionName: string;
  args?: Record<string, unknown>;
}

export async function supabaseRpcQuery<T = unknown>({
  functionName,
  args,
}: SupabaseRpcArgs): Promise<T> {
  const { data, error } = args
    ? await supabase.rpc(functionName as any, args)
    : await supabase.rpc(functionName as any);

  if (error) {
    const rpcError: SupabaseRpcError = {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    };
    throw rpcError;
  }

  return data as T;
}
