$(document).ready(function(){
	showProjects('all');
	$('ul.topnav.pull-left li').first().addClass('active');

});

showProjects=function(query){
	$('ul.topnav.pull-left li').click(function(){
		$("ul.topnav.pull-left li.active").removeClass('active');
		$(this).addClass('active');   		
	});
	
	var url="/showProject?query="+query;
	getHtmlContent(url,function(data){
		$("#projectContent").html("")
		$("#projectContent").html(data);

	})

}


showProjectForType=function(typeId){
	
	var url="/showProjectForType?&typeId="+typeId;
	getHtmlContent(url,function(data){
		$("#projectContent").html("")
		$("#projectContent").html(data);

	})
}

showProjectForDomain=function(domainId,typeId){
	
	if(typeId=="undefined"){
		typeId="all";
	}
	var url="/showProjectForDomain?&domainId="+domainId+"&typeId="+typeId;
	console.log(url);
	getHtmlContent(url,function(data){
		$("#projectContent").html("")
		$("#projectContent").html(data);

	})
}

getHtmlContent=function(url,callback){
	$.ajax({
		url:url,
		dataType:"html",
		success:function(data){
			callback(data);
		}
	})

}

showAddProjectScreen=function(){
	var url="/showAddProjectScreen";
	getHtmlContent(url,function(data){
		$("#projectContent").html("")
		$("#projectContent").html(data);
		showLongDescription("");	
	});

}

showEditProjectScreen=function(projectId){
	var url="/showEditProjectScreen?projectId="+projectId;
	getHtmlContent(url,function(data){
		$("#projectContent").html("")
		$("#projectContent").html(data);
		//loadEditor();
		showLongDescription($("#longDescVal").val());
	});

}

showAddCompanyScreen=function(){
	var url="/showAddCompanyScreen";
	getHtmlContent(url,function(data){
		$("#projectContent").html("")
		$("#projectContent").html(data);
			
	});

}



showLongDescription=function(val){
	CKEDITOR.replace( 'longDesc' );
	CKEDITOR.on( 'instanceReady', function( evt ) {
		var editor = evt.editor;
		editor.setData( val);
	});
}

postAddProject=function(eleName,url){
	var eleObj=$('#'+eleName)
	var editorVal=CKEDITOR.instances.longDesc.getData();
	editorVal.replace("'","\'");
	$('#htmlDesc').val(editorVal);
	var imgName=$('#projectImage').val();
	$('#imageName').val(imgName);
	var formDiv="addProjForm";
	validateAddProject(function(resp){
		if(resp==""){
			postData(formDiv);		
		}
		else
		{
			showErrorDiv(resp);
		}
	});
	
}

postEditProject=function(eleName,url){
	var eleObj=$('#'+eleName)
	var editorVal=CKEDITOR.instances.longDesc.getData();
	editorVal.replace("'","\'");
	$('#htmlDesc').val(editorVal);
	var imgName=$('#projectImage').val();
	if(imgName!="")
	{
		$('#imageName').val(imgName);
	}
	
	var formDiv="editProjectForm";
	validateEditProject(function(resp){
		if(resp==""){
			postData(formDiv);		
		}
		else
		{
			showErrorDiv(resp);
		}
	});
	
}


postAddCompany=function(containerEle,url){
	var eleObj=$('#'+containerEle);

	validateAddCompany(function(resp){
		if(resp=="")
		{
			hideErrorDiv();	
			constructUrlParm(eleObj,function(param){
				console.log(param)
				$.ajax({
					url:url,
					type:'POST',
					data:param,
					dataType:"html",
					success:function(data){
						callback(data);
					}
				})
			});
		}
		else
		{
			showErrorDiv(resp)
			
		}
	});
	
	
	
}

validateAddProject=function(resp){
	var valHash={};
	valHash["#projectTitle"]=["Mandatory","Size-100"];
	valHash["#projectType"]=["Mandatory"];
	valHash["#projectDomain"]=["Mandatory"];
	valHash["#shortDesc"]=["Mandatory","Size-255"];
	valHash["#imageName"]=["Mandatory","Image"];
	
	var finalResp="";
	validateFields(valHash,function(valResponse)
	{
		finalResp=valResponse;
	});
	resp(finalResp);	
	
}

validateEditProject=function(resp){
	var valHash={};
	valHash["#projectTitle"]=["Mandatory","Size-100"];
	valHash["#projectType"]=["Mandatory"];
	valHash["#projectDomain"]=["Mandatory"];
	valHash["#shortDesc"]=["Mandatory","Size-255"];
	if($('#projectImage').val()!="")
	{
		valHash["#imageName"]=["Mandatory","Image"];
	}
	var finalResp="";
	validateFields(valHash,function(valResponse)
	{
		finalResp=valResponse;
	});
	resp(finalResp);	
	
}

validateAddCompany=function(resp){
	var valHash={};
	valHash["#companyName"]=["Mandatory","AlphaNumeric","Size-100"];
	valHash["#cemail"]=["Mandatory","Email","Size-100"];
	valHash["#site"]=["Size-255"];
	valHash["#address"]=["Mandatory","Size-255"];
	valHash["#phone"]=["Numeric","Size-100"];
	valHash["#mobile"]=["Mandatory","Numeric","Size-100"];
	valHash["#cpassword"]=["Mandatory","Size-100"];
	
	var finalResp="";
	validateFields(valHash,function(valResponse)
	{
		finalResp=valResponse;
	});

	if($('#cpassword').val()!=$('#conpassword').val())
	{
		finalResp+="Pasword and confirm password must be same.";
	}
	resp(finalResp);
}

/*function projectNatureChange(ele){
	if(ele.value==="new"){
		$('#buyerDetails').show("fast");	
	}else{
		$('#buyerDetails').hide("fast");
	}
}*/

function showErrorDiv(resp)
{	
	$("#errorDiv").html(resp);
	$("#errorDiv").css({"visibility":"visible"});
	$("#errorDiv").css({"display":"block"});
}

function hideErrorDiv(resp)
{	
	$("#errorDiv").html("");
	$("#errorDiv").css({"visibility":"hidden"});
	$("#errorDiv").css({"display":"none"});
}
function showCompanyProjects(companyId)
{
	var url="/showProject?query=all&companyId="+companyId;
	getHtmlContent(url,function(data){
		$("#projectContent").html("")
		$("#projectContent").html(data);

	})
}

function editProject(projectId)
{
	showEditProjectScreen(projectId);
	
}

function openSite(site)
{
	console.log(site);
	window.open("http://"+site,'_blank');
}

function showFullDescription(projectId)
{
	var url="/showFullDescription?projectId="+projectId;
	getHtmlContent(url,function(data){
		$("#projectContent").html("")
		$("#projectContent").html(data);

	})
}
