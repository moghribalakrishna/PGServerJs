<?php

class Suppliers 
{
	


	function getSuppliersRestApi($limit_from=0)
	{

        $data['controller_name']=$this->get_controller_name();
		$data['form_width']=$this->get_form_width();
		$lines_per_page = $this->Appconfig->get('lines_per_page');
		$Suppliers = $this->Supplier->get_all($lines_per_page);
		
		$data['links'] = $this->_initialize_pagination($this->Supplier,$lines_per_page,$limit_from);
		$data['manage_table']=get_supplier_manage_table($Suppliers,$this);
		//$this->load->view('suppliers/manage',$data);

		$x=0;
		$SuppliersJson=array();
		foreach($Suppliers->result() as $Supplier)
        {
           $SuppliersJson[$x] = $Supplier;
           $x=$x+1;
         }
     
   
         echo json_encode(array('Suppliers' => $SuppliersJson));
   	 //    $this->_remove_duplicate_cookies();

	}

  function deleteSuppliersRestApi()
	{
		$suppliers_to_delete=$_REQUEST['person_id'];
		
		if($this->Supplier->delete_list($suppliers_to_delete))
		{
			echo json_encode(array('success'=>true,'message'=>$this->lang->line('suppliers_successful_deleted').' '.
			count($suppliers_to_delete).' '.$this->lang->line('suppliers_one_or_multiple')));
		}
		else
		{
			echo json_encode(array('success'=>false,'message'=>$this->lang->line('suppliers_cannot_be_deleted')));
		}

		$url = NodeServerUrl."?event=supplierDelete&id=".$suppliers_to_delete."&appType=".APPTYPE;
		$url = urlencode($url);
	 	file_get_contents(urldecode($url));
	}

    function saveSupplierRestApi($supplier_id=-1)
	{
		$supplier_id=$_REQUEST ['person_id']==''? -1:$_REQUEST ['person_id'];
		$person_data = array(
		'first_name'=>$_REQUEST ['first_name'],
		'last_name'=>$_REQUEST ['last_name'],
		'gender'=>$_REQUEST ['gender'],
		'email'=>$_REQUEST ['email'],
		'phone_number'=>$_REQUEST ['phone_number'],
		'address_1'=>$_REQUEST ['address_1'],
		'address_2'=>$_REQUEST ['address_2'],
		'city'=>$_REQUEST ['city'],
		'state'=>$_REQUEST ['state'],
		'zip'=>$_REQUEST ['zip'],
		'country'=>$_REQUEST ['country'],
		'comments'=>$_REQUEST ['comments'] == null? '': $_REQUEST ['comments']
		);
		$supplier_data=array(
		'company_name'=>$_REQUEST ['company_name'],
		'agency_name'=>$_REQUEST ['agency_name'],
		'account_number'=>$_REQUEST ['account_number']=='' ? null:$_REQUEST ['account_number']
		);

		$isNewSupplier = $supplier_id;
		$SupplierAddResp = $this->Supplier->save_supplier($person_data,$supplier_data,$supplier_id);
		if($SupplierAddResp == 1)
		{
			//New supplier
			if($isNewSupplier==-1)
			{
				$url = NodeServerUrl."?event=supplierSave&id=".$supplier_id."&appType=".APPTYPE;
					$url = urlencode($url);
	 				file_get_contents(urldecode($url));

				echo json_encode(array('message'=>$this->lang->line('suppliers_successful_adding').' '.$supplier_data['company_name']));
			
			}  
			else //previous supplier
			{
				$url = NodeServerUrl."?event=supplierEdit&id=".$supplier_id."&appType=".APPTYPE;
					$url = urlencode($url);
	 				file_get_contents(urldecode($url));

				echo json_encode(array('message'=>$this->lang->line('suppliers_successful_updating').' '.$supplier_data['company_name'],'addSupplier' => true));
				
			}
		}
		else//failure
		{	
			if($SupplierAddResp != 1){
			$errormsg = $SupplierAddResp;
		  }else{
		  	$errormsg = $this->lang->line('suppliers_error_adding_updating').' '.$supplier_data['company_name'];
		  }
			
			echo json_encode(array('message'=>$errormsg,'addSupplier' => false));
		}
	}

}
?>