/// <reference path="../../DefinitelyTyped/node/node.d.ts" />

export module DbManager{
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/nhomeasdb.db');

    function executeQuery(strQuery:string, params:any,callback){
        db.serialize(function () {
            if (params) {
                var stmt = db.prepare(strQuery, params);
                stmt.run();
                stmt.finalize();
            } else {
                var stmt = db.prepare(strQuery);
                stmt.all(callback);
                stmt.finalize();
            }         
        });

        db.close();
    }
}

exports.DbManager = DbManager;