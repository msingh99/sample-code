<?php
class User_model extends CI_Model {
	private $tbl_school = 'tbl_school';
	private $tbl_user = 'tbl_user';
	private $tbl_role = 'tbl_role';
	private $tbl_address = 'tbl_address';
	private $tbl_user_address = 'tbl_user_address';
	private $tbl_profile_picture = 'tbl_profile_picture';
	
	function __construct(){
		parent::__construct();
	}
	  

	//Get user data from database
	 function getUser(){
		 $this -> db -> select('username, role_id, user_id, dob');
         $this -> db -> from($this->tbl_user);
         $this -> db -> where('username', $this->input->post('username'));
         $this -> db -> where('password', base64_encode($this->input->post('password')));
		 $this -> db -> where('role_id', $this->input->post('role'));
		 $this -> db -> where('status', $this->config->item('active'));
         $this -> db -> limit(1);
		 $query  = $this -> db -> get();
		 return $query;
     }
	 /****************************************************************************/

	 //Get School
	 function getSchool(){
		 $this -> db -> select('username, school_id');
         $this -> db -> from($this->tbl_school);
         $this -> db -> where('username', $this->input->post('username'));
         $this -> db -> where('password', base64_encode($this->input->post('password')));
		 $this -> db -> where('status', $this->config->item('active'));
         $this -> db -> limit(1);
		 $query  = $this -> db -> get();
		 return $query;
	 }
	 //End

	 //Get user data from database
	 function getRole(){
		$this -> db -> select('role_id, role_name');
		$this->db->where('role_name !=', 'super_admin');
		return $this->db->get($this->tbl_role)->result_array();
	 }
	/****************************************************************************/


	// Check user account activation
	  function checkUserAccountActivation(){
		$this -> db -> select('username');
		$this -> db -> from($this->tbl_user);
	    $this -> db -> where('email', $this->input->post('email'));
		$this -> db -> where('status', $this->config->item('active'));
		$this -> db -> where('role_id', $this->input->post('role'));
	    $this -> db -> limit(1);
		$query = $this -> db -> get();		

		return $query;
	}
	/****************************************************************************/

	// Check school account activation
	  function checkSchoolAccountActivation(){
		$this -> db -> select('username');
		$this -> db -> from($this->tbl_school);
	    $this -> db -> where('email', $this->input->post('email'));
		$this -> db -> where('status', $this->config->item('active'));
	    $this -> db -> limit(1);
		$query = $this -> db -> get();		

		return $query;
	}
	/****************************************************************************/

	//Get user data by email from database
	  function getSchoolByEmail(){
		$this -> db -> select('username');
		$this -> db -> from($this->tbl_school);
	    $this -> db -> where('email', $this->input->post('email'));
	    $this -> db -> limit(1);
		$query = $this -> db -> get();		

		return $query;
	}
	/****************************************************************************/

	//Update User Password
	function updateUserPassword($email,$userdata){		
		$this->db->where('email', $email);
		$this -> db -> where('status', $this->config->item('active'));
		$this->db->update($this->tbl_user, $userdata);
	}
	/****************************************************************************/


	//Update School Password
	function updateSchoolPassword($email,$userdata){		
		$this->db->where('email', $email);
		$this -> db -> where('status', $this->config->item('active'));
		$this->db->update($this->tbl_school, $userdata);
	}
	/****************************************************************************/

	//Update User data
	function updateUser($file_name=null){
		$data = $this->session->userdata('logged_in');
		$user_id = $data['id'];
		if($file_name != ''){
			$userData=array('profile_picture'=>$file_name,'description'=>$this->input->post('description'),'email'=>$this->input->post('email'),'phone_no'=>$this->input->post('phone'), 'updated_date'=>date('Y-m-d H:i:s'));
		}else{
			$userData=array('description'=>$this->input->post('description'),'email'=>$this->input->post('email'),'phone_no'=>$this->input->post('phone'), 'updated_date'=>date('Y-m-d H:i:s'));
		}
		$addressData=array('address1'=>$this->input->post('address1'),'address2'=>$this->input->post('address2'),'city'=>$this->input->post('city'),'country'=>$this->input->post('country'),'state'=>$this->input->post('state'),'zip_code'=>$this->input->post('zip_code'));
		$this->db->where('user_id',$user_id);
		$this -> db -> where('role_id', $data['role']);
		$this->db->update($this->tbl_user,$userData);
		$this -> db -> select('address_id');
		$this -> db -> from($this->tbl_user_address);
	    $this -> db -> where('user_id', $user_id);
	    $this -> db -> limit(1);
		$result  = $this->db->get()->result_array();
		$address_id = $result[0]['address_id'];
		$this->db->where('address_id',$address_id);
		$this->db->update($this->tbl_address,$addressData);
		return true;
	}
	/****************************************************************************/

	//Check password
	 function checkPassword(){
		$data = $this->session->userdata('logged_in');
		$this -> db -> select('username');
		$this -> db -> from($this->tbl_user);
	    $this -> db -> where('user_id =', $data['id']);
		$this -> db -> where('password',  base64_encode($this->input->post('old_password')));
	    $this -> db -> limit(1);
		$query = $this -> db -> get();		
		return $query;
	}
	/****************************************************************************/

	//Get user data by email from database
	  function getUserByEmail(){
		
		$this -> db -> select('username');
		$this -> db -> from($this->tbl_user);
	    $this -> db -> where('email', $this->input->post('email'));
		$this -> db -> where('role_id', $this->input->post('role'));
	    $this -> db -> limit(1);
		$query = $this -> db -> get();		

		return $query;
	}
	/****************************************************************************/

	//update password
	function updatePassword(){
		$session = $this->session->userdata('logged_in');
		$userData = array('password'=>base64_encode($this->input->post('new_password')),'updated_date'=>date('Y-m-d H:i:s'));
		$this->db->where('user_id',$session['id']);
		$this->db->where('role_id',$session['role']);
		$this->db->update($this->tbl_user,$userData);
	}
	/****************************************************************************/

	//Update status to activate account
	function updateStatus($user_id, $random_code){
		$data=array('status'=>$this->config->item('active'),'updated_date'=>date('Y-m-d H:i:s'));
		$this->db->where('user_id',$user_id);
		$this->db->where('random_code',$random_code);
		$this->db->update($this->tbl_user,$data);
	}
	/****************************************************************************/
	
	 //Check email exists
	 function checkEmailExistance(){
		$data = $this->session->userdata('logged_in');
		$user_id = $data['id'];
		$email = $this->input->post("email");
		$this -> db -> select('username');
		$this -> db -> from($this->tbl_user);
	    $this -> db -> where('user_id !=', $user_id);
		$this -> db -> where('email', $this->input->post('email'));
	    $this -> db -> limit(1);
		$query = $this -> db -> get();		
		return $query;
	}
	/****************************************************************************/

	function resendMail(){
		$this -> db -> select('user_id');
		$this -> db -> from($this->tbl_user);
		$this -> db -> where('email', $this->input->post('email'));
		$this -> db -> where('role_id', $this->input->post('role'));
	    $this -> db -> limit(1);
		$result = $this -> db -> get()->result_array();	
		$user_id = $result[0]['user_id'];
		$random_code = generateRandomCode();
		$data=array('random_code'=>$random_code,'updated_date'=>date('Y-m-d H:i:s'));
		$this->db->where('user_id',$user_id);
		$this -> db -> where('role_id', $this->input->post('role'));
		$this->db->update($this->tbl_user,$data);
		$return = array('user_id'=>$user_id, 'random_code'=>$random_code, 'email'=>$this->input->post("email"));
		return $return;
	}
	/*************************************************************************/

	//get student dob
	function getUserDob(){
		$this->db->select('dob');
		$this->db->from($this->tbl_user);
		$this -> db -> where('user_id', $this->session->userdata('logged_in')['id']);
		$this -> db -> limit(1);
		$query = $this->db->get();
		if($query->num_rows() > 0){
			return $records = $query->result_array();
		}else{
			return false;
		}
	}
	/****************************************************************************/

	

}
?>
