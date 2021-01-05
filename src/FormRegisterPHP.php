<div id="signupbox" class="col-md-7">
	<div class="panel panel-info">
		<div class="panel-heading">
			<div class="panel-title">Sign Up</div>				
		</div>  
		<div class="panel-body" >
			<form id="signupform" class="form-horizontal" role="form" method="POST" action="">				
				<?php if ($message != '') { ?>
					<div id="login-alert" class="alert alert-danger col-sm-12"><?php echo $message; ?></div>                            
				<?php } ?>	
				<div class="form-group">
					<label for="firstname" class="col-md-3 control-label">First Name*</label>
					<div class="col-md-9">
						<input type="text" class="form-control" name="firstname" placeholder="First Name" value="<?php if(!empty($_POST["firstname"])) { echo $_POST["firstname"]; } ?>" required>
					</div>
				</div>
				<div class="form-group">
					<label for="lastname" class="col-md-3 control-label">Last Name</label>
					<div class="col-md-9">
						<input type="text" class="form-control" name="lastname" placeholder="Last Name" value="<?php if(!empty($_POST["lastname"])) { echo $_POST["lastname"]; } ?>" >
					</div>
				</div>					
				<div class="form-group">
					<label for="email" class="col-md-3 control-label">Email*</label>
					<div class="col-md-9">
						<input type="email" class="form-control" name="email" placeholder="Email Address" value="<?php if(!empty($_POST["email"])) { echo $_POST["email"]; } ?>" required>
					</div>
				</div>					
				<div class="form-group">
					<label for="password" class="col-md-3 control-label">Password*</label>
					<div class="col-md-9">
						<input type="password" class="form-control" name="passwd" placeholder="Password" required>
					</div>
				</div>								
				<div class="form-group">						                                  
					<div class="col-md-offset-3 col-md-9">
						<button id="btn-signup" type="submit" name="register" value="register" class="btn btn-info"><i class="icon-hand-right"></i>   Register</button>			
					</div>
				</div>					
				<div class="form-group">
					<div class="col-md-12 control">
						<div style="border-top: 1px solid#888; padding-top:15px; font-size:85%" >
							If You've already an account! 
						<a href="login.php">
							Log In 
						</a>Here
						</div>
					</div>
				</div>  				
			</form>
		 </div>
	</div>
</div>	
public function register(){		
	$message = '';
	if(!empty($_POST["register"]) && $_POST["email"] !='') {
		$sqlQuery = "SELECT * FROM ".$this->userTable." 
			WHERE email='".$_POST["email"]."'";
		$result = mysqli_query($this->dbConnect, $sqlQuery);
		$isUserExist = mysqli_num_rows($result);
		if($isUserExist) {
			$message = "User already exist with this email address.";
		} else {			
			$authtoken = $this->getAuthtoken($_POST["email"]);
			$insertQuery = "INSERT INTO ".$this->userTable."(first_name, last_name, email, password, authtoken) 
			VALUES ('".$_POST["firstname"]."', '".$_POST["lastname"]."', '".$_POST["email"]."', '".md5($_POST["passwd"])."', '".$authtoken."')";
			$userSaved = mysqli_query($this->dbConnect, $insertQuery);
			if($userSaved) {				
				$link = "<a href='http://example.com/user-management-system/verify.php?authtoken=".$authtoken."'>Verify Email</a>";			
				$toEmail = $_POST["email"];
				$subject = "Verify email to complete registration";
				$msg = "Hi there, click on this ".$link." to verify email to complete registration.";
				$msg = wordwrap($msg,70);
				$headers = "From: info@webdamn.com";
				if(mail($toEmail, $subject, $msg, $headers)) {
					$message = "Verification email send to your email address. Please check email and verify to complete registration.";
				}
			} else {
				$message = "User register request failed.";
			}
		}
	}
	return $message;
}	

