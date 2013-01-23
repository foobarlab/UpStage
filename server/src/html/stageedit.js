/**
 * stageedit.js, contains functions used by the edit stage page.
 * 
 * @Author Shaun Narayan
 * @note Should probably move the color generation code to master
 * 		 script since it can be used anywhere. If possible change
 * 		 genColorTable to allow selection of color deviation.
 * @history
 * @Version 0.6
 * Modified by Vibhu Patel 22/07/2011 - Made changes to not conflict with the html changes required to move around
 										components. Namely rename fields, move the colour selector.
 										Added radio buttons next to fields that need to be modified namely colours.

 * Modified by Daniel Han 27/06/2012	- Changes to ColorPicker to have an ID so it can be styled. (Easy to change size)
					- Changes to removal of proptd id and change it to colProp which I have reduced the number of rows and columns.
					- Added Resize Event handler
                    
 * Modified by Gavin Chan 12/09/2012    - Modified StageChooseSubmit() method to trim the name values and
                                          add a validator for the "#" key that removes "#" when the user enters it in the stage name 
                                          
                                        - Created a function saveStage() that is called when the user edits the stage page and confirms, it trims the stage name value and add a alert for the "#" key 

                                        
    Modified by Daniel Han 18/09/2012   - added stateNum parameter on saveStage for refresh stage or not.
                                        
*/

//Instance based variables
var selector;
var nocolor;
var state; //Temp patch
//Static variables
var colorTypes = ['Prop','Chat','Tools','Page'];
/**
 * Constructor (Well, as close as you can get).
 * @return none
 */
function stageEdit()
{
	selector = "Prop";
	nocolor = document.getElementById("colProp").bgColor;
	document.getElementById("colProp").bgColor='#FFFFFF';
	genColorTable("colorpicker");
	displayAccess();
	debugToBeChecked(document.rupert.debugTextMsg.value);
		
	var cols = document.rupert.colorvals.value;
	if(cols!='No stage selected')
	{
		var temp = cols.split(",");
		colourNumOnLoad(temp);
		resizePage();
		//document.getElementById("debugp").style.position="absolute";
		//document.getElementById("debugp").style.left="40%";
	}
	else
	{

        var rm = document.getElementById("stagename");
        rm.parentNode.removeChild(rm);
        rm = document.getElementById("edit");
        rm.parentNode.removeChild(rm);
        
        //rm = document.getElementById("submit");
        //rm.parentNode.removeChild(rm);
	}
}

/**
 * Generates a color table (HTML) and places it in the specified
 * element.
 * @param elementID - where to place the element in the DOM
 * @return none
 */
function genColorTable(elementID)
{
	var color = new Array();
	color[0] = 0;
	color[1] = 0;
	color[2] = 0;
	var selector = 2;
	
	colorPicker='<table id="ColorPicker">';
	for(var i = 0; i < 6; i++)
	{;
		for(var a = 0; a < 2; a++)
		{
			colorPicker+='<tr id="ColorPickerTr">';
			for(var x = 0; x < 3; x++)
			{
				for(var z = 0; z < 6; z++)
				{
					colorPicker+= '<td id="ColorPickerTd" bgColor="#' + decimalToHex(color[0],2) + decimalToHex(color[1],2) + decimalToHex(color[2],2) + '" onClick="colourNum(this.bgColor)"></td>'; 
					color[2] += 51;
					
				}
				color[2] = 0;
				color[0] += 51;
			}
			colorPicker+='</tr>';
		}
		color[0] = 0;
		color[1] +=51;
	}
	colorPicker+='</table>';
	document.getElementById(elementID).innerHTML = colorPicker;
}
/**
 * Convert a base 10 value to base 16, then pad with leading zeros
 * @param d - base 10 value.
 * @param padding -number of leading zeros to insert.
 * @return hex - padded base 16 value
 */
function decimalToHex(d, padding) 
{
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
    while (hex.length < padding) 
    {
        hex = "0" + hex;
    }
    return hex;
}
/**
 * Sets colors on first load of page.
 * @param colprop - The color received from server.
 * @param colchat ""
 * @param coltools ""
 * @param colpage ""
 * @return - none
 */
function colourNumOnLoad(cols)
{
	for(i in colorTypes)
	{
		document.getElementById("colourNum" + colorTypes[i]).value = cols[i];
		document.getElementById("col" + colorTypes[i]).bgColor=cols[i].replace(/0x/, "#");
	}
}
/**
 * set value to be sent back to server.
 * @param koda - color value.
 * @return - none
 */
function colourNum(koda)
{
	document.getElementById("col"+selector).bgColor=koda;
	document.getElementById("colourNum"+selector).value=koda.toUpperCase().replace(/#/, "0x");
	document.getElementById("colourNum"+selector).select();
}
/**
 * Highlight the item being colored currently.
 * @param select - Name of the item to be colored. Used for indexing.
 * @return - none
 */
function selectColoring(select)
{
	// 09/08/2011 Vibhu Patel - Changed from radio buttons to images.
	if(select == "Prop")
	{
		document.getElementById("propIm").src = "/style/radioselect.jpg";
		document.getElementById("chatIm").src = "/style/radioNonSelect.jpg";
		document.getElementById("toolsIm").src = "/style/radioNonSelect.jpg";
		document.getElementById("pageIm").src = "/style/radioNonSelect.jpg";
	}
	if(select == "Chat")
	{
		document.getElementById("propIm").src = "/style/radioNonSelect.jpg";
		document.getElementById("chatIm").src = "/style/radioselect.jpg";
		document.getElementById("toolsIm").src = "/style/radioNonSelect.jpg";
		document.getElementById("pageIm").src = "/style/radioNonSelect.jpg";
	}
	if(select == "Tools")
	{
		document.getElementById("propIm").src = "/style/radioNonSelect.jpg";
		document.getElementById("chatIm").src = "/style/radioNonSelect.jpg";
		document.getElementById("toolsIm").src = "/style/radioselect.jpg";
		document.getElementById("pageIm").src = "/style/radioNonSelect.jpg";
	}
	if(select == "Page")
	{
		document.getElementById("propIm").src = "/style/radioNonSelect.jpg";
		document.getElementById("chatIm").src = "/style/radioNonSelect.jpg";
		document.getElementById("toolsIm").src = "/style/radioNonSelect.jpg";
		document.getElementById("pageIm").src = "/style/radioselect.jpg";
	}
	selector = select;
	clearAllColors();
	document.getElementById(select.toLowerCase()+"td").bgColor='#FFFFFF';
}
/**
 * Set all items to default bg color.
 * @return - none
 */
function clearAllColors()
{
	for(i in colorTypes)
	{
		document.getElementById(colorTypes[i].toLowerCase() + "td").bgColor=nocolor;
	}
}
/**
 * Action should now portray access rights changing, and new data posted.
 * @param action - what to do at the server.
 * @return - none
 */
function setAccess(action)
{
	saveState();
	document.getElementById("status").innerHTML = 'Sending to server, please wait...';
	document.getElementById("status").style.display = "inline";
	document.rupert.action.value = action;
	requestPage("POST", buildRequest(2),fillPage);
}
/**
 * Stage was selected in the first form. 
 * (Dont know why their separated, but it allows data to be trickle sent).
 * @return
 */
function stageChooseSubmit()
{
    
	document.getElementById("status").innerHTML = 'Sending to server, please wait...';
	document.getElementById("status").style.display = "inline";
	requestPage("POST", buildRequest(1), fillPage);//'/admin/workshop/stage?shortName='+document.shaun.shortName.value, fillPage);
}

function stageCreate()
{
    try
    {
        document.getElementById('name').value = trim(document.getElementById('name').value);
        document.getElementById('urlname').value = trim(document.getElementById('urlname').value);
        if(document.getElementById('name').value.match('#'))
        {
            document.getElementById('name').value = document.getElementById('name').value.replace(/#/g,"");
        } 
    }
    catch(ex)
    {

    }
    
	document.getElementById("status").innerHTML = 'Sending to server, please wait...';
	document.getElementById("status").style.display = "inline";
	requestPage("POST", buildRequest(2), fillPage);//'/admin/workshop/stage?shortName='+document.shaun.shortName.value, fillPage);
}

/**
 * Saves the stage edited by the user 
 * Modified by: Daniel Han (18/09/2012) - added stateNum parameter for refresh stage or not.
 * @return - none
 */
 function saveStage(stateNum)
 {
    try
    {
       document.getElementById('longName').value = trim(document.getElementById('longName').value);
       if(document.getElementById('longName').value.match('#'))
       {
           document.getElementById('longName').value = document.getElementById('longName').value.replace(/#/g,"");
       } 
       warn(stateNum);
       
    }
    catch(ex)
    {}
  
 }

/**
 * Save the state of form elements so that changed are not lost while editing
 * (Will change to only request certain bits of info from server as opposed to whole page).
 * @return none
 */
function saveState()
{
	state = new Array();
	var x = 0;
	for(i in colorTypes)
	{
		state[i] = document.getElementById("colourNum" + colorTypes[i]).value;
		x = i;
	}
	state[i+1] = document.getElementById("splash_message").value;
	state[i+2] = document.getElementById("debug").checked;
	state[i+3] = selector;
}
/**
 * Put the page back as it was.
 * @return none
 */
function restoreState()
{
	if(state == undefined) return;
	var cola = new Array();
	var x = 0;
	for(i in colorTypes)
	{
		cola[i] = state[i];
		x=i;
	}
	colourNumOnLoad(cola);
	document.getElementById("splash_message").value = state[i+1];
	document.getElementById("debug").checked = state[i+2];
	selector = state[i+3];
	selectColoring(selector);
	//alert(selector);			07/11/20101 PR - Removed, because I couldn't see the point in this
	state = undefined;
}
/**
 * Can this user set access rights?
 * @return - none
 */
function displayAccess()
{
	if(document.rupert.displayaccess.value=='false')
	{
		document.getElementById('accessdiv').innerHTML='';
	}
}
//=================================================================
//OLD METHODS
//=================================================================
/**
 * Legacy method - sets initial value for debug checkbox.
 * @param kora - debug or not
 * @return - none
 */
function debugToBeChecked(kora)
{
	if(kora == "DEBUG")
	{
		document.getElementById("debug").checked = 'checked';
	}
}
/**
 * Legacy method - set the value to be posted to server.
 * @return - none
 */
function debugChecked()
{
	document.getElementById("debugTextMsg").value='DEBUG';
}
/**
 * As above.
 * @return - none
 */
function debugUnChecked()
{
	document.getElementById("debugTextMsg").value='normal';
}
/**
 * Legacy method - Doesnt work with the new version of the site, 
 * just left in to remind us to add in a warning if the client wants it.
 * @return
 */
function discourage_edit(){
    var count = document.getElementById('usercount');
    if (count != undefined){
        alert("There are people using this stage -- don't edit it now!");

        var elements = document.forms[0].elements;
        var i, e;
        for (i = 0; i < elements.length; i++){
            e = elements[i];
            e.disabled = true;
        }
        var enable = document.createElement("a");
        enable.href = "#";
        enable.innerHTML = " <b>Ignore users and edit this stage</b>";
        enable.onclick = function(){
            for (i = 0; i < elements.length; i++){
                e = elements[i];
                e.disabled = false;
            }
            enable.style.display = 'none';
            return false;
        }
        count.appendChild(enable);
    }
}

/*
* Occurs when the form is resized.
* @return none
*/
function resizePage()
{
	document.getElementById('masterpage').style.width = "";
	var colorPickerWidth = 300;
	var editWidth = document.getElementById('edit').offsetWidth;
	var editStage = document.getElementById('editStageGeneral');
	var calculatedWidth = (editWidth - colorPickerWidth - 40);
	
	if(calculatedWidth > 550)
	{
		editStage.style.width = calculatedWidth + "px";
		
	}
	else
	{
		editStage.style.width = 550 + "px";
		document.getElementById('masterpage').style.width = (550 + colorPickerWidth + 120) + "px";
	}
}

