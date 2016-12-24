var url=require('url');
var model=require('./ModelUtils');
var cache = require('memory-cache');
var getParam=function(inurl){
	console.log(inurl);
	var urlParse=url.parse(inurl,true);
	var urlObj=urlParse.query;
	return urlObj;
}

exports.getParam=getParam;

var showHome=function(res)
{
	model.getProjectType(function(domain){
		var rows=domain;
		var company=cache.get("company")
		res.render('index',{type:rows,"company":company})
	});
}

exports.showHome=showHome;