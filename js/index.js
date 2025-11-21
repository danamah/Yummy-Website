// ^ ================ HTML Elements ===============
const logo = document.querySelector(".sidebar .image img");
const moonIcon = document.querySelector(
  ".theme-toggle i.fa-moon"
).parentElement;
const sunIcon = document.querySelector(".theme-toggle i.fa-sun").parentElement;
const sidebar = document.querySelector("div.sidebar");
const openBtn = document.getElementById("open");
const closeBtn = document.getElementById("close");
const mainPage = document.querySelector(".main-page");
const mainRow = mainPage.querySelector(".row");
const searchPage = document.querySelector(".search-page");
const categoryPage = document.querySelector(".category-page");
const categoriesContainer = document.getElementById("categoriesContainer");
const areaPage = document.querySelector(".area");
const areaContainer = areaPage.querySelector(".container");
const ingredientsPage = document.querySelector(".ingredients");
const ingredientsContainer = ingredientsPage.querySelector(".container");
const contactPage = document.querySelector(".contact");
const mealDetailsPage = document.createElement("div");
mealDetailsPage.className = "meal-details p-2 my-4 d-none";
mealDetailsPage.innerHTML = `<div class="container"><div class="row g-5" id="mealDetailsRow"></div></div>`;
document.body.appendChild(mealDetailsPage);
const searchByName = document.getElementById("searchByName");
const searchByLetter = document.getElementById("searchByLetter");
const searchResults = document.getElementById("searchResults");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const phoneInput = document.getElementById("phoneInput");
const ageInput = document.getElementById("ageInput");
const passwordInput = document.getElementById("passwordInput");
const repasswordInput = document.getElementById("repasswordInput");
const submitBtn = document.getElementById("submitBtn");

// ^ ============== Dark mode condition ==============
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  moonIcon.classList.add("d-none");
  sunIcon.classList.remove("d-none");
}

// ^ ================ Events =====================
// * after everything loading hide loading
window.addEventListener("load", function () {
  setTimeout(() => {
    document.querySelector(".loading").classList.add("hidden");
    setTimeout(() => {
      document.querySelector(".loading").remove();
    }, 600);
  }, 1000);
});
// * back to the default page
logo.addEventListener("click", function () {
  getDefaultMeals();
  showPage(mainPage);
  closeSidebar();
});
// * dark & light mode
moonIcon.addEventListener("click", function () {
  document.body.classList.add("dark-mode");
  moonIcon.classList.add("d-none");
  sunIcon.classList.remove("d-none");
  localStorage.setItem("theme", "dark");
});

sunIcon.addEventListener("click", function () {
  document.body.classList.remove("dark-mode");
  sunIcon.classList.add("d-none");
  moonIcon.classList.remove("d-none");
  localStorage.setItem("theme", "light");
});
// * close and open the side bar
openBtn.addEventListener("click", function () {
  openBtn.classList.remove("d-block");
  openBtn.classList.add("d-none");
  closeBtn.classList.remove("d-none");
  closeBtn.classList.add("d-block");
  sidebar.classList.remove("open");
  sidebar.classList.add("close");
  gsap.fromTo(
    ".chooseOne li",
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, stagger: 0.12, duration: 0.2, ease: "power2.out" }
  );
  anime({
    targets: ".left-side footer ul li",
    opacity: [0, 1],
    translateX: [-20, 0],
    easing: "easeOutQuad",
    duration: 200,
    delay: anime.stagger(100),
  });
});
closeBtn.addEventListener("click", function () {
  closeBtn.classList.remove("d-block");
  closeBtn.classList.add("d-none");
  openBtn.classList.add("d-block");
  openBtn.classList.remove("d-none");
  sidebar.classList.add("open");
  sidebar.classList.remove("close");
});
// * connect the side bar elements with pages
document.getElementById("search").addEventListener("click", function () {
  showPage(searchPage);
  closeSidebar();
});

document.getElementById("categories").addEventListener("click", function () {
  showPage(categoryPage);
  getCategories();
  closeSidebar();
});

document.getElementById("area").addEventListener("click", function () {
  showPage(areaPage);
  getAreas();
  closeSidebar();
});

document.getElementById("ingredients").addEventListener("click", function () {
  showPage(ingredientsPage);
  getIngredients();
  closeSidebar();
});

document.getElementById("contactUs").addEventListener("click", function () {
  showPage(contactPage);
  closeSidebar();
});
// * search by name
searchByName.addEventListener("input", function () {
  const term = this.value.trim();
  if (term) {
    searchMealsByName(term);
  } else {
    searchResults.innerHTML = "";
  }
  searchByLetter.value = "";
});
// * search by letter
searchByLetter.addEventListener("input", function () {
  const letter = this.value.trim();
  if (letter && letter.length === 1) {
    searchMealsByLetter(letter);
  } else if (letter === "") {
    searchResults.innerHTML = "";
  }
  searchByName.value = "";
});
// * validation
[
  nameInput,
  emailInput,
  phoneInput,
  ageInput,
  passwordInput,
  repasswordInput,
].forEach((input) => {
  input.addEventListener("input", checkAllValid);
});

// ^ ===================== functions =====================
// & displayMeals function
function displayMeals(meals) {
  let cartona = "";
  meals.forEach((meal) => {
    cartona += `
      <div class="col-12 col-md-6 col-lg-3">
        <div class="inner position-relative overflow-hidden rounded-3 shadow" data-id="${meal.idMeal}">
          <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="${meal.strMeal}" />
          <div class="layer d-flex align-items-center p-3">
            <h3 class="fs-2">${meal.strMeal}</h3>
          </div>
        </div>
      </div>
    `;
  });
  mainRow.innerHTML = cartona;

  // ~ addEventListener after each time we display the meals
  document.querySelectorAll(".main-page .inner").forEach((item) => {
    item.addEventListener("click", () => {
      getMealDetails(item.dataset.id);
    });
  });
}
// & general function to display meals after any filter
function displayMealsInMain(meals) {
  showPage(mainPage);
  displayMeals(meals);
}
// & getDefaultMeals function
async function getDefaultMeals() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s="
  );
  const data = await response.json();
  // ~ get first 20 meals
  displayMeals(data.meals.slice(0, 20));
}

// & getMealDetails function
async function getMealDetails(id) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await response.json();
  displayMealDetails(data.meals[0]);
}

// & display Meal details function
function displayMealDetails(meal) {
  const html = `
    <div class="col-lg-4">
      <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="${
    meal.strMeal
  }" />
      <h2 class="mt-3 text-white">${meal.strMeal}</h2>
    </div>
    <div class="col-lg-8 text-white">
      <h2>Instructions</h2>
      <p>${meal.strInstructions}</p>
      <h3>Area : <span class="fw-bolder">${meal.strArea}</span></h3>
      <h3>Category : <span class="fw-bolder">${meal.strCategory}</span></h3>
      <h3>Recipes :</h3>
      <div class="d-flex flex-wrap gap-3 mb-4 list-unstyled">
        ${getRecipes(meal)}
      </div>
      <h3>Tags :</h3>
      <p class="alert alert-danger d-inline-block p-1 mb-1">${
        meal.strTags?.split(",").join(" , ") || "No Tags"
      }</p>
      <h3 class="mb-1 mt-4">Sources & Youtube</h3>
      <div class="mt-2">
        <a href="${
          meal.strSource
        }" target="_blank" class="btn btn-success me-3">Source</a>
        <a href="${
          meal.strYoutube
        }" target="_blank" class="btn btn-danger">YouTube</a>
      </div>
    </div>
  `;

  document.getElementById("mealDetailsRow").innerHTML = html;
  showPage(mealDetailsPage);
  closeSidebar();
}

// & get Recipes function
function getRecipes(meal) {
  let recipes = "";
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      recipes += `<li class="alert alert-info p-2 m-2">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }
  return recipes;
}

// & Hide all pages and show only one
function showPage(page) {
  [
    mainPage,
    searchPage,
    categoryPage,
    areaPage,
    ingredientsPage,
    contactPage,
    mealDetailsPage,
  ].forEach((p) => p.classList.add("d-none"));
  page.classList.remove("d-none");
}
// & close Sidebar
function closeSidebar() {
  sidebar.classList.add("open");
  sidebar.classList.remove("close");
  openBtn.classList.remove("d-none");
  openBtn.classList.add("d-block");
  closeBtn.classList.remove("d-block");
  closeBtn.classList.add("d-none");
}

// & Search Meals by Name
async function searchMealsByName(name) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  const data = await response.json();
  displaySearchResults(data.meals || []);
}

// & Search Meals by letter
async function searchMealsByLetter(letter) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  const data = await response.json();
  displaySearchResults(data.meals || []);
}
// & display search result function
function displaySearchResults(meals) {
  let cartona = "";
  meals.forEach((meal) => {
    cartona += `
      <div class="col-12 col-md-6 col-lg-3">
        <div class="inner position-relative overflow-hidden rounded-3 shadow" data-id="${meal.idMeal}">
          <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="" />
          <div class="layer d-flex align-items-center p-3">
            <h3 class="fs-2">${meal.strMeal}</h3>
          </div>
        </div>
      </div>
    `;
  });
  searchResults.innerHTML =
    cartona || "<p class='text-center text-white'>No meals found</p>";

  document.querySelectorAll("#searchResults .inner").forEach((item) => {
    item.addEventListener("click", () => getMealDetails(item.dataset.id));
  });
}
// & get category function
async function getCategories() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  const data = await response.json();
  displayCategories(data.categories);
}
// & display Category function
function displayCategories(categories) {
  let cartona = "";
  for (let i = 0; i < categories.length; i++) {
    cartona += `
      <div class="col-12 col-md-6 col-lg-3">
        <div class="inner position-relative overflow-hidden rounded-3" onclick="getMealsByCategory('${
          categories[i].strCategory
        }')">
          <img class="img-fluid w-100" src="${
            categories[i].strCategoryThumb
          }" alt="" />
          <div class="layer">
            <h2>${categories[i].strCategory}</h2>
            <p>${categories[i].strCategoryDescription
              .split(" ")
              .slice(0, 20)
              .join(" ")}...</p>
          </div>
        </div>
      </div>
    `;
  }
  document.getElementById("categoriesContainer").innerHTML = cartona;
}
// & get meals by category function
async function getMealsByCategory(category) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  const data = await response.json();
  displayMealsInMain(data.meals.slice(0, 20));
}
// & get areas function
async function getAreas() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  const data = await response.json();
  displayAreas(data.meals);
}
async function getAreas() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  const data = await response.json();
  displayAreas(data.meals);
}
// & display area function
function displayAreas(areas) {
  let cartona = "";
  for (let i = 0; i < areas.length; i++) {
    cartona += `
      <div class="col-12 col-md-6 col-lg-3 text-center text-white" onclick="getMealsByArea('${areas[i].strArea}')">
        <i class="fa-solid fa-house-laptop fa-4x"></i>
        <h3 class="mt-3">${areas[i].strArea}</h3>
      </div>
    `;
  }
  areaPage.querySelector(
    ".container"
  ).innerHTML = `<div class="row g-4">${cartona}</div>`;
}
// & get meals by area
async function getMealsByArea(area) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  const data = await response.json();
  displayMealsInMain(data.meals.slice(0, 20));
}

// & get ingrediants
async function getIngredients() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  const data = await response.json();
  displayIngredients(data.meals.slice(0, 20));
}

// & display ingredients
function displayIngredients(ingredients) {
  let cartona = "";
  for (let i = 0; i < ingredients.length; i++) {
    cartona += `
      <div class="col-12 col-md-6 col-lg-3 text-center text-white" onclick="getMealsByIngredient('${
        ingredients[i].strIngredient
      }')">
        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
        <h3>${ingredients[i].strIngredient}</h3>
        <p>${
          ingredients[i].strDescription?.split(" ").slice(0, 20).join(" ") || ""
        }</p>
      </div>
    `;
  }
  ingredientsPage.querySelector(
    ".container"
  ).innerHTML = `<div class="row g-4">${cartona}</div>`;
}
// & get meals by ingredient
async function getMealsByIngredient(ingredient) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  const data = await response.json();
  displayMealsInMain(data.meals.slice(0, 20));
}
// & validation functions
// ~ ########### nameValidation function #############
function validateName() {
  const regex = /^[a-zA-Z\s]+$/;
  const alert = nameInput.parentElement.querySelector(".alert");
  if (regex.test(nameInput.value)) {
    alert.classList.add("d-none");
    return true;
  } else {
    alert.classList.remove("d-none");
    return false;
  }
}
// ~ ########### emailValidation function #############
function validateEmail() {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const alert = emailInput.parentElement.querySelector(".alert");
  if (regex.test(emailInput.value)) {
    alert.classList.add("d-none");
    return true;
  } else {
    alert.classList.remove("d-none");
    return false;
  }
}
// ~ ########### phoneValidation function #############
function validatePhone() {
  const regex = /^01[0125][0-9]{8}$/;
  const alert = phoneInput.parentElement.querySelector(".alert");
  if (regex.test(phoneInput.value)) {
    alert.classList.add("d-none");
    return true;
  } else {
    alert.classList.remove("d-none");
    return false;
  }
}
// ~ ########### ageValidation function #############
function validateAge() {
  const age = parseInt(ageInput.value);
  const alert = ageInput.parentElement.querySelector(".alert");
  if (age >= 16 && age <= 100) {
    alert.classList.add("d-none");
    return true;
  } else {
    alert.classList.remove("d-none");
    return false;
  }
}
// ~ ########### passwordValidation function #############
function validatePassword() {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const alert = passwordInput.parentElement.querySelector(".alert");
  if (regex.test(passwordInput.value)) {
    alert.classList.add("d-none");
    return true;
  } else {
    alert.classList.remove("d-none");
    return false;
  }
}
// ~ ########### repasswordValidation function #############
function validateRepassword() {
  const alert = repasswordInput.parentElement.querySelector(".alert");
  if (
    repasswordInput.value === passwordInput.value &&
    passwordInput.value !== ""
  ) {
    alert.classList.add("d-none");
    return true;
  } else {
    alert.classList.remove("d-none");
    return false;
  }
}
// ~ ########### checkAll valid function #############
function checkAllValid() {
  if (
    validateName() &&
    validateEmail() &&
    validatePhone() &&
    validateAge() &&
    validatePassword() &&
    validateRepassword()
  ) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
}

getDefaultMeals();
