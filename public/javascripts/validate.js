function validate(){
	var login=document.getElementById('login').value;
	var passwd=document.getElementById('passwd').value;
	if(login=="admin" && passwd=="reset@123"){
		window.location.href="/index";
	}else{
		alert("Invalid login..Please enter correct login and password")
		document.getElementById('login').value="";
		document.getElementById('passwd').value="";
	}
}