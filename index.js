var socket = io.connect();
const MONITORROOM = "monitor_room";		// socket room name for monitoring this service

function getDepartments() {
	leaveRoom();	// in case already subscribing
	socket.emit('departmentRequest',"");
}

function getOperators() {
	leaveRoom();	// in case already subscribing
	socket.emit('operatorRequest',"");
}

function joinRoom() {
	clearall();
	$('#dlog').show();
	socket.emit('join room',MONITORROOM);
}

function leaveRoom() {
	socket.emit('leave room',MONITORROOM);
}

function DBInsert() {
	var cid = $('#cid').val();
	var dept = $('#dept').val();
	var nm = $('#name').val();
	var dt = $('#date').val();
	var tm = $('#time').val();
	var mes = $('#text').val();
	var cm = {chatID: cid, deptName: dept, name: nm, date: dt, time: tm, text: mes};
	$("#message1").html("");
	$("#error").html("");
	socket.emit('DBInsertRequest',cm);
}

function DBRead() {
	socket.emit('DBReadRequest',"");
}

function showForm(id) {	
	$('#chatform').show(500);
}

$(document).ready(function() {
	
	console.log("Console Ready");
	clearall();
	socket.on('errorResponse', function(data){
		clearall();
		$("#error").text(data);
	});
	socket.on('goodResponse', function(data){
		clearall();
		$("#message1").text(data);
	});
	// this returns an object of departments
	socket.on('departmentResponse',function(data){
		clearall();
		var str = "No of Depts: "+Object.keys(data).length;
		str += "<table><tr><td>DeptID</td><td>Name</td></tr>";
		for(var i in data)
		{
			str += "<tr><td>"+i+"</td>";
			str += "<td>"+data[i]+"</td></tr>";
		}
		str += 	"</table>";	
		$("#message1").html(str);
	});
	// this returns an object of operator objects
	socket.on('operatorResponse',function(data){
		clearall();
		var str = "No of Operators: "+Object.keys(data).length;
		str += "<table border='1'><tr><td>OperatorID</td><td>Name</td><td>EmployeeID</td></tr>";
		for(var i in data)
		{
			str += "<tr><td>"+data[i].operatorID+"</td>";
			str += "<td>"+data[i].operatorName+"</td>";
			str += "<td>"+data[i].employeeID+"</td></tr>";
		}
		str += 	"</table>";	
		$("#message1").html(str);
	});	
	// this returns an object of Chat messages
	socket.on('DBReadResponse',function(data){
		clearall();
		var str = "No of entries: "+Object.keys(data).length;
		str += "<table border='1'><tr><td>Chat ID</td><td>Dept</td><td>Name</td><td>Date</td><td>Time</td><td>Text</td></tr>";
		for(var i in data)
		{
			str += "<tr><td>"+data[i].id+"</td>";
			str += "<td>"+data[i].deptName+"</td>";
			str += "<td>"+data[i].name+"</td>";
			str += "<td>"+data[i].date+"</td>";
			str += "<td>"+data[i].time+"</td>";
			str += "<td>"+data[i].text+"</td></tr>";
		}
		str += 	"</table>";	
		$("#message1").html(str);
	});
	socket.on('chatMessage',function(data){
		var str = "\r\n";
		console.log("Message: "+data.text);
		str += "Chat id:"+data.chatID+"\r\n";
		str += "Dept:"+data.deptName+"\r\n";
		str += "Name:"+data.name+"\r\n";
		str += "Date:"+data.date+"\r\n";
		str += "Time:"+data.time+"\r\n";
		str += "Text:"+data.text+"\r\n";
		$('#dlog').append(str);
		document.getElementById("dlog").scrollTop = document.getElementById("dlog").scrollHeight
	});
	socket.on('consoleLogs',function(data){
		$('#dlog').append(data);
		document.getElementById("dlog").scrollTop = document.getElementById("dlog").scrollHeight
	});
});

function clearall() {
	$('#chatform').hide();
	$('#dlog').hide();
	$('#error').text();
	$('#message1').html("");
	$('#message2').html("");
}

/*
 *	This function makes data (typically csv format) available for download
 *  using the DOM id "download" which should be labelled "download file"
 */
function prepareDownloadFile(data)
{
	var filedata = new Blob([data], {type: 'text/plain'});
	// If we are replacing a previously generated file we need to
	// manually revoke the object URL to avoid memory leaks.
	if (csvfile !== null)
	{
		window.URL.revokeObjectURL(csvfile);
	}

    csvfile = window.URL.createObjectURL(filedata);
	$("#message1").text("Messages exported "+ new Date().toUTCString());
	$('#download').attr("href",csvfile);
	$('#download').show(300);
}
