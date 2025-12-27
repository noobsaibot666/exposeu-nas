import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function query<T>(text: string, params: Array<string | number | null> = []) {
  const result = await pool.query<T>(text, params)
  return result
}
