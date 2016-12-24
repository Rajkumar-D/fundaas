
validateFields=function(fieldHash,response)
{
	console.log(Object.keys(fieldHash));
	var fieldIds=Object.keys(fieldHash);
	var catResp="";
	var key="";
	for(count=0;count<fieldIds.length;count++)
	{
		key=fieldIds[count];
		var val=$(key).val();
		var name=$(key).attr('name');
		var validations=fieldHash[key];
		validateIndividualField(validations,val,name,function(resp){
			catResp+=resp;
			if(resp!="")
			{
				$(key).css({"border-color":"red"});
			}
			else
			{
				$(key).css({"border-color":"#D8D9DA"});
			}	
		});
	}
	
	response(catResp);
}

validateIndividualField=function(validationArr,value,fldName,valResponse)
{
	var res="";
	for(valCount=0;valCount<validationArr.length;valCount++)
	{
		var validation=validationArr[valCount];
		var sizeToCheck=0
		if(validation.startsWith("Size-"))
		{
			sizeToCheck=validation.split("-")[1];
			validation="Size";
		}
		switch(validation)
		{
			case "Mandatory":
				mandatoryValidation(fldName,value,function(response){
				res+=response;
				});
				break;
			case "Size":
				sizeValidation(fldName,value,sizeToCheck,function(response){
					res+=response;
				});
				break;
			case "Numeric":
				numericValidation(fldName,value,function(response){
					res+=response;
				});
				break;
			case "Image":
				imageValidation(fldName,value,function(response){
					res+=response;
				});
				break;
				
		}
	}
	valResponse(res);
}

mandatoryValidation=function(fldName,value,response)
{
	var res="";
	if(value=="")
	{
		res=fldName+" cannot be empty. Please enter valid "+fldName+"<br>";
	}
	response(res);
}

numericValidation=function(fldName,value,response)
{
	var res="";
	var match=value.match(/\d/);
	if(match==null)
	{
		res=fldName+" must contain valid numeric value. Please enter valid "+fldName+"<br>";
	}
	response(res);
}

sizeValidation=function(fldName,value,sizeToCheck,response)
{
	var res="";
	if(value.length>sizeToCheck)
	{
		res=fldName+" must contain "+sizeToCheck+" characters only. <br>";
	}
	response(res);
}

imageValidation=function(fldName,value,response)
{
	var res="";
	var match=value.match(/.jpg|.png/);
	console.log("==="+match)
	if(match==null)
	{
		res=fldName+" must contain valid numeric value. Please enter valid "+fldName+"<br>";
	}
	response(res);
}