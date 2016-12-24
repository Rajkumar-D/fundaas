/*
	Name    :	constructUrlParm
	Syntax  :	var constructUrlParm=function(eleObj)
	purpose :	This method will iterate all the elements in eleObj,
				get its values and construct a url and return to calling method
	@paaram :  	eleObj - the element object which contains form elements			
	return  :   String - url paramaters
*/
var constructUrlParm=function(eleObj,callback){

	var eleArr=["input","select","textarea"];
	var paramStr="";
		
	eleArr.forEach(function(ele){
		var inputArr=eleObj.find(ele);
		for(var x=0;x<inputArr.length;x++){
			paramStr+=inputArr[x].id+"="+inputArr[x].value+"&";	

		}

	})
	console.log(paramStr)
	callback(paramStr);
}

postData=function(divId){
	var form=$('#'+divId)[0];
	form.submit(function(e){
    e.preventDefault();
    var formData = new FormData(form);
    $.ajax({
            type:'POST',
            data:formData,
            cache:false,
            contentType: false,
            processData: false,
            success:function(data){
                alert("success");
                console.log(data);
            },
            error: function(data){
                alert("error");
                console.log(data);
            }
        });
	});
}

function hexToBase64(str) {
	console.log(str)
return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}

