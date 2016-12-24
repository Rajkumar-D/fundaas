var dbConn=null;

initDbConnection=function(){
	var pg = require("pg");
	var conString = "pg://root:Passw0rd@127.0.0.1:5432/fundaasdb";
	//var conString = "pg://rkrbarkuezvqts:cSNk-LWV2Wh5AAxEVs0jJRxstT@ec2-54-243-204-221.compute-1.amazonaws.com:5432/dc2s6htih2skh5";
	//var conString = "pg://fundaasdb:Passw0rd@fundaasdb.cnal8dka7imi.us-east-1.rds.amazonaws.com:5432/fundaasdb"
	dbConn = new pg.Client(conString);
	dbConn.connect();	
}

getConn=function(){
	if(dbConn==null){
		initDbConnection();
	}
	return dbConn;
}

exports.getConn=getConn;


