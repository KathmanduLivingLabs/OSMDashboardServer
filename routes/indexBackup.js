var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');

var connectionString = require(path.join(__dirname, '../', 'config'));

//formats query for time
function formatQuery(query, queryString) {
  var tempQstr = {};
  tempQstr["from"] = queryString.from + 'T00:00:00Z';
  if(queryString.to)
    tempQstr["to"] = queryString.to + 'T23:59:59Z';
  else
    tempQstr["to"] = '2015:12:31T23:59:59Z'

  var temp;
  temp = query.replace(new RegExp('aakashsigdel', 'g'), tempQstr.from);
  temp = temp.replace(new RegExp('megha', 'g'), tempQstr.to);
	if(queryString.bbox)
		temp = temp.replace(new RegExp('pratik', 'g'), queryString.bbox);
	else
		temp = temp.replace(new RegExp(escapeRegExp('ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857), ST_SetSRID(way, 3857)) AND'), 'g'), '');

  return temp;
}		

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function getIntervalQueries(query, queryString) {
	var tempQuery = [];
	var interval = {};
	var tempQString = [];
	
	var diff;
	if(queryString.to) {
		diff = Number(queryString.to) - Number(queryString.from);
	} else {
		diff = 2015 - Number(queryString.from);
	}

	switch(diff) {
		case 0:
			interval["1"] = ['02', '04', '06', '08', '10', '12'];
			break;
		case 1:
			interval["2"] = ['04', '08', '12', '04', '08', '12'];
			break;
		default:
			interval["0"] = ['fun'];
	}

	if(interval["1"]) {
		for(var i = 0; i < 6; i++) {
			tempQString.push({from: queryString.from + ':' + interval["1"][i] + ':01'});
			tempQString[i]["to"] = queryString.from + ':' + interval["1"][i] + ':31'; 
			tempQString[i]["bbox"] = queryString.bbox;
		}
	} else if(interval["2"]) {
		for(var i = 0; i < 6; i++) {
			if(i > 2) {
				tempQString.push({from: (Number(queryString.from) + 1) + ':' + interval["2"][i] + ':01'});
				tempQString[i]["to"] = (Number(queryString.from) + 1) + ':' + interval["2"][i] + ':31'; 
				tempQString[i]["bbox"] = queryString.bbox;
			} else {
				tempQString.push({from: queryString.from + ':' + interval["2"][i] + ':01'});
				tempQString[i]["to"] = queryString.from + ':' + interval["2"][i] + ':31'; 
				tempQString[i]["bbox"] = queryString.bbox;
			}
		}
	} else if(interval["0"]) {
		for(var i = 0; i <= diff; i++) {
			tempQString.push({from: (Number(queryString.from) + i)  + ':01:01'})
			tempQString[i]["to"] = (Number(queryString.from) + i) + ':12:31';
			tempQString[i]["bbox"] = queryString.bbox;
		}
			console.log(tempQString);
	}

	for(var i = 0; i < tempQString.length; i++) {
		tempQuery[i] = formatQuery(query, tempQString[i]);
	}
	return tempQuery;
}








router.all('/api/e_i_y', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  next();
	  });

router.all('/api/roads', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  next();
	  });

router.all('/api/waterways', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  next();
	  });

router.all('/api/edu_institute', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  next();
	  });

router.all('/api/buildings', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  next();
	  });

router.all('/api/medical', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  next();
	  });


router.all('/api/financial_institute', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  next();
	  });

router.all('/api/gov_offices', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  next();
	  });

router.all('/api/historic_sites', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  next();
	  });

router.all('/api/natural_heritage', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  next();
	  });

router.all('/api/tourist_interest', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  next();
	  });

router.all('/api/settlements', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  next();
	  });












router.get('/', function(req, res) {
	return res.json({"aakash":"toto"});
})

// planet_osm_point ma vako 2010 ko distinct number of osm_id count gareko. Repeat for all years
router.get('/api/e_i_y', function(req, res) {
	var result = [];
	var queryString = req.query;
	
	queryText = "SELECT count(distinct osm_id), max(osm_timestamp) FROM planet_osm_point WHERE ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857), ST_SetSRID(way, 3857)) AND (tags->'osm_timestamp')>='aakashsigdel' AND  (tags->'osm_timestamp')<'megha';";

	queryText = getIntervalQueries(queryText, queryString);
	//var queryText = formatQuery(queryText, queryString);
	console.log(queryText);
/*
	var lock = queryText.length - 1;
		pg.connect(connectionString, function(err, client, done) {
			for(var i = 0; i< queryText.length; i++) {
			var query = client.query(queryText[i]);

			query.on('row', function(row) {
				result.push(row);
				console.log("tiki takkata pakara laka");
			});

			query.on('end', function() {
				client.end();
				if(lock === 0) {
					return res.json(result);
				}
				else
					--lock;
			})
			}
		})
	 */
	var lock = queryText.length - 1;
		pg.connect(connectionString, function(err, client, done) {
			for(var i = 0; i< queryText.length; i++) {
			var query = client.query(queryText[i]);

			query.on('row', function(row) {
				result.push(row);
				console.log("ttikkic toooccckkk");
			});

			query.on('end', function() {
				if(lock === 0) {
					client.end();
					return res.json(result);
				}
				else {
					console.log("lock = " + lock);
					--lock;
				}
			})
			}
		})
});
	

// count the distinct osm id from planet_osm_line for buildings mapped in year 2010
router.get('/api/buildings', function(req, res) {
	var result = [];
	var queryString = req.query;
	
	queryText = "select count ( distinct osm_id),max(osm_timestamp) from planet_osm_line where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND ((tags-> 'building') is not NULL AND (tags -> 'osm_timestamp') >= 'aakashsigdel' AND (tags -> 'osm_timestamp')< 'megha')";

	var queryText = getIntervalQueries(queryText, queryString);
	//var queryText = formatQuery(queryText, queryString);

	var lock = queryText.length - 1;
		pg.connect(connectionString, function(err, client, done) {
			for(var i = 0; i< queryText.length; i++) {
			var query = client.query(queryText[i]);

			query.on('row', function(row) {
				result.push(row);
				console.log("ttikkic toooccckkk");
			});

			query.on('end', function() {
				if(lock === 0) {
					client.end();
					return res.json(result);
				}
				else {
					console.log("lock = " + lock);
					--lock;
				}
			})
			}
		})
});




router.get('/api/roads', function(req, res) {
	var result = [];
	var queryString = req.query;
	
	var queryText = "select sum(ST_Length(ST_Transform(way, 4326)::geography)),max(osm_timestamp) from planet_osm_line where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND ((tags -> 'highway') is not NULL AND (tags-> 'osm_timestamp') >='aakashsigdel' AND (tags -> 'osm_timestamp') <'megha')";

	queryText = getIntervalQueries(queryText, queryString);
	//var queryText = formatQuery(queryText, queryString);

	var lock = queryText.length - 1;
		pg.connect(connectionString, function(err, client, done) {
			for(var i = 0; i< queryText.length; i++) {
			var query = client.query(queryText[i]);

			query.on('row', function(row) {
				result.push(row);
			});

			query.on('end', function() {
				if(lock === 0) {
					client.end();
					return res.json(result);
				}
				else {
					--lock;
				}
			})
			}
		})
});



router.get('/api/waterways', function(req, res) {
	var result = [];
	var queryString = req.query;
	
	var queryText = "select sum(ST_Length(ST_Transform(way, 4326)::geography)), max(osm_timestamp) from planet_osm_line where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND ((tags -> 'waterway') is not NULL AND (tags-> 'osm_timestamp') >='aakashsigdel' AND (tags -> 'osm_timestamp') <'megha')";

	var queryText = getIntervalQueries(queryText, queryString);
	//var queryText = formatQuery(queryText, queryString);

	var lock = queryText.length - 1;
		pg.connect(connectionString, function(err, client, done) {
			for(var i = 0; i< queryText.length; i++) {
			var query = client.query(queryText[i]);

			query.on('row', function(row) {
				result.push(row);
			});

			query.on('end', function() {
				if(lock === 0) {
					client.end();
					return res.json(result);
				}
				else {
					--lock;
				}
			})
			}
		})
});


router.get('/api/medical', function(req, res) {
	var result = [];
	var queryString = req.query;
	
	var queryText = "Select sum (hospital) as hospital_total , max(time) from  (Select count (distinct planet_osm_point.osm_id) as hospital, max(planet_osm_point.osm_timestamp) as time from planet_osm_point where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857))  AND ((planet_osm_point.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_point.tags->'osm_timestamp')<'megha' )AND ((planet_osm_point.tags->'amenity')='hospital' OR (planet_osm_point.tags->'amenity')='clinic' OR (planet_osm_point.tags->'amenity')='dentist' OR (planet_osm_point.tags ->'amenity') = 'doctors' OR (planet_osm_point.tags-> 'amenity') = 'nursing_home' OR (planet_osm_point.tags -> 'amenity') = 'pharmacy' OR (planet_osm_point.tags -> 'amenity') = 'social_facility' OR (planet_osm_point.tags -> 'amenity') = 'veterinary' OR (planet_osm_point.tags -> 'healthcare') = 'blood_donation' OR (planet_osm_point.tags -> 'amenity') = 'healthpost') union all  select count (distinct planet_osm_polygon.osm_id) as hospital, max(planet_osm_polygon.osm_timestamp) as time from planet_osm_polygon where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857))  AND ((planet_osm_polygon.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_polygon.tags->'osm_timestamp')<'megha') AND ((planet_osm_polygon.tags->'amenity')='hospital' OR (planet_osm_polygon.tags->'amenity')='clinic' OR (planet_osm_polygon.tags->'amenity')='dentist' OR (planet_osm_polygon.tags ->'amenity') = 'doctors' OR (planet_osm_polygon.tags-> 'amenity') = 'nursing_home' OR (planet_osm_polygon.tags -> 'amenity') = 'pharmacy' OR (planet_osm_polygon.tags -> 'amenity') = 'social_facility' OR (planet_osm_polygon.tags -> 'amenity') = 'veterinary' OR (planet_osm_polygon.tags -> 'healthcare') = 'blood_donation' OR (planet_osm_polygon.tags -> 'amenity') = 'healthpost')) as u";

	queryText = getIntervalQueries(queryText, queryString);
	//var queryText = formatQuery(queryText, queryString);

	var lock = queryText.length - 1;
		pg.connect(connectionString, function(err, client, done) {
			for(var i = 0; i< queryText.length; i++) {
			var query = client.query(queryText[i]);

			query.on('row', function(row) {
				result.push(row);
				console.log("tiki toki loki boki");
			});

			query.on('end', function() {
				if(lock === 0) {
					client.end();
					return res.json(result);
				}
				else {
					--lock;
				}
			})
			}
		})
});

router.get('/api/edu_institute', function(req, res) {
	var result = [];
	var queryString = req.query;
	
	var queryText = "Select sum (school) as school_total , max(time)   from  (Select count (distinct planet_osm_point.osm_id) as school, max(planet_osm_point.osm_timestamp) as time  from planet_osm_point where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857))  AND  ((planet_osm_point.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_point.tags->'osm_timestamp')<'megha') AND  ((planet_osm_point.tags->'amenity')='school' OR (planet_osm_point.tags->'amenity')='kindergarten' OR (planet_osm_point.tags->'amenity')='college' OR (planet_osm_point.tags ->'amenity') = 'library' OR (planet_osm_point.tags-> 'amenity') = 'university') union all  select count (distinct planet_osm_polygon.osm_id) as school, max(planet_osm_polygon.osm_timestamp) as time  from planet_osm_polygon where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND  ((planet_osm_polygon.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_polygon.tags->'osm_timestamp')<'megha') AND ((planet_osm_polygon.tags->'amenity')='school' OR (planet_osm_polygon.tags->'amenity')='kindergarten' OR (planet_osm_polygon.tags->'amenity')='college' OR (planet_osm_polygon.tags ->'amenity') = 'library' OR (planet_osm_polygon.tags-> 'amenity') = 'university'))  as u";

	queryText = getIntervalQueries(queryText, queryString);
	//var queryText = formatQuery(queryText, queryString);

	var lock = queryText.length - 1;
		pg.connect(connectionString, function(err, client, done) {
			for(var i = 0; i< queryText.length; i++) {
			var query = client.query(queryText[i]);

			query.on('row', function(row) {
				result.push(row);
			});

			query.on('end', function() {
				if(lock === 0) {
					client.end();
					return res.json(result);
				}
				else {
					--lock;
				}
			})
			}
		})
});

router.get('/api/financial_institute', function(req, res) {
	var result = [];
	var queryString = req.query;
	
	var queryText = "Select sum (finance) as finance_total, max(time)   from  (Select count (distinct planet_osm_point.osm_id) as finance, max(planet_osm_point.osm_timestamp) as time  from planet_osm_point where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857))  AND  ((planet_osm_point.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_point.tags->'osm_timestamp')<'megha') AND  ((planet_osm_point.tags->'amenity')='bank' OR (planet_osm_point.tags->'amenity')='atm')  union all  select count (distinct planet_osm_polygon.osm_id) as finance, max(planet_osm_polygon.osm_timestamp) as time  from planet_osm_polygon where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND ((planet_osm_polygon.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_polygon.tags->'osm_timestamp')<'megha') AND ((planet_osm_polygon.tags->'amenity')='bank' OR (planet_osm_polygon.tags->'amenity')='atm')) as u";

	queryText = getIntervalQueries(queryText, queryString);
	//var queryText = formatQuery(queryText, queryString);

	var lock = queryText.length - 1;
		pg.connect(connectionString, function(err, client, done) {
			for(var i = 0; i< queryText.length; i++) {
			var query = client.query(queryText[i]);

			query.on('row', function(row) {
				result.push(row);
			});

			query.on('end', function() {
				if(lock === 0) {
					client.end();
					return res.json(result);
				}
				else {
					--lock;
				}
			})
			}
		})
});

router.get('/api/gov_offices', function(req, res) {
	var result = [];
	var queryString = req.query;
	
	var queryText = "Select sum (offc) as offc_total, max(time)   from  (Select count (distinct planet_osm_point.osm_id) as offc, max(planet_osm_point.osm_timestamp) as time  from planet_osm_point where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857))  AND ((planet_osm_point.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_point.tags->'osm_timestamp')<'megha') AND  ((planet_osm_point.tags->'office')='government') union all  select count (distinct planet_osm_polygon.osm_id) as offc, max(planet_osm_polygon.osm_timestamp) as time  from planet_osm_polygon where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND ((planet_osm_polygon.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_polygon.tags->'osm_timestamp')<'megha') AND ((planet_osm_polygon.tags->'office')='government')) as u";

	queryText = getIntervalQueries(queryText, queryString);
	//var queryText = formatQuery(queryText, queryString);

	var lock = queryText.length - 1;
		pg.connect(connectionString, function(err, client, done) {
			for(var i = 0; i< queryText.length; i++) {
			var query = client.query(queryText[i]);

			query.on('row', function(row) {
				result.push(row);
			});

			query.on('end', function() {
				if(lock === 0) {
					client.end();
					return res.json(result);
				}
				else {
					--lock;
				}
			})
			}
		})
});

router.get('/api/historic_sites', function(req, res) {
	var result = [];
	var queryString = req.query;
	
	var queryText = "Select sum (historic) as historic_total, max(time)   from  (Select count (distinct planet_osm_point.osm_id) as historic, max(planet_osm_point.osm_timestamp) as time  from planet_osm_point where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857))  AND ((planet_osm_point.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_point.tags->'osm_timestamp')<'megha') AND  ((planet_osm_point.tags->'place_of_worship') IS NOT NULL OR (planet_osm_point.tags->'historic') IS NOT NULL)  union all  select count (distinct planet_osm_polygon.osm_id) as historic, max(planet_osm_polygon.osm_timestamp) as time  from planet_osm_polygon where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND ((planet_osm_polygon.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_polygon.tags->'osm_timestamp')<'megha') AND ((planet_osm_polygon.tags->'place_of_worship') IS NOT NULL OR (planet_osm_polygon.tags->'historic') IS NOT NULL)) as u";

	queryText = getIntervalQueries(queryText, queryString);
	//var queryText = formatQuery(queryText, queryString);

	var lock = queryText.length - 1;
		pg.connect(connectionString, function(err, client, done) {
			for(var i = 0; i< queryText.length; i++) {
			var query = client.query(queryText[i]);

			query.on('row', function(row) {
				result.push(row);
			});

			query.on('end', function() {
				if(lock === 0) {
					client.end();
					return res.json(result);
				}
				else {
					--lock;
				}
			})
			}
		})
});

router.get('/api/natural_heritage', function(req, res) {
	var result = [];
	var queryString = req.query;
	
	var queryText = "Select sum (nature) as natural_total, max(time) from (Select count (distinct planet_osm_point.osm_id) as nature, max(planet_osm_point.osm_timestamp) as time from planet_osm_point where  ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND ((planet_osm_point.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_point.tags->'osm_timestamp')<'megha' ) AND ((planet_osm_point.tags->'natural')='peak' OR (planet_osm_point.tags->'leisure')='nature_reserve' OR (planet_osm_point.tags->'natural')='water') union all  select count (distinct planet_osm_polygon.osm_id) as nature, max(planet_osm_polygon.osm_timestamp) as time from planet_osm_polygon where   ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857))   AND  ((planet_osm_polygon.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_polygon.tags->'osm_timestamp')<'megha')  AND  ((planet_osm_polygon.tags->'landuse')='forest' OR (planet_osm_polygon.tags->'natural')='wood' OR (planet_osm_polygon.tags->'leisure')='nature_reserve' OR (planet_osm_polygon.tags ->'boundary') = 'national_park' OR (planet_osm_polygon.tags-> 'natural') = 'water')) as u";

	queryText = getIntervalQueries(queryText, queryString);
	//var queryText = formatQuery(queryText, queryString);

	var lock = queryText.length - 1;
		pg.connect(connectionString, function(err, client, done) {
			for(var i = 0; i< queryText.length; i++) {
			var query = client.query(queryText[i]);

			query.on('row', function(row) {
				result.push(row);
			});

			query.on('end', function() {
				if(lock === 0) {
					client.end();
					return res.json(result);
				}
				else {
					--lock;
				}
			})
			}
		})
});

router.get('/api/tourist_interest', function(req, res) {
	var result = [];
	var queryString = req.query;
	
	var queryText = "Select count (distinct planet_osm_point.osm_id) , max(osm_timestamp)  from planet_osm_point where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857))  AND  ((planet_osm_point.tags->'tourism') IS NOT NULL  AND (planet_osm_point.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_point.tags->'osm_timestamp')<'megha')"

	queryText = getIntervalQueries(queryText, queryString);
	//var queryText = formatQuery(queryText, queryString);

	var lock = queryText.length - 1;
		pg.connect(connectionString, function(err, client, done) {
			for(var i = 0; i< queryText.length; i++) {
			var query = client.query(queryText[i]);

			query.on('row', function(row) {
				result.push(row);
			});

			query.on('end', function() {
				if(lock === 0) {
					client.end();
					return res.json(result);
				}
				else {
					--lock;
				}
			})
			}
		})
});

router.get('/api/settlements', function(req, res) {
	var result = [];
	var queryString = req.query;
	
	var queryText = "select count(distinct osm_id), max(osm_timestamp) from planet_osm_polygon where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND ( (tags->'landuse') ='residential' AND (tags->'osm_timestamp')>='aakashsigdel' and  (tags->'osm_timestamp')<'megha')";

	queryText = getIntervalQueries(queryText, queryString);
	//var queryText = formatQuery(queryText, queryString);

	var lock = queryText.length - 1;
		pg.connect(connectionString, function(err, client, done) {
			for(var i = 0; i< queryText.length; i++) {
			var query = client.query(queryText[i]);

			query.on('row', function(row) {
				result.push(row);
			});

			query.on('end', function() {
				if(lock === 0) {
					client.end();
					return res.json(result);
				}
				else {
					--lock;
				}
			})
			}
		})
});

module.exports = router;
