let quote = document.getElementById("quote");
let author = document.getElementById("author");
let btn = document.getElementById("btn");
let favorite = document.getElementById("favorite");
let list = document.getElementById("list-of-favorite-quotes");
let copyButton = document.getElementById("copy");
let showAllFavoriteList = document.getElementById("show-list");
let clearButton = document.getElementById("clear-button");
let closeButton = document.getElementById("close-button");
let favoriteContainer = document.querySelector(".favorite-container");

const url = "https://api.quotable.io/random";
let favorites = [];

//update displayed quote and author
let updateQuote = (content, authorName) => {
  quote.textContent = content;
  author.textContent = authorName;
  let existsInFavorites = checkExistence(content, authorName);
  let heartIcon = favorite.firstElementChild;
  if (existsInFavorites) {
    heartIcon.classList.remove("fa-regular");
    heartIcon.classList.add("fa-solid", "active");
  } else {
    heartIcon.classList.remove("fa-solid", "active");
    heartIcon.classList.add("fa-regular");
  }
};
//check whether a quote is already in favorites list
const checkExistence = (content, authorName) => {
  return favorites.some(
    (q) => q.content === content && q.author === authorName
  );
};
//fetch a random quote from API
const getQuotes = () => {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      updateQuote(data.content, data.author);
      console.log(data);
    });
};

//display favorite quotes
const displayFavorites = () => {
  list.innerHTML = "";
  favorites.forEach((quote, index) => {
    const liItem = document.createElement("li");
    liItem.textContent = `${index + 1}. ${quote.content} - ${quote.author}`;
    list.appendChild(liItem);
  });
};

//save to local storage
const saveFavoritesToLocalStorage = () => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

//add to favorites
const addToFavorites = () => {
  let heartIcon = favorite.firstElementChild;
  heartIcon.classList.remove("fa-regular");
  heartIcon.classList.add("fa-solid", "active");
  const content = quote.textContent;
  const authorName = author.textContent;
  let existsInFavorites = checkExistence(content, authorName);
  //push the favorites array only if it doesn't already exist
  if (!existsInFavorites) {
    favorites.push({ content, author: authorName });
    saveFavoritesToLocalStorage();
    displayFavorites();
  }
};

//clear favorites
const clearFavorites = () => {
  localStorage.removeItem("favorites");
  favorites = [];
  displayFavorites();
  favoriteContainer.style.display = "none";
  list.style.display = "none";
  if (heartIcon.classList.contains("fa-solid")) {
    heartIcon.classList.remove("fa-solid", "active");
    heartIcon.classList.add("fa-regular");
  }
};

//when a page reload
window.onload = () => {
  list.style.display = "none";
  favoriteContainer.style.display = "none";
  favorite.addEventListener("click", addToFavorites);
  clearButton.addEventListener("click", clearFavorites);

  let storedFavorites = localStorage.getItem("favorites");
  if (storedFavorites) {
    favorites = JSON.parse(storedFavorites);
    displayFavorites();
  }
  getQuotes();
};

//copy the quotes text when clicked the quotes
quote.addEventListener("click", () => {
  copyToClipBoard(quote.textContent);
});
copyButton.addEventListener("click", () => {
  copyToClipBoard(quote.textContent);
});

//copy quotes
const copyToClipBoard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
};

//show the Favorites modal when clicked
showAllFavoriteList.addEventListener("click", () => {
  if (favorites.length == 0) {
    list.innerHTML = "You haven't added any quote yet </p>";
  }
  list.style.display = "block";
  favoriteContainer.style.display = "block";
});
//close the Favorites modal when clicked
closeButton.addEventListener("click", () => {
  list.style.display = "none";
  favoriteContainer.style.display = "none";
});

btn.addEventListener("click", getQuotes);
