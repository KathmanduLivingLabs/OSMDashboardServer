
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
    tempQstr["to"] = '2015:12:31T23:59:59Z';
  var temp;
  temp = query.replace(new RegExp('aakashsigdel', 'g'), tempQstr.from);
  temp = temp.replace(new RegExp('megha', 'g'), tempQstr.to);
  if(queryString.bbox) {
			temp = temp.replace(new RegExp('pratik', 'g'), queryString.bbox);
	}
  else {
    temp = temp.replace(new RegExp('ST_Intersects[0-9a-zA-Z,_ ()]*AND', 'g'), '');
	}

  return temp;
}   

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function getIntervalQueries(query, queryString) {
  var tempQuery = [];
  var interval = {};
  var tempQString = [];
  

     	interval["1"] = ['01', '02', '03', '04', '05', '06','07','08','09','10','11','12'];
			var k = 0;
			for (var j = 0; j < 6; j++){
			for(var i = 0; i < 12; i++) {
				tempQString[k] = {};
				tempQString[k].from = (Number(queryString.from)+ j ) + ':' + interval["1"][i] + ':01';
				tempQString[k].to= (Number(queryString.from) + j ) + ':' + interval["1"][i+1] + ':31';
			//	console.log(k);
				k++;
			}			
			}
  for(var j = 0; j < tempQString.length; j=j+2) {
    tempQuery[j] = formatQuery(query, tempQString[j]);

	}
	console.log(tempQuery);
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


function formatDate(date){
	var d = new Date(date);
	month = '' + (d.getMonth() + 1),
	year = d.getFullYear();
	if (month.length < 2){
		month = '0' + month;
    var y_m = [year,month].join('-');
		}
		console.log('I am khan  ' + y_m);
		if (typeof y_m === 'undefined'){
		return null;
		}
		else {
					return y_m;
}
}
router.get('/', function(req, res) {
  return res.json({"aakash":"toto"});
});

// planet_osm_point ma vako 2010 ko distinct number of osm_id count gareko. Repeat for all years
router.get('/api/e_i_y', function(req, res) {
  var result = [];
  var queryString = req.query;
  
  var queryText = "SELECT count(distinct osm_id) as count , max(osm_timestamp) as year FROM planet_osm_point WHERE ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857), ST_SetSRID(way, 3857)) AND (tags->'osm_timestamp')>='aakashsigdel' AND  (tags->'osm_timestamp')<'megha';";

  queryText = getIntervalQueries(queryText, queryString);
  var lock = (queryText.length - 1) / 2;
    pg.connect(connectionString, function(err, client, done) {
      for(var i = 0; i< queryText.length; i=i+2) {
      (function(i){
				var query = client.query(queryText[i]);

      query.on('row', function(row) {
			row.year = formatDate(row.year);
				console.log(row.year);
        result.push(row);
      });

      query.on('end', function() {
			console.log(lock);
        if(lock === 0) {
          client.end();
          return res.json(result);
        }
        else {
          --lock;
        }
      });
      }(i));
			}
    });
});
  

// count the distinct osm id from planet_osm_line for buildings mapped in year 2010
router.get('/api/buildings', function(req, res) {
  var result = [];
  var queryString = req.query;
  
  queryText = "select count ( distinct osm_id) as count,max(osm_timestamp) as year from planet_osm_line where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND ((tags-> 'building') is not NULL AND (tags -> 'osm_timestamp') >= 'aakashsigdel' AND (tags -> 'osm_timestamp')< 'megha')";

  var queryText = getIntervalQueries(queryText, queryString);
  //var queryText = formatQuery(queryText, queryString);

  var lock = (queryText.length - 1) / 2;
    pg.connect(connectionString, function(err, client, done) {
      for(var i = 0; i< queryText.length; i=i+2) {
      (function(i){
				var query = client.query(queryText[i]);

      query.on('row', function(row) {
			row.year = formatDate(row.year);
				console.log(row.year);
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
      });
      }(i));
			}
    });
});




router.get('/api/roads', function(req, res) {
  var result = [];
  var queryString = req.query;
  
  var queryText = "select sum(ST_Length(ST_Transform(way, 4326)::geography)) as count ,max(osm_timestamp) as year from planet_osm_line where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND ((tags -> 'highway') is not NULL AND (tags-> 'osm_timestamp') >='aakashsigdel' AND (tags -> 'osm_timestamp') <'megha')";

  queryText = getIntervalQueries(queryText, queryString);
  //var queryText = formatQuery(queryText, queryString);

  var lock = (queryText.length - 1) / 2;
    pg.connect(connectionString, function(err, client, done) {
      for(var i = 0; i< queryText.length; i=i+2) {
      (function(i){
				var query = client.query(queryText[i]);

      query.on('row', function(row) {
		//	row.year = formatDate(row.year);
//      console.log(row.year);
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
      });
      }(i));
			}
    });
});



router.get('/api/waterways', function(req, res) {
  var result = [];
  var queryString = req.query;
  
  var queryText = "select sum(ST_Length(ST_Transform(way, 4326)::geography)) as count , max(osm_timestamp) as year from planet_osm_line where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND ((tags -> 'waterway') is not NULL AND (tags-> 'osm_timestamp') >='aakashsigdel' AND (tags -> 'osm_timestamp') <'megha')";

  var queryText = getIntervalQueries(queryText, queryString);
  //var queryText = formatQuery(queryText, queryString);

  var lock = (queryText.length - 1) / 2;
    pg.connect(connectionString, function(err, client, done) {
      for(var i = 0; i< queryText.length; i=i+2) {
     (function(i){
			 	var query = client.query(queryText[i]);

      query.on('row', function(row) {
			row.year = formatDate(row.year);
        result.push(row);
      });

      query.on('end', function() {
			console.log(lock);
        if(lock === 0) {
          client.end();
          return res.json(result);
        }
        else {
          --lock;
        }
      });
      }(i));
			}
    });
});


router.get('/api/medical', function(req, res) {
  var result = [];
  var queryString = req.query;
  
  var queryText = "Select sum (hospital) as count , max(time) as year from  (Select count (distinct planet_osm_point.osm_id) as hospital, max(planet_osm_point.osm_timestamp) as time from planet_osm_point where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857))  AND ((planet_osm_point.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_point.tags->'osm_timestamp')<'megha' )AND ((planet_osm_point.tags->'amenity')='hospital' OR (planet_osm_point.tags->'amenity')='clinic' OR (planet_osm_point.tags->'amenity')='dentist' OR (planet_osm_point.tags ->'amenity') = 'doctors' OR (planet_osm_point.tags-> 'amenity') = 'nursing_home' OR (planet_osm_point.tags -> 'amenity') = 'pharmacy' OR (planet_osm_point.tags -> 'amenity') = 'social_facility' OR (planet_osm_point.tags -> 'amenity') = 'veterinary' OR (planet_osm_point.tags -> 'healthcare') = 'blood_donation' OR (planet_osm_point.tags -> 'amenity') = 'healthpost') union all  select count (distinct planet_osm_polygon.osm_id) as hospital, max(planet_osm_polygon.osm_timestamp) as time from planet_osm_polygon where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857))  AND ((planet_osm_polygon.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_polygon.tags->'osm_timestamp')<'megha') AND ((planet_osm_polygon.tags->'amenity')='hospital' OR (planet_osm_polygon.tags->'amenity')='clinic' OR (planet_osm_polygon.tags->'amenity')='dentist' OR (planet_osm_polygon.tags ->'amenity') = 'doctors' OR (planet_osm_polygon.tags-> 'amenity') = 'nursing_home' OR (planet_osm_polygon.tags -> 'amenity') = 'pharmacy' OR (planet_osm_polygon.tags -> 'amenity') = 'social_facility' OR (planet_osm_polygon.tags -> 'amenity') = 'veterinary' OR (planet_osm_polygon.tags -> 'healthcare') = 'blood_donation' OR (planet_osm_polygon.tags -> 'amenity') = 'healthpost')   union all   select count (distinct planet_osm_line.osm_id) as hospital, max(planet_osm_line.osm_timestamp) as time from planet_osm_line where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857))  AND ((planet_osm_line.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_line.tags->'osm_timestamp')<'megha') AND ((planet_osm_line.tags->'amenity')='hospital' OR (planet_osm_line.tags->'amenity')='clinic' OR (planet_osm_line.tags->'amenity')='dentist' OR (planet_osm_line.tags ->'amenity') = 'doctors' OR (planet_osm_line.tags-> 'amenity') = 'nursing_home' OR (planet_osm_line.tags -> 'amenity') = 'pharmacy' OR (planet_osm_line.tags -> 'amenity') = 'social_facility' OR (planet_osm_line.tags -> 'amenity') = 'veterinary' OR (planet_osm_line.tags -> 'healthcare') = 'blood_donation' OR (planet_osm_line.tags -> 'amenity') = 'healthpost')) as u";;

  queryText = getIntervalQueries(queryText, queryString);
  //var queryText = formatQuery(queryText, queryString);

 	var lock = (queryText.length - 1) / 2;  
    pg.connect(connectionString, function(err, client, done) {
      for(var i = 0; i< queryText.length; i=i+2) {
      (function(i){
				var query = client.query(queryText[i]);

      query.on('row', function(row) {
			row.year = formatDate(row.year);
        result.push(row);
      });

      query.on('end', function() {
			console.log(lock);
        if(lock === 0) {
          client.end();
          return res.json(result);
        }
        else {
          --lock;
        }
      });
      }(i));
			}
			});
});

router.get('/api/edu_institute', function(req, res) {
  var result = [];
  var queryString = req.query;
  
  var queryText = "Select sum (school) as count,    max(time) as year  from      (Select count (distinct planet_osm_point.osm_id)      as school, max(planet_osm_point.osm_timestamp)      as time  from planet_osm_point      where ST_Intersects     (ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),       ST_SetSRID(way,3857))  AND   ((planet_osm_point.tags->'osm_timestamp')>='aakashsigdel' and     (planet_osm_point.tags->'osm_timestamp')<'megha') AND     ((planet_osm_point.tags->'amenity')='school' OR     (planet_osm_point.tags->'amenity')='kindergarten'      OR (planet_osm_point.tags->'amenity')='college' OR      (planet_osm_point.tags ->'amenity') = 'library' OR      (planet_osm_point.tags-> 'amenity') = 'university')      union all  select count (distinct planet_osm_polygon.osm_id) as school, max(planet_osm_polygon.osm_timestamp) as time  from planet_osm_polygon where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND  ((planet_osm_polygon.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_polygon.tags->'osm_timestamp')<'megha') AND ((planet_osm_polygon.tags->'amenity')='school' OR (planet_osm_polygon.tags->'amenity')='kindergarten' OR (planet_osm_polygon.tags->'amenity')='college' OR (planet_osm_polygon.tags ->'amenity') = 'library' OR (planet_osm_polygon.tags-> 'amenity') = 'university') union all  select count (distinct planet_osm_line.osm_id) as school, max(planet_osm_line.osm_timestamp) as time  from planet_osm_line where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND  ((planet_osm_line.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_line.tags->'osm_timestamp')<'megha') AND ((planet_osm_line.tags->'amenity')='school' OR (planet_osm_line.tags->'amenity')='kindergarten' OR (planet_osm_line.tags->'amenity')='college' OR (planet_osm_line.tags ->'amenity') = 'library' OR (planet_osm_line.tags-> 'amenity') = 'university')      )  as u";
  queryText = getIntervalQueries(queryText, queryString);
 	var lock = (queryText.length - 1) / 2;  
    pg.connect(connectionString, function(err, client, done) {
      for(var i = 0; i< queryText.length; i=i+2) {
	(function(i){ 
				var query = client.query(queryText[i]);
      query.on('row', function(row) {
			row.year = formatDate(row.year);
        result.push(row);
			});

      query.on('end', function() {
			console.log(lock);
        if(lock === 0) {
          client.end();
          return res.json(result);
        }
        else {
          --lock;
        }
      })
	}(i));
      }
    })
});

router.get('/api/financial_institute', function(req, res) {
  var result = [];
  var queryString = req.query;
  
  var queryText = "Select sum (finance) as count, max(time) as year   from  (Select count (distinct planet_osm_point.osm_id) as finance, max(planet_osm_point.osm_timestamp) as time  from planet_osm_point where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857))  AND  ((planet_osm_point.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_point.tags->'osm_timestamp')<'megha') AND  ((planet_osm_point.tags->'amenity')='bank' OR (planet_osm_point.tags->'amenity')='atm')  union all  select count (distinct planet_osm_polygon.osm_id) as finance, max(planet_osm_polygon.osm_timestamp) as time  from planet_osm_polygon where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND ((planet_osm_polygon.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_polygon.tags->'osm_timestamp')<'megha') AND ((planet_osm_polygon.tags->'amenity')='bank' OR (planet_osm_polygon.tags->'amenity')='atm') union all  select count (distinct planet_osm_line.osm_id) as finance, max(planet_osm_line.osm_timestamp) as time  from planet_osm_line where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND ((planet_osm_line.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_line.tags->'osm_timestamp')<'megha') AND ((planet_osm_line.tags->'amenity')='bank' OR (planet_osm_line.tags->'amenity')='atm')     ) as u";

  queryText = getIntervalQueries(queryText, queryString);
  //var queryText = formatQuery(queryText, queryString);

  var lock = (queryText.length - 1) / 2;
    pg.connect(connectionString, function(err, client, done) {
      for(var i = 0; i< queryText.length; i=i+2) {
      (function(i){
				var query = client.query(queryText[i]);

      query.on('row', function(row) {
			row.year = formatDate(row.year);
        result.push(row);
      });

      query.on('end', function() {
    	console.log(lock);
			 	if(lock === 0) {
          client.end();
				 	return res.json(result);
        }
        else {
          --lock;
        }
      })
      }(i));
			}
    })
});

router.get('/api/gov_offices', function(req, res) {
  var result = [];
  var queryString = req.query;
  
  var queryText = "Select sum (offc) as count, max(time) as year   from  (Select count (distinct planet_osm_point.osm_id) as offc, max(planet_osm_point.osm_timestamp) as time  from planet_osm_point where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857))  AND ((planet_osm_point.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_point.tags->'osm_timestamp')<'megha') AND  ((planet_osm_point.tags->'office')='government') union all  select count (distinct planet_osm_polygon.osm_id) as offc, max(planet_osm_polygon.osm_timestamp) as time  from planet_osm_polygon where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND ((planet_osm_polygon.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_polygon.tags->'osm_timestamp')<'megha') AND ((planet_osm_polygon.tags->'office')='government')     union all Select count (distinct planet_osm_line.osm_id) as offc, max(planet_osm_line.osm_timestamp) as time  from planet_osm_line where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857))  AND ((planet_osm_line.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_line.tags->'osm_timestamp')<'megha') AND  ((planet_osm_line.tags->'office')='government')) as u";

  queryText = getIntervalQueries(queryText, queryString);
  //var queryText = formatQuery(queryText, queryString);

  var lock = (queryText.length - 1) / 2;
    pg.connect(connectionString, function(err, client, done) {
      for(var i = 0; i< queryText.length; i=i+2) {
     (function(i){ 
				var query = client.query(queryText[i]);

      query.on('row', function(row) {
			row.year = formatDate(row.year);
        result.push(row);
      });

      query.on('end', function() {
    		console.log(lock);
		 		if(lock === 0) {
          client.end();
          return res.json(result);
        }
        else {
          --lock;
        }
      })
    }(i));
			}
    })
});

router.get('/api/historic_sites', function(req, res) {
  var result = [];
  var queryString = req.query;
  
  var queryText = "Select sum (historic) as count, max(time) as year   from  (Select count (distinct planet_osm_point.osm_id) as historic, max(planet_osm_point.osm_timestamp) as time  from planet_osm_point where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857))  AND ((planet_osm_point.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_point.tags->'osm_timestamp')<'megha') AND  ((planet_osm_point.tags->'place_of_worship') IS NOT NULL OR (planet_osm_point.tags->'historic') IS NOT NULL)  union all   Select count (distinct planet_osm_line.osm_id) as historic, max(planet_osm_line.osm_timestamp) as time  from planet_osm_line where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857))  AND ((planet_osm_line.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_line.tags->'osm_timestamp')<'megha') AND  ((planet_osm_line.tags->'place_of_worship') IS NOT NULL OR (planet_osm_line.tags->'historic') IS NOT NULL) union all     select count (distinct planet_osm_polygon.osm_id) as historic, max(planet_osm_polygon.osm_timestamp) as time  from planet_osm_polygon where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND ((planet_osm_polygon.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_polygon.tags->'osm_timestamp')<'megha') AND ((planet_osm_polygon.tags->'place_of_worship') IS NOT NULL OR (planet_osm_polygon.tags->'historic') IS NOT NULL)) as u";

  queryText = getIntervalQueries(queryText, queryString);
  //var queryText = formatQuery(queryText, queryString);

  var lock = (queryText.length - 1) / 2;
    pg.connect(connectionString, function(err, client, done) {
      for(var i = 0; i< queryText.length; i=i+2) {
     (function(i){
			 	var query = client.query(queryText[i]);

      query.on('row', function(row) {
			row.year = formatDate(row.year);
        result.push(row);
      });

      query.on('end', function() {
			console.log(lock);
        if(lock === 0) {
          client.end();
          return res.json(result);
        }
        else {
          --lock;
        }
      })
      }(i));
			}
			})
});

router.get('/api/natural_heritage', function(req, res) {
  var result = [];
  var queryString = req.query;
  
  var queryText = "Select sum (nature) as count, max(time) as year from (Select count (distinct planet_osm_point.osm_id) as nature, max(planet_osm_point.osm_timestamp) as time from planet_osm_point where  ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND ((planet_osm_point.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_point.tags->'osm_timestamp')<'megha' ) AND ((planet_osm_point.tags->'natural')='peak' OR (planet_osm_point.tags->'leisure')='nature_reserve' OR (planet_osm_point.tags->'natural')='water')  union all  select count (distinct planet_osm_line.osm_id) as nature, max(planet_osm_line.osm_timestamp) as time from planet_osm_line where   ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857))   AND  ((planet_osm_line.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_line.tags->'osm_timestamp')<'megha')  AND  ((planet_osm_line.tags->'landuse')='forest' OR (planet_osm_line.tags->'natural')='wood' OR (planet_osm_line.tags->'leisure')='nature_reserve' OR (planet_osm_line.tags ->'boundary') = 'national_park' OR (planet_osm_line.tags-> 'natural') = 'water')     union all  select count (distinct planet_osm_polygon.osm_id) as nature, max(planet_osm_polygon.osm_timestamp) as time from planet_osm_polygon where   ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857))   AND  ((planet_osm_polygon.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_polygon.tags->'osm_timestamp')<'megha')  AND  ((planet_osm_polygon.tags->'landuse')='forest' OR (planet_osm_polygon.tags->'natural')='wood' OR (planet_osm_polygon.tags->'leisure')='nature_reserve' OR (planet_osm_polygon.tags ->'boundary') = 'national_park' OR (planet_osm_polygon.tags-> 'natural') = 'water')) as u";

  queryText = getIntervalQueries(queryText, queryString);
  //var queryText = formatQuery(queryText, queryString);

  var lock = (queryText.length - 1) / 2;
    pg.connect(connectionString, function(err, client, done) {
      for(var i = 0; i< queryText.length; i=i+2) {
      (function(i){
				var query = client.query(queryText[i]);

      query.on('row', function(row) {
			row.year = formatDate(row.year);
        result.push(row);
      });

      query.on('end', function() {
			console.log(lock);
        if(lock === 0) {
          client.end();
          return res.json(result);
        }
        else {
          --lock;
        }
      })
      }(i));
			}
    })
});

router.get('/api/tourist_interest', function(req, res) {
  var result = [];
  var queryString = req.query;
  
  var queryText = "Select count (distinct planet_osm_point.osm_id) as count , max(osm_timestamp) as year from planet_osm_point where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857))  AND  ((planet_osm_point.tags->'tourism') IS NOT NULL  AND (planet_osm_point.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_point.tags->'osm_timestamp')<'megha')"

  queryText = getIntervalQueries(queryText, queryString);
  //var queryText = formatQuery(queryText, queryString);

  var lock = (queryText.length - 1) / 2;
    pg.connect(connectionString, function(err, client, done) {
      for(var i = 0; i< queryText.length; i=i+2) {
			(function(i){
      var query = client.query(queryText[i]);

      query.on('row', function(row) {
			row.year = formatDate(row.year);
        result.push(row);
      });

      query.on('end', function() {
			console.log(lock);
        if(lock === 0) {
          client.end();
          return res.json(result);
        }
        else {
          --lock;
        }
      })
      }(i));
			}
    })
});

router.get('/api/settlements', function(req, res) {
  var result = [];
  var queryString = req.query;
  
  var queryText = "select sum(settle) as count, max(time) as year from (select count(distinct planet_osm_polygon.osm_id) as settle, max(planet_osm_polygon.osm_timestamp) as time from planet_osm_polygon where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND ((planet_osm_polygon.tags->'landuse') ='residential' AND (planet_osm_polygon.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_polygon.tags->'osm_timestamp')<'megha')    union all    select count(distinct planet_osm_line.osm_id) as settle, max(planet_osm_line.osm_timestamp) as time from planet_osm_line where ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857),ST_SetSRID(way,3857)) AND ( (planet_osm_line.tags->'landuse') ='residential' AND (planet_osm_line.tags->'osm_timestamp')>='aakashsigdel' and  (planet_osm_line.tags->'osm_timestamp')<'megha')) as u";

  queryText = getIntervalQueries(queryText, queryString);
  //var queryText = formatQuery(queryText, queryString);

  var lock = (queryText.length - 1) / 2;
    pg.connect(connectionString, function(err, client, done) {
      for(var i = 0; i< queryText.length; i=i+2) {
      (function(i){
				var query = client.query(queryText[i]);

      query.on('row', function(row) {
			row.year = formatDate(row.year);
        result.push(row);
      });

      query.on('end', function() {
			console.log(lock);
        if(lock === 0) {
          client.end();
          return res.json(result);
        }
        else {
          --lock;
        }
      })
      }(i));
			}
    })
});

router.get('/api/users', function(req, res) {
  var result = [];
  var queryString = req.query;
  
  var queryText = "SELECT count(distinct tags->'osm_user') as count, max(osm_timestamp) as year FROM planet_osm_point WHERE ST_Intersects(ST_Transform(ST_MakeEnvelope (pratik, 4326), 3857), ST_SetSRID(way, 3857)) AND (tags->'osm_timestamp')>='aakashsigdel' AND  (tags->'osm_timestamp')<'megha';"

  queryText = getIntervalQueries(queryText, queryString);
  //var queryText = formatQuery(queryText, queryString);

  var lock = (queryText.length - 1) / 2;
    pg.connect(connectionString, function(err, client, done) {
      for(var i = 0; i< queryText.length; i=i+2) {
				(function(i){
      var query = client.query(queryText[i]);

      query.on('row', function(row) {
			row.year = formatDate(row.year);
			console.log(row.year);
				result.push(row);
      });

      query.on('end', function() {
			console.log(lock);
        if(lock === 0) {
          client.end();
          return res.json(result);
        }
        else {
          --lock;
        }
      })
      }(i));
			}
    })
});

module.exports = router;
