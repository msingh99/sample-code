<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User extends CI_Controller {

	function __construct(){
		parent::__construct();
		
		$this->load->library(array('form_validation'));
		$this->load->helper(array('form','url'));
		$this->load->model('User_model');
	}

	//Get Role array
	function getRole(){
		$roleArray =array();
		 $roles = $this->User_model->getRole();
		 $roleArray = array(''=>'Select');
		 foreach($roles as $role){
			$roleArray[$role['role_id']] = $role['role_name'];
		 }
		 return $roleArray;
	}
	//End

	//Login User
	public function login(){
		if($this->session->userdata('logged_in')){
			redirect("user/logout");
		}else{
			 $this->load->helper('cookie');
			  $data = array();
			  $data['role'] = $this->getRole();
			  //set validations
			  $this->form_validation->set_rules("username", "Username", "trim|required");
			  $this->form_validation->set_rules("password", "Password", "trim|required");
			  $this->form_validation->set_error_delimiters('<p class="error">', '</p>');
		
			  if ($this->form_validation->run() == TRUE){
					
				   if ($this->input->post('submit') == "Login")
				   {
						if($this->input->post("role") == $this->config->item('school_role')){
							$data['invaliddata'] = $this->schoolLogin();
						}else{
							$data['invaliddata'] = $this->userLogin();
						}
					}
			   }
			   $this->load->view('header');
			   $this->load->view('login', $data);
			   $this->load->view('footer');
		}
	}
	//End of Login

	//User Login
	function userLogin(){
		$data = array();
		//check if username and password is correct
		$result = $this->User_model->getUser()->row();
		$rows = $this->User_model->getUser()->num_rows();
	
		if ($rows > 0){	
			if($this->input->post("remember_me") != null){
				$this->input->set_cookie(array('name' => 'password','value' =>trim($this->input->post("password")),'expire' => 31536000));
				$this->input->set_cookie(array('name' => 'username','value' =>trim($this->input->post("username")),'expire' => 31536000));
				$this->input->set_cookie(array('name' => 'role','value' =>trim($this->input->post("role")),'expire' => 31536000));
				$this->input->set_cookie(array('name' => 'remember_me','value' =>trim($this->input->post("remember_me")),'expire' => 31536000));
			}
			
			$sessiondata = array(
				  'username' => $result->username,
				  'id'=>$result->user_id,
				  'role' => $result->role_id
			 );
			if($result->role_id == $this->config->item('student_role')){
				$age = date_diff(date_create($result->dob), date_create('today'))->y;
				if($age > 18){
					$this->session->set_userdata('student_type',$this->config->item('adult_student_type'));	
				}else{
					$this->session->set_userdata('student_type',$this->config->item('teen_student_type'));
				}
			}

			 $this->session->set_userdata('logged_in',$sessiondata);	
			
			 if($this->config->item('student_role') == $this->input->post("role")){
				redirect("student/profile");
			 }else{
				redirect("instructor/profile");
			 }
			
			
		}else{
			$invalid = '<div class="error-message">Invalid username or password!</div>';
		}
		return $invalid;
	}
	//End

	//School Login
	function schoolLogin(){
		$data = array();
		//check if username and password is correct
		$result = $this->User_model->getSchool()->row();
		$rows = $this->User_model->getSchool()->num_rows();
		
		if ($rows > 0){	
			if($this->input->post("remember_me") != null){
				$this->input->set_cookie(array('name' => 'password','value' =>trim($this->input->post("password")),'expire' => 31536000));
				$this->input->set_cookie(array('name' => 'username','value' =>trim($this->input->post("username")),'expire' => 31536000));
				$this->input->set_cookie(array('name' => 'role','value' =>trim($this->input->post("role")),'expire' => 31536000));
				$this->input->set_cookie(array('name' => 'remember_me','value' =>trim($this->input->post("remember_me")),'expire' => 31536000));
			}
	
			$sessiondata = array(
				  'username' => $result->username,
				  'id'=>$result->school_id,
				  'role' => $this->config->item('school_role')
			 );

			 $this->session->set_userdata('logged_in',$sessiondata);						
			 redirect("school/profile");
			
		}else{
			$invalid = '<div class="error-message">Invalid username or password!</div>';
		}
		return $invalid;

	}
	//End


	//generate forgot password
	function forgot_password(){
	   $this->load->helper('common');
	   $data  = array();
	   $data['role'] = $this->getRole();
	   $message = $error = '';

	   if($this->input->post('submit') == "Forgot Password"){
		   $this->form_validation->set_rules('email','Email','trim|required|valid_email|callback_checkEmailExists');
		   $this->form_validation->set_rules("role", "Role", "required");
		   $this->form_validation->set_error_delimiters('<p class="error">', '</p>');
			if($this->form_validation->run() == TRUE)
			{
				$email = $this->input->post('email');
				$password = $this->generatePassword();
				if($this->input->post("role") == $this->config->item('school_role') && $this->User_model->checkSchoolAccountActivation()->num_rows > 0){
					$userdata = array('password' => base64_encode($password),'updated_date' => date("Y-m-d H:i:s"));
					$this->User_model->updateSchoolPassword($email,$userdata);
					$username = $this->User_model->getSchoolByEmail()->row()->username;
					$message = forgotPasswordMail($username, $password, $email);
				}else if($this->User_model->checkUserAccountActivation()->num_rows > 0){
					$userdata = array('password' => base64_encode($password),'updated_date' => date("Y-m-d H:i:s"));
					$this->User_model->updateUserPassword($email,$userdata);
					$username = $this->User_model->getUserByEmail()->row()->username;	
					$message = forgotPasswordMail($username, $password, $email);
				}else{
					$data['error'] = "Your account is not activated. Please activate your account ";
				}
				
				$data['message'] = $message;
			}
	   }	
	   $this->load->view('header_inner');
	   $this->load->view('forgot_password', $data);
	   $this->load->view('footer');

	}
	//End

	//Check email exists or not in database
	public function checkEmailExists()
	{
	
		  if($this->input->post("role") == $this->config->item('school_role')){
			$result = $this->User_model->getSchoolByEmail();
		  }else{
			$result = $this->User_model->getUserByEmail();
		  }
		  
		  if ($result->num_rows != 1 )
		  {
			$this->form_validation->set_message('checkEmailExists', 'Email address don\'t exist');
			return FALSE;
		  }
		  else
		  {
			return TRUE;
		  }
	}

	function generatePassword(){
		$chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		$password = substr( str_shuffle( $chars ), 0, 8 );
		return $password;
	}

	//resend activation mail
	function activate_account(){
		$this->load->model('school_model');
		$this->load->helper('common');
         $data  = array();
		 $data['role'] = $this->getRole();
		
		  if($this->input->post('submit') == "Activate Account"){
		   $this->form_validation->set_rules('email','Email','trim|required|valid_email|callback_checkEmailExists');
		   $this->form_validation->set_rules("role", "Role", "required");
		   $this->form_validation->set_error_delimiters('<p class="error">', '</p>');
			if($this->form_validation->run() == TRUE)
			{
				if($this->input->post("role") == $this->config->item('school_role')){
					$record = $this->School_model->resendMail();
					$data['message'] = activateAccount($record,'school');
				}else {
					$record = $this->User_model->resendMail();
					$data['message'] = activateAccount($record,'user');
				}
			}
	     }
		 $this->load->view('header_inner');
		 $this->load->view('activate_account', $data);
		 $this->load->view('footer');
	}
	/***************************************************************************************/

	//Logout user
	function logout(){
        $this->session->sess_destroy();
        redirect('home');
   
	}
	/***************************************************************************************/

	//Update Password
	function update_password(){
		$data = array();
		if($this->session->userdata('logged_in')){
			if ($this->input->post('submit') == "Change Password"){
				$this->form_validation->set_rules("old_password", "Password", "trim|required|callback_checkPassword");
				$this->form_validation->set_rules("new_password", "Password", "trim|required|matches[cnf_password]");
				$this->form_validation->set_rules("cnf_password", "Confirm Password", "trim|required");
				$this->form_validation->set_error_delimiters('<p class="error">', '</p>');
				if ($this->form_validation->run() == True)
				{
					$this->User_model->updatePassword();
					$data['message']="Your password has been updated successfully";
				}
			}
			$this->load->view('header_inner');
			$this->load->view('update_password', $data);
			$this->load->view('footer');
		}else{
			redirect("user/login");
		}
		
	}
	/***************************************************************************************/

	public function checkPassword()
	{
		  $result = $this->User_model->checkPassword();
		  if ($result->num_rows < 1 ){
			$this->form_validation->set_message('checkPassword', 'Please enter correct old password');
			return FALSE;
		  }else{
			return TRUE;
		  }
	}
	/***************************************************************************************/

	/**
	*	Update Instructor Profile
	**/
	function edit_profile(){
		$data = array();
		$this->load->model('Student_model');
		$this->load->model('School_model');
		$this->load->helper('common');
		
		if($this->session->userdata('logged_in')){
			$path = '/assets/js/ckfinder';
			$width = '530px';
			editor($path, $width);
			$data = $this->Student_model->getUserData();
			$data['default_country'] = showCountryList();
			$data['default_state'] =  showStateList('USA',true);
			$data['role'] = $this->session->userdata('logged_in')['role'];
			if ($this->input->post('submit') == "Update"){
				$file_name = '';
				$this->form_validation->set_rules("email", "Email Address", "trim|required|valid_email|callback_checkEmail");
				$this->form_validation->set_rules("phone", "Phone", "trim|required|regex_match[/^[0-9]+$/]|xss_clean");
				$this->form_validation->set_rules("state", "State", "required");
				$this->form_validation->set_rules("city", "City", "trim|required|alpha_numeric");
				$this->form_validation->set_rules("zip_code", "Zip Code", "trim|required|numeric");
				$this->form_validation->set_error_delimiters('<p class="error">', '</p>');
				if ($this->form_validation->run() == True){
					//image upload
					$file_name = uploadImages('user', $this->config->item('user_image_path'));
					
					//end
					$updated = $this->User_model->updateUser($file_name);
					if($this->session->userdata('logged_in')['role'] == $this->config->item('instructor_role') || $this->session->userdata('logged_in')['role'] == $this->config->item('school_instructor_role')){
						redirect("instructor/profile");
					}else{
						redirect("student/profile");
					}
				}		
			}
			$this->load->view('header_inner');
			$this->load->view('edit_profile', $data);
			$this->load->view('footer');
		}else{
			redirect("user/login");
		}

		
		
	}
	/***************************************************************************************/

	//Check email exists or not in database
	public function checkEmail()
	{
		  $result = $this->User_model->checkEmailExistance();
		  if ($result->num_rows > 0 ){
			$this->form_validation->set_message('checkEmail', 'Email already exists. Please enter another Email.');
			return FALSE;
		  }else{
			return TRUE;
		  }
	}
	/***************************************************************************************/


	/**
		* Activate user account
	**/
	function activate($user_id, $random_code){
		$data = array();
		if(!empty($user_id)){
			$this->User_model->updateStatus($user_id,$random_code);
			$data['message'] = "Your account has been activated.";
		}else{
			$data['message'] = "Sorry there is something wrong";
		}
		$this->load->view('header_inner');
		$this->load->view('account_activation', $data);
		$this->load->view('footer');

	}
	/**************************************************************************/

	
}

/* End of file login.php */
