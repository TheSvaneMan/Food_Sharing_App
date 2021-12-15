/* ---------- Backend Services --------- */
// ApplicationService will deal with Data manipulation: Loading, Filters, Images, etc
const _baseUrl = 'backend/applicationService.php/';
// MessageSystem handles all messages
const _messageUrl = 'backend/messagingSystem/B_MessageService.php';
// The SercurityService handles Authentication, Account Creation, Logout, Tracking User State(Online, Offline), etc
// The MessageService will handle Inbox :)
/* ---- Global Variables ---- */
let _selectedProductID;
let _searchMetric = 'search';
let _feedbackQuery = 'general';
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
	checkActiveUser();
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
	loadCheckList();
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

// Toggle Filter Component Visibility
function ToggleFilters() {
	let filterBar = document.getElementById('filterComponent');
	if (filterBar.style.display === 'none') {
		filterBar.style.display = 'grid';
	} else {
		filterBar.style.display = 'none';
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

async function loadCatAndAllergyData(id) {
	const url = _baseUrl + '?action=getCategoryAndAllergies&value=' + id;
	const response = await fetch(url);
	const data = await response.json();
	_catAndAllergyData = data;
}

function loadCheckList() {
	let categories = [
		'Dairy',
		'Fruit',
		'Grain',
		'Beans',
		'Meat',
		'Confections',
		'Vegetable',
		'Water',
	];
	let htmlTemplateCategory = '';
	for (const cat of categories) {
		htmlTemplateCategory += /*html*/ `
		<li><input type="checkbox" id=cat${cat} value=${cat}><label for=cat${cat}>${cat}</label></li>
		`;
	}
	let allergies = [
		'Grain',
		'Milk',
		'Eggs',
		'Fish',
		'ShellFish',
		'Almonds',
		'Pecans',
		'Peanuts',
		'Wheat',
		'Soybeans',
		'Sesame',
		'BrazilNuts',
		'Cashews',
		'Pistachios',
		'Walnuts',
		'Hazelnuts',
		'Cinnamon',
	];

	let htmlTemplateAllergies = '';
	for (const allergy of allergies) {
		htmlTemplateAllergies += /*html*/ `
		<li><input type="checkbox" id=allergy${allergy} value=${allergy}><label for=allergy${allergy}>${allergy}</label></li>
		`;
	}
	document.querySelector('#foodCategories').innerHTML = htmlTemplateCategory;
	document.querySelector('#foodAllergies').innerHTML = htmlTemplateAllergies;
}

// ========== Appending Data Services ==========
// Adds meals to the DOM Browse
function appendMeals(allFood) {
	let htmlTemplate = '';
	for (const food of allFood) {
		htmlTemplate += /*html*/ `
			<article onclick="showDetails(${food.food_id})" class="foodComponent">
					<div class="foodContent" id="browse">
						<img
							class="foodImage"
							src="backend/${food.foodImageDir}"
							alt="${food.foodImageDir}"
						/>
						<h4 class="foodDescription">${food.foodDescription}</h4>
						<br>
						<h5 class="foodDescription">From  ${food.foodOwner}</h5>
						<br>
						<h4 class="foodDescription">${food.foodPrice}kr</h4>
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
	await loadCatAndAllergyData(id);
	appendFood(selectedMeal);
	navigateTo('#/selectedMeal');
}

// append single Food Item
function appendFood(food) {
	let htmlTemplate = '';
	// Front-end data tidying, maybe not best practice
	let foodContainer = '';
	if (food.foodContainer == 1) {
		foodContainer = 'Yes';
	} else {
		foodContainer = 'No';
	}
	let foodCooked = '';
	if (food.foodCooked == 1) {
		foodCooked = 'Yes';
	} else {
		foodCooked = 'No';
	}
	htmlTemplate += /*html*/ `
			<img class="foodImage" src="backend/${food.foodImageDir}" alt="Food Image" />
			
			<p>Food Name: ${food.foodName}</p>
			<p id="subtitle">From Penda ${food.foodOwner}</p>
			<p>ID: ${food.food_id}</p>
			<b>Description</b>
			<p>${food.foodDescription}</p>
			<b>Has a container?</b>
			<p>${foodContainer}</p>
			<b>The meal is cooked:</b>
			<p>${foodCooked}</p>
			<h3 id="itemprice">${food.foodPrice}kr</h3>
			<hr class="solid">
			<h3>Pickup Location</h3>
			<p id="subtitle" style="margin-bottom: 10px;">${food.foodLocation}</p>
			<div class="imgcontainer">
				<img class="foodImage" src="assets/tmp_Map.png" alt="Food Image" />
			</div>
			<hr class="solid">
			<b>Date Added</b>
			<p>${food.dateAdded}</p>
			<b>Best Before Date</b>
			<p>${food.bestBeforeDate}</p>
			<hr class="solid">
			<b>Categories</b>
			<section class="foodTag" id="selected-meal-cat"></section>
			<b>Allergies</b>
			<section class="foodTag" id="selected-meal-allergy"></section>
			<section class="buttongrid">
				<button id="buybtn" class="defaultButton" onclick="purchaseFood()">Buy</button>
				<button id="messagebtn" class="defaultButton" onclick="messageUser(${food.foodOwner})">Message</button>
			</section>
		`;
	// Create local array that contains the food cat items
	let htmlTemplateCat = '';
	if (_catAndAllergyData.category.length == 0) {
		htmlTemplateCat += /*html*/ `
		<div class="foodTagWarning" >No category implicitly defined</div>
		`;
	} else {
		_catAndAllergyData.category.forEach((element) => {
			htmlTemplateCat += /*html*/ `
		<div class="foodCategory">${element.foodGroup}</div>
		`;
		});
	}
	// Create local array that contains the food allergy items
	let htmlTemplateAllergy = '';
	if (_catAndAllergyData.allergy.length == 0) {
		htmlTemplateAllergy += /*html*/ `
		<div class="foodTagWarning" >No allergies implicitly defined, make sure to read description :)</div>
		`;
	} else {
		_catAndAllergyData.allergy.forEach((element) => {
			htmlTemplateAllergy += /*html*/ `
		<div class="foodAllergy">${element.allergyName}</div>
		`;
		});
	}

	document.querySelector('#selected-meal').innerHTML = htmlTemplate;
	document.querySelector('#selected-meal-cat').innerHTML = htmlTemplateCat;
	document.querySelector('#selected-meal-allergy').innerHTML =
		htmlTemplateAllergy;
}

// ========== My Store Functions ==========
function purchaseFood() {
	alert(
		'Work in progress functionality. Good job buying a virtual meal. Enjoy!'
	);
}

// ========== My Store Functions ==========
// Appends Meals to MyStore and only shows items user uploaded
function appendMyStore(foods) {
	let htmlTemplate = '';
	for (food of foods) {
		htmlTemplate += /*html*/ `
			<article class="foodComponent" id="mystorecomp">
				<div class="foodcontent" id="mystore">
					<img class="foodImage" src="backend/${food.foodImageDir}" alt="${food.foodImageDir}" />
					<h3 class="description">${food.foodName}</h3>
					<div class="foodFunctions">
						<button class="defaultButton" id="storebtn" style="margin-right: 7px;" onclick="deleteFood(${food.food_id})" >Delete</button>
						<button class="defaultButton" id="storebtn" onclick="showFoodDetails(${food.food_id})" >Edit</button>
					</div>
				</div>
			</article>
			<!-- <article class="foodComponent">
			<div class="foodHeader">
						<img
							class="foodImage"
							src="assets/tmp_food.png"
							alt=""
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
			</article> -->
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

// ========== Delete Functions ==========
// Delete Food Item (User Owned)
async function deleteFood(foodID) {
	const url = _baseUrl + '?action=deleteFood&value=' + foodID;
	const response = await fetch(url);
	// Load My Store Page once successful delete
	// Do something better with response data
	showMyStorePage();
}

// ========== Filter Functions ==========
// Filters
async function filterFood(value) {
	htmlTemplate = '';
	const options = {
		method: 'GET',
	};
	let response = await fetch(
		_baseUrl + '?action=filterFood&value=' + value,
		options
	);
	let data = await response.json();
	console.log(data);
	appendMeals(data);
	// Update UI to notify User which filter they have selected
	htmlTemplate += /*html*/ `
			<p>Current Filter: ${value}</p>
		`;
	document.querySelector('#selectedFilter').innerHTML = htmlTemplate;
}

// Clear Filters
async function clearFilters() {
	htmlTemplate = '';
	await loadFood();
	// Update UI to notify User which filter they have selected
	htmlTemplate += /*html*/ `
			<p>No filter selected</p>
		`;
	document.querySelector('#selectedFilter').innerHTML = htmlTemplate;
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
function SetSearch(value) {
	htmlTemplate = '';
	_searchMetric = value;
	// Update UI to notify User of current Search Criteria
	htmlTemplate += /*html*/ `
			<p>Currently Searching by: ${value}</p>
		`;
	document.querySelector('#selectedSearch').innerHTML = htmlTemplate;
}

function SetFeedbackQuery(value) {
	_feedbackQuery = value;
}
// Dynamic Search Function
async function search(searchString) {
	const options = {
		method: 'GET',
	};
	let response = await fetch(
		_baseUrl + '?action=' + _searchMetric + '&value=' + searchString,
		options
	);
	let data = await response.json();
	appendMeals(data);
}

// ========== Search Function ==========
fileToUpload.onchange = (event) => {
	const [file] = fileToUpload.files;
	if (file) {
		clientImage.src = URL.createObjectURL(file);
	}
};

// ========== Add New Food Product ==========
async function AddNewFoodProduct() {
	await UploadFoodImage();
	await AddFoodProduct();
}

// ========== Upload Product Image ==========
async function UploadFoodImage() {
	let image = document.getElementById('fileToUpload');
	let formData = new FormData();
	formData.append(image.name, image.files[0]);

	const options = {
		method: 'POST',
		body: formData,
	};
	await fetch(_baseUrl + '?action=upload', options).then((response) => {
		result = response.json();
		// showHomePage();
	});
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
	foodCooked = document.getElementById('newProductFoodCooked').checked;
	if (foodCooked == true) {
		foodCooked = 1;
	} else {
		foodCooked = 0;
	}
	// Food Category
	catDairy = document.getElementById('catDairy').checked;
	catFruit = document.getElementById('catFruit').checked;
	catGrain = document.getElementById('catGrain').checked;
	catBeans = document.getElementById('catBeans').checked;
	catMeat = document.getElementById('catMeat').checked;
	catConfections = document.getElementById('catConfections').checked;
	catVegetable = document.getElementById('catVegetable').checked;
	catWater = document.getElementById('catWater').checked;
	// Food Category Object
	foodCategory = {
		Dairy: catDairy,
		Fruit: catFruit,
		Grains: catGrain,
		Beans: catBeans,
		Meat: catMeat,
		Confections: catConfections,
		Vegetables: catVegetable,
		Water: catWater,
	};

	// Food Allergies
	allergyMilk = document.getElementById('allergyMilk').checked;
	allergyEggs = document.getElementById('allergyEggs').checked;
	allergyFish = document.getElementById('allergyFish').checked;
	allergyShellFish = document.getElementById('allergyShellFish').checked;
	allergyAlmonds = document.getElementById('allergyAlmonds').checked;
	allergyPecans = document.getElementById('allergyPecans').checked;
	allergyPeanuts = document.getElementById('allergyPeanuts').checked;
	allergyWheat = document.getElementById('allergyWheat').checked;
	allergySoybeans = document.getElementById('allergySoybeans').checked;
	allergyBrazilNuts = document.getElementById('allergyBrazilNuts').checked;
	allergySesame = document.getElementById('allergySesame').checked;
	allergyCashews = document.getElementById('allergyCashews').checked;
	allergyPistachios = document.getElementById('allergyPistachios').checked;
	allergyWalnuts = document.getElementById('allergyWalnuts').checked;
	allergyHazelnuts = document.getElementById('allergyHazelnuts').checked;
	allergyCinnamon = document.getElementById('allergyCinnamon').checked;
	// Food Allergy Object
	foodAllergy = {
		milk: allergyMilk,
		eggs: allergyEggs,
		fish: allergyFish,
		shellfish: allergyShellFish,
		almonds: allergyAlmonds,
		pecans: allergyPecans,
		peanuts: allergyPeanuts,
		wheat: allergyWheat,
		soybeans: allergySoybeans,
		sesame: allergySesame,
		brazilNuts: allergyBrazilNuts,
		cashew: allergyCashews,
		pistachios: allergyPistachios,
		walnutsAllergy: allergyWalnuts,
		hazelnutsAllergy: allergyHazelnuts,
		cinnamonAllergy: allergyCinnamon,
	};
	// Food Price
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
		FoodCooked: foodCooked,
		FoodCategory: foodCategory,
		FoodAllergy: foodAllergy,
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
		result = response.json();
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
const img = document.getElementById('clientImage');
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

// ========== Inbox System ==========
// Sort messages into chats
function appendMessages(messages) {
	console.log(messages);
	let htmlTemplateInbox = '';
	for (const message of messages) {
		// Filter messages into received and sent
		if (message.sentby == _currentUserID) {
			// Outbox
			htmlTemplateInbox += /*html*/ `
				<div class="messageComponent">
					<div class="messageHeader">	
						<p>From: </p><b>${message.sentby}</b>
						<p>To:</p><b> ${message.sentto}</b>
						<p>${message.created}</p>
					</div>
					<div class="messageContentSent">
						<p>${message.message} </p>
					</div>
				</div>
			`;
		} else if (message.sentto == _currentUserID) {
			// Inbox
			htmlTemplateInbox += /*html*/ `
				<div class="messageComponent">
					<div class="messageHeader">	
						<p>From: </p><b>${message.sentby}</b>
						<p>To:</p><b> ${message.sentto}</b>
						<p>${message.created}</p>
					</div>
					<div class="messageContentReceive">
						<p>${message.message} </p>
					</div>
				</div>
			`;
		}
	}
	document.querySelector('#user-inbox').innerHTML = htmlTemplateInbox;
}

function messageUser(id) {
	let chatBox = document.getElementById('chatBox');
	chatBox.style.display = 'grid';
	_messageUserId = id;
}

// Message Chat Box
function toggleChatBox() {
	let chatBox = document.getElementById('chatBox');
	chatBox.style.display = 'none';
}

function confirmReceiver() {
	// Prints out the Receiver ID to confirm you selected the right person
	// Debugging purposes
	console.log(_messageUserId);
}

async function sendMessage(receiverID) {
	// Message data collection
	let messageData = document.getElementById('messageData').value;
	// Message Parameters
	const params = {
		receiver: _messageUserId,
		message: messageData,
	};
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
		body: JSON.stringify(params),
	};

	await fetch(_messageUrl + '?action=sendMessage', options).then((response) => {
		let result = response.json();
		alert('Message Successfully sent :)');
		toggleChatBox();
	});
}

// -------------- FEEDBACK FEATURE ------------- //
// Feedback Box
function toggleFeedbackBox() {
	let chatBox = document.getElementById('feedbackBox');
	chatBox.style.display = 'none';
}

function OpenFeedback() {
	let chatBox = document.getElementById('feedbackBox');
	chatBox.style.display = 'grid';
}

async function SendFeedBack() {
	// Message data collection
	let queryData = _feedbackQuery;
	let messageData = document.getElementById('feedbackMessageData').value;
	// Message Parameters
	const params = {
		query: queryData,
		message: messageData,
	};
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
		body: JSON.stringify(params),
	};

	await fetch(_messageUrl + '?action=sendFeedback', options).then(
		(response) => {
			let result = response.json();
			alert('Feedback Successfully sent :)');
			toggleFeedbackBox();
		}
	);
}
// ========== Image Recognition Feature ==========
function predictFood() {
	let chatBox = document.getElementById('imagePredictionBox');
	let img = document.getElementById('clientImage');
	chatBox.style.display = 'grid';
	// Load the model.
	mobilenet.load().then((model) => {
		// Classify the image.
		model.classify(img).then((predictions) => {
			console.log('Predictions: ');
			console.log(predictions);
			let htmlTemplate = '';
			for (const prediction of predictions) {
				htmlTemplate += /*html*/ `
					<li class="imageEstimates">
						Guestimate:<b>${prediction.className}</b>
						<br>
						Probability:<b>${prediction.probability}</b>
					</li>
					
				`;
			}
			document.getElementById('imagePredictions').innerHTML = htmlTemplate;
		});
	});
}

// Message Chat Box
function togglePredictionBox() {
	let chatBox = document.getElementById('imagePredictionBox');
	chatBox.style.display = 'none';
}

// Get the active user from Server
async function checkActiveUser() {
	const url = _security + '?action=activeUser';
	const response = await fetch(url);
	const data = await response.json();
	_currentUserID = data;
	console.log(_currentUserID);
}

// ========== INIT APP ==========
function init() {
	checkActiveUser();
	if (location.hash === '#/') {
		showStartPage();
	} else if (location.hash === '#/browse') {
		showHomePage();
	} else if (location.hash === '#/myStore') {
		loadMyStoreFood();
	} else if (location.hash === '#/addNewProduct') {
		loadCheckList();
	} else if (location.hash === '#/inbox') {
		checkActiveUser();
		loadMessages();
	}
}

init();
