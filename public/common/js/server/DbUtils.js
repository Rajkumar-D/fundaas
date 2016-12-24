var conUtil=require('./ConnectionManager');
getConn= function(){
	var con=conUtil.getConn();
	return con;

}

selectQuery=function(queryStr,dbVal){
	var connObj=getConn();
	var query = connObj.query(queryStr);
	var rows = new Array();
	query.on('row', function(row, res) {
		rows.push(row);
	});
	query.on("end", function (result) {
		dbVal(rows);
	})	

}

exports.selectQuery=selectQuery;


insertQuery=function(queryStr,valArr,dbVal){
	var connObj=getConn();
	var query = connObj.query(queryStr,valArr,function(err, result){
		if(err){
			dbVal(err);
		}else{
			dbVal("SUCCESS");
		}
	});
}
exports.insertQuery=insertQuery;


updateQuery=function(queryStr,valArr,dbVal){
	var connObj=getConn();
	console.log(queryStr+"\n"+valArr);
	var query = connObj.query(queryStr,valArr,function(err, result){
		if(err){
			dbVal(err);
		}else{
			dbVal("SUCCESS");
		}
	});
}
exports.updateQuery=updateQuery;
