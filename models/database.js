var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/osmdhasboard';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query("select * from planet_osm_line where (tags -> 'natural')= 'wood' limit 10");
query.on('end', function() { client.end(); });
