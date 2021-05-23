var bodyParser = require('body-parser'),
    express = require('express'),
    request = require('request'),
    app = express();

    if (process.env.NODE_ENV !== 'production') require('dotenv').config()

    // call router to connect database
    const pool = require('../Fyle_Chalange_Part_1/db');

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