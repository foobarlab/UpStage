/**
 * Functions used by the user page.
 * 
 * @author Nicholas Robinson.
 * @history 22/02/10 Initial version created.
 * @note
 * @version 0.1
 * Changelog:
 * Heath Behrens, Moh - 18-05-2011 - Added a check to see if the password is empty.
 * Daniel, Gavin        24/08/2012 - Removed alert box on toUser so it only gets postback from the server
 * Gavin                29/08/2012 - Made event to close the edit player form 
 * Gavin                13/09/2012 - Added alert for players when they update their password with different inputs 
 */

/**
 * Generate HTML for allowing the user to update their email.
 * @param addy - new email address for the user.
 * @param username - the username of the current user.
 * @return none
 */

function updateEmail(addy, username)
{
	requestPage("POST", '/admin/workshop/user?username='+unescape(username)+'&email='+addy+'&submit=saveemail', toUser);
    //alert("Email changed successfully.");
}

/**
* Generate HTML for allowing the user to update their password.
* @param addy - new email address for the user.
* @param username - the username of the current user.
* @return none
*/

function updatePass(pass1, pass2, username)
{
	//(19/05/11) Mohammed and Heath - Added a check to ensure password is not left empty
	if(pass1.length < 1 || pass2.length < 1){
		alert("Password cannot be empty.");
	} 
    else if(pass1 != pass2){
		alert("Both password are different. please re-enter");
        document.getElementById("password").value = "";
        document.getElementById("password2").value = "";
	} 
    else {
		var hex1 = hex_md5(pass1);
		var hex2 = hex_md5(pass2);
		requestPage("POST", '/admin/workshop/user?username='+unescape(username)+'&password='+hex1+'&password2='+hex2+'&submit=savepassword', toUser);
		//alert("Password changed successfully.");
	}
}

function toUser()
{
	if(xmlhttp.readyState==4)
	{
        if(xmlhttp.status == 200)
        {
            divMsg = document.getElementById("divPopup");
            divShad = document.getElementById("divShade");
            divMsg.innerHTML = "Successfully Confirmed!" + "<input type='button' onclick=\"hideDiv('divPopup'); hideDiv('divShade'); navUserPage()\" value='Close' />";;
            
            divMsg.style.display = 'block';
            divShad.style.display = 'block';
        }
        else
        {
            var html = xmlhttp.responseText;
            
            var a = html.split('<!-- content_start -->');
            var b = a[1].split('<!-- content_end -->');
            html = b[0];
            
            divMsg = document.getElementById("divPopup");
            divShad = document.getElementById("divShade");
            divMsg.innerHTML = html + "<input type='button' onclick=\"hideDiv('divPopup'); hideDiv('divShade');\" value='Close' />";;
            
            divMsg.style.display = 'block';
            divShad.style.display = 'block';
        }
        
	}
    
}

function setAdminLinks()
{
	if(document.nick.is_su.value == "True")
	{
		window.onLoad = document.getElementById('adminstuff').innerHTML = '<h1>Administration Links</h1><a href="javascript:navNewPlayer()">Create New Player</a><br /><br /><a href="javascript:navEditPlayers()">Edit Existing Player Details</a><br />';
	}
}

function navNewPlayer()
{
	window.location = '/admin/workshop/newplayer';
}

function navEditPlayers()
{
	window.location = '/admin/workshop/editplayers';
}

/**
* Functions used by the Add New Player page.
* 
* @author Nicholas Robinson.
* @history 22/02/10 Initial version created.
* @note
* @version 0.1
*/

function switchPasswordStuff(on)
{
    var p = document.getElementById("passwordpara");
    var pw = document.getElementById("password");
    var pw2 = document.getElementById("password2");
    if (on){        
        p.style.visibility = 'visible';
        p.style.display = 'block';
        pw.disabled = false;
        pw2.disabled = false;
    }
    else{        
        p.style.visibility = 'hidden';
        p.style.display = 'none';
        pw.disabled = true;
        pw2.disabled = true;
    }
}

/**
	Saves player details according to the given items within the appropriate fields.
*/
function savePlayer()
{
	var date = new Date();
	var username = document.getElementById('name').value;
	var password = document.getElementById('password').value;
	var password2 = document.getElementById('password2').value;
	var email = document.getElementById('email').value;
	var act = true;
	var admin = stringChecked(document.getElementById('admin').checked, 'admin');
	var su = stringChecked(document.getElementById('su').checked, 'su');
	var unlimited = stringChecked(document.getElementById('unlimited').checked, 'unlimited');
	
	var hex1 = hex_md5(password);
	var hex2 = hex_md5(password2);
	
	if(email == ""){
		email = "Unset!";
	}
	
	requestPage("POST", '/admin/workshop/newplayer?username='+unescape(username) +
			'&password='+hex1+'&password2='+hex2+'&date='+date+'&email='+email+
			'&act='+act+'&admin='+admin+'&su='+su+'&unlimited='+unlimited+
			'&submit=saveplayer', toUser);
}

/**
* Functions used by the Edit Players page.
* 
* @author Nicholas Robinson.
* @history 22/02/10 Initial version created.
* @note
* @version 0.1
*/

function deletePlayer()
{
	var username = document.getElementById('editplayername').value;
	requestPage("POST", '/admin/workshop/editplayers?username=' + unescape(username) +
			'&submit=deleteplayer', toUser);
}

function updatePlayer()
{
	var username = document.getElementById('editplayername').value;
	var act = true;
	var admin = stringChecked(document.getElementById('editadmin').checked, 'admin');
	var su = stringChecked(document.getElementById('editsu').checked, 'su');
	var unlimited = stringChecked(document.getElementById('editunlimited').checked, 'unlimited');
	var email = document.getElementById('email').value;	

	if(email == ""){
			email = "Unset!";
		}

	var request = '/admin/workshop/editplayers?username='+unescape(username) + '&act='+act+
		'&admin='+admin+'&su='+su+'&unlimited='+unlimited+'&email='+email;
	
	// Vibhu Patel (31/08/2011) Check the password fields only if the checkbox is ticked.
	if(document.getElementById('changepassword').checked)
	{
		var password = document.getElementById('password').value;
		var password2 = document.getElementById('password2').value;
		
		if (password != '' && password2 != ''){		
			var hex1 = hex_md5(password);
			var hex2 = hex_md5(password2);
			
			request += '&password='+hex1+'&password2='+hex2
		} else {
			alert("Password cannot be empty");
            return false;
		}
	}
	
	requestPage("POST", request + '&submit=updateplayer', toUser);
}

function stringChecked(val, valname)
{
	if(val){
		return valname;
	}
	else
	{
		return "";
	}
}
/**
* Event to close the editing player details form 
*/   
function closeEdit()
{
    // Gavin Chan (29/08/2012) Makes the form and components hidden
    document.getElementById("userdetails").style.visibility = "Hidden";
    document.getElementById("edit_player").style.visibility = "Hidden";
}

function displayError()
{
	document.getElementById("message").innerHTML = "Error - please choose a player from the list!";
}

function playerSelect(uname)
{
	// added uname as a parameter of uname so does not have get pname from its value (Daniel Han)
	document.getElementById("dispplayername").innerHTML = uname;	//18/05/2011 set the player name bieng edited on HTML page (Vibhu and Henry)
	requestPage("GET", '/admin/workshop/editplayers?name='+uname+'&submit=getplayer', renderPlayer);
}

function renderPlayer()
{
	var cType;
	if(xmlhttp.readyState==4)
	{
		cType = xmlhttp.getResponseHeader("Content-Type");
		if(cType == "text/html")
		{
			var username = (xmlhttp.responseText).split('<name>')[1];
			var email = (xmlhttp.responseText).split('<email>')[1];
			var date = (xmlhttp.responseText).split('<date>')[1];
			var admin = (xmlhttp.responseText).split('<admin>')[1];
			var su = (xmlhttp.responseText).split('<su>')[1];
			var unlimited = (xmlhttp.responseText).split('<unlimited>')[1];
			
			document.getElementById("editplayername").value = username;
			document.getElementById("editdate").value = date;
			document.getElementById("editadmin").checked = compareBool(admin);
			document.getElementById("editsu").checked = compareBool(su);
			document.getElementById("editunlimited").checked = compareBool(unlimited);
			document.getElementById("userdetails").style.visibility = "visible";
			document.getElementById("edit_player").style.visibility = "visible";
			document.getElementById("userdetails").style.display = "inline";
			document.getElementById("dispplayername").style.display = "inline";
			document.getElementById("email").value = email;
		}
		else
		{
			alert('failure, incorrect response type: type was' + cType);
		}
	}
}

function compareBool(s)
{
	if(s == "True")
	{
		return true;
	}
	else
	{
		return false;
	}
}
