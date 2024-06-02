document.addEventListener("DOMContentLoaded", async () => {
  await checkBackendStatusAndLoadData();

  window.addEventListener("hashchange", async () => {
    await checkBackendStatusAndLoadData();
  });
});

const checkBackendStatusAndLoadData = async () => {
  try {
    const response = await fetch("http://localhost:3000/status");
    if (!response.ok) {
      throw new Error("Backend is not running");
    }
    const data = await response.json();
    if (data.status !== "OK") {
      throw new Error("Backend status is not OK");
    }
    const hash = window.location.hash.substring(1);
    if (hash === "dogs" || hash === "cats" || hash === "birds") {
      showLoadingState();
      await loadAnimals(hash);
      hideLoadingState();
    }
  } catch (error) {
    console.error("Failed to connect to backend:", error);
    displayErrorMessage(
      "The backend server is not running. Please try again later."
    );
    disableFrontend();
  }
};

const disableFrontend = () => {
  document.getElementById("search-bar").disabled = true;
  document.getElementById("gallery").innerHTML = "";
  document
    .querySelectorAll(
      'nav a[href="#dogs"], nav a[href="#cats"], nav a[href="#birds"]'
    )
    .forEach((link) => {
      link.style.display = "none";
    });
};

const displayErrorMessage = (message) => {
  const main = document.createElement("main");
  main.innerHTML = `<p style="color: red; text-align: center;">${message}</p>`;
  document.body.appendChild(main);
};

const loadAnimals = async (type) => {
  let apiUrl;
  switch (type) {
    case "dogs":
      apiUrl = "https://freetestapi.com/api/v1/dogs";
      break;
    case "cats":
      apiUrl = "https://freetestapi.com/api/v1/cats";
      break;
    case "birds":
      apiUrl = "https://freetestapi.com/api/v1/birds";
      break;
    default:
      apiUrl = "";
  }

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    displayAnimals(data, type);
  } catch (error) {
    console.error("Failed to fetch animals:", error);
    displayErrorMessage("Failed to load animals. Please try again later.");
    clearGallery();
  }
};

const displayAnimals = (animals, type) => {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  animals.forEach((animal) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${animal.image}" alt="${animal.name}">
      <h3>${animal.name}</h3>
      <p>Origin: ${animal.origin || animal.place_of_found}</p>
    `;
    card.onclick = () => showPopup(animal);
    gallery.appendChild(card);
  });
};

const clearGallery = () => {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
};

const showPopup = (animal) => {
  const popup = document.getElementById("popup");
  const popupDetails = document.getElementById("popup-details");
  popupDetails.innerHTML = `
    <h2>${animal.name}</h2>
    <img src="${animal.image}" alt="${animal.name}">
    <p>Origin: ${animal.origin || animal.place_of_found}</p>
    <p>Description: ${animal.description}</p>
    ${animal.breed_group ? `<p>Breed Group: ${animal.breed_group}</p>` : ""}
    ${animal.size ? `<p>Size: ${animal.size}</p>` : ""}
    ${animal.lifespan ? `<p>Life Span: ${animal.lifespan}</p>` : ""}
    ${animal.temperament ? `<p>Temperament: ${animal.temperament}</p>` : ""}
    ${animal.colors ? `<p>Colors: ${animal.colors.join(", ")}</p>` : ""}
    ${animal.species ? `<p>Species: ${animal.species}</p>` : ""}
    ${animal.family ? `<p>Family: ${animal.family}</p>` : ""}
    ${animal.habitat ? `<p>Habitat: ${animal.habitat}</p>` : ""}
    ${animal.diet ? `<p>Diet: ${animal.diet}</p>` : ""}
    ${animal.weight_kg ? `<p>Weight: ${animal.weight_kg} kg</p>` : ""}
    ${animal.height_cm ? `<p>Height: ${animal.height_cm} cm</p>` : ""}
  `;
  popup.classList.add("show");
};

const closePopup = () => {
  document.getElementById("popup").classList.remove("show");
};

const closePopupOutside = (event) => {
  if (event.target === document.getElementById("popup")) {
    closePopup();
  }
};

const searchAnimals = () => {
  const input = document.getElementById("search-bar").value.toLowerCase();
  const cards = document.getElementsByClassName("card");
  Array.from(cards).forEach((card) => {
    const name = card.getElementsByTagName("h3")[0].innerText.toLowerCase();
    card.style.display = name.includes(input) ? "" : "none";
  });
};

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

const showLoadingState = () => {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = `<div class="loading">Loading...</div>`;
};

const hideLoadingState = () => {
  const loading = document.querySelector(".loading");
  if (loading) {
    loading.remove();
  }
};
