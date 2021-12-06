/* ---------- Backend Services --------- */
// ApplicationService will deal with Data manipulation: Loading, Filters, Images, etc
const _baseUrl = 'backend/applicationService.php/';
// The SercurityService handles Authentication, Account Creation, Logout, Tracking User State(Online, Offline), etc
// The MessageService will handle Inbox :)
/* ---- Global Variables ---- */
let _selectedProductID;
// ========== Usability Function ==========
async function checkActiveUser() {
	const url = _security + '?action=activeUser';
	const response = await fetch(url);
	const data = await response.json();
	_currentUserID = data;
	console.log(_currentUserID);
}

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
	loadFood();
}
// Show Store Page
function showMyStorePage() {
	navigateTo('#/myStore');
	loadMyStoreFood();
}
// Add New Product Page
function showAddNewProductPage() {
	navigateTo('#/addNewProduct');
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
		headers: { 'Content-Type': 'application/json; chartype=utf-8' },
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

// ========== Data Retrieval Services ==========
/* Fetch all food data from php backend services, except the users */
async function loadFood() {
	const url = _baseUrl + '?action=getFood';
	const response = await fetch(url);
	const data = await response.json();
	_foods = data;
	appendMeals(_foods);
}

/* Fetch only food uploaded by the user */
async function loadMyStoreFood() {
	const url = _baseUrl + '?action=getUserFood';
	const response = await fetch(url);
	const data = await response.json();
	_userFoods = data;
	appendMyStore(_userFoods);
}

async function loadMessages() {
	const url = _messageUrl + '?action=getMessages';
	const response = await fetch(url);
	const data = await response.json();
	_messages = data;
	appendMessages(_messages);
}

// ========== Appending Data Services ==========
// Adds meals to the DOM Browse
function appendMeals(allFood) {
	let htmlTemplate = '';
	for (const food of allFood) {
		htmlTemplate += /*html*/ `
			<article onclick="showDetails(${food.food_id})" class="foodComponent">
					<div class="foodHeader">
						<img
							class="foodImage"
							src="assets/tmp_food.png"
							alt="${food.foodImageDir}"
						/>
						<div class="foodPrice">Price: ${food.foodPrice}</div>
					</div>
					<div class="foodContent">
						<div class="foodDescription">
							<p>${food.foodDescription}</p>
						</div>
						<div class="foodDescription">
							<p>From: ${food.foodOwner}</p>
							<p>Uploaded: ${food.dateAdded}</p>
							<p>Best before: ${food.bestBeforeDate}</p>
						</div>
						<div class="foodFunctions">
							<button class="defaultButton">Buy</button>
						</div>
					</div>
				</article>
		`;
	}
	document.querySelector('#listedItems').innerHTML = htmlTemplate;
}

// Show Selected Meal Details
async function showDetails(id) {
	_selectedProductID = id;
	localStorage.setItem('selectedFoodId', _selectedProductID);
	const selectedMeal = _foods.find((food) => food.food_id == id);
	appendFood(selectedMeal);
	navigateTo('#/selectedMeal');
}

// append single Food Item
function appendFood(food) {
	let htmlTemplate = '';
	htmlTemplate += /*html*/ `
			<article class="user-item">
			<h3>ID: ${food.food_id}</h3>
			<p>Food Name: ${food.foodName}</p>
			<img class="foodImage" src="assets/tmp_food.png" alt="Food Image" />
			<p>ImageURL: ${food.foodImageDir} </p>
			<p>Description: ${food.foodDescription}</p>
			<p>Has a container: ${food.foodContainer}</p>
			<p>Price: ${food.foodPrice}</p>
			<p>Uploaded By: ${food.foodOwner}</p>
			<p>Pickup Location: ${food.foodLocation}</p>
			<p>Date Added: ${food.dateAdded}</p>
			<p>Best Before Date: ${food.bestBeforeDate}</p>
			<button class="defaultButton" onclick="purchaseFood(${food.food_id})">Buy</button>
			<button class="defaultButton">Message</button>
			</article>
		`;
	document.querySelector('#selected-meal').innerHTML = htmlTemplate;
}

// ========== My Store Functions ==========
// Appends Meals to MyStore and only shows items I uploaded
function appendMyStore(foods) {
	let htmlTemplate = '';
	for (food of foods) {
		htmlTemplate += /*html*/ `
			<article class="foodComponent">
			<div class="foodHeader">
						<img
							class="foodImage"
							src="assets/tmp_food.png"
							alt=" ${food.foodImageDir}"
						/>
						<div class="foodPrice">Price:  ${food.foodPrice}</div>
					</div>
				<div class="foodContent">
						<div class="foodDescription">
							<p>Name: ${food.foodName}</p>
							<p>Description: ${food.foodDescription}</p>
							<p>Has a container: ${food.foodContainer}</p>
							<p>Pickup Location: ${food.foodLocation}</p>
							<p>Added: ${food.dateAdded}</p>
							<p>Best before date: ${food.bestBeforeDate}</p>
						</div>
						<div class="foodFunctions">
							<button class="greenActionButton" onclick="showFoodDetails(${food.food_id})" >Update</button>
							<button class="redActionButton" onclick="deleteFood(${food.food_id})" >Delete</button>
						</div>
					</div>
			</article>
		`;
	}
	document.querySelector('#myStoreItems').innerHTML = htmlTemplate;
}

// Show Selected Food (User Owned) Details
async function showFoodDetails(id) {
	_selectedProductID = id;
	localStorage.setItem('selectedFoodId', _selectedProductID);
	const selectedMeal = _userFoods.find((food) => food.food_id == id);
	// references to the input fields
	let nameInput = document.querySelector('#name-update');
	let descriptionInput = document.querySelector('#description-update');
	let priceInput = document.querySelector('#price-update');
	let locationInput = document.querySelector('#location-update');
	// let bestBeforeInput = document.querySelector('#best-before-update');
	// set indout values with selected user values
	nameInput.value = selectedMeal.foodName;
	descriptionInput.value = selectedMeal.foodDescription;
	priceInput.value = selectedMeal.foodPrice;
	locationInput.value = selectedMeal.foodLocation;
	navigateTo('#/updateFood');
}

// Delete Food Item (User Owned)
async function deleteFood(foodID) {
	const url = _baseUrl + '?action=deleteFood&value=' + foodID;
	const response = await fetch(url);
	// Load My Store Page once successful delete
	// Do something better with response data
	showMyStorePage();
}

// ========== Update Functions ==========
/* Updates Food Product with values from input fields*/
async function updateFood() {
	//showLoader(true);
	// references to input fields
	let nameInput = document.querySelector('#name-update');
	let descriptionInput = document.querySelector('#description-update');
	let priceInput = document.querySelector('#price-update');
	let locationInput = document.querySelector('#location-update');
	// find user to update by given user id
	//const foodToUpdate = _userFoods.find(
	//	(food) => food.food_id === _selectedProductID
	// );
	// update values of user in array
	//foodToUpdate.foodName = nameInput.value;
	//foodToUpdate.foodDescription = descriptionInput.value;
	//foodToUpdate.foodPrice = priceInput.value;
	//foodToUpdate.foodLocation = locationInput.value;
	// Create Updated food object with new data
	const params = {
		FoodID: _selectedProductID,
		FoodName: nameInput.value,
		FoodDescription: descriptionInput.value,
		FoodPrice: priceInput.value,
		FoodLocation: locationInput.value,
	};
	// wait for update
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
		body: JSON.stringify(params),
	};
	// Put new data to server
	// waiting for the result
	await fetch(_baseUrl + '?action=updateMeal', options).then((response) => {
		let result = response.json();
		console.log(result);
		// Check if upload was success of not, notify user on each case
	});
	// reset
	nameInput.value = '';
	descriptionInput.value = '';
	priceInput.value = '';
	locationInput.value = '';
	//navigating back
	// navigateTo('#/myStore');
}

// ========== Search Function ==========
async function search(searchString) {
	const options = {
		method: 'GET',
	};
	let response = await fetch(
		_baseUrl + '?action=search&value=' + searchString,
		options
	);
	let data = await response.json();
	appendMeals(data);
}

// ========== Add Food Product ==========
async function AddFoodProduct() {
	foodName = document.getElementById('newProductName').value;
	foodDescription = document.getElementById('newProductDescription').value;
	foodLocation = document.getElementById('newProductPickUpLoc').value;
	foodContainer = document.getElementById('newProductFoodContainer').checked;
	if (foodContainer == true) {
		foodContainer = 1;
	} else {
		foodContainer = 0;
	}
	// Multiple choice, must be an array
	foodCategory = [];
	// foodCategory = document.getElementById('foodCategory').value;
	// Multiple choice, must be an array
	foodAllergies = [];
	// Call a different JS Function to loop through allergies and categories selected
	// And add them to the database
	// foodAllergies = document.getElementById('foodAllgeries').value;
	foodPrice = document.getElementById('newProductPrice').value;
	foodImage = 'A directory';
	bestBeforeDay = document.getElementById('bestBeforeDate').value;
	// Convert Date to string
	let bestBeforeDate = bestBeforeDay.toString();
	foodFree = document.getElementById('newProductIsFree').checked;
	if (foodFree == true) {
		foodFree = 1;
	} else {
		foodFree = 0;
	}
	// Create the relevant inputs for each.
	const params = {
		FoodName: foodName,
		FoodImage: foodImage,
		FoodDescription: foodDescription,
		FoodContainer: foodContainer,
		FoodPrice: foodPrice,
		FoodLocation: foodLocation,
		FoodBestBeforeDate: bestBeforeDate,
		FoodFreeLastDay: foodFree,
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
		// Check if upload was success of not, notify user on each case
		showHomePage();
	});
}

// ========== Google Maps ==========
/* function myMap() {
	var mapProp = {
		center: new google.maps.LatLng(51.508742, -0.12085),
		zoom: 5,
	};
	var map = new google.maps.Map(document.getElementById('googleMap'), mapProp);
} */

// ========== Image Recognition Feature ==========
const img = document.getElementById('testImg');

function predictFood() {
	// Load the model.
	mobilenet.load().then((model) => {
		// Classify the image.
		model.classify(img).then((predictions) => {
			console.log('Predictions: ');
			console.log(predictions);
		});
	});
}

// ========== INIT APP ==========
function init() {
	// checkActiveUser();
	if (location.hash === '#/') {
		showStartPage();
	} else if (location.hash === '#/browse') {
		showHomePage();
	} else if (location.hash === '#/myStore') {
		loadMyStoreFood();
	}
}

init();
