declare const Deno: {
  env: {
    get(name: string): string | undefined
  }
}

declare module 'https://deno.land/std@0.177.0/http/server.ts' {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void
}

declare module 'npm:@supabase/supabase-js@2.39.3' {
  export function createClient(url: string, key: string): {
    from: (table: string) => {
      insert: (value: any) => Promise<{ error: any }>
      update: (value: any) => {
        eq: (column: string, value: string) => Promise<{ error: any }>
      }
    }
  }
}
