
/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');

var helpers=require('./routes/helpers');
var model=require('./public/common/js/server/ModelUtils');
var dbUtil=require('./public/common/js/server/DbUtils');
var common=require('./public/common/js/server/ServerCommonUtils');

var expHandle = require('express3-handlebars');
var fs=require("fs");
var busboy=require("connect-busboy");
var url=require('url');
var cache = require('memory-cache');

var app = express();
app.use(busboy());

app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static('./public'));



var handleObj=expHandle.create({
	helpers:helpers
	});

app.engine("handlebars",handleObj.engine);
app.set('view engine',"handlebars");
// all environments
app.set('port', process.env.PORT || 3000);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/',function(req,res){ 
	common.showHome(res);
});


app.get('/guest',function(req,res){ 
	common.showHome(res);
});


app.get('/showLogin',function(req,res){ 
		res.render('login')
	});

app.get('/signOut',function(req,res){
		cache.clear(); 
		res.render('login');
	});


app.post('/authenticate',function(req,res){ 
		model.authenticate(req,function(company){
			if(company!=null)
			{
				cache.put('company', company);
				common.showHome(res);
			}
			else
			{
				res.render('login');
			}
		});
	});
	

app.get('/showProject',function(req,res){
	var param=getParam(req.url);
	var companyId=param.companyId;
	if(param.query==='all'){
		var domain=param.domain;
		getAllProject(companyId,function(proj){
			getAllProjectDomain(companyId,function(domain){
				res.render('project',{categories:domain,project:proj,query:param.query,company:cache.get('company')});		
			});	
		});
	}else {
		var type=param.query;
		domain="";
		showProjectByType(type,function(proj){
		getProjectDomainByType(type,function(domain){
			res.render('project',{categories:domain,project:proj,query:param.query,company:cache.get('company')});	
		});
	});
	}

})

app.get('/showProjectForType',function(req,res){
	var param=getParam(req.url);
	var typeId=param.typeId;
	showProjectByType(typeId,function(proj){
		getProjectDomainByType(typeId,function(domain){
			res.render('project',{categories:domain,project:proj,query:param.query,company:cache.get('company')});		
		});	
	});
	
});


app.get('/showProjectForDomain',function(req,res){
	var param=getParam(req.url);
	var domainId=param.domainId;
	var typeId=param.typeId;

	showProjectByDomain(domainId,typeId,function(proj){

		getProjectDomainByType(typeId,function(domain){
			
			res.render('project',{categories:domain,project:proj,query:param.query,company:cache.get('company')});		
		});	

	});
	
});

app.get('/showAddProjectScreen',function(req,res){ 
	model.getProjectType(function(projType){
		model.getProjectDomain(function(projDomain){
			res.render('addproject',{type:projType,domain:projDomain});			
		})
	})	
});

app.get('/showEditProjectScreen',function(req,res){ 
	var param=getParam(req.url);
	var projectId=param.projectId;
	model.getProjectType(function(projType){
		model.getProjectDomain(function(projDomain){
			model.getProjectById(projectId,function(project){
				res.render('editproject',{type:projType,domain:projDomain,project:project});				
			});
		});
	});	
});

app.get('/showAddCompanyScreen',function(req,res){ 
	res.render('addcompany');			
		
});

app.post("/addProject",function(req,res){

	var folderName="public/project_images";
	var fstream;
	var fileX
	req.pipe(req.busboy);
	req.busboy.on('file',function(fieldname,file,filename){
		fileX=filename;
		fstream=fs.createWriteStream(path.join(__dirname+"/"+folderName+"/"+filename));
        file.pipe(fstream);
        
        fstream.on('close',function(){
            console.log("Completed uploading...")
        });
    });

    var objArr=new Array();
    var objKey=new Array();
    var obj=new Object();
	req.busboy.on('field',function(fieldName,val,valTruncated,keyTruncated){
		
		obj[fieldName]=val;
		objKey.push(fieldName);
		
	});

	req.busboy.on('finish',function(){
		model.getNextId('project',function(projId){
			var ins=objKey.toString();
			var val="";
			var buyerId=0;
			var companyId=cache.get("company").companyId;
			var status="INITIAL";
			var nature="completed";
			if(obj["nature"]!="new"){
			}
			imageData='';
			var valArr=[projId,buyerId,companyId,obj["Project Name"],obj["Short Discription"],obj["long_description"],nature,obj["Project Type"],obj["Project Domain"],'spec',obj["image"],'now()',status,'now()','now()'];
			var query="insert into project (project_id,buyer_id,company_id,name,description,long_description,nature,type_id,domain_id,specificetion,image,dead_line,status,created_ts,modified_ts) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)";
	   		dbUtil.insertQuery(query,valArr,function(val){
	   			common.showHome(res);
	   		})
	   		
		});	

	});	
});

app.post("/editProject",function(req,res){

	var folderName="public/project_images";
	var fstream;
	var fileX
	req.pipe(req.busboy);
	req.busboy.on('file',function(fieldname,file,filename){
		if(filename==="")
		{
			filename="XX"
		}
    	else
    	{
    		console.log("Image not uploaded...")
    		
    	}
			fileX=filename;
			fstream=fs.createWriteStream(__dirname+"/"+folderName+"/"+filename);
	        file.pipe(fstream);
	        
	        fstream.on('close',function(){
	            console.log("Completed uploading...")
	        });

    });

    var objArr=new Array();
    var objKey=new Array();
    var obj=new Object();
	req.busboy.on('field',function(fieldName,val,valTruncated,keyTruncated){
		
		obj[fieldName]=val;
		objKey.push(fieldName);
		
	});

	req.busboy.on('finish',function(){
		model.getNextId('project',function(projId){
			var ins=objKey.toString();
			var val="";
			var buyerId=0;
			var companyId=cache.get("company").companyId;
			var status="INITIAL";
			var nature="completed";
			if(obj["nature"]!="new"){
			}
			//var base64str = base64_encode(__dirname+"/"+folderName+"/"+fileX);
			//var imageData = fstream.toString('hex');
			//console.log(imageData)
			//imgeData = '\\x' + imageData;

			imageData='';
			image = obj["image"];
			if(image.search("project_images")!=-1)
			{
				image=image.replace(/project_images\//,"");

			}
			var valArr=[obj["Project Name"],obj["Short Discription"],obj["long_description"],obj["Project Type"],obj["Project Domain"],image,'now()',obj["Project Id"]];
			var query="update project set name=($1),description=($2),long_description=($3),type_id=($4),domain_id=($5),image=($6),modified_ts=($7) where project_id=($8)";
	   		dbUtil.updateQuery(query,valArr,function(val){
	   			common.showHome(res);
	   		})
	   		
		});	

	});	
});


app.post("/addCompany",function(req,res){
	addCompany(req,function(val){
		res.render("index");
	})
});	




app.get('/contactsForm',function(req,res){ 
	res.render('contact',{message:"Welcome sir!!!"})
});

app.get('/showFullDescription',function(req,res){ 
	var param=getParam(req.url);
	var projectId=param.projectId;
	
	model.getProjectById(projectId,function(project){
				res.render('fullDescription',{project:project});				
			});		
		
});

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var getParam=function(inurl){
	var urlParse=url.parse(inurl,true);
	var urlObj=urlParse.query;
	return urlObj;
}

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap);
}

// function to create file from base64 encoded string
function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}

