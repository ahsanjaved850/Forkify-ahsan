// import icons from "img/icons.svg"; //parcel 1
import icons from "url:/img/icons.svg"; //parcel 2
import "core-js/stable";
import "regenerator-runtime/runtime";

const result = document.querySelector(".results");
const search = document.querySelector(".search__field");
const searchBtn = document.querySelector(".search__btn");
const recipeDisplay = document.querySelector(".recipe");
const pagination = document.querySelector(".pagination");
const addRecipe = document.querySelector(".nav__btn--add-recipe");
const overlay = document.querySelector(".overlay");
const recipeWindow = document.querySelector(".add-recipe-window");
const closeBtn = document.querySelector(".btn--close-modal");
const bookmarkList = document.querySelector(".bookmarks__list");
const message = document.querySelector(".message");
const recipesPerPage = 10;
let bkId;
let bkImgUrl;
let bkPub;
let bkTitle;
let recipeId;
let results = [];
let currentPage = 1;
let nextPage;
let currentServings = 0;

//////////////////////
// Spinner Rendering
const renderSpinner = function (parentEl) {
  const markup = `
      <div class="spinner">
          <svg>
              <use href="${icons}#icon-loader"></use>
          </svg>
      </div>
      `;
  parentEl.innerHTML = "";
  parentEl.insertAdjacentHTML("afterbegin", markup);
};

//////////////////////////
// Rendering the Search Result
const showRecipe = async function (inp) {
  try {
    result.innerHTML = "";
    renderSpinner(result);
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes?search=${inp}&key=171782c3-aa57-48a8-95c3-61fb2f2f8b4e`
    );
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    let recipes = data.data.recipes;
    recipes = recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
    }));

    results = recipes;
    renderRecipes(currentPage);
  } catch (err) {
    result.innerHTML = `<div class="error">${err.message}</div>`;
  }
};

///////////////////////////////////////
// Rendering the Recipe in the search Result
const renderRecipes = function (page) {
  result.innerHTML = "";
  const startIndex = (page - 1) * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  const recipesToShow = results.slice(startIndex, endIndex);

  const html = recipesToShow
    .map(
      (recipe) => `
      <li class="preview" data-id="${recipe.id}">
        <a class="preview__link" href="#${recipe.id}">
          <figure class="preview__fig">
            <img src="${recipe.image}" alt="${recipe.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${recipe.title}</h4>
            <p class="preview__publisher">${recipe.publisher}</p>
            <div class="preview__user-generated">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
    `
    )
    .join("");

  nextPage = currentPage + 1;
  result.insertAdjacentHTML("beforeend", html);
  showPagi(currentPage, Math.round(results.length / 10), nextPage);
};

////////////////////////////////////////////
// Pagitation of the search REsults
pagination.addEventListener("click", function (e) {
  e.preventDefault();
  const btn = e.target.closest(".btn--inline");
  if (!btn) return;

  if (btn.classList.contains("pagination__btn--prev")) {
    if (currentPage > 1) {
      currentPage--;
      renderRecipes(currentPage);
    }
  }

  if (btn.classList.contains("pagination__btn--next")) {
    if (currentPage < Math.round(results.length / recipesPerPage)) {
      currentPage++;
      renderRecipes(currentPage);
    }
  }
});

////////////////////////////////////////////
// Displaying the Pagitation
const showPagi = function (start, end, next) {
  pagination.innerHTML = "";
  if (start === 1) {
    start = "";
  }
  if (next === end) {
    next = "";
  }
  const html = `
    <button class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${start}</span>
        </button>
        <button class="btn--inline pagination__btn--next">
        <span>Page ${next}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>
    `;
  pagination.insertAdjacentHTML("beforeend", html);
};

///////////////////////////////////
// handler for the search value
const searchHandler = function (e) {
  e.preventDefault();
  let rec = search.value.trim();
  showRecipe(rec);
};

searchBtn.addEventListener("click", searchHandler);

////////////////////////////////////////////////
// handler for the search recipe
result.addEventListener("click", function (event) {
  const clickedPreview = event.target.closest(".preview");
  if (!clickedPreview) return;

  recipeId = clickedPreview.dataset.id;
  searching(recipeId);
});

////////////////////////////////////////////////
// Hnadler for updating the servings
const serving = function (e) {
  const tap = e.target.closest(".btn--tiny");
  if (!tap) return null;

  if (tap.classList.contains("btn--decrease-servings")) {
    currentServings -= 1;
    if (currentServings <= -3) {
      currentServings = -3;
    }
  } else if (tap.classList.contains("btn--increase-servings")) {
    currentServings += 1;
  }
  searching(recipeId, currentServings);
};
if (currentServings <= -3) {
  currentServings = -3;
}

recipeDisplay.addEventListener("click", (event) => {
  serving(event);
});

//////////////////////////////////////////
// Rendering the search recipe
const searching = async function (id, change = 0) {
  try {
    // render spinner
    renderSpinner(recipeDisplay);
    // console.log("Searching with ID:", id);
    if (change < -3) {
      change = -3;
    }

    // console.log("Change received in searching function:", change);
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );
    const datad = await res.json();
    if (!res.ok) throw new Error(`${datad.message} (${res.status})`);
    let { recipe: renderRecipe } = datad.data;
    renderRecipe = {
      id: renderRecipe.id,
      title: renderRecipe.title,
      publisher: renderRecipe.publisher,
      sourceUrl: renderRecipe.source_url,
      image: renderRecipe.image_url,
      servings: renderRecipe.servings,
      cookingTime: renderRecipe.cooking_time,
      ingredients: renderRecipe.ingredients,
    };
    bkId = renderRecipe.id;
    bkImgUrl = renderRecipe.image;
    bkPub = renderRecipe.publisher;
    bkTitle = renderRecipe.title;

    renderRecipe.servings += change;
    if (renderRecipe.servings <= 1) {
      renderRecipe.servings = 1;
    }
    // console.log("change:", change);
    const portionServed =
      renderRecipe.servings / (renderRecipe.servings - change);
    renderRecipe.ingredients.forEach((ing) => {
      ing.quantity *= portionServed / (portionServed - 1);
    });

    // console.log(portionServed);
    // console.log("Updated servings:", renderRecipe.servings);
    const renderHtml = `
          <figure class="recipe__fig">
            <img src="${renderRecipe.image}" alt="${
      renderRecipe.title
    }" class="recipe__img" />
            <h1 class="recipe__title">
              <span>${renderRecipe.title}</span>
            </h1>
          </figure>
  
          <div class="recipe__details">
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${renderRecipe.sourceUrl}"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--minutes">${
                renderRecipe.cookingTime
              }</span>
              <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icons}#icon-users"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--people">${
                renderRecipe.servings
              }</span>
              <span class="recipe__info-text">servings</span>
  
              <div class="recipe__info-buttons">
                <button class="btn--tiny btn--decrease-servings">
                  <svg>
                    <use href="${icons}#icon-minus-circle"></use>
                  </svg>
                </button>
                <button class="btn--tiny btn--increase-servings">
                  <svg>
                    <use href="${icons}#icon-plus-circle"></use>
                  </svg>
                </button>
              </div>
            </div>
  
            <div class="recipe__user-generated">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
            <button class="btn--round ">
            <svg class="saved">
              <use href="${icons}#icon-bookmark"></use>
            </svg>
          </button>
          </div>
  
          <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe Ingredients</h2>
            <ul class="recipe__ingredient-list">
            ${renderRecipe.ingredients
              .map((ing) => {
                ing.unit = ing.unit || "";
                ing.quantity = ing.quantity || "";
                return `
                  <li class="recipe__ingredient">
                      <svg class="recipe__icon">
                      <use href="${icons}#icon-check"></use>
                      </svg>
                      <div class="recipe__quantity">${ing.quantity}</div>
                      <div class="recipe__description">
                      <span class="recipe__unit">${ing.unit}</span>
                      ${ing.description}
                      </div>
                  </li>
              `;
              })
              .join("")}
              
            </ul>
          </div>
  
          <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
              This recipe was carefully designed and tested by
              <span class="recipe__publisher">${
                renderRecipe.publisher
              }</span>. Please check out
              directions at their website.
            </p>
            <a
              class="btn--small recipe__btn"
              href="${renderRecipe.sourceUrl}"
              target="_blank"
            >
              <span>Directions</span>
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
              </svg>
            </a>
          </div>
      `;
    recipeDisplay.innerHTML = "";
    recipeDisplay.insertAdjacentHTML("beforeend", renderHtml);
  } catch (err) {
    console.log(err);
  }
};

//////////////////////////////////////////////
// Displaying the add recipe window
addRecipe.addEventListener("click", function (e) {
  e.preventDefault();
  overlay.classList.remove("hidden");
  recipeWindow.classList.remove("hidden");
});

overlay.addEventListener("click", function (e) {
  e.preventDefault();
  overlay.classList.add("hidden");
  recipeWindow.classList.add("hidden");
});

closeBtn.addEventListener("click", function (e) {
  e.preventDefault();
  overlay.classList.add("hidden");
  recipeWindow.classList.add("hidden");
});
// /////////////////////////
// Saving the bookmarks in local storage
document.addEventListener("click", function (e) {
  e.preventDefault();
  const clickedRoundBtn = e.target.closest(".btn--round");
  if (!clickedRoundBtn) return;

  const savedBtn = clickedRoundBtn.querySelector(".saved");
  if (savedBtn.classList.contains("active") === false) {
    savedBtn.classList.add("active");
    const icon = savedBtn.querySelector("use");
    if (icon) {
      icon.setAttribute("href", `${icons}#icon-bookmark-fill`);
    }

    const bookmarkData = {
      id: bkId,
      title: bkTitle,
      image: bkImgUrl,
      publisher: bkPub,
    };

    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    savedBookmarks.push(bookmarkData);

    localStorage.setItem("bookmarks", JSON.stringify(savedBookmarks));
    const preview = `
    <li class="preview" data-id="${bookmarkData.id}">
      <a class="preview__link preview__link--active" href="#">
        <figure class="preview__fig">
          <img src="${bkImgUrl}" alt="${bkTitle}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">
            ${bkTitle}
          </h4>
          <p class="preview__publisher">${bkPub}</p>
        </div>
      </a>
    </li>
  `;
    bookmarkList.insertAdjacentHTML("afterbegin", preview);

    message.remove();
  } else if (savedBtn.classList.contains("active")) {
    const savedId = bkId;
    let savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    const bkIndex = savedBookmarks.findIndex(
      (bookmark) => bookmark.id === savedId
    );
    if (bkIndex !== -1) {
      savedBookmarks.splice(bkIndex, 1);
      localStorage.setItem("bookmarks", JSON.stringify(savedBookmarks));
    }
    const removedBookmark = document.querySelector(
      `.preview[data-id="${savedId}"]`
    );
    if (removedBookmark) {
      removedBookmark.remove();
    }
    savedBtn.classList.remove("active");
    const icon = savedBtn.querySelector("use");
    if (icon) {
      icon.setAttribute("href", `${icons}#icon-bookmark`);
    }
  }
});
//////////////////
// Rendering bookmarks in the list
const renderBookmarks = function () {
  const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
  if (savedBookmarks.length > 0) {
    bookmarkList.innerHTML = "";

    savedBookmarks.forEach((bookmark) => {
      const preview = `
          <li class="preview" data-id="${bookmark.id}">
            <a class="preview__link" href="#">
              <figure class="preview__fig">
                <img src="${bookmark.image}" alt="${bookmark.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${bookmark.title}</h4>
                <p class="preview__publisher">${bookmark.publisher}</p>
              </div>
            </a>
          </li>
        `;
      bookmarkList.insertAdjacentHTML("beforeend", preview);
    });
  }
};

document.addEventListener("DOMContentLoaded", renderBookmarks);

///////////////////////////////

bookmarkList.addEventListener("click", function (event) {
  event.preventDefault();
  const clickedBookmark = event.target.closest(".preview__link");
  if (!clickedBookmark) return;

  const rec = clickedBookmark.closest(".preview").dataset.id;
  // console.log("Clicked Recipe ID:", rec);
  searching(rec, currentServings);
  recipeId = rec;
});
