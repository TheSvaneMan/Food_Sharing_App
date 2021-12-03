<?php
// ---------------- Instantiate Required Classes ------------ //
class Security
{
    public $mySQL;
    private $userLogin;
    private $userSignUp;
    private $logOut;
    public $userSettings;
    public $searchFilter;
    public $userSearch;

    public function __construct($mySQL)
    {
        $this->mySQL = $mySQL;
        // Use connect function to establish a connection
        $this->mySQL->Connect();
        // ------------ Instantiate child Class ------------------- //
        // New login class instance, handles data verification process
        $this->userLogin = new Login();
        // Sign Up intance, handles all sign up processes
        $this->userSignUp = new SignUp();
        // Log Out class
        $this->LogOut = new LogOut();
        // Instantiate Search
        $this->userSearch = new UserSearch();
    }
    // --------------------------- Sign Up ----------------------- //
    // Sign Up Form password encryption
    public function SignUp($email, $password)
    {
        // Handles Sign up calls and password encryption
        $this->userSignUp->SignUp($email, $password, $this->mySQL);
    }
    // ---------------------------- Login ------------------------ //
    // Login Form password verification
    public function Login($email, $password)
    {
        // Handles verification
        $this->userLogin->LoginUser($email, $password, $this->mySQL);
    }
    // ---------------------------- Logout ------------------------ //
    public function LogOut()
    {
        // Logout
        $this->LogOut->LogOut($this->mySQL);
    }
    // ---------------------------- Set Current User ------------------------ //
    public function SearchUser($sql)
    {
        $this->userSearch->searchUser($this->mySQL, $sql);
    }
}
?>