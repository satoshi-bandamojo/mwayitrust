declare const Deno: {
  env: {
    get(name: string): string | undefined
  }
}

declare module 'https://deno.land/std@0.177.0/http/server.ts' {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void
}

declare module 'https://esm.sh/@supabase/supabase-js@2' {
  export function createClient(url: string, key: string): {
    from: (table: string) => {
      select: (columns?: string) => {
        eq: (column: string, value: string) => {
          single: () => Promise<{ data?: any; error?: any }>
        }
      }
      update: (value: any) => {
        eq: (column: string, value: string) => Promise<{ error: any }>
      }
    }
  }
}
