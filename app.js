var bodyParser = require('body-parser'),
    express = require('express'),
    request = require('request'),
    app = express();

    app.use(function (req, res, next) {
        /*var err = new Error('Not Found');
         err.status = 404;
         next(err);*/
      
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');
      
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
      
      //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      
        // Pass to next layer of middleware
        next();
    });

    // making client
    const Pool  = require('pg').Pool;
    const pool = new Pool({
        user: process.env.POSTGRESQL_ADDON_USER,
        password: process.env.POSTGRESQL_ADDON_PASSWORD,
        database: process.env.POSTGRESQL_ADDON_DB,
        host: process.env.POSTGRESQL_ADDON_HOST,
        uri: process.env.POSTGRESQL_ADDON_URI
    });
    app.use(bodyParser.json());

    // API call to get the all bank detail of particular branch along with limit and offset value
    app.get("/api/branches/autocomplete", async(req,res) => {
        try {

            var rqData = {
                branch: '%' + req.query.q.toUpperCase() + '%',
                limit:  req.query.limit,
                offset: req.query.offset
            };
            
            const values = [ rqData.branch, rqData.limit, rqData.offset];

            const data = await pool.query("SELECT * FROM branches WHERE branch LIKE $1" 
                                          + "ORDER BY ifsc ASC LIMIT $2 OFFSET $3",
                                            values);
            res.json(data);

        } catch (err) {
           console.log(err.message); 
        }
    });


    // API call to get the all branches in a particular city along with limit and offset value
    app.get("/api/branches", async(req,res) => {
        try {

            var rqData = {
                city  : '%' + req.query.q.toUpperCase() + '%',
                limit :  req.query.limit,
                offset: req.query.offset
            };

            const values = [ rqData.city, rqData.limit, rqData.offset];

            const data = await pool.query("SELECT * FROM branches WHERE branch LIKE $1 "
                                            + "or address LIKE $1 or city LIKE $1 or "
                                            + "district LIKE $1 or state LIKE $1"
                                            + "ORDER BY ifsc ASC LIMIT $2 OFFSET $3",
                                            values);
            res.json(data);

        } catch (err) {
           console.log(err.message); 
        }
    });


// server listening 
app.listen(process.env.PORT || 5000,process.env.IP,function(){
    console.log("App is listening Now....!");
});
