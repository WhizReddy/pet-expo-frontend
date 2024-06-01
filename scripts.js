document.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.substring(1);
  if (hash === "dogs" || hash === "cats" || hash === "birds") {
    loadAnimals(hash);
  }

  window.addEventListener("hashchange", () => {
    const newHash = window.location.hash.substring(1);
    if (newHash === "dogs" || newHash === "cats" || newHash === "birds") {
      loadAnimals(newHash);
    } else if (newHash === "about-us" || newHash === "contact-us") {
      scrollToSection(newHash);
    }
  });
});

const loadAnimals = async (type) => {
  let apiUrl;
  switch (type) {
    case "dogs":
      apiUrl = "http://localhost:3000/animals/dogs";
      break;
    case "cats":
      apiUrl = "http://localhost:3000/animals/cats";
      break;
    case "birds":
      apiUrl = "http://localhost:3000/animals/birds";
      break;
    default:
      apiUrl = "";
  }

  const response = await fetch(apiUrl);
  const data = await response.json();
  displayAnimals(data, type);
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
  popup.style.display = "flex";
};

const closePopup = () => {
  document.getElementById("popup").style.display = "none";
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
