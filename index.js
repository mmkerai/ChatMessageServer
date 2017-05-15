var socket = io.connect();

function getDepartments() {
	socket.emit('departmentRequest',"");
}

function getOperators() {
	socket.emit('operatorRequest',"");
}

function joinRoom() {
	socket.emit('join room',"chat_message_room");
}

function leaveRoom() {
	socket.emit('leave room',"chat_message_room");
}

$(document).ready(function() {
	
	console.log("Console Ready");
	socket.on('errorResponse', function(data){
		$("#error").text(data);
	});
	socket.on('goodResponse', function(data){
		$("#message1").html(data);
	});
	// this returns an object of departments
	socket.on('departmentResponse',function(data){
		var str = "No of Depts: "+Object.keys(data).length;
		str += "<table><tr><td>DeptID</td><td>Name</td></tr>";
		for(var i in data)
		{
			str += "<tr><td>"+i+"</td>";
			str += "<td>"+data[i]+"</td>";
		}
		str += 	"</table>";	
		$("#message1").html(str);
	});
	// this returns an object of operator objects
	socket.on('operatorResponse',function(data){
		var str = "No of Operators: "+Object.keys(data).length;
		str += "<table><tr><td>OperatorID</td><td>Name</td><td>EmployeeID</td><td>Chat Messages</td></tr>";
		for(var i in data)
		{
			str += "<tr><td>"+data[i].operatorID+"</td>";
			str += "<td>"+data[i].operatorName+"</td>";
			str += "<td>"+data[i].employeeID+"</td>";
			str += "<td>"+data[i].chatMessages+"</td>";
		}
		str += 	"</table>";	
		$("#message1").html(str);
	});	
	// this returns an object of operator objects
	socket.on('chatMessage',function(data){
		var str = "New message: <br/>";
			str += "Chat ID:"+data[i].chatID+"<br/>";
			str += "Dept Name:"+data[i].deptName+"<br/>";
			str += "Name:"+data[i].name+"<br/>";
			str += "Date"+data[i].date+"<br/>";
			str += "Time"+data[i].time+"<br/>";
			str += "Message"+data[i].text+"<br/>";

		$("#message1").html(str);
	});	
});

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
	$("#message1").text("Snapshot exported "+ new Date().toUTCString());
	$('#download').attr("href",csvfile);
	$('#download').show(300);
}
