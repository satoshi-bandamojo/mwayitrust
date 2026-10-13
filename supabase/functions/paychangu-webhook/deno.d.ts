declare const Deno: {
  serve(handler: (req: Request) => Response | Promise<Response>): void
  env: {
    get(name: string): string | undefined
  }
}

declare module 'npm:@supabase/supabase-js@2.39.3' {
  type DatabaseError = { message: string; code?: string }
  type QueryResult<T = never> = { data: T | null; error: DatabaseError | null }

  interface SelectQuery {
    eq(column: string, value: string): SelectQuery
    maybeSingle(): Promise<QueryResult<Record<string, unknown>>>
  }

  interface UpdateQuery {
    eq(column: string, value: string): UpdateQuery
    in(column: string, values: string[]): UpdateQuery
    select(columns?: string): SelectQuery
  }

  export function createClient(url: string, key: string): {
    from: (table: string) => {
      select: (columns?: string) => SelectQuery
      update: (value: Record<string, unknown>) => UpdateQuery
    }
  }
}
