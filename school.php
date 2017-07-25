<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class School extends CI_Controller {

	function __construct(){
		parent::__construct();
		
		$this->load->library(array('table','form_validation'));
		$this->load->helper(array('form','url','common'));
		$this->load->model('School_model');
		$this->perPage = 2;
	}
	/***************************************************************************************/

	//Become driving school
	function driving(){
		if($this->session->userdata('logged_in')){
			$this->load->view('header_inner');
		}else{
			$this->load->view('header');
		}
		$this->load->view('driving_school');
		$this->load->view('footer');
	}
	/***************************************************************************************/

	//School list
	function index(){
		if($this->input->post('submit')== 'Search'){
			setParams();
		}
		$data['country'] = showCountryList();
		$data['state'] =  showStateList('USA',true);
		$this->load->library('Ajax_pagination');
       
		$totalRec = $this->School_model->getRows();
		//pagination configuration
        $config['first_link']  = 'First';
        $config['div']         = 'results'; //parent div tag id
        $config['base_url']    = base_url().'school/school_list';
        $config['total_rows']  = $totalRec;
        $config['per_page']    = $this->perPage;
        
        $this->ajax_pagination->initialize($config);
        
        //get the posts data
        $data['records'] = $this->School_model->getAllSchool(array('limit'=>$this->perPage));
        //load the view
		if($this->session->userdata('logged_in')  && $this->session->userdata('logged_in')['role'] == $this->config->item('student_role')){
			$this->load->view('header_inner');
		}else{
			//session_destroy();
			$this->load->view('header');
		}
        $this->load->view('school', $data);
		$this->load->view('footer');
	}
	/***************************************************************************************/

	//Get the school list
	function school_list($page = null)
    {
		$this->load->library('Ajax_pagination');
        if(!$page){
            $offset = 0;
        }else{
            $offset = $page;
        }
        
        //total rows count
        $totalRec = $this->School_model->getRows();
        
        //pagination configuration
        $config['first_link']  = 'First';
        $config['div']         = 'results'; //parent div tag id
        $config['base_url']    = base_url().'school/school_list';
        $config['total_rows']  = $totalRec;
        $config['per_page']    = $this->perPage;
        
        $this->ajax_pagination->initialize($config);
        
        //get the posts data
        $data['records'] = $this->School_model->getAllSchool(array('start'=>$offset,'limit'=>$this->perPage));
        
        //load the view
        $this->load->view('ajax_school', $data, false);
    }
	/*************************************************************************************/


	//All available instructor under school
	function instructor($school_id, $package_id){
		if($this->session->userdata('logged_in') && $this->session->userdata('logged_in')['role'] == $this->config->item('student_role')){
			
			if($school_id != '' && $package_id != ''){
				$records  = $this->School_model->checkPackage($school_id,$package_id);
				if(!empty($records)){ 
					
					$this->session->set_userdata('school_id', $school_id);
					$this->session->set_userdata('package_id', $package_id);
					
					$data = array();
					if($this->input->post('start_date')){
						$search_date = $this->input->post('start_date');
					}else{
						$search_date = date("m-d-Y");
					}
					$this->session->set_userdata('search_date', $search_date);

					$this->load->library('Ajax_pagination');

					$totalRec = $this->School_model->getInstructorRows();
	
					//pagination configuration
					$config['first_link']  = 'First';
					$config['div']         = 'results'; //parent div tag id
					$config['base_url']    = base_url().'school/instructor_list';
					$config['total_rows']  = $totalRec;
					$config['per_page']    = $this->perPage;
					
					$this->ajax_pagination->initialize($config);
		
					$data['records'] = $this->School_model->getAllInstructor(array('limit'=>$this->perPage));
					$data['search_date'] = $search_date;
					
					$this->load->view('header_inner');
					$this->load->view('school_instructor', $data);
					$this->load->view('footer');
				}else{
					redirect("school");
				}
			}else{
				redirect("student/packages");
			}
		}else{
			redirect("user/login");
		}

		
	}
	/**********************************************************************************/
	
	//Geth the Instructor list
	function instructor_list($page = null){
		$this->load->library('Ajax_pagination');
        if(!$page){
            $offset = 0;
        }else{
            $offset = $page;
        }
	
        //total rows count
        $totalRec = $this->School_model->getInstructorRows();
        
        //pagination configuration
        $config['first_link']  = 'First';
        $config['div']         = 'results'; //parent div tag id
        $config['base_url']    = base_url().'instructor/instructor_list';
        $config['total_rows']  = $totalRec;
        $config['per_page']    = $this->perPage;
        
        $this->ajax_pagination->initialize($config);
        
        //get the posts data
        $data['records'] = $this->School_model->getAllInstructor(array('start'=>$offset,'limit'=>$this->perPage));
        
        //load the view
        $this->load->view('ajax_school_instructor', $data, false);
    }
	/*************************************************************************************/

	
	
	//about school
	function profile($school_id = null){
		if($this->session->userdata('logged_in') && $this->session->userdata('logged_in')['role'] == $this->config->item('school_role')){
			$school_id = $this->session->userdata('logged_in')['id'];
		}
		if($school_id != ''){
			$result = $this->School_model->getSchoolInformation($school_id);
			$data = array('result'=>$result);
			if($this->session->userdata('logged_in')){
				$this->load->view('header_inner');
			}else{
				$this->load->view('header');
			}
			$this->load->view('school_profile',$data);
			$this->load->view('footer');
			
		}else{
			redirect('school');
		}
	}
	/**********************************************************************************/
	
	//Student schedule his/her appointment
	function scheduling($instructor_id = null){
	
		if($this->session->userdata('logged_in') && $this->session->userdata('logged_in')['role'] == $this->config->item('student_role')){
			if($this->input->post('instructor_id')){
				$instructor_id = $this->input->post('instructor_id');
			}
			$package_id = $this->session->userdata('package_id');
			$school_id = $this->session->userdata('school_id');
			
			if($instructor_id != '' && $package_id != '' && $school_id != ''){ 
				
				$this->session->set_userdata('instructor_id',$instructor_id);	
				
				if($this->input->post('search_date')){
					$searchDate = $this->input->post('search_date');
				}else{
					$searchDate = date("m-d-Y");
				}
	
				$data['instructor_id'] = $instructor_id;
				$data['package_id'] = $package_id;
				$data['start_date'] = $searchDate;
				$records = $this->School_model->checkAvailabilityDate($searchDate);
				if($records != ''){ 
					$pkgRecords = $this->School_model->getInstructorPackage($school_id, $package_id);
					if(isset($pkgRecords->observation_hours) && $pkgRecords->observation_hours !='' && $pkgRecords->behind_wheel_hours != ''){
						$data['flag']= 'true';
					}
					$data['start_time'] = date("H",strtotime($records->start_time));
					$data['end_time'] =  date("H",strtotime($records->end_time))+1;
					
				}else{
					$data['start_time'] =  0;
					$data['end_time'] = 0;
					$data['error'] = "Instructor is not available for this date. Please schedule your appointment for another date.";
				}
				$this->load->view('header_inner');
				$this->load->view('student_schedule', $data);
				$this->load->view('footer');
				
			}else{
				redirect("school/instructor");
			}
		}else{
			redirect("user/login");
		}
	}
	/**********************************************************************************/

	//get instructor schedule fro 1 week
	function get_schedule(){

		if($this->session->userdata('instructor_id') && $this->session->userdata('logged_in') && $this->session->userdata('logged_in')['role'] == $this->config->item('student_role')){
			 $result = $this->School_model->getSchedule();
			if($result != '' && count($result) >0 ){
				echo $record =  json_encode($result);
			}
			
		}
	}
	/****************************************************************************/
	
	//save schedule of student
	function save_schedule(){
		if($this->session->userdata('instructor_id') && $this->session->userdata('logged_in') && $this->session->userdata('logged_in')['role'] == $this->config->item('student_role')){
			 $this->School_model->saveSchedule();
		}
	}
	/******************************************************************************/
	
	//update schedule of student
	function update_schedule(){
		if($this->session->userdata('instructor_id') && $this->session->userdata('logged_in') && $this->session->userdata('logged_in')['role'] == $this->config->item('student_role')){
			echo $this->School_model->updateSchedule();
		}
	}
	/******************************************************************************/

	//delete schedule by student
	function delete_schedule(){
		if($this->session->userdata('instructor_id') && $this->session->userdata('logged_in') && $this->session->userdata('logged_in')['role'] == $this->config->item('student_role')){
			echo $this->School_model->deleteSchedule();
		}
	}
	/******************************************************************************/

	//check available schedule of instructor
	function check_schedule(){
		if($this->session->userdata('instructor_id') && $this->session->userdata('logged_in') && $this->session->userdata('logged_in')['role'] == $this->config->item('student_role')){
			echo $this->School_model->checkSchedule();
		}
	}
	/******************************************************************************/


	//Booking package by student
	function booking(){
		if($this->session->userdata('logged_in') && $this->session->userdata('logged_in')['role'] == $this->config->item('student_role')){
			if($this->input->post('school_id') && $this->input->post('package_id')){
				$this->session->set_userdata('package_type',$this->config->item('school_role'));
				$this->session->set_userdata('school_id',$this->input->post('school_id'));
				$this->session->set_userdata('package_id',$this->input->post('package_id'));

				$data = array();
				$result = $this->School_model->checkPackage($this->input->post('school_id'),$this->input->post('package_id'));
				if($result == false){
					$records = $this->School_model->getSchoolPackage($this->input->post('school_id'),$this->input->post('package_id'));
					$data['records'] = $records;
					$this->session->set_userdata('package_price',$records[0]['package_price']);
				}else{
					$data['error'] = $result;
				}
				
				$this->load->view('header_inner');
				$this->load->view('package_booking', $data);
				$this->load->view('footer');
			}else{
				redirect("school");
			}
		}else{
			redirect("user/login");
		}
	}
	/******************************************************************************/
	
	
	//Deduct the payment for booked package
	function payment(){
		if($this->session->userdata('logged_in') && $this->session->userdata('logged_in')['role'] == $this->config->item('student_role')){
			//if($_SERVER['HTTP_REFERER'] == base_url()."instructor/booking"){
				$data['state'] =  showStateList('USA',true);
				$data['role'] = 'school';
				$data['payment_amount'] = $this->session->userdata('package_price');
				$school_id = $this->session->userdata('school_id');
				$details = $this->School_model->checkAccountDetails($school_id);
				$this->load->view('header_inner');
				if(count($details) > 0){
					if($this->input->post('submit')== 'Book'){
						$this->load->helper('payment');
						$PayPalResult = do_user_payment($details['username'], $details['password'], $details['signature']);
						if(!$this->paypal_pro->APICallSuccessful($PayPalResult['ACK'])){
							$errors = array('errors'=>$PayPalResult['ERRORS']);
							$this->load->view('paypal_error',$errors);
						}else{
							$message = $this->School_model->packageBooking();//Book Package
							// Successful call.  Load view or whatever you need to do here.
							$data = array('PayPalResult'=>$PayPalResult);
							$data['role'] = 'user';
							$this->load->view('paypal_success',$data);
						}
					}else {
						$this->load->view('user_payment', $data);
					}
					$this->load->view('footer');
				}else{
					redirect("school");
				}
				
				
		}else{
			redirect("user/login");
		}
		/*if($this->session->userdata('logged_in') && $this->session->userdata('logged_in')['role'] == $this->config->item('student_role')){
			if($_SERVER['HTTP_REFERER'] == base_url()."school/booking"){
				$data = array();
				$message = $this->School_model->packageBooking();//payment
				$data['message'] = $message;
				$this->load->view('header_inner');
				$this->load->view('payment', $data);
				$this->load->view('footer');
			}else{
				redirect("school");
			}

		}else{
			redirect("user/login");
		}*/
	}
	/******************************************************************************/
	

	//School Registration
	public function register()
	{
			$data = array();
		
			$data['country'] = showCountryList();
			$default = 'USA'; 
			if($this->input->post('country')){
				$default = $this->input->post('country');
			}
			$data['state'] =  showStateList($default,true);
			$this->form_validation->set_rules("school_name", "School Name", "trim|required");
			$this->form_validation->set_rules("username", "Username", "trim|required|is_unique[tbl_school.username]");
			$this->form_validation->set_rules("password", "Password", "trim|required|matches[confirm_password]");
			$this->form_validation->set_rules("confirm_password", "Confirm Password", "trim|required");
			$this->form_validation->set_rules("email", "Email Address", "trim|required|valid_email|matches[confirm_email]|is_unique[tbl_school.email]");
			$this->form_validation->set_rules("confirm_email", "Confirm Email Address", "trim|required|valid_email");
			$this->form_validation->set_rules("phone", "Phone", "trim|required|regex_match[/^[0-9]+$/]|xss_clean");
			$this->form_validation->set_rules("state", "State", "trim|required");
			$this->form_validation->set_rules("city", "City", "trim|required");
			$this->form_validation->set_rules("zip_code", "Zip Code", "trim|required|numeric");
			
			$this->form_validation->set_error_delimiters('<p class="error">', '</p>');

			if ($this->form_validation->run() == True){
				$random_code =  $this->School_model->saveSchoolDetails();
				$data['message'] = activateAccount($random_code,'school');
			}
			$this->load->view('header');
			$this->load->view('school_register', $data);
			$this->load->view('footer');
		
	}
	//End

	/**
		* Activate user account
	**/
	function activate($user_id, $random_code){
		$data = array();
		if(!empty($user_id)){
			$this->School_model->updateStatus($user_id, $random_code);
			$data['message'] = "Your account has been activated.";
		}else{
			$data['message'] = "Sorry there is something wrong";
		}
		$this->load->view('header');
		$this->load->view('account_activation', $data);
		$this->load->view('footer');

	}
	/**************************************************************************/

	/**
		* School profile page
	**/
	/*function profile(){
		$data = array();
		if($this->session->userdata('logged_in') && $this->session->userdata('logged_in')['role'] == $this->config->item('school_role')){
			$data = $this->School_model->getSchoolData();
			$this->load->view('header_inner');
			$this->load->view('school_profile', $data);
			$this->load->view('footer');
		}else{
			redirect("user/login");
		}
	}*/
	/**************************************************************************/

	
	//Update Profile
	function edit_profile(){
		$data = array();
		$count = 0;
		if($this->session->userdata('logged_in') && $this->session->userdata('logged_in')['role'] == $this->config->item('school_role')){
			$data = $this->School_model->getSchoolData();
			$data['default_country'] = showCountryList();
			$data['default_state'] =  showStateList('USA',true);
			$this->checkEmail();
			$path = '../assets/js/ckfinder';
			$width = '530px';
			editor($path, $width);
	
			if ($this->input->post('submit') == "Update"){
				$file_name = '';
				$this->form_validation->set_rules("email", "Email Address", "trim|required|valid_email|callback_checkEmail");
				$this->form_validation->set_rules("phone", "Phone", "trim|required|regex_match[/^[0-9]+$/]|xss_clean");
				$this->form_validation->set_rules("state", "State", "required");
				$this->form_validation->set_rules("city", "City", "trim|required");
				$this->form_validation->set_rules("zip_code", "Zip Code", "trim|required|numeric");
				$this->form_validation->set_error_delimiters('<p class="error">', '</p>');
				if ($this->form_validation->run() == True)
				{
					//image upload
					$file_name = uploadImages('school', $this->config->item('school_image_path'));
					//end
					$this->School_model->updateSchool($file_name);
					redirect("school/profile");
				}
			}

			$this->load->view('header_inner');
			$this->load->view('school_edit_profile', $data);
			$this->load->view('footer');
		}else{
			redirect("user/login");
		}
	 }
	/**************************************************************************/
	
	
	
	//Check email exists or not in database
	  public function checkEmail(){
		 
		  $result = $this->School_model->getSchoolByEmail();
	
		  if ($result->num_rows > 0 ){
			$this->form_validation->set_message('checkEmail', 'Email already exists. Please enter another Email.');
			return FALSE;
		  }else{
			return TRUE;
		  }
	}
	
	/**************************************************************************/


	//Update User data
	function updateSchool(){

		if($this->session->userdata('logged_in') && $this->session->userdata('logged_in')['role'] == $this->config->item('school_role')){
			$school_id = $this->session->userdata('logged_in')['id'];
			$schoolData=array('email'=>$this->input->post('email'),'phone_no'=>$this->input->post('phone'), 'updated_date'=>date('Y-m-d H:i:s'));

			$addressData=array('address1'=>$this->input->post('address1'),'address2'=>$this->input->post('address2'),'city'=>$this->input->post('city'),'country'=>$this->input->post('country'),'state'=>$this->input->post('state'),'zip_code'=>$this->input->post('zip_code'));

			$this->db->where('school_id',$school_id);
			$this->db->update($this->tbl_school,$schoolData);

			$this -> db -> select('address_id');
			$this -> db -> from($this->tbl_school_address);
			$this -> db -> where('school_id =', $school_id);
			$this -> db -> limit(1);
			$result  = $this->db->get()->result_array();
			$address_id = $result[0]['address_id'];
			
			$this->db->where('address_id',$address_id);
			$this->db->update($this->tbl_address,$addressData);

			return true;
		}
	}
	/**************************************************************************/


	//Update Password
	function update_password(){
		$data = array();
		if($this->session->userdata('logged_in') && $this->session->userdata('logged_in')['role'] == $this->config->item('school_role')){
			if ($this->input->post('submit') == "Change Password"){
				$this->form_validation->set_rules("old_password", "Password", "trim|required|callback_checkPassword");
				$this->form_validation->set_rules("new_password", "Password", "trim|required|matches[cnf_password]");
				$this->form_validation->set_rules("cnf_password", "Confirm Password", "trim|required");
				$this->form_validation->set_error_delimiters('<p class="error">', '</p>');
				if ($this->form_validation->run() == True)
				{
					$this->School_model->updatePassword();
					$data['message']="Your password has been updated successfully";
				}
			}
			$this->load->view('header_inner');
			$this->load->view('update_school_password',$data);
			$this->load->view('footer');
		}else{
			redirect("user/login");
		}
		
	}
	/**************************************************************************/

	/**
		* Check Existing Password
	**/
	public function checkPassword(){
		  $result = $this->School_model->checkPassword();
		  if ($result->num_rows < 1 )
		  {
			$this->form_validation->set_message('checkPassword', 'Please enter correct old password');
			return FALSE;
		  }else{
			return TRUE;
		  }	
	}
	/**************************************************************************/
	/************************************ Booked package by student ****************************************************/
	//Booked package by student
	function booked_package($package_type){
		$this->load->helper('flexigrid');
		if($this->session->userdata('logged_in') && ($this->session->userdata('logged_in')['role'] == $this->config->item('school_role')) && $package_type !=''){
			$this->session->set_userdata('package_type',$package_type);
			$colModel['name'] = array('Student Name',200,TRUE,'center',0);
			$colModel['package_hours'] = array('Package',518,TRUE,'center',1);
			$colModel['status'] = array('Package Price',200,TRUE,'center',1);
			$colModel['status1'] = array('Package Status',209,TRUE,'center',1);
			
			
			$gridParams = array(
			'width' => 'auto',
			'height' => 'auto',
			'rp' => 15,
			'rpOptions' => '[10,15,20,25,40]',
			'pagestat' => 'Displaying: {from} to {to} of {total} items.',
			'blockOpacity' => 0.5,
			'title' => 'List of Booked Packages',
			'showTableToggleBtn' => true
			);
			

			$grid_js = build_grid_js('flex1',site_url("/school/booked_package_list"),$colModel,'tbl_school_'.$package_type.'_booking.status','desc',$gridParams,'');
			$data['js_grid'] = $grid_js;
			
			$this->load->view('flexigrid_header');
			$this->load->view('package', $data);
			$this->load->view('footer');
		}else{
			redirect("user/login");
		}
	}
	/**********************************************************************************/
	
	//Get the booked package list via ajax
	function booked_package_list($page = null){
		$this->load->library('flexigrid');
		$package_type = $this->session->userdata('package_type');
		
        $valid_fields = array(
            'package_id',
            'first_name',
            'last_name',
			'status',
			'status'
        );
        
        $this->flexigrid->validate_post('tbl_school_'.$package_type.'_booking.status', 'asc', $valid_fields);
        $records  = $this->School_model->getBookedPackageRows();
        $this->output->set_header($this->config->item('json_header'));
        
        $record_items = array();
        foreach ($records['records']->result() as $row) {
			$pkg = '';
			if($package_type == 'teen'){
					$pkg .=  "Class Session ". $row->start_date ." - ". $row->start_date." (". date("h:i:s A",strtotime($row->start_time)) ."-".date("h:i:s A",strtotime($row->end_time)).")</br>";
					$observation = '';
					if($row->observation_hours != ''){
						$observation =  number_format((float) $row->observation_hours, 2, '.', '');
					}
					$behind_wheel = '';
					if($row->behind_wheel_hours != ''){
						$behind_wheel =  number_format((float) $row->behind_wheel_hours, 2, '.', '');
					}
					$pkg .= 'Observation hours:'. $observation.'</br>';
					$pkg .= 'Behind Wheel Hours:'.$behind_wheel;	
			}else{
				$pkg = 'Package Hours:'. number_format((float) $row->package_hours, 2, '.', '');
				
			}
			$name = '';
			if($row->middle_name != ''){
				$name = $row->first_name.' '.$row->middle_name. ' '.$row->last_name;
			}else{
				$name = $row->first_name.' '.$row->last_name;
			}
			$record_items[] = array(
				$row->package_id,
				$name,
				'<a href="'.base_url().'school/package_details/'.$row->package_id.'/'.$row->user_id.'">'.$pkg.'</a>',
				$row->package_price,
				$row->status
			);
        }
        $this->output->set_output($this->flexigrid->json_build($records['record_count'], $record_items, $records['footmsg']));
    }
	/*************************************************************************************/

	function package_details($package_id, $student_id){
		$this->load->helper('flexigrid');
		if($this->session->userdata('logged_in') && ($this->session->userdata('logged_in')['role'] == $this->config->item('school_role')) && $package_id !=''){
			$this->session->set_userdata('package_id',$package_id);
			$this->session->set_userdata('student_id',$student_id);
			$colModel['start_date'] = array('Start Date',180,TRUE,'center',1);
			$colModel['end_date'] = array('End Date',180,TRUE,'center',1);
			$colModel['start_time'] = array('Start Time',180,TRUE,'center',1);
			$colModel['end_time'] = array('End Time',180,TRUE,'center',1);
			$colModel['name'] = array('Instructor Name',409,TRUE,'center',0);
			
			$gridParams = array(
			'width' => 'auto',
			'height' => 'auto',
			'rp' => 15,
			'rpOptions' => '[10,15,20,25,40]',
			'pagestat' => 'Displaying: {from} to {to} of {total} items.',
			'blockOpacity' => 0.5,
			'title' => 'Details of Booked Package',
			'showTableToggleBtn' => true
			);
			
			$grid_js = build_grid_js('flex1',site_url("/school/package_detail_list"),$colModel,'tbl_user.user_id','desc',$gridParams,'');
			$data['js_grid'] = $grid_js;
			
			$this->load->view('flexigrid_header');
			$this->load->view('package', $data);
			$this->load->view('footer');
		}else{
			redirect("user/login");
		}
	}
	/**********************************************************************************/
	
	//Get the booked package list via ajax
	function package_detail_list($page = null){
		$this->load->library('flexigrid');
		$package_id = $this->session->userdata('package_id');
		$package_type = $this->session->userdata('package_type');
		
        $valid_fields = array(
            'booking_id',
            'name',
            'start_date',
			'end_date',
			'start_time',
			'end_time'
        );
        
        $this->flexigrid->validate_post('tbl_school_'.$package_type.'_booking.status', 'asc', $valid_fields);
        $records  = $this->School_model->getPackageDetails();
        $this->output->set_header($this->config->item('json_header'));
        
        $record_items = array();
        foreach ($records['records']->result() as $row) {
			$name = '';
			if($row->middle_name != ''){
				$name = $row->first_name.' '.$row->middle_name. ' '.$row->last_name;
			}else{
				$name = $row->first_name.' '.$row->last_name;
			}
			
			$record_items[] = array(
				$row->booking_id,
				date('m-d-Y',strtotime($row->start_date)),
				date('m-d-Y',strtotime($row->end_date)),
				date('h:i A',strtotime($row->start_date)),
				date('h:i A',strtotime($row->end_date)),
				$name
			);
        }
        $this->output->set_output($this->flexigrid->json_build($records['record_count'], $record_items, $records['footmsg']));
    }
	
	
	/**
	* Payment to enroll unlimited student by instructor
	**/
	function pay(){
		if($this->session->userdata('logged_in') && $this->session->userdata('logged_in')['role'] == $this->config->item('school_role')){
			$data['payment_amount'] = $this->config->item('payment_for_school');
			$data['role'] =  'school';
			$data['state'] =  showStateList('USA',true);
			$this->load->view('header_inner');
			$checkPayment = $this->School_model->checkPaymentDetails();
			if($checkPayment == true){
				$data['message'] = 'You have access to enrol unlimited users';
				$this->load->view('paypal_success',$data);
			}else if($this->input->post('submit')== 'Book'){
				$this->load->helper('payment');
				$PayPalResult = do_direct_payment();
				if(!$this->paypal_pro->APICallSuccessful($PayPalResult['ACK'])){
					$errors = array('Errors'=>$PayPalResult['ERRORS']);
					$this->load->view('paypal_error',$errors);
				}else{
					$this->School_model->savePayment();
					// Successful call.  Load view or whatever you need to do here.
					$data = array('PayPalResult'=>$PayPalResult);
					$this->load->view('paypal_success',$data);
				}		
			}else{
				$this->load->view('payment', $data);
			}
			$this->load->view('footer');
		}else{
			redirect("user/login");
		}
	
	}
	/**************************************************************************/
	
	function account_details(){
		if($this->session->userdata('logged_in') && $this->session->userdata('logged_in')['role'] == $this->config->item('school_role')){	
			$data= array('role'=>'school');
			$accountExists = $this->School_model->checkAccountDetails();
			if(count($accountExists)> 0){
				$data['username'] =  $accountExists['username'];
				$data['password'] =  $accountExists['password'];
				$data['signature'] = $accountExists['signature'];
			}		
			if ($this->input->post('submit') == "Submit"){
				$this->form_validation->set_rules("username", "First Name", "trim|required|is_unique[tbl_school_payment_detail.school_id]");
				$this->form_validation->set_rules("password", "First Name", "trim|required");
				$this->form_validation->set_rules("signature", "First Name", "trim|required");
				if ($this->form_validation->run() == True){	
					$accountExists = $this->School_model->checkAccountDetails();
					if(count($accountExists)> 0){
						$details = $this->School_model->accountDetails(true);	
						if($details == true){
							$data['message'] = "Your Account Detail has been updated successfully";
						}
						
					}else{
						$details = $this->School_model->accountDetails();	
						if($details == true){
							$data['message'] = "Your Account Detail has been saved successfully";
						}
					}
				}
			}
			if($this->session->userdata('logged_in')){
				$this->load->view('header_inner');
			}else{
				$this->load->view('header');
			}
			
			$this->load->view('account_details', $data);
			$this->load->view('footer');
		}else{
			redirect("user/login");
		}
	}
	/*************************************************************************************/
	
}

/* End of file user.php */
