/* ---------- Backend Services --------- */
// ApplicationService will deal with Data manipulation: Loading, Filters, Images, etc
const _baseUrl = 'backend/applicationService.php/';
// The SercurityService handles Authentication, Account Creation, Logout, Tracking User State(Online, Offline), etc
// The MessageService will handle Inbox :)
/* ---- Global Variables ---- */

// ========== Navigation Controls ==========
// Show Home Page
function showStartPage() {
	navigateTo('#/');
}
// Show Login Page
function showLoginPage() {
	navigateTo('#/login');
}
// Show Signup Page
function showSignUpPage() {
	navigateTo('#/signup');
}

// Show Home Page
function showHomePage() {
	navigateTo('#/browse');
}

// ========== Sign Up Procedure ==========
// Create Account
async function createUserEvent() {
	const firstname = document.getElementById('signUpFirstName').value;
	const lastname = document.getElementById('signUpLastName').value;
	const email = document.getElementById('signUpEmail').value;
	const password = document.getElementById('signUpPassword').value;
	const city = document.getElementById('signUpCity').value;
	const country = document.getElementById('signUpCountry').value;
	const postalCode = document.getElementById('signUpPostalCode').value;
	const birthday = document.getElementById('signUpBirthday').value;
	const interest = document.getElementById('signUpInterestedIn').value;
	// Convert Date to string
	let birthdate = birthday.toString();
	if (
		firstname &&
		lastname &&
		email &&
		password &&
		city &&
		country &&
		postalCode &&
		birthdate &&
		interest
	) {
		await createUser(
			firstname,
			lastname,
			email,
			password,
			city,
			country,
			postalCode,
			birthdate,
			interest
		);
	} else {
		alert(' Please fill in all fields.');
	}
}

async function createUser(
	firstname,
	lastname,
	email,
	password,
	city,
	country,
	postalCode,
	birthday,
	interest
) {
	const newUser = {
		Firstname: firstname,
		Lastname: lastname,
		Email: email,
		Password: password,
		City: city,
		Country: country,
		PostalCode: postalCode,
		Birthday: birthday,
		InterestedIn: interest,
	};
	console.log(newUser);
	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json; chartype=utf-8' },
		body: JSON.stringify(newUser),
	};

	const response = await fetch(_security + '?action=signUp', options);
	// Wait for server response
	const result = await response.json();
	// Automatically logs in user via Backend.
	showHomePage(); // Navigate to Login Page
}

// ========== Login Procedure ==========
async function login() {
	emailRaw = document.getElementById('loginEmail').value;
	passwordRaw = document.getElementById('loginPassword').value;
	// Basic validation
	let email = emailRaw.toLowerCase();
	let password = passwordRaw.toLowerCase();
	const params = {
		Email: email,
		Password: password,
	};
	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json; chartype=utf-8' },
		body: JSON.stringify(params),
	};
	const response = await fetch(_security + '?action=login', options);
	// Wait for server response
	// The response object could be useful in the future, we can make tailored experiences
	// Based on the content of the response object returned from server after a code execution.
	const result = await response.json();
	showHomePage(); // Navigate to Home Page
}

// Toggle Password Visibility
function TogglePasswordVisibility() {
	var pass = document.getElementById('loginPassword');
	if (pass.type === 'password') {
		pass.type = 'text';
	} else {
		pass.type = 'password';
	}
}

// ========== Logout Procedure ==========
async function LogOut() {
	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json; chartype=utf-8' }
	};
	const response = await fetch(_security + '?action=logOut', options);
	// Wait for server response
	const result = await response.json();
	// Show start page
	showStartPage();
}

// ----------------- TO DO: ----------------------------

// Total sales
// Total purchases
// ========== Food System ==========
// MVP --- !! IMPORTANT ----------- MVP

// Add new Food Product
// Add drop-down to make Filter option --
// ---------- Browse UX -------------
// Food Price / Arrow for highest, lowest, and price (Search field)
// Food Category (Drop Down)
// Food Allergies
// This filter should be used both on Browse and Explore (Dynamic Component)


// ========== Additional Systems ==========
// Keeping track of the transaction state happens only after the user clicks "Buy", (?) 
// Col saying if it is sold.
// Only on transaction complete/ sold can you make a review.
// Save date item sold. NOW().
// Option to update rating on completed purchase screen. Confirm rating button,
// Boolean prevents User from updating review after confirmation.
// Remember to check image file size before upload, use js && php.

// Inbox system shows list of conversations

// User settings : Dark Mode, Background Wallpaper, Colors, etc

// I have one other fun feature to add but lets get the CRUD working on items :D 

async function AddFoodProduct() {
	foodName = document.getElementById('foodName').value;
	foodDescription = document.getElementById('foodDescription').value;
	// Multiple choice, must be an array
	foodCategory = [];
	foodCategory = document.getElementById('foodCategory').value;
	// Multiple choice, must be an array
	foodAllergies = [];
	foodAllergies = document.getElementById('foodAllgeries').value;
	foodImage = document.getElementById('foodImage').value;
	// Create the relevant inputs for each.
	const params = {
		FoodName: foodName,
		FoodDescription: foodDescription,
		FoodDescription: foodCategory,
		FoodAllergies: foodAllergies,
		FoodImage: foodImage,
	};
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
		body: JSON.stringify(params),
	};
	await fetch(_baseUrl + '?action=addNewFood', options).then((response) => {
		let result = response.json();
	});
}
