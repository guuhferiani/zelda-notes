import fs from 'fs';
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('Erro: variável de ambiente DATABASE_URL não definida.');
  process.exit(1);
}
const sql = neon(url);

const ddl = fs.readFileSync('db/schema.sql', 'utf8');

// Remove single line comments
const cleanSql = ddl.replace(/--.*$/gm, '');

const statements = cleanSql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 5);

async function main() {
  console.log('Executando DDL no Neon DB...');
  for (const st of statements) {
    console.log('Executando:', st.substring(0, 40).replace(/\n/g, ' ') + '...');
    await sql(st);
  }

  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;

  console.log('\nTabelas ativas no Neon:');
  tables.forEach(t => console.log(' -> ' + t.table_name));
}

main().then(() => {
  console.log('\nMigração para o Neon concluída com 100% de sucesso!');
  process.exit(0);
}).catch(err => {
  console.error('Falha na migração:', err);
  process.exit(1);
});
