
const { Client, Pool } = require('pg/lib');
const expressServer = require('./js/express');

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  database: "countryprofiles",
  password: "root",
  port: 5432
});



//SELECT json_agg(t) FROM (SELECT * FROM countries NATURAL JOIN regions NATURAL JOIN population NATURAL JOIN economy ORDER BY countrykey ASC) t;
async function getData(){
  const query = 'SELECT json_agg(t) FROM (SELECT * FROM countries NATURAL JOIN regions NATURAL JOIN population NATURAL JOIN economy ORDER BY countrykey ASC) t;'
  const client = await pool.connect();
  const res = await client.query(query);
  return res.rows[0].json_agg;;
}
async function fetch(q){
  const query = q;
  const client = await pool.connect();
  const res = await client.query(query);
  return res.rows[0].json_agg;;
}

  const server = new expressServer(3000);

  //fetch data from database
  server.app.get('/data.json', async (req, res) => {
    res.json(await getData());
    });

  //fetch region surface areas from database
  server.app.get('/rsum.json', async (req, res) => {
    const q = "SELECT json_agg(t) FROM (SELECT rname, SUM(surfacearea) surfacearea FROM regions NATURAL JOIN countries GROUP BY regionkey) t;";
    res.json(await fetch(q));
    });