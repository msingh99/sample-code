/** popup********************/

function closeIframe()
{
    $('#myIframe').dialog('close');
    return false;
}

/**********************************************/

function validate_availability(){
	var availability_id = $("#availability_time_id", top.document).val();

	if($('#end_availability_date-error').html() == '' || typeof $('#end_availability_date-error').html() == 'undefined'){
		 $.ajax({
		  url: '/instructor/checkDateExists/',
		  type: 'POST',
		  data:$('#frm').serialize(),
		  success: function(data) { 
			 if(data == '1'){
				 $.ajax({
				  url: '/instructor/add_availability/'+availability_id,
				  type: 'POST',
				  data:$('#frm').serialize(),
				  success: function(data) {
					$('#message').html("Time Availability has been added successfully").show().fadeOut(3000);
					 
				  }
				});
			 }else{
				 $('#error').html("Your available date already exists in database.").show().fadeOut(3000);
				 return false;
			 }
		 }
	  });
		return true;
	}else{
		return false;
	}
}
/************************************************************************************************/



//Show/hide insternational licence no
function hideInternationalLicence(){  
	$('#learner_permit_number').val('');
	$('#learner_permit_number').attr('disabled','');
	$('#div_learner_permit_no').hide();
	var dob = $('#dob').val();
    var new_dob = new Date(dob);
	var today = new Date();
    var age = Math.floor((today-new_dob) / (365.25 * 24 * 60 * 60 * 1000));
	
	if(age > 18){
		$('#internation_licence_no').removeAttr('disabled','');
		$('#international_country').removeAttr('disabled','');
		$('#div_internation_licence_no').show();
		$('#div_country').show();
	}else{
		$('#internation_licence_no').val('');
		$('#international_country').val('');
		$('#internation_licence_no').attr('disabled','');
		$('#international_country').attr('disabled','');
		$('#div_internation_licence_no').hide();
		$('#div_country').hide();
	}
}
/************************************************************************************************/

//Show/hide insternational licence no
function showInternationalLicence(){
	$('#internation_licence_no').val('');
	$('#international_country').val('');
	$('#learner_permit_number').removeAttr('disabled','');
	$('#div_learner_permit_no').show();	
	$('#internation_licence_no').attr('disabled','');
	$('#international_country').attr('disabled','');
	$('#div_internation_licence_no').hide();
	$('#div_country').hide();
}
/************************************************************************************************/

// Display state
function displayState(){
	country = $('select#country option:selected').val();
	$.ajax({
	  url: '/student/showState/'+country,
	  type: 'Get',
	  success: function(data) {
		$('#show_state').html(data);
	  }
	});
	
}
/************************************************************************************************/



//Confirm dialoug for adult package
function create_adult_package(){
	if (confirm("Do you want to create a new Adult student package?") == true) {
		document.location = "/adult_package/create";
	} else {
		return false;
	}
}
/************************************************************************************************/


function change_dob(){
	var dob = $('#dob').val();
	$('#show_dob').val(dob);
	if(dob != ''){
		$('#show_dob-error').hide();
	}
	 var today = new Date();
	 var new_dob = new Date(dob);
	 var age = Math.floor((today-new_dob) / (365.25 * 24 * 60 * 60 * 1000));
	 if(age > 15){
		$('#div_dob .error').hide();
	 }
	 $('#age').val(age);
	 var permit_no = $('input[name="permit_no"]:checked').val();
	 if(age <= 18){
		$('#pname').show();
	 }else{
		$('#pname').hide(); 
	 }
	 if(permit_no == 'No'){
		hideInternationalLicence();
	 }else{
		showInternationalLicence();
	 }
	
}
/************************************************************************************************/


 $.validator.addMethod("show_dob", function (value, element) {
	change_dob();
	return true;
 }, '');



//Onready of page call, validation and other required function
$().ready(function() {
	// validate form on  submit
	$("#frm").validate({
		ignore: "",
        onkeyup: false,
		rules: {
			fname: {
				required: true,
				minlength: 2
			},
			lname: {
				required: true,
				minlength: 2
			},
			schoolname: {
				required: true,
				minlength: 2
			},
			username: {
				required: true,
				minlength: 2,
				alphanumeric: true
			},
			password: {
				required: true,
				minlength: 5,
				alphanumeric: true
			},
			old_password: {
				required: true,
				minlength: 5,
				alphanumeric: true
			},
			new_password: {
				required: true,
				minlength: 5,
				alphanumeric: true
			},
			cnf_password: {
				required: true,
				minlength: 5,
				alphanumeric: true,
				equalTo: "#new_password"
			},
			confirm_password: {
				required: true,
				minlength: 5,
				alphanumeric: true,
				equalTo: "#password"
			},
			email: {
				required: true,
				email: true
			},
			confirm_email: {
				required: true,
				email: true,
				equalTo: "#email"
			},
			state: {
				required: true
			},
			sex: {
				required: true
			},
			zip_code: {
				required: true,
				minlength: 5,
				number: true
			},
			phone: {
				required: true,
				number: true
			},
			learner_permit_number: {
				required: true,
				minlength: 5,
				alphanumeric: true
			},
			driving_licence_number: {
				required: true,
				minlength: 5,
				alphanumeric: true
			},
			internation_licence_no: {
				required: true,
				minlength: 5,
				alphanumeric: true
			},
			city: {
				required: true,
				minlength: 2,
			},
			international_country: {
				required: true,
				minlength: 2,
			},	
			show_dob: {
				required: true
				
			},
			role: {
				required: true
			}
					
		},
		messages: {
			schoolname: {
				required: "Please enter a school name",
				minlength: "Your school name must consist of at least 2 characters"
			},
			fname: {
				required: "Please enter a firstname",
				minlength: "Your firstname must consist of at least 2 characters"
			},
			lname: {
				required: "Please enter a lastname",
				minlength: "Your lastname must consist of at least 2 characters"
			},
			username: {
				required: "Please enter a username",
				minlength: "Your username must consist of at least 2 characters",
				alphanumeric : "Please enter valid alphanumeric username"
			},
			password: {
				required: "Please provide a password",
				minlength: "Your password must be at least 5 characters long",
				alphanumeric : "Please enter valid alphanumeric password"
			},
			confirm_password: {
				required: "Please provide a confirm password",
				minlength: "Your confirm password must be at least 5 characters long",
				alphanumeric : "Please enter valid alphanumeric confirm password",
				equalTo: "Please enter the same password as above"
			},
			email: "Please enter a valid email address",
			old_password: {
				required: "Please provide a old password",
				alphanumeric : "Please enter valid alphanumeric old password",
				minlength: "Your old password must be at least 5 characters long"
			},
			new_password: {
				required: "Please provide a new password",
				alphanumeric : "Please enter valid alphanumeric new password",
				minlength: "Your new password must be at least 5 characters long"
			},
			cnf_password: {
				required: "Please provide a confirm password",
				minlength: "Your password must be at least 5 characters long",
				alphanumeric : "Please enter valid alphanumeric confirm password",
				equalTo: "Please enter the same password as above"
			},
			
			confirm_email: {
				required: "Please enter a valid email address",
				equalTo: "Please enter the same email as above"
			},
			state: "Please select State",
			zip_code: "Please provide a valid Zip Code",
			phone: "Please provide a valid Phone No",
			show_dob: "Please provide a DOB",
			learner_permit_number: {
				required: "Please provide a Learner Permit Number",
				minlength: "Your Learner Permit Number must be at least 5 characters long",
				alphanumeric: "Please provide a valid Learner Permit Number"
			},
			internation_licence_no: {
				required: "Please provide a Internation Licence Number",
				minlength: "Your Internation Licence Number must be at least 5 characters long",
				alphanumeric: "Please provide a valid Internation Licence Number"
			},
			driving_licence_number: {
				required: "Please provide a Driving Licence Number",
				minlength: "Your Driving Licence Number must be at least 5 characters long",
				alphanumeric: "Please provide a valid Driving Licence Number"
			},
			city: {
				required: "Please provide a City",
				minlength: "Your City must be at least 2 characters long"
			},
			international_country: {
				required: "Please provide a International Country",
				minlength: "Your International Country must be at least 2 characters long"
			},
			role: "Please provide a Role",
			sex: "Please select a Sex",
				
		}
});
/************************************************************************************************/

// Add more session for teen package
$("#add").click(function (e) {
		//Append a new row of code to the "#items" div
		var value = parseInt($('#hdn').val());
		var flag = true;
		
		if($('#session_name'+value).val() ==''){
			alert("Please provide a Session Name");
			flag = false;
		}
		if($('#session_hours'+value).val() ==''){
			alert("Please provide a Session Hours");
			flag = false;
		}

		if($('#session_priority'+value).val() ==''){
			alert("Please provide a Priority of Session");
			flag = false;
		}

		if(flag == true){
			var hdnVal = parseInt($('#hdn').val()) + 1;
			$('#hdn').val(hdnVal);
			$("#items").append('<div class="div_txt"><div class="levelname">Session Name : '+hdnVal+'</div><div class="inputname"><input id="session_name'+hdnVal+'" type="text" maxlength="250" size="50" value="" name="session_name[]"></div></div><div class="div_txt"><div class="levelname"> Session Hours</div><div class="inputname"><input id="session_hours'+hdnVal+'" type="text" maxlength="250" size="50" value="" name="session_hours[]"></div></div><div class="div_txt"><div class="levelname"> Session Priority</div><div class="inputname"><input id="session_priority'+hdnVal+'" type="text" maxlength="250" size="50" value="" name="session_priority[]"></div></div>');
		}
	});

});
/************************************************************************************************/


// validate session for teen package
function validate(){
	var value = parseInt($('#hdn').val());
	var flag = true;
	for(var i= 1; i <= value; i++){
		if($('#session_name'+i).val() ==''){
			alert("Please provide a Session Name");
			flag = false;
		}
		if($('#session_hours'+i).val() ==''){
			alert("Please provide a Session Hours");
			flag = false;
		}
		if($('#session_priority'+i).val() ==''){
			alert("Please provide a Priority of Session");
			flag = false;
		}
		if($('#package_price').val() ==''){
			alert("Please provide a package price");
			flag = false;
		}
	}
	return flag;
}
/************************************************************************************************/


