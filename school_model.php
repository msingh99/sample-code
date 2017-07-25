<?php
class School_model extends CI_Model {
	private $tbl_user = 'tbl_user';
	private $tbl_school_address = 'tbl_school_address';
	private $tbl_school = 'tbl_school';
	private $tbl_address = 'tbl_address';
	private $tbl_adult_package = 'tbl_adult_package';
	private $tbl_school_adult_package = 'tbl_school_adult_package';
	
	public $CI;

	function __construct(){
		parent::__construct();
		$this->CI =& get_instance();
	}
	  
	/*******************************************************************************/
	function saveSchoolDetails(){
		$randomCode = generateRandomCode();

		$schoolData = array(
		'school_name' =>$this->input->post("school_name"),
		'username' =>$this->input->post("username"),
		'password' =>base64_encode($this->input->post("password")),
		'email' =>$this->input->post("email"),
		'phone_no' =>$this->input->post("phone"),
		'status'=>$this->config->item('active'),
		'random_code'=>$randomCode,
		'created_date'=>date('Y-m-d H:i:s'),
		'updated_date'=>date('Y-m-d H:i:s')
		);

		$this->db->insert($this->tbl_school, $schoolData);
		$school_id =  $this->db->insert_id();
		
		$addressData = array(
		'address1' =>$this->input->post("address1"),
		'address2' =>$this->input->post("address2"),
		'country' =>$this->input->post("country"),
		'state' =>$this->input->post("state"),
		'city' =>$this->input->post("city"),
		'zip_code' =>$this->input->post("zip_code")
		);

		$this->db->insert($this->tbl_address, $addressData);
		$address_id =  $this->db->insert_id();

		$userAddressData = array('address_id'=>$address_id, 'school_id'=>$school_id);
		$this->db->insert($this->tbl_school_address, $userAddressData);

		$return = array('user_id'=>$school_id, 'random_code'=>$randomCode, 'email'=>$this->input->post("email"));
		return $return;
	 }
	 /*******************************************************************************/

	 //Update status to activate account
	function updateStatus($user_id, $random_code){
		$data=array('status'=>$this->config->item('active'),'updated_date'=>date('Y-m-d H:i:s'));
		$this->db->where('school_id',$user_id);
		$this->db->where('random_code',$random_code);
		$this->db->update($this->tbl_school,$data);
	}
	/*******************************************************************************/

	//Resend mail to user to activate the account
	function resendMail(){
		
		$this -> db -> select('user_id');
		$this -> db -> from($this->tbl_school);
		$this -> db -> where('email', $this->input->post('email'));
	    $this -> db -> limit(1);
		$result = $this -> db -> get()->result_array();	
		$user_id = $result[0]['user_id'];
		$random_code = generateRandomCode();

		$data=array('random_code'=>$random_code,'updated_date'=>date('Y-m-d H:i:s'));
		$this->db->where('user_id',$user_id);
		$this -> db -> where('role_id', $this->input->post('role'));
		$this->db->update($this->tbl_school,$data);

		$return = array('user_id'=>$user_id, 'random_code'=>$random_code, 'email'=>$this->input->post("email"));
		return $return;
	}
	/*******************************************************************************/

	function getSchoolData(){
		 $data = $this->session->userdata('logged_in');
		 $this -> db -> select('tbl_school.profile_picture,tbl_address.address1, tbl_school.description, tbl_address.address2, tbl_address.state, tbl_address.city, tbl_address.zip_code, tbl_address.country, tbl_school.username, tbl_school.email,tbl_school.phone_no, tbl_school.school_name, tbl_school.school_id');
         $this -> db -> from($this->tbl_school);
		 $this->db->join($this->tbl_school_address,'tbl_school_address.school_id = tbl_school.school_id');
		 $this->db->join($this->tbl_address,'tbl_address.address_id = tbl_school_address.address_id');
         $this -> db -> where('tbl_school.school_id', $data['id']);
		 $this -> db -> where('status', $this->config->item('active'));
         $this -> db -> limit(1);
		 
		 $result  = $this->db->get()->result_array();
		 
		 return  $result[0];
	}
	/*******************************************************************************/

	
	
	function getSchoolByEmail(){
		$data = $this->session->userdata('logged_in');
		$email = $this->input->post("email");
		$school_id = $data['id'];
		$this -> db -> select('school_id');
		$this -> db -> from($this->tbl_school);
	    $this -> db -> where('school_id !=', $school_id);
		$this -> db -> where('email', $this->input->post('email'));
	    $this -> db -> limit(1);
		$query = $this -> db -> get();		

		return $query;
	}
	/*******************************************************************************/

	function getSchoolInformation($school_id){
		 $this -> db -> select('tbl_address.address1, tbl_address.address2, tbl_address.state, tbl_address.city, tbl_address.zip_code, tbl_address.country, tbl_school.username, tbl_school.email,tbl_school.phone_no, tbl_school.school_name, tbl_school.school_id, tbl_school.description, tbl_school.profile_picture');
         $this -> db -> from($this->tbl_school);
		 $this->db->join($this->tbl_school_address,'tbl_school_address.school_id = tbl_school.school_id');
		 $this->db->join($this->tbl_address,'tbl_address.address_id = tbl_school_address.address_id');
         $this -> db -> where('tbl_school.school_id', $school_id);
		 $this -> db -> where('status', $this->config->item('active'));
         $this -> db -> limit(1);
		 $query  = $this->db->get();
		 $result = $query->row();
		 return  $result;
	}

	//Update school data
	function updateSchool($file_name = null){
		$data = $this->session->userdata('logged_in');
		$school_id = $data['id'];

		//add video
		if($this->input->post('video') && count($this->input->post('video')) > 0 ){
			$count = count($this->input->post('video'));
			for($i = 0; $i <$count; $i++){
				if($this->input->post('video')[$i] != ''){
					$videos = array(
					'owner_id' => $this->session->userdata('logged_in')['id'],
					'type' => 'school',
					'name' => $this->input->post('video')[$i],
					'video_type'=>'youtube'
					);

					$this->db->insert('tbl_video', $videos);
				}
			}
		}
		//end
		//delete video
		if($this->input->post('remove_videos') && $this->input->post('remove_videos')!='' ){
			$exploded = explode(",",$this->input->post('remove_videos'));
			for($i=0; $i < count($exploded); $i++){
				if($exploded[$i] != ''){
					$this -> db -> where('video_id', $exploded[$i]);
					$this -> db -> delete('tbl_video');
				}
			}
		}
		//end

		if($file_name != ''){
			$scoolData=array('profile_picture'=>$file_name,'description'=>$this->input->post('desc'),'email'=>$this->input->post('email'),'phone_no'=>$this->input->post('phone'), 'updated_date'=>date('Y-m-d H:i:s'));
		}else{
			$scoolData=array('description'=>$this->input->post('desc'),'email'=>$this->input->post('email'),'phone_no'=>$this->input->post('phone'), 'updated_date'=>date('Y-m-d H:i:s'));
		}
		$addressData=array('address1'=>$this->input->post('address1'),'address2'=>$this->input->post('address2'),'city'=>$this->input->post('city'),'country'=>$this->input->post('country'),'state'=>$this->input->post('state'),'zip_code'=>$this->input->post('zip_code'));
		$this->db->where('school_id',$school_id);
		$this->db->update($this->tbl_school,$scoolData);
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
	/*******************************************************************************/


	//Check password
	 function checkPassword(){
		$data = $this->session->userdata('logged_in');
		$this -> db -> select('school_id');
		$this -> db -> from($this->tbl_school);
	    $this -> db -> where('school_id =', $data['id']);
		$this -> db -> where('password',  base64_encode($this->input->post('old_password')));
	    $this -> db -> limit(1);
		$query = $this -> db -> get();		

		return $query;
	}
	/*******************************************************************************/


	//update password
	function updatePassword(){
		$data = $this->session->userdata('logged_in');
		$school_id = $data['id'];
		$data=array('password'=>base64_encode($this->input->post('new_password')),'updated_date'=>date('Y-m-d H:i:s'));
		$this->db->where('school_id',$school_id);
		$this->db->update($this->tbl_school,$data);
	}
	/*******************************************************************************/


	//Get the total number of school
	function getRows($params = array())
    {
         $this->db->select('count(tbl_school.school_id) as count');
         $this->db->from($this->tbl_school);
		 $this->db->join($this->tbl_school_address,'tbl_school_address.school_id = tbl_school.school_id');
		 $this->db->join($this->tbl_address,'tbl_address.address_id = tbl_school_address.address_id');
		 $this -> db -> where('status', $this->config->item('active'));
		 $searchRecords = '';
		 $searchRecords = $this->session->userdata('search');
		
        if(array_key_exists("start",$params) && array_key_exists("limit",$params)){
            $this->db->limit($params['limit'],$params['start']);
        }elseif(!array_key_exists("start",$params) && array_key_exists("limit",$params)){
            $this->db->limit($params['limit']);
        }
        $query = $this->db->get();
		$records = $query->result_array();
		
		if($records){
			return $records[0]['count'];
		}else{
			return false;
		}
    }
	/***********************************************************************************/

	//Get school package
	function getSchoolPackage($school_id, $package_id = null, $count=null, $student_type=null){
		if($student_type == null){
			$student_type = $this->config->item('adult_student_type');
			if($this->session->userdata('student_type') != ''){
				 $student_type = $this->session->userdata('student_type');
			}else{
				 $searchRecords = $this->session->userdata('search');
				 if(!empty($searchRecords) && count($searchRecords) > 0){
						$student_type = $searchRecords[0]['student_type'];
				}
			}
		}
		 $role = $this->session->userdata('logged_in')['role'];
		
		 $this->db->select('*');
		 if($student_type == $this->config->item('teen_student_type')){
			 $this->db->from($this->tbl_teen_package);
			 $this->db->join($this->tbl_school_teen_package,'tbl_school_teen_package.package_id = tbl_teen_package.package_id');
			 $this->db->join($this->tbl_class,'tbl_class.class_id = tbl_teen_package.class_id','left');
			 $this->db->join($this->tbl_observation,'tbl_observation.observation_id = tbl_teen_package.observation_id','left');
			 $this->db->join($this->tbl_behind_wheel,'tbl_behind_wheel.behind_wheel_id = tbl_teen_package.behind_wheel_id','left');
			 $this -> db -> where('tbl_school_teen_package.school_id', $school_id);
			 $this -> db -> where('tbl_teen_package.type',"$role" );
			 if($package_id != ''){
				 $this -> db -> where('tbl_teen_package.package_id', $package_id);
			 }
			 $this->db->order_by('tbl_teen_package.package_id','desc');
		 }else{
			 $this->db->from($this->tbl_adult_package);
			 $this->db->join($this->tbl_school_adult_package,'tbl_school_adult_package.package_id = tbl_adult_package.package_id');
			 $this -> db -> where('tbl_school_adult_package.school_id', $school_id);
			 $this -> db -> where('tbl_adult_package.type', "$role");
			 if($package_id != ''){
				 $this -> db -> where('tbl_adult_package.package_id', $package_id);
			 }
			 $this->db->order_by('tbl_adult_package.package_id','desc');

		 }
		 if($count != null){
			 $this->db->limit($count);
		 }
         $query = $this->db->get();
         return ($query->num_rows() > 0)?$query->result_array():FALSE;
	}
	/***************************************************************************************/

	function getAllInstructor($params){
		$searchDate = convertDateFormat($this->session->userdata('search_date'));
		
		 $this->db->select('tbl_driving_licence.driving_licence_number,description, first_name, tbl_user.user_id, tbl_school_instructor.school_id, last_name, middle_name, email, phone_no, sex, address1, address2, country, state, city, zip_code, tbl_available_time.start_date, tbl_available_time.end_date, profile_picture');
         $this->db->from($this->tbl_school_instructor);
		 $this->db->join($this->tbl_user,'tbl_user.user_id = tbl_school_instructor.user_id');
		 $this->db->join($this->tbl_driving_licence,'tbl_driving_licence.user_id = tbl_user.user_id');
		 $this->db->join($this->tbl_available_time,'tbl_available_time.user_id = tbl_user.user_id');
		 $this->db->join($this->tbl_user_address,'tbl_user_address.user_id = tbl_user.user_id');
		 $this->db->join($this->tbl_address,'tbl_address.address_id = tbl_user_address.address_id');
		 $this -> db -> where('tbl_school_instructor.school_id', $this->session->userdata('school_id'));
		 $this -> db -> where('tbl_user.status', $this->config->item('active'));
		 $this->db->where('tbl_available_time.start_date <=', $searchDate);
	     $this->db->where('tbl_available_time.end_date >=', $searchDate);  
		 $this->db->group_by('tbl_available_time.user_id');
        
         if(array_key_exists("start",$params) && array_key_exists("limit",$params)){
            $this->db->limit($params['limit'],$params['start']);
         }elseif(!array_key_exists("start",$params) && array_key_exists("limit",$params)){
            $this->db->limit($params['limit']);
         }
        
        $query = $this->db->get();

        return ($query->num_rows() > 0)?$query->result_array():FALSE;
		
	}
	/*************************************************************************/
	
	
	//Get the total number of school
	function getInstructorRows($params = array())
    {
		 $searchDate = convertDateFormat($this->session->userdata('search_date'));
         $this->db->select('count(tbl_user.user_id) as count');
         $this->db->from($this->tbl_school_instructor);
		 $this->db->join($this->tbl_user,'tbl_user.user_id = tbl_school_instructor.user_id');
		 $this->db->join($this->tbl_available_time,'tbl_available_time.user_id = tbl_user.user_id');
		 $this -> db -> where('tbl_school_instructor.school_id', $this->session->userdata('school_id'));
		 $this -> db -> where('tbl_user.status', $this->config->item('active'));
		 $this->db->where('tbl_available_time.start_date <=', $searchDate);
	     $this->db->where('tbl_available_time.end_date >=', $searchDate); 
		 $this->db->group_by('tbl_available_time.user_id');
		 
        
        if(array_key_exists("start",$params) && array_key_exists("limit",$params)){
            $this->db->limit($params['limit'],$params['start']);
        }elseif(!array_key_exists("start",$params) && array_key_exists("limit",$params)){
            $this->db->limit($params['limit']);
        }
        $query = $this->db->get();
		$records = $query->result_array();
		
		if($records){
			return $records[0]['count'];
		}else{
			return false;
		}
    }
	/***********************************************************************************/
	
	
	//Get schedule of instructor for 1 week
	function getSchedule(){
		if($this->input->post('start_date')){
			$start_date = convertDateFormat($this->input->post('start_date'));
		}else{
			$start_date = convertDateFormat(date("m-d-Y"));
		}

		if($this->session->userdata('student_type') == $this->config->item('teen_student_type')){
			$sql = "select tbl_school_booking.id , start_date, end_date, IF(tbl_school_booking.user_id = ".$this->session->userdata('logged_in')['id'].",'','true') as type, IF(tbl_school_booking.user_id = ".$this->session->userdata('logged_in')['id'].",'Booked by you','Booked by another user') as title from tbl_school_booking left join
			tbl_school_teen_booking on tbl_school_teen_booking.booking_id = tbl_school_booking.booking_id left join  tbl_school_teen_package on  tbl_school_teen_package.package_id = tbl_school_teen_booking.school_package_id WHERE tbl_school_teen_package.school_id=".$this->session->userdata('school_id')." and tbl_school_booking.instructor_id= ".$this->session->userdata('instructor_id')." and    ( STR_TO_DATE('". date('Y-m-d H:i:s',strtotime($start_date))."', '%Y-%m-%d') BETWEEN STR_TO_DATE(start_date,'%Y-%m-%d') and STR_TO_DATE(end_date,'%Y-%m-%d'))";
		}else{
			$sql = "select tbl_school_booking.id , start_date, end_date, IF(tbl_school_booking.user_id = ".$this->session->userdata('logged_in')['id'].",'','true') as type, IF(tbl_school_booking.user_id = ".$this->session->userdata('logged_in')['id'].",'Booked by you','Booked by another user') as title from tbl_school_booking left join
			tbl_school_adult_booking on tbl_school_adult_booking.booking_id = tbl_school_booking.booking_id left join tbl_school_adult_package on  tbl_school_adult_package.package_id = tbl_school_adult_booking.school_package_id WHERE tbl_school_adult_package.school_id=".$this->session->userdata('school_id')." and tbl_school_booking.instructor_id= ".$this->session->userdata('instructor_id')." and    ( STR_TO_DATE('". date('Y-m-d H:i:s',strtotime($start_date))."', '%Y-%m-%d') BETWEEN STR_TO_DATE(start_date,'%Y-%m-%d') and STR_TO_DATE(end_date,'%Y-%m-%d'))";
		}

		$record = $this->db->query($sql);
		$result  = $record->result_array();
		return $result;
	}
	/*****************************************************************************/

	//save shedule of student
	function saveSchedule(){
		$totalBookedHours = $totalPackageHours = '';
		$package_type = 0;
		$type = $this->config->item('school_role');
		if($this->input->post('package_type') != ''){
			$package_type = $this->input->post('package_type');
		}
		if($this->session->userdata('student_type') == $this->config->item('adult_student_type')){
			$sql = "SELECT tbl_school_adult_booking.booking_id FROM  tbl_school_adult_booking join tbl_school_adult_package on tbl_school_adult_package.package_id = tbl_school_adult_booking.school_package_id
			where tbl_school_adult_package.package_id=".$this->session->userdata('package_id');
		}else{
			$sql = "SELECT tbl_school_teen_booking.booking_id FROM  tbl_school_teen_booking join tbl_school_teen_package on tbl_school_teen_package.package_id = tbl_school_teen_booking.school_package_id
			where tbl_school_teen_package.package_id=".$this->session->userdata('package_id');
			$query = $this->db->query($sql);
		}
		$query = $this->db->query($sql);
		if($query->num_rows() > 0){
			$records  = $query->row();
			$booking_id = $records->booking_id;
		}
		
		$bookingData = array(
		'booking_id'=>$booking_id,
		'start_date' =>date( "Y-m-d H:i:s", strtotime($this->input->post('start_date'))),
		'end_date' =>date( "Y-m-d H:i:s", strtotime($this->input->post('end_date'))),
		'user_id' =>$this->session->userdata('logged_in')['id'],
		'instructor_id'=>$this->session->userdata('instructor_id'),
		'package_type'=>$package_type,
		'student_type'=>$this->session->userdata('student_type')
		);
		$this->db->insert($this->tbl_school_booking, $bookingData);
		
		if($this->session->userdata('student_type') == $this->config->item('teen_student_type')){
			 $sql = "select addtime(behind_wheel_hours, observation_hours) as package_hours from tbl_teen_package join tbl_behind_wheel on tbl_teen_package.behind_wheel_id = tbl_behind_wheel.behind_wheel_id join tbl_observation 
			 on tbl_teen_package.observation_id = tbl_observation.observation_id join  tbl_school_teen_package 
			 on  tbl_school_teen_package.package_id = tbl_teen_package.package_id join tbl_school_teen_booking on tbl_school_teen_booking.school_package_id = tbl_school_teen_package.package_id
			 where tbl_teen_package.type= '".$type."' and tbl_school_teen_booking.user_id = ".$this->session->userdata('logged_in')['id']." and 
			 tbl_school_teen_package.package_id = ".$this->session->userdata('package_id');
			 $query = $this->db->query($sql);
			 if($query->num_rows() > 0){
				 $records  = $query->row();
				 $totalPackageHours = strtotime($records->package_hours);
				 
				 $bookedSql = 'select DATE_FORMAT(tbl_school_booking.start_date, "%H:%i:%s") as start_date,DATE_FORMAT(tbl_school_booking.end_date, "%H:%i:%s") as end_date, IF(SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(end_date,start_date)))) IS NULL,0,SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(end_date,start_date))))) AS total_hour, tbl_school_teen_package.package_id, tbl_school_teen_booking.booking_id from tbl_school_teen_booking left join tbl_school_booking on tbl_school_booking.booking_id = tbl_school_teen_booking.booking_id left join tbl_school_teen_package on tbl_school_teen_package.package_id =  tbl_school_teen_booking.school_package_id  where tbl_school_booking.user_id='.$this->session->userdata('logged_in')['id'].' and tbl_school_teen_package.package_id ='.$this->session->userdata('package_id').' and tbl_school_teen_package.type="'.$type.'" group by tbl_school_teen_package.package_id ';
				 $bookedQuery = $this->db->query($bookedSql);
				 if($bookedQuery->num_rows() > 0){
					$bookedResult  = $bookedQuery->row();
					$totalBookedHours = strtotime($bookedResult->total_hour);
				 } 
			 }
			 $tbl = $this->tbl_school_teen_booking;
		}else{
			$tbl = $this->tbl_school_adult_booking;
			$sql = 'select total_hour, package_hours,tbl_adult_package.package_id from tbl_school_adult_booking join (select tbl_school_adult_booking.booking_id, DATE_FORMAT(tbl_school_booking.start_date, "%H:%i:%s") as start_date,
				DATE_FORMAT(tbl_school_booking.end_date, "%H:%i:%s") as end_date, IF(SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(end_date,start_date)))) IS NULL,0,SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(end_date,start_date))))) AS total_hour, 
				tbl_school_adult_package.package_id from tbl_school_booking left join tbl_school_adult_booking on tbl_school_booking.booking_id = tbl_school_adult_booking.booking_id left join tbl_school_adult_package 
				on tbl_school_adult_package.school_package_id =  tbl_school_adult_booking.school_package_id where tbl_school_booking.user_id='.$this->session->userdata('logged_in')['id'].'  
				and tbl_school_adult_package.package_id = '.$this->session->userdata('package_id').'  group by tbl_school_adult_package.package_id) as new_tbl on new_tbl.booking_id = tbl_school_adult_booking.booking_id 
				join tbl_school_adult_package on tbl_school_adult_package.package_id =  tbl_school_adult_booking.school_package_id join tbl_adult_package on 
				tbl_adult_package.package_id = tbl_school_adult_package.package_id where tbl_adult_package.type= "'.$type.'" and tbl_adult_package.package_id='.$this->session->userdata('package_id').' and tbl_school_adult_booking.user_id='.$this->session->userdata('logged_in')['id'].' group by tbl_adult_package.package_id';
				
			 $query = $this->db->query($sql);
			 if($query->num_rows() > 0){
				$result  = $query->row();
				$totalBookedHours = strtotime($result->total_hour);
				$totalPackageHours = strtotime($result->package_hours);
			 }
		}
		
		if($totalPackageHours !='' && $totalBookedHours != '' && $totalPackageHours == $totalBookedHours){
			$this->db->where('booking_id',$booking_id);
			$this->db->update($tbl, array('status' =>'Booked'));
		}
		
		return true;
		
		
		
	}
	/*****************************************************************************/

	// check the available schedule
	function checkSchedule(){
		$totalBookedHours = $totalPackageHours = 0;
		$role = $this->config->item('school_role');
		$type = $where = '';
		$start_date = date( "Y-m-d H:i:s", strtotime($this->input->post('start_date')));
		$end_date = date( "Y-m-d H:i:s", strtotime($this->input->post('end_date')));
		
		if(strtotime($start_date) < strtotime(date('Y-m-d H:i:s'))){
			return "Please book an appointment for future date/time.";
		}

		if($this->input->post('id')){
			$id = $this->input->post('id');
			$where =' and tbl_school_booking.id != '.$id;
		}
		if($this->session->userdata('student_type') == $this->config->item('teen_student_type')){
			$sql = 'SELECT * FROM tbl_school_booking join tbl_school_teen_booking on tbl_school_teen_booking.booking_id= tbl_school_booking.booking_id join
					tbl_school_teen_package on  tbl_school_teen_package.package_id = tbl_school_teen_booking.school_package_id
					where tbl_school_teen_package.school_id="'.$this->session->userdata('school_id').'" and tbl_school_booking.instructor_id="'.$this->session->userdata('instructor_id').'" and (tbl_school_booking.start_date < "'.$end_date.'"  
					and tbl_school_booking.end_date > "'.$start_date.'")'.$where;
					
		}else{
			$sql = 'SELECT * FROM tbl_school_booking join tbl_school_adult_booking on tbl_school_adult_booking.booking_id= tbl_school_booking.booking_id join
					tbl_school_adult_package on  tbl_school_adult_package.package_id = tbl_school_adult_booking.school_package_id
					where tbl_school_adult_package.school_id="'.$this->session->userdata('school_id').'" and tbl_school_booking.instructor_id="'.$this->session->userdata('instructor_id').'" and (tbl_school_booking.start_date < "'.$end_date.'"  
					and tbl_school_booking.end_date > "'.$start_date.'") '.$where;
					
		}
		$record = $this->db->query($sql);
		
		if($record->num_rows() > 0){
			return 'This appointment schedule is not available.';
		}else{
			if($this->session->userdata('student_type') == $this->config->item('teen_student_type')){
				$package_type = $this->input->post('package_type');
				if($package_type == 0){
					$psql = "select tbl_behind_wheel.behind_wheel_hours as package_hours from tbl_behind_wheel join tbl_teen_package on tbl_teen_package.behind_wheel_id = tbl_behind_wheel.behind_wheel_id  join  tbl_school_teen_package 
					  on  tbl_school_teen_package.package_id = tbl_teen_package.package_id join tbl_school_teen_booking on tbl_school_teen_booking.school_package_id = tbl_school_teen_package.package_id
					  where tbl_school_teen_booking.user_id = ".$this->session->userdata('logged_in')['id']." and tbl_teen_package.type= '".$role."' and tbl_school_teen_package.package_id = ".$this->session->userdata('package_id');
				
				}else{
					$psql = "select tbl_observation.observation_hours as package_hours from tbl_observation join tbl_teen_package on tbl_teen_package.observation_id = tbl_observation.observation_id  join  tbl_school_teen_package 
					  on  tbl_school_teen_package.package_id = tbl_teen_package.package_id join tbl_school_teen_booking on tbl_school_teen_booking.school_package_id = tbl_school_teen_package.package_id
					  where tbl_school_teen_booking.user_id = ".$this->session->userdata('logged_in')['id']." and tbl_teen_package.type= '".$role."' and tbl_school_teen_package.package_id = ".$this->session->userdata('package_id');
				
				}
				$pquery = $this->db->query($psql);
				if($pquery->num_rows() > 0){
					$presult  = $pquery->row();
					$totalPackageHours = $presult->package_hours;
					$sql = 'select DATE_FORMAT(tbl_school_booking.start_date, "%H:%i:%s") as start_date,DATE_FORMAT(tbl_school_booking
						.end_date, "%H:%i:%s") as end_date, IF(SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(end_date,start_date)))) IS
						 NULL,0,SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(end_date,start_date))))) AS total_hour, tbl_school_teen_package
						.package_id, tbl_school_teen_booking.booking_id from tbl_school_booking left join tbl_school_teen_booking on tbl_school_booking
						.booking_id = tbl_school_teen_booking.booking_id left join tbl_school_teen_package on tbl_school_teen_package.package_id =  tbl_school_teen_booking.school_package_id  where  tbl_school_teen_package.package_id
						='.$this->session->userdata('package_id').' and tbl_school_booking.user_id='.$this->session->userdata('logged_in')['id'].' and tbl_school_teen_package.type="'.$type.'" '.$where.' group by tbl_school_teen_package.package_id ';
					$query = $this->db->query($sql);
					if($query->num_rows() > 0){
						$result  = $query->row();
						$totalBookedHours = $result->total_hour;
					}

				}
				$type = "Behind Wheel" ;
				if($package_type == '1'){
					$type = "Observation" ;
				}
			}else{
				
				$sql = 'select total_hour, package_hours,tbl_adult_package.package_id from tbl_school_adult_booking join (select tbl_school_adult_booking.booking_id, DATE_FORMAT(tbl_school_booking.start_date, "%H:%i:%s") as start_date,
				DATE_FORMAT(tbl_school_booking.end_date, "%H:%i:%s") as end_date, IF(SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(end_date,start_date)))) IS NULL,0,SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(end_date,start_date))))) AS total_hour, 
				tbl_school_adult_package.package_id from tbl_school_adult_booking left join tbl_school_booking on tbl_school_booking.booking_id = tbl_school_adult_booking.booking_id left join tbl_school_adult_package 
				on tbl_school_adult_package.school_package_id =  tbl_school_adult_booking.school_package_id where tbl_school_adult_booking.user_id='.$this->session->userdata('logged_in')['id'].'  
				and tbl_school_adult_package.package_id = '.$this->session->userdata('package_id').' '.$where.' ) as new_tbl on new_tbl.booking_id = tbl_school_adult_booking.booking_id 
				join tbl_school_adult_package on tbl_school_adult_package.package_id =  tbl_school_adult_booking.school_package_id join tbl_adult_package on 
				tbl_adult_package.package_id = tbl_school_adult_package.package_id where tbl_adult_package.type="'.$role.'" and tbl_adult_package.package_id='.$this->session->userdata('package_id').' and tbl_school_adult_booking.user_id='.$this->session->userdata('logged_in')['id'].' group by tbl_adult_package.package_id';
				
				$query = $this->db->query($sql);
				if($query->num_rows() > 0){
					$result  = $query->row();
					$totalBookedHours = $result->total_hour;
					$totalPackageHours = $result->package_hours;
				}
			}
			
			/*if($totalBookedHours == '0') $totalBookedHours = "00:00";
			$remaining = strtotime(number_format((float) $totalPackageHours, 2, '.', ''))-strtotime($totalBookedHours);
			
			$remaingHours = floor($remaining / 3600);
			$remaingMinuts = floor(($remaining - ($remaingHours*3600)) / 60);
			$leftTime = $remaingHours."h : ".$remaingMinuts."m";
			
			$start_time = strtotime($this->input->post('start_date'));
			$end_time = strtotime($this->input->post('end_date'));
			$diff = $end_time - $start_time;
			
			$years = floor($diff / (365*60*60*24)); 
			$months = floor(($diff - $years * 365*60*60*24) / (30*60*60*24)); 
			$days = floor(($diff - $years * 365*60*60*24 - $months*30*60*60*24)/ (60*60*24));
			$hours = floor(($diff - $years * 365*60*60*24 - $months*30*60*60*24 - $days*60*60*24)/ (60*60));
			$minuts = floor(($diff - $years * 365*60*60*24 - $months*30*60*60*24 - $days*60*60*24 - $hours*60*60)/ 60);
				
			$currentBooking = strtotime($hours.":".$minuts);
			$remainingTime = strtotime($remaingHours.":".$remaingMinuts);
			
			if($currentBooking > strtotime($totalPackageHours)  && strtotime($totalBookedHours) == '' ){
				return 'You can book only  '.$totalPackageHours. " hours";
			}else if($remaingHours == 0 && $remaingMinuts == 0 || $totalPackageHours == $totalBookedHours){
				return "Sorry!!!!!! Your ".$type." hours have been completed";
			}else if($currentBooking > $remainingTime && strtotime($totalBookedHours) != ''){
				$leftTime = $remaingHours."h : ".$remaingMinuts."m";
				return 'You can book only remaining '.$leftTime;
			}else{
				return 1;
			}*/
			
		}
		

	}
	/*****************************************************************************/

	
	//save shedule of student
	function updateSchedule(){
		$flag = $this->checkValidAppoitmentDate($this->input->post('id'));
		if($flag == ''){
			$bookingData = array(
			'start_date' =>date( "Y-m-d H:i:s", strtotime($this->input->post('start_date'))),
			'end_date' =>date( "Y-m-d H:i:s", strtotime($this->input->post('end_date'))),
			);
			$this->db->where('id',$this->input->post('id'));
			$this->db->update($this->tbl_school_booking, $bookingData);
		}
	}
	/*****************************************************************************/

	//Delete schedule by student
	function deleteSchedule(){
		$flag = $this->checkValidAppoitmentDate($this->input->post('id'));
		if($flag == ''){
			$type = $this->session->userdata('student_type');
			$sql = "SELECT tbl_school_booking.booking_id,status FROM tbl_school_booking join tbl_school_".strtolower($type)."_booking on tbl_school_".strtolower($type)."_booking.booking_id = tbl_school_booking.booking_id WHERE tbl_school_booking.id=".$this->input->post('id');
			$query = $this->db->query($sql);
			if($query->num_rows() > 0){
				$records  = $query->row();
				$booking_id = $records->booking_id;
				$status = $records->status;
				if($status == 'Booked'){
					if($type == $this->config->item('teen_student_type')){
						$this->db->where('booking_id',$booking_id);
						$this->db->update('tbl_school_teen_booking', array('status'=>'Pending'));
					}else{
						$this->db->where('booking_id',$booking_id);
						$this->db->update('tbl_school_adult_booking', array('status'=>'Pending'));
					}
				}
			}
			$this -> db -> where('id', $this->input->post('id'));
			$this -> db -> delete($this->tbl_school_booking);
		}
	}
	/****************************************************************************/

	//Check valid appointment date
	function checkValidAppoitmentDate($id){
		$sql = "SELECT start_date FROM tbl_school_booking WHERE id=".$id;
		$query = $this->db->query($sql);
		if($query->num_rows() > 0){
			$records  = $query->row();
			$start_date = $records->start_date;
			if(strtotime($start_date) < strtotime(date('Y-m-d H:i:s'))){
				return "Please delete/update an appointment only for future date/time.";
			}
		}
		return;
	}
	/**************************************************************************************************/

	//booking package by student
	function packageBooking(){
		if($this->session->userdata('student_type') == $this->config->item('adult_student_type')){
			$tbl = $this->tbl_school_adult_booking;
			$tbl_package = 'tbl_school_adult_package';
		}else{
			$tbl = $this->tbl_school_teen_booking;
			$tbl_package = 'tbl_school_teen_package';
		}
			
		$sql = "SELECT package_id FROM ".$tbl_package." WHERE  package_id=".$this->session->userdata['package_id']." and school_id= ".$this->session->userdata['school_id']." Limit 1";
		$query = $this->db->query($sql);
		if($query->num_rows() > 0){
			$p_sql = "SELECT school_package_id FROM ".$tbl." join ".$tbl_package." on ".$tbl.".school_package_id = ".$tbl_package.".package_id   WHERE ".$tbl.".school_package_id=".$this->session->userdata['package_id']." and ".$tbl_package.".school_id= ".$this->session->userdata['school_id']." and ".$tbl.".user_id=".$this->session->userdata('logged_in')['id']." and ".$tbl.".status='pending'  Limit 1";
			$p_query = $this->db->query($p_sql);
			if($p_query->num_rows() == 0){
				$records  = $query->row();
				$school_package_id = $records->package_id;
				$bookingData = array(
				'school_package_id' => $school_package_id,
				'user_id' =>$this->session->userdata('logged_in')['id'],
				'status'=>'Pending',
				'payment_email'=>$this->input->post("email"),
				'payment_phone'=>$this->input->post("phone_no")
				);
				$this->db->insert($tbl , $bookingData);
				return 'Your package has been booked. Please book your appointment.';
			}else{
				return "You already booked this package. Please complete your existing package.";
			}
		}else{
			return "Sorry!!! Package does not exists";
		}
	}
	/****************************************************************************/


	//Check package booked or not ny specific user
	function checkPackage($school_id = null, $package_id = null){
		$type = $this->config->item('school_role');
		if($this->session->userdata('student_type') == $this->config->item('adult_student_type')){
			$tbl = $this->tbl_school_adult_booking;
			$package_tbl = $this->tbl_school_adult_package;
			$pkg_sql = "SELECT package_id from tbl_adult_package where type= '".$type."' package_id=".$this->session->userdata('package_id')." limit 1";
		}else{
			$tbl = $this->tbl_school_teen_booking;
			$package_tbl = $this->tbl_school_teen_package;
			$pkg_sql = "SELECT package_id from tbl_teen_package where tbl_teen_package.type= '".$type."' and package_id=".$this->session->userdata('package_id')." limit 1";
		}
		$sql = "Select ".$tbl.".booking_id, ".$tbl.".status from ".$tbl." where school_package_id in (Select school_package_id from ".$package_tbl." where school_id=".$school_id.") 
				and ".$tbl.".user_id=".$this->session->userdata('logged_in')['id']." Limit 1";
		
		$query = $this->db->query($sql);
		
		if($query->num_rows() > 0){
			$records  = $query->row();
			$booking_id = $records->booking_id;
			$status = $records->status;
			
			if($status == 'Booked'){
				$inner_sql = "SELECT max(end_date) as end_date from tbl_school_booking where booking_id=".$booking_id ." and student_type='".$this->session->userdata('student_type')."'";
				$inner_query = $this->db->query($inner_sql);
				if($inner_query->num_rows() > 0){
					$records  = $inner_query->row();
					$end_date = $records->end_date;
					if(strtotime($end_date)< strtotime(date("Y-m-d h:i:s"))){
						return "You have already booked package under this instructor. Please complete the existing package.";
					}else{
						return false;
					}
				}
			}else{
				return "You have already booked package under this instructor. Please complete the existing package.";
			}	
		}else{
			$query = $this->db->query($pkg_sql);
			if($query->num_rows() > 0){
				return false;
			}else{
				return "Package does not exist";
			}
		}
	}
	/****************************************************************************/


	//Get booked package
	function getBookedPackage($type){
		if($type=='instructor'){
			$type = $this->config->item('instructor_role');
			if($this->session->userdata('student_type') == $this->config->item('teen_student_type')){
			    $sql = "SELECT tbl_class.class_id,tbl_behind_wheel.behind_wheel_hours,tbl_observation.observation_hours,tbl_class.start_date, 
				tbl_class.end_date, tbl_class.start_time,tbl_class.end_time, tbl_instructor_teen_package.package_id, tbl_instructor_teen_package.instructor_id as id, 'instructor' as type, tbl_instructor_teen_booking.status,tbl_instructor_teen_booking.booking_id, tbl_teen_package.package_id,tbl_teen_package.package_price,CONCAT_WS(' ',tbl_user.first_name,tbl_user.middle_name,tbl_user.last_name) as name FROM tbl_instructor_teen_booking left join tbl_instructor_teen_package 
				on tbl_instructor_teen_package.package_id= tbl_instructor_teen_booking.instructor_package_id join tbl_teen_package on tbl_teen_package.package_id = 
				tbl_instructor_teen_package.package_id left join tbl_user on tbl_user.user_id = tbl_instructor_teen_package.instructor_id 
				left join tbl_observation on tbl_observation.observation_id = 
				tbl_teen_package.observation_id left join tbl_behind_wheel on tbl_behind_wheel.behind_wheel_id = tbl_teen_package.behind_wheel_id left join tbl_class 
				on tbl_class.class_id = tbl_teen_package.class_id WHERE tbl_teen_package.type= '".$type."' and tbl_instructor_teen_booking.user_id=".$this->session->userdata('logged_in')['id'];
		
			 }else{	
				$sql = "SELECT tbl_instructor_adult_package.package_id, tbl_instructor_adult_package.instructor_id as id, 'instructor' as type, tbl_instructor_adult_booking.status,tbl_instructor_adult_booking.booking_id, tbl_adult_package.package_id,tbl_adult_package.package_price, 
				tbl_adult_package.package_hours,CONCAT_WS(' ',tbl_user.first_name,tbl_user.middle_name,tbl_user.last_name) as name FROM tbl_instructor_adult_booking left join tbl_instructor_adult_package 
				on tbl_instructor_adult_package.package_id= tbl_instructor_adult_booking.instructor_package_id join tbl_adult_package on tbl_adult_package.package_id = 
				tbl_instructor_adult_package.package_id left join tbl_user on tbl_user.user_id = tbl_instructor_adult_package.instructor_id WHERE tbl_adult_package.type= '".$type."' and tbl_instructor_adult_booking.user_id=".$this->session->userdata('logged_in')['id'];
				
			}
			
		}else{
				$type = $this->config->item('school_role');
				if($this->session->userdata('student_type') == $this->config->item('teen_student_type')){
				$sql = "SELECT tbl_class.class_id,tbl_behind_wheel.behind_wheel_hours,tbl_observation.observation_hours,tbl_class.start_date, 
				tbl_class.end_date, tbl_class.start_time,tbl_class.end_time, tbl_school_teen_package.package_id, tbl_school_teen_package.school_id as id, 'school' as type, tbl_school_teen_booking.status,tbl_school_teen_booking.booking_id, tbl_teen_package.package_id,tbl_teen_package.package_price,school_name as name FROM tbl_school_teen_booking left join tbl_school_teen_package 
				on tbl_school_teen_package.package_id= tbl_school_teen_booking.school_package_id join tbl_teen_package on tbl_teen_package.package_id = 
				tbl_school_teen_package.package_id left join tbl_school on tbl_school.school_id = tbl_school_teen_package.school_id 
				left join tbl_observation on tbl_observation.observation_id = tbl_teen_package.observation_id left join tbl_behind_wheel on tbl_behind_wheel.behind_wheel_id = tbl_teen_package.behind_wheel_id left join tbl_class 
				on tbl_class.class_id = tbl_teen_package.class_id WHERE tbl_teen_package.type= '".$type."' and tbl_school_teen_booking.user_id=".$this->session->userdata('logged_in')['id'];
		
			 }else{	
				$sql = "SELECT tbl_school_adult_package.package_id, tbl_school_adult_package.school_id as id, 'school' as type, tbl_school_adult_booking.status,tbl_school_adult_booking.booking_id, tbl_adult_package.package_id,tbl_adult_package.package_price, 
				tbl_adult_package.package_hours,tbl_school.school_name as name FROM tbl_school_adult_booking left join tbl_school_adult_package 
				on tbl_school_adult_package.package_id= tbl_school_adult_booking.school_package_id join tbl_adult_package on tbl_adult_package.package_id = 
				tbl_school_adult_package.package_id left join tbl_school on tbl_school.school_id = tbl_school_adult_package.school_id WHERE 
				tbl_adult_package.type= '".$type."' and tbl_school_adult_booking.user_id=".$this->session->userdata('logged_in')['id'];
				
			}
			
		}
		
		$this->CI->flexigrid->build_query();
		$records = $this->db->query($sql);
		$return['records'] = $records;
	
		$return['record_count'] = $records->num_rows() ;
	
		return $return;

	}
	/****************************************************************************/

	// Get the status to schedule appoitment
	function getScheduleStatus($booking_id, $type){
		$inner_sql = "SELECT max(end_date) as end_date from tbl_".$type."_booking where booking_id=".$booking_id;
		$inner_query = $this->db->query($inner_sql);
		if($inner_query->num_rows() > 0){
			$records  = $inner_query->row();
			$end_date = $records->end_date;
			if(strtotime($end_date)< strtotime(date("Y-m-d h:i:s"))){
				return true;
			}else{
				return false;
			}
		}
	}
	/****************************************************************************/

	function getCompletedPackage($type, $package_id){
		if($type == 'instructor'){
			$role = $this->config->item('instructor_role');
		}else{
			$role = $this->config->item('school_role');
		}
		if($this->session->userdata('student_type') == $this->config->item('teen_student_type')){
			$sql = "SELECT tbl_".$type."_teen_booking.booking_id, start_date, end_date from tbl_".$type."_booking join  tbl_".$type."_teen_booking on tbl_".$type."_booking.booking_id = 
			tbl_".$type."_teen_booking.booking_id join  tbl_".$type."_teen_package on  tbl_".$type."_teen_package.".$type."_package_id = tbl_".$type."_teen_booking.".$type."_package_id
			where tbl_".$type."_teen_package.package_id=".$package_id ." and tbl_".$type."_teen_package.type ='".$role."'";
		}else{
			$sql = "SELECT tbl_".$type."_adult_booking.booking_id, start_date, end_date  from tbl_".$type."_booking join  tbl_".$type."_adult_booking on tbl_".$type."_booking.booking_id = 
			tbl_".$type."_adult_booking.booking_id join  tbl_".$type."_adult_package on  tbl_".$type."_adult_package.".$type."_package_id = tbl_".$type."_adult_booking.".$type."_package_id
			where tbl_".$type."_adult_package.package_id=".$package_id." and tbl_".$type."_teen_package.type ='".$role."'";;
		}
		$this->CI->flexigrid->build_query();
		$records = $this->db->query($sql);
		$return['records'] = $records;
	
		$return['record_count'] = $records->num_rows() ;
	
		return $return;
	}
	/****************************************************************************/
	
	
	//Get student class status
	function getStudentClassStatus($classID){
		$sql = "SELECT start_date, end_date, start_time, end_time FROM tbl_class where class_id=".$classID;
		$query = $this->db->query($sql);
		$this -> db -> limit(1);
		if($query->num_rows() > 0){
			return $records  = $query->row();
		}else{
			return false;
		}
	}
	/****************************************************************************/
	
	/**
	* check the Availability date of Instructor
	**/
	function checkAvailabilityDate($searchDate=null){
		$sql = "SELECT * FROM (tbl_available_time) WHERE user_id = '".$this->session->userdata('instructor_id')."'  AND '".convertDateFormat($searchDate)."' BETWEEN start_date AND end_date GROUP BY tbl_available_time.user_id";
		
		$query = $this->db->query($sql);
		$this -> db -> limit(1);
		if($query->num_rows() > 0){
			return $records  = $query->row();
		}else{
			return false;
		}
	}
	/************************************************************************************/
	
	//Get instructor package
	function getInstructorPackage($school_id=null, $package_id = null){
		 $student_type = $this->config->item('adult_student_type');
		 $role = $this->config->item('school_role');
		 if($this->session->userdata('student_type') != ''){
			 $student_type = $this->session->userdata('student_type');
		 }
		
		 $this->db->select('*');
		 if($student_type == $this->config->item('teen_student_type')){
			 $this->db->from($this->tbl_teen_package);
			 $this->db->join($this->tbl_school_teen_package,'tbl_school_teen_package.package_id = tbl_teen_package.package_id');
			 $this->db->join($this->tbl_class,'tbl_class.class_id = tbl_teen_package.class_id','left');
			 $this->db->join($this->tbl_observation,'tbl_observation.observation_id = tbl_teen_package.observation_id','left');
			 $this->db->join($this->tbl_behind_wheel,'tbl_behind_wheel.behind_wheel_id = tbl_teen_package.behind_wheel_id','left');
			 $this -> db -> where('tbl_school_teen_package.school_id', $school_id);
			 $this -> db -> where('tbl_teen_package.type', "$role");
			 if($package_id != ''){
				 $this -> db -> where('tbl_teen_package.package_id', $package_id);
			 }
			 $this->db->order_by('tbl_teen_package.package_id','desc');
		 }else{
			 $this->db->from($this->tbl_adult_package);
			 $this->db->join($this->tbl_school_adult_package,'tbl_school_adult_package.package_id = tbl_adult_package.package_id');
			 $this -> db -> where('tbl_school_adult_package.school_id', $school_id);
			 $this -> db -> where('tbl_adult_package.type', "$role");
			 if($package_id != ''){
				 $this -> db -> where('tbl_adult_package.package_id', $package_id);
			 }
			 $this->db->order_by('tbl_adult_package.package_id','desc');

		 }
         $query = $this->db->get();
         return ($query->num_rows() > 0)?$query->row():FALSE;
	}
	/***************************************************************************************/
	
	//insert slideshow images
	function insertSlideshowImages($type, $filename){
		$images = array(
		'owner_id' => $this->session->userdata('logged_in')['id'],
		'type' => $type,
		'picture' => $filename
		);

		$this->db->insert('tbl_slideshow', $images);
	}
	/***************************************************************************************/
	
	//delete slideshow images
	function deleteSlideshowImage($imageID, $path){
		$exploded = explode(",",$imageID);
		foreach($exploded as $id){
			$this -> db -> select('picture');
			$this -> db -> from('tbl_slideshow');
			$this -> db -> where('slideshow_id', $id);
			$this -> db -> limit(1);
			$query = $this -> db -> get();
			if($query->num_rows()){
				$result = $query->row();	
				$info = pathinfo("../uploads/".$result->picture);
				$name = $info['filename'];
				$ext  = $info['extension'];
				$thumbnail = $name."_thumb.".$ext;			
				unlink($path.$result->picture);
				unlink($path.$thumbnail);
			}
			$this -> db -> where('slideshow_id', $id);
			$this -> db -> delete('tbl_slideshow');	
		}
	}
	/***************************************************************************************/
	
	//get slideshow image
	function getSlideShow($type, $id = null){
		if($id != null){
			$onwer_id = $id;
		}else{
			$onwer_id = $this->session->userdata('logged_in')['id'];
		}
		$this -> db -> select('picture, slideshow_id');
		$this -> db -> from('tbl_slideshow');
	    $this -> db -> where('owner_id', $onwer_id);
		$this -> db -> where('type', $type);
		$query = $this -> db -> get();	
		if($query->num_rows() > 0){
			$result = $query->result_array();	
			return $result;
		}else{
			return false;
		}
	}
	/***************************************************************************************/


	//get slideshow image
	function getVideos($type, $id = null){
		if($id != null){
			$onwer_id = $id;
		}else{
			$onwer_id = $this->session->userdata('logged_in')['id'];
		}
		$this -> db -> select('name, video_id');
		$this -> db -> from('tbl_video');
	    $this -> db -> where('owner_id', $onwer_id);
		$this -> db -> where('type', $type);
		$query = $this -> db -> get();	
		if($query->num_rows() > 0){
			$result = $query->result_array();	
			return $result;
		}else{
			return false;
		}
	}
	/***************************************************************************************/


	
	//Get the total number of booked packages
	function getBookedPackageRows(){
		
		$session = $this->session->userdata('logged_in');
		$type = $this->config->item('school_role');
		$package_type = $this->session->userdata('package_type');
		if($package_type == 'adult'){
			$this->db->select('tbl_user.first_name, tbl_user.middle_name, tbl_user.last_name, tbl_'.$package_type.'_package.package_id, tbl_adult_package.package_hours, tbl_adult_package.package_price,tbl_school_adult_booking.status,tbl_user.user_id ');
		}else{
			$this->db->select('tbl_user.first_name, tbl_user.middle_name, tbl_user.last_name, tbl_'.$package_type.'_package.package_id, tbl_class.start_date,tbl_class.end_date, tbl_class.start_time, tbl_class.end_time, tbl_observation.observation_hours,tbl_behind_wheel.behind_wheel_hours, tbl_teen_package.package_price, tbl_school_teen_booking.status,tbl_user.user_id');
		}
        $this->db->from('tbl_school_'.$package_type.'_booking');
		$this->db->join('tbl_school_'.$package_type.'_package','tbl_school_'.$package_type.'_package.package_id = tbl_school_'.$package_type.'_booking.school_package_id');
		$this->db->join('tbl_'.$package_type.'_package','tbl_'.$package_type.'_package.package_id = tbl_school_'.$package_type.'_package.package_id');		  
		$this->db->join($this->tbl_user,'tbl_user.user_id = tbl_school_'.$package_type.'_booking.user_id');
		if($package_type == 'teen'){
			 $this->db->join($this->tbl_class,'tbl_class.class_id = tbl_teen_package.class_id','left');
			 $this->db->join($this->tbl_observation,'tbl_observation.observation_id = tbl_teen_package.observation_id','left');
			 $this->db->join($this->tbl_behind_wheel,'tbl_behind_wheel.behind_wheel_id = tbl_teen_package.behind_wheel_id','left');
			 $this -> db -> where('tbl_teen_package.type', "$type");
		}
		
		$this -> db -> where('tbl_school_'.$package_type.'_package.school_id', $session['id']);
		$this->db->group_by('tbl_user.user_id');
		
		$this->CI->flexigrid->build_query();
		
		//Get contents
		$return['records'] = $this->db->get();
	
		$this->db->select('count(tbl_user.user_id) as record_count');
        $this->db->from('tbl_school_'.$package_type.'_booking');
		$this->db->join('tbl_school_'.$package_type.'_package','tbl_school_'.$package_type.'_package.package_id = tbl_school_'.$package_type.'_booking.school_package_id');
		$this->db->join('tbl_'.$package_type.'_package','tbl_'.$package_type.'_package.package_id = tbl_school_'.$package_type.'_package.package_id');	  
		$this->db->join($this->tbl_user,'tbl_user.user_id = tbl_school_'.$package_type.'_booking.user_id');
		$this -> db -> where('tbl_school_'.$package_type.'_package.school_id', $session['id']);
		$this -> db -> where('tbl_'.$package_type.'_package.type', "$type");
		$this->db->group_by('tbl_user.user_id');

		$this->CI->flexigrid->build_query(FALSE);
		$record_count = $this->db->get();
		$row = $record_count->row();
		
		//Get Record Count
		$return['record_count'] = $row->record_count;
		
		
		//Build sum query for footer message
		
		$this->db->select('SUM(tbl_user.user_id) as sum_code');
        $this->db->from('tbl_school_'.$package_type.'_booking');
		$this->db->join('tbl_school_'.$package_type.'_package','tbl_school_'.$package_type.'_package.package_id = tbl_school_'.$package_type.'_booking.school_package_id');
		$this->db->join('tbl_'.$package_type.'_package','tbl_'.$package_type.'_package.package_id = tbl_school_'.$package_type.'_package.package_id');
		$this->db->join($this->tbl_user,'tbl_user.user_id = tbl_school_'.$package_type.'_booking.user_id');
		$this -> db -> where('tbl_school_'.$package_type.'_package.school_id', $session['id']);
		$this -> db -> where('tbl_'.$package_type.'_package.type', "$type");
		$this->db->group_by('tbl_user.user_id');
		
		
		$this->CI->flexigrid->build_query(FALSE);
		$record_count = $this->db->get();
		$row = $record_count->row();
		
		//Get Footer Message
		$return['footmsg'] = $row->sum_code;
	
		//Return all
		return $return;
	}
	/*************************************************************************************/
	
	
	//Get the total number of booked packages
	function getPackageDetails(){
		$session = $this->session->userdata('logged_in');
		$package_type = $this->session->userdata('package_type');
		$package_id = $this->session->userdata('package_id');
		$student_id = $this->session->userdata('student_id');
		
		$this->db->select('start_date,end_date, tbl_user.first_name, tbl_user.middle_name, tbl_user.last_name, tbl_school_booking.booking_id');
        $this->db->from('tbl_school_booking');
		$this->db->join('tbl_user','tbl_user.user_id = tbl_school_booking.instructor_id');	
		$this->db->join('tbl_school_'.$package_type.'_booking','tbl_school_'.$package_type.'_booking.booking_id = tbl_school_booking.booking_id');	
		$this->db->join('tbl_school_'.$package_type.'_package','tbl_school_'.$package_type.'_package.school_package_id = tbl_school_'.$package_type.'_booking.school_package_id');
		$this -> db -> where('tbl_school_booking.user_id', $student_id);
		$this -> db -> where('tbl_school_'.$package_type.'_package.package_id', $package_id);
		$this -> db -> where('tbl_school_'.$package_type.'_package.school_id', $session['id']);
		
		$this->CI->flexigrid->build_query();
		
		//Get contents
		$return['records'] = $this->db->get();
	
		$this->db->select('count(tbl_school_booking.booking_id) as record_count');
        $this->db->from('tbl_school_booking');
		$this->db->join('tbl_user','tbl_user.user_id = tbl_school_booking.instructor_id');	
		$this->db->join('tbl_school_'.$package_type.'_booking','tbl_school_'.$package_type.'_booking.booking_id = tbl_school_booking.booking_id');	
		$this->db->join('tbl_school_'.$package_type.'_package','tbl_school_'.$package_type.'_package.school_package_id = tbl_school_'.$package_type.'_booking.school_package_id');	
		$this -> db -> where('tbl_school_booking.user_id', $student_id);
		$this -> db -> where('tbl_school_'.$package_type.'_package.package_id', $package_id);
		$this -> db -> where('tbl_school_'.$package_type.'_package.school_id', $session['id']);
		
		$this->CI->flexigrid->build_query(FALSE);
		$record_count = $this->db->get();
		$row = $record_count->row();
		
		//Get Record Count
		$return['record_count'] = $row->record_count;
		
		$this->db->select('SUM(tbl_school_booking.booking_id) as sum_code');
        $this->db->from('tbl_school_booking');
		$this->db->join('tbl_user','tbl_user.user_id = tbl_school_booking.instructor_id');	
		$this->db->join('tbl_school_'.$package_type.'_booking','tbl_school_'.$package_type.'_booking.booking_id = tbl_school_booking.booking_id');	
		$this->db->join('tbl_school_'.$package_type.'_package','tbl_school_'.$package_type.'_package.package_id = tbl_school_'.$package_type.'_booking.school_package_id');
		$this -> db -> where('tbl_school_booking.user_id', $student_id);
		$this -> db -> where('tbl_school_'.$package_type.'_package.package_id', $package_id);
		$this -> db -> where('tbl_school_'.$package_type.'_package.school_id', $session['id']);
		
		$this->CI->flexigrid->build_query(FALSE);
		$record_count = $this->db->get();
		$row = $record_count->row();
		
		//Get Footer Message
		$return['footmsg'] = $row->sum_code;
	
		//Return all
		return $return;
	}
	
	
	 //Save instructor account details
	function accountDetails($flag = ''){
		if($flag == true){
			$accountData = array(
			'username' =>$this->input->post("username"),
			'password' =>$this->input->post("password"),
			'signature' =>$this->input->post("signature")
			);
			$this->db->where('school_id', $this->session->userdata('logged_in')['id']);
			$this->db->update($this->tbl_school_payment_detail, $accountData);
		}else{
			$accountData = array(
			'username' =>$this->input->post("username"),
			'password' =>$this->input->post("password"),
			'signature' =>$this->input->post("signature"),
			'school_id' =>$this->session->userdata('logged_in')['id']
			);
			$this->db->insert($this->tbl_school_payment_detail, $accountData);
		}
		return true;
	}
	/***********************************************************************************/
	
	function savePayment(){
		$accountData = array(
		'payment' =>$this->config->item('payment_for_instructor'),
		'school_id' =>$this->session->userdata('logged_in')['id'],
		'email' =>$this->input->post("email"),
		'phone_number' =>$this->input->post("phone_no")
		);
		$this->db->insert($this->tbl_school_payment, $accountData);
	}
	/*********************************************************************************/
	
	//check account details
	function checkAccountDetails($school_id = null){
		if($school_id == null){
			$school_id = $this->session->userdata('logged_in')['id'];
		}
		$this->db->select('*')->from($this->tbl_school_payment_detail);
		$this -> db -> where('school_id', $school_id);
		$result  = $this->db->get()->result_array();
		if($result){
			return  $result[0];
		 }else{
			return;
		 }
	}
	/**************************************************************************************/
	
	//check payment details
	function checkPaymentDetails(){
		$this->db->select('*')->from($this->tbl_school_payment);
		$this -> db -> where('school_id', $this->session->userdata('logged_in')['id']);
		$query = $this -> db -> get();	
		if($query->num_rows() > 0){
			return  true;
		 }else{
			return false;
		 }
	}
	/**************************************************************************************/
	
}
?>
