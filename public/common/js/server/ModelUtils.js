var dbUtil=require('./DbUtils');
var common=require('./ServerCommonUtils');
var fs=require("fs");
var path = require('path');
var busboy=require("connect-busboy");
var async=require("async");
getProjectType= function(domain){
	var query="select * from project_type";
	dbUtil.selectQuery(query,function(rows){
		domain(rows);
	});
	
}

exports.getProjectType=getProjectType;

var getProject=function(domain){
	var query="select * from project"
}

var getProjectById=function(projectId,project){
	var query="select * from project where project_id="+projectId;
	var projArr=new Array();
	dbUtil.selectQuery(query,function(rows){
		rows.forEach(function(row){
			var projObj=new Object();
			projObj.projectName=row.name;
			projObj.projectId=row.project_id;
			projObj.image=projObj.image="project_images/"+row.image;
			//var vals = (new Buffer(row.image_data)).toString('base64')
			//projObj.image=vals;
			projObj.company="novatium";
			projObj.companySite="www.novatium.com";
			projObj.description=row.description;
			projObj.long_description=row.long_description;
			projObj.projectType=row.type_id;
			projObj.projectDomain=row.domain_id;
			projObj.date=sqlDateConverter(row.created_ts);
			projArr.push(projObj);
		});
		project(projArr[0]);
	});
}

exports.getProjectById=getProjectById;

getProjectDomain=function(projDomain){
	var query="select * from project_domain";
	dbUtil.selectQuery(query,function(rows){
		projDomain(rows);
	});
}

exports.getProjectDomain=getProjectDomain;


getNextId=function(table,nxtVal){
	var query="select count(*) from "+table;
	dbUtil.selectQuery(query,function(rows){
		var nxt=0;
		nxt=parseInt(rows[0].count)+1;
		nxtVal(nxt);
	});
}
exports.getNextId=getNextId;

getAllProject=function(companyId, projRet){
	var query="";
	if(typeof companyId!='undefined')
	{
		query="select * from project where company_id="+companyId+" order by created_ts desc";
	}
	else
	{
		query="select * from project order by created_ts desc";	
	}
	var projArr=new Array();

	dbUtil.selectQuery(query,function(rows){
		rows.forEach(function(row){
			var projObj=new Object();
			projObj.projectName=row.name;
			projObj.projectId=row.project_id;
			projObj.companyId=row.company_id;
			projObj.image="project_images/"+row.image;
			projObj.description=row.description;
			projObj.long_description=row.long_description;
			projObj.date=sqlDateConverter(row.created_ts);
			getCompanyById(row.company_id,function(companyObj)
			{
				if(companyObj)
				{
					projObj.company=companyObj.name;
					projObj.companySite=companyObj.website;
				}
			});

			projArr.push(projObj);
			
		});

		var proj={"val":projArr}		
		projRet(proj);
	});
}
exports.getAllProject=getAllProject;


getAllProjectDomain=function(companyId,domains){
	if(typeof companyId!='undefined')
	{
		var query="select b.name,b.domain_id as id,count(*) as count from project a,project_domain b,project_type c where a.domain_id=b.domain_id and c.type_id=a.type_id and a.company_id="+companyId+" group by b.name,b.domain_id order by count desc";	
	}
	else
	{
		var query="select b.name,b.domain_id as id,count(*) as count from project a,project_domain b,project_type c where a.domain_id=b.domain_id and c.type_id=a.type_id group by b.name,b.domain_id order by count desc";
	}
	dbUtil.selectQuery(query,function(rows){
		var domainArr=new Array();
		rows.forEach(function(row){
			var dom=new Object();
			dom.name=row.name;
			dom.id=row.id;
			dom.count=row.count;
			domainArr.push(dom);
		})

		query="select name,domain_id as id from project_domain where domain_id not in(select distinct domain_id from project)"
		dbUtil.selectQuery(query,function(rows){
			rows.forEach(function(row){
				var dom=new Object();
				dom.name=row.name;
				dom.id=row.id;
				dom.count=0;
				domainArr.push(dom);
			});
			domainArr.sort(function(a,b){
				if(a.name>b.name){
					return 1;
				}else if(a.name<b.name){
					return -1
				}else{
					return 0;
				}
			})

			var domain={"val":domainArr};
			domains(domain);
		});
	});
}

showProjectByType=function(type,projRet){
	var query="select * from project where type_id="+type+" order by created_ts desc";
	var projArr=new Array();
	
	dbUtil.selectQuery(query,function(rows){

		async.each(rows,function(row,callback){
			var projObj=new Object();
			projObj.projectName=row.name;
			projObj.image=projObj.image="project_images/"+row.image;
			projObj.description=row.description;
			projObj.date=sqlDateConverter(row.created_ts);
			projObj.companyId=row.company_id;
			getCompanyById(row.company_id,function(companyObj){
				if(companyObj)
				{
					projObj.company=companyObj.name;
					projObj.companySite=companyObj.website;
				}
				projArr.push(projObj);
				callback(projArr)	
			});
			
		},function(){
			var proj={"val":projArr}
			projRet(proj);
		});
	});
};

getRows=function(query)
{
	return function(callback){
		dbUtil.selectQuery(query,function(dbrows){
			callback(null,dbrows);
		});	
	}				
}


createProjArr=function(rows)
{
	return function(callback){

		var projArr=new Array();
		var count=1;
		rows.forEach(function(row){
			var projObj=new Object();
			projObj.projectName=row.name;
			projObj.image=projObj.image="project_images/"+row.image;
			projObj.description=row.description;
			projObj.date=sqlDateConverter(row.created_ts);
			projObj.companyId=row.company_id;
			projArr.push(projObj);
			if(count==rows.length)
			{
				callback(null,projArr);
				
			}
			count++;
		});	
	}
}

addCompanyToProj=function(projArr,callback)
{
	return function(callback)
	{
		var newArr=new Array();
		var count=1;
		projArr.forEach(function(project){
			var companyId=project.company_id;
			getCompanyById(companyId,function(companyObj){

				if(companyObj)
				{
					project.company=companyObj.name;
					project.companySite=companyObj.website;
				}
				//console.log(newArr);
				newArr.push(project);
			});
			if(count==projArr.length)
			{
				
				callback(null,projArr);
			}
		});
	}
}

getProjectDomainByType=function(type,domains){
	var query="";
	if(type==="all"){
		query="select b.name,b.domain_id as id,count(*) as count from project a,project_domain b,project_type c where a.domain_id=b.domain_id and c.type_id=a.type_id  group by b.name,b.domain_id order by count desc";
	}else{
		query="select b.name,b.domain_id as id,count(*) as count from project a,project_domain b,project_type c where a.domain_id=b.domain_id and c.type_id=a.type_id and a.type_id="+type+" group by b.name,b.domain_id order by count desc";
	}
	var domainArr=new Array();
	dbUtil.selectQuery(query,function(rows){
		rows.forEach(function(row){
			var dom=new Object();
			dom.name=row.name;
			dom.id=row.id;
			dom.count=row.count;
			dom.typeId=type;
			domainArr.push(dom);
		});
		if(type==="all"){
			query="select name,domain_id as id from project_domain where domain_id not in(select distinct domain_id from project)"
		}else{
			query="select name,domain_id as id from project_domain where domain_id not in(select distinct domain_id from project where type_id="+type+")"
		}
		dbUtil.selectQuery(query,function(rows){
			rows.forEach(function(row){
				var dom=new Object();
				dom.name=row.name;
				dom.id=row.id;
				dom.count=0;
				dom.typeId=type;
				domainArr.push(dom);
			});
			domainArr.sort(function(a,b){
				if(a.name>b.name){
					return 1;
				}else if(a.name<b.name){
					return -1
				}else{
					return 0;
				}
			})

			var domain={"val":domainArr};
			domains(domain);
		});
	});
}


showProjectByDomain=function(domain,typeId,projRet){

	var query="";
	if(typeId==="all"){
		query="select * from project where domain_id="+domain+" order by created_ts desc";
	}else{
		query="select * from project where domain_id="+domain+" and type_id="+typeId+" order by created_ts desc";
	}
	
	var projArr=new Array();

	dbUtil.selectQuery(query,function(rows){
		async.each(rows,function(row,callback){
			var projObj=new Object();
			projObj.projectName=row.name;
			projObj.image=projObj.image="project_images/"+row.image;
			projObj.description=row.description;
			projObj.date=sqlDateConverter(row.created_ts);
			getCompanyById(row.company_id,function(companyObj)
			{
				if(companyObj)
				{
					projObj.company=companyObj.name;
					projObj.companySite=companyObj.website;
				}
				projArr.push(projObj);
				callback(null,projArr);
			});

		},function(){

			var proj={"val":projArr}
			projRet(proj);
		});
		
	});
	
}


sqlDateConverter=function(sqldate){
	var date=new Date(sqldate);
	var strDate=date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()
	return strDate;
}

addCompany=function(req,callback){
	var compId=0;
	getNextId('company',function(id){
		compId=id;
		var adminId=1;
		var query="insert into company(company_id,name,email,passwrd,address,website,phone_no,mobile,admin_id,created_ts,modified_ts) values ("+compId+",'"+req.body.companyName+"','"+req.body.cemail+"','"+req.body.cpassword+"','"+req.body.address+"','"+req.body.site+"','"+req.body.phone+"','"+req.body.mobile+"',1,'now()','now()')";
		dbUtil.insertQuery(query,"",function(val){
			callback(val);
		})
	})
}

authenticate=function(req,callback){
	var loginName=req.body.inputEmail;
	var pass=req.body.inputPassword;
	var query="select * from company where name='"+loginName+"' and passwrd='"+pass+"'";
	dbUtil.selectQuery(query,function(rows){
		if(rows.length>0)
		{
			var row=rows[0];
			var company=new Object();
			company.companyId=row.company_id;
			company.name=row.name;
			callback(company);
		}
		else
		{
			callback(false);
		}
	});
	
}	

exports.authenticate=authenticate;

getCompanyById=function(companyId,callback){
	var query="select * from company where company_id='"+companyId+"'";
	dbUtil.selectQuery(query,function(rows){
		if(rows.length>0)
		{
			var row=rows[0];
			var company=new Object();
			company.companyId=row.company_id;
			company.name=row.name;
			company.website=row.website;
			company.phone=row.phone_no;
			company.mobile=row.mobile;
			company.description=row.description;
			company.email=row.email;
			company.address=row.address;
			company.password=row.passwrd;
			callback(company);
		}
		else
		{
			callback(false);
		}
	});
}
