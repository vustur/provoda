import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as any,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  manageConns: true,
  connUtilization: 0.9,
});

export default async function dbPost(query: string, values: any) {
  try {
    const req = await db.query(query, values);
    return req;
  } catch (error) {
    throw new Error(error)
  } finally {
    db.end()
  }
}
