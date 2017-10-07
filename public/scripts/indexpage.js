

//TODO: make the create new bar button have default characteristics
//make sure the finalize button is accurate
/*
  <tr>
  <td> Test Row</td>
  <td> 100 </td>
  <td>

  	<input type="radio" id="radio1" name="radios" value="all" checked>
       <label for="radio1">Edit</label>
    <input type="radio" id="radio2" name="radios"value="false">
       <label for="radio2">Deactivate</label>
    <input type="radio" id="radio3" name="radios" value="true">
       <label for="radio3">Duplicate</label> 
     <input type="radio" id="radio4" name="radios" value="true">
       <label for="radio4">Delete</label> 
</td>
  <td>Activated</td>
  </tr>

*/
var barColor;
function deleteRow(valuenum){
	console.log("deleting")
	var dashboardTable=document.getElementById("dashboardTable");
	tablerows=dashboardTable.childNodes;

	var url = 'https://108.167.175.187\/deleteBar';

	for (var i=1 ; i<tablerows.length ; i++){
		console.log(tablerows[i].tagName)
		if(tablerows[i].id == valuenum && tablerows[i].tagName==="TR"){
			

			data={
				name: tablerows[i].childNodes[0].innerHTML
			}


		$.ajax({
        type: 'DELETE',
        dataType: 'json',
        url: url,
        data:data,
        timeout: 15000,
        success: function(a, status, XMLhttpsReq) {
          location.reload();
          getAndPopulateRows();

        },
        error: function(xhr, status, error) {
          alert( xhr.status + error + "deleting");
        },

      	});
			dashboardTable.removeChild(tablerows[i]);
		}
	}
}

function activateRow(valuenum){

	console.log("activation valuenum: " + valuenum);
	var dashboardTable=document.getElementById("dashboardTable");
	tablerows=dashboardTable.childNodes;

	var activateurl = 'https://108.167.175.187\/activateBar';
	var deactivateurl = 'https://108.167.175.187\/deactivateBar';

	for (var i=0 ; i<tablerows.length ; i++){

		if(tablerows[i].id == valuenum && tablerows[i].tagName==="TR"){
		console.log("activation info")
		console.log(i);
		console.log(tablerows[i]);

		
		activatedata={
				name: tablerows[i].childNodes[0].innerHTML
		}

		$.ajax({
        type: 'PUT',
        dataType: 'json',
        url: activateurl,
        timeout: 15000,
        data:activatedata,
        success: function(a, status, XMLhttpsReq) {
  		location.reload();
          getAndPopulateRows();

        },
        error: function(xhr, status, error) {
          alert( xhr.status + error + "deactivating");
        },

      	});
	}}
	/*
	for (var i=0 ; i<tablerows.length ; i++){
	if ( tablerows[i].id != valuenum && tablerows[i].tagName==="TR") {
		console.log("deactivationinfo")
		console.log(i)
		console.log(tablerows[i])
		var deactivatedata={
				name: tablerows[i].childNodes[0].innerHTML
		}
	

		$.ajax({
        type: 'PUT',
        dataType: 'json',
        url: deactivateurl,
        timeout: 15000,
        data:deactivatedata,
        success: function(a, status, XMLhttpsReq) {
   
          location.href = location.href;
          getAndPopulateRows();

        },
        error: function(xhr, status, error) {
          alert( xhr.status + error + "deactivating");
        },

      	});

	}}

	*/
}

function deactivateRow(valuenum){


	var dashboardTable=document.getElementById("dashboardTable");
	tablerows=dashboardTable.childNodes;

	var url = 'https://108.167.175.187\/deactivateBar';

	for (var i=0 ; i<tablerows.length ; i++){


		if(tablerows[i].id == valuenum && tablerows[i].tagName==="TR"){
		
		data={
				name: tablerows[i].childNodes[0].innerHTML
		}



		$.ajax({
        type: 'PUT',
        dataType: 'json',
        url: url,
        timeout: 15000,
        data:data,
        success: function(a, status, XMLhttpsReq) {
        console.log("ASDASD")
          location.href = location.href;
          getAndPopulateRows();

        },
        error: function(xhr, status, error) {
          alert( xhr.status + error + "deactivating");
        },

      	});


		}
	}




}

function addRow(rowjson,valuenum){




	row=document.createElement("tr");
	titleElement=document.createElement("td");
	goalamountElement=document.createElement("td");
	optionsElement=document.createElement("td");
	activationstatusElement = document.createElement("td");


	row.setAttribute("id",valuenum);


	editradio = document.createElement("input");
	deactivateradio=document.createElement("input");
	//duplicateradio=document.createElement("input");
	deleteradio=document.createElement("input");




	editradio.setAttribute("onclick","editRow(" + valuenum +")")
	deleteradio.setAttribute("onclick","deleteRow("+ valuenum +")")

	if(rowjson.activation==="Deactivated"){
		deactivateradio.setAttribute("onclick","activateRow("+valuenum+")")
	}
	else{

	deactivateradio.setAttribute("onclick","deactivateRow("+valuenum + ")")
	}


	
	//duplicateradio.setAttribute("onclick","duplicateRow(" + valuenum+")")





	editlabel = document.createElement("label");
	deactivatelabel=document.createElement("label");
	//duplicatelabel = document.createElement("label");
	deletelabel = document.createElement("label");


	editradio.setAttribute("type","radio");
	deactivateradio.setAttribute("type","radio");
	//duplicateradio.setAttribute("type","radio");
	deleteradio.setAttribute("type","radio")

	editradio.setAttribute("name",valuenum+"baroptions")
	deactivateradio.setAttribute("name",valuenum+"baroptions")
	//duplicateradio.setAttribute("name",valuenum+"baroptions")
	deleteradio.setAttribute("name",valuenum+"baroptions")

	editradio.setAttribute("value","all")
	deactivateradio.setAttribute("value","false")
	//duplicateradio.setAttribute("value","true")
	deleteradio.setAttribute("value","true")


	editradio.setAttribute("id",valuenum+"radio1")
	deactivateradio.setAttribute("id",valuenum+"radio2")
	//duplicateradio.setAttribute("id",valuenum+"radio3")
	deleteradio.setAttribute("id",valuenum+"radio4")


	editradio.checked=true;



	editlabel.innerHTML="Edit";



	if(rowjson.activation==="Deactivated"){
		deactivatelabel.innerHTML="Activate"
	}
	else{

	deactivatelabel.innerHTML="Deactivate"
	}
	//duplicatelabel.innerHTML="Duplicate"
	deletelabel.innerHTML="Delete"

	editlabel.setAttribute("for",valuenum+"radio1")
	deactivatelabel.setAttribute("for",valuenum+"radio2")
	//duplicatelabel.setAttribute("for",valuenum+"radio3")
	deletelabel.setAttribute("for",valuenum+"radio4")

	titleElement.innerHTML = rowjson.title
	goalamountElement.innerHTML=rowjson.goal
	activationstatusElement.innerHTML= rowjson.activation

	optionsElement.appendChild(editradio);
	optionsElement.appendChild(editlabel);
	optionsElement.appendChild(deactivateradio);
	optionsElement.appendChild(deactivatelabel);
	//optionsElement.appendChild(duplicateradio);
	//optionsElement.appendChild(duplicatelabel);
	optionsElement.appendChild(deleteradio);
	optionsElement.appendChild(deletelabel);

	row.appendChild(titleElement);
	row.appendChild(goalamountElement);
	row.appendChild(optionsElement);
	row.appendChild(activationstatusElement);


	document.getElementById("dashboardTable").appendChild(row);

}



function editRow(valuenum){

	var dashboardTable=document.getElementById("dashboardTable");
	var tablerows=dashboardTable.childNodes;
	var barName;

	for (var i=0 ; i<tablerows.length ; i++){


	if(tablerows[i].id == valuenum && tablerows[i].tagName==="TR"){

		barName=tablerows[i].childNodes[0].innerHTML
		break;
	}}

	if(!(barName===undefined)){



	jQuery.getJSON("/obtainRows", function(a) { 
	 	var barList=a.barList;

	 	for (var i=0;i<barList.length;i++){

	 		if(barList[i].title===barName){
	 			showTemplates();
				showPreviews(barList[i].color);

	 			//set document parameters here
	 			setFormParameters(barList[i],valuenum);

	 			break;
	 		}
	 	}
	 })}}

function setFormParameters(rowJSON,valuenum){


	 	/*
	 		var data ={
		title: titlestring.value,
		goal: goalamount.value,
		activation: "Activated",
		initialMessage: initialMessageField.value,
		beforeProgressMessageField: beforeProgressMessageField.value,
		afterProgressMessageField: afterProgressMessageField.value,
		beforeGoalMessageField: beforeGoalMessageField.value,
		afterGoalMessageField: afterGoalMessageField.value

	}
	*/

	document.getElementById("nameField").value =rowJSON.title;
	document.getElementById("goalField").value=rowJSON.goal;
	document.getElementById("initialMessageField").value=rowJSON.initialMessage;
	document.getElementById("beforeProgressMessageField").value=rowJSON.beforeProgressMessageField;
	document.getElementById("afterProgressMessageField").value=rowJSON.afterProgressMessageField;
	document.getElementById("goalMessageField").value=rowJSON.goalMessageField;


	document.getElementById("alterBarButton").setAttribute("onclick","editBar("+valuenum+")")
	document.getElementById("alterBarButton").innerHTML= "Edit Bar";
}


function editBar(valuenum){

	var dashboardTable=document.getElementById("dashboardTable");
	tablerows=dashboardTable.childNodes;
	var oldBarName

	var url = 'https://108.167.175.187\/deactivateBar';

	for (var i=0 ; i<tablerows.length ; i++){


		if(tablerows[i].id == valuenum && tablerows[i].tagName==="TR"){
			oldBarName=tablerows[i].childNodes[0].innerHTML;
		}
	}

	var titlestring= document.getElementById("nameField");
	var goalamount=document.getElementById("goalField");
	var initialMessageField=document.getElementById("initialMessageField");
	var beforeProgressMessageField=document.getElementById("beforeProgressMessageField");
	var afterProgressMessageField=document.getElementById("afterProgressMessageField");
	var goalMessageField=document.getElementById("goalMessageField");



	var data ={
		oldBarName:oldBarName,
		newBarTitle: titlestring.value,
		newBarGoal: goalamount.value,
		newBarActivation: "Activated",
		newBarInitialMessage: initialMessageField.value,
		newBarBeforeProgressMessageField: beforeProgressMessageField.value,
		newBarAfterProgressMessageField: afterProgressMessageField.value,
		newBarGoalMessageField: goalMessageField.value,
		newBarColor: barColor
			
	}

	var url = 'https://108.167.175.187\/editBar';
	$.ajax({
        type: 'POST',
        url: url,
        data:data,
       // json: true,
        timeout: 15000,
        success: function(a, status, XMLhttpsReq) {
        	//alert("ASDASD0");
          location.reload();

        },
        error: function(xhr, status, error) {
        // alert(status + error +"editing");
        },

      });
}












function duplicateRow(valuenum){

	var dashboardTable=document.getElementById("dashboardTable");
	tablerows=dashboardTable.childNodes;

	var url = 'https://108.167.175.187\/duplicateBar';

	for (var i=0 ; i<tablerows.length ; i++){


		if(tablerows[i].id == valuenum && tablerows[i].tagName==="TR"){

		data={
				name: tablerows[i].childNodes[0].innerHTML
		}



		$.ajax({
        type: 'POST',
        dataType: 'json',
        url: url,
        timeout: 15000,
        data:data,

        success: function(a, status, XMLhttpsReq) {

          location.reload();
          getAndPopulateRows();

        },
        error: function(xhr, status, error) {
          alert( xhr.status + error + "deactivating");
        },

      	});


		}
	}
}


function showTemplates(){
	document.getElementById('templatesTable').style.display ="table";
}

function showPreviews(colorstring){
	barColor=colorstring;
	//document.getElementById('previewsTable').style.display ="table";
	document.getElementById('formTable').style.display="table";

}


function getAndPopulateRows(){
	 jQuery.getJSON("/obtainRows", function(a) { populateRows(a) })
}


function populateRows(rowsArrayJSON){

	var rowsArray=rowsArrayJSON.barList

	for (var i = 0; i < rowsArray.length; i++) {
		if(rowsArray[i]!=null){
    	addRow(rowsArray[i], i);
    }
	}
}


function finalizeBar(){


	var titlestring= document.getElementById("nameField");
	var goalamount=document.getElementById("goalField");
	var initialMessageField=document.getElementById("initialMessageField");
	var beforeProgressMessageField=document.getElementById("beforeProgressMessageField");
	var afterProgressMessageField=document.getElementById("afterProgressMessageField");
	var goalMessageField=document.getElementById("goalMessageField");
	



	var data ={
		title: titlestring.value,
		goal: goalamount.value,
		activation: "Deactivated",
		initialMessage: initialMessageField.value,
		beforeProgressMessageField: beforeProgressMessageField.value,
		afterProgressMessageField: afterProgressMessageField.value,
		goalMessageField: goalMessageField.value,
		color: barColor

	}

	var url = 'https://108.167.175.187\/addBar';
	$.ajax({
        type: 'POST',
        dataType: 'jsonp',
        url: url,
        data:data,
        timeout: 15000,
        success: function(a, status, XMLhttpsReq) {
          location.reload();
          getAndPopulateRows();
        },
        error: function(xhr, status, error) {
         // alert( xhr.status + error +"adding");
        },

      });
}



getAndPopulateRows();

$( "#goalField" ).on('input', function() {
  $(".dollarOutput").html('$' + $("#goalField").val()) ;
});