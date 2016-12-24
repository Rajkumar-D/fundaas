
/*
 * GET home page.
 */

exports.index=function(msg){
	//return msg;
}

exports.login=function(msg){
	console.log("CALLED");
}
exports.evenIndex=function(ind,options){
	var index=ind.data.index
	index++;
	//console.log(index)
	if(index%2==0){
		return options.fn(this);
	}else{
		return false;
	}
}

exports.getProjectMethod=function(domainId,typeId){

	var methodName="showProjectForDomain('"+domainId+"','"+typeId+"')";
	return (methodName);
}

exports.getDomainClickMethod=function(method,arg){
	var methodname=method+"('"+arg+"')";
	
	return(methodname);
}

var ifcondition=function(arg1,arg2,options){
	if(arg1===arg2 && typeof arg1!='undefined')
	{
		return options.fn(this);
		
	}
	else
	{
		return options.inverse(this);
	}
}
exports.ifcondition=ifcondition;

var setHtmlContent=function(ele,htmlStr)
{
	$("#"+ele).innerHTML(htmlStr);
}