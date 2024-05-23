// Récupération des works dans l'api et renvoi des données
async function getWorks() {
    const worksJson = await fetch("http://localhost:5678/api/works");
    const works = await worksJson.json();
    return works;
}

// Récupération des catégories pour les filtres dans l'api 
async function getCategories() {
    const categoriesJson = await fetch("http://localhost:5678/api/categories");
    const categories = await categoriesJson.json();
    return categories;
}

// Ajout des works dans la div Gallery
async function addDivWorks() {
    // Récupération des works via la fonction getWorks
    let works = await getWorks();
    let divGallery = document.querySelector(".gallery");
    divGallery.innerHTML = "";
    for (let i = 0; i < works.length; i++) {
        // Création du conteneur pour la photo et la description
        let figure = document.createElement("figure");
        let imgGallery = document.createElement("img");
        // Création d'une balise pour la description
        let figcaption = document.createElement("figcaption");
        imgGallery.src = works[i].imageUrl;
        imgGallery.alt = works[i].title;
        figcaption.innerText = works[i].title;
        figure.appendChild(imgGallery);
        figure.appendChild(figcaption);
        divGallery.appendChild(figure);
    }
}

// Création des filtres
async function addFilters() {
    // Récupération des catégories via la fonction getCategories
    let categories = await getCategories();
    let divFilters = document.querySelector(".filters");
    console.log(categories)

    // Création du filtre "Tous"
    let allFilter = document.createElement("button");
    allFilter.innerText = "Tous";
    divFilters.appendChild(allFilter);
    allFilter.classList.add("filter-button");

    //boucle pour générer les autres filtres à l'aide des données de l'api
    for (let i = 0; i < categories.length; i++) {
        let filters = document.createElement("button");
        filters.innerText = categories[i].name;
        divFilters.appendChild(filters);
        filters.classList.add("filter-button");
    }

    addClass()
}

function addClass() {
    let filterButtons = document.querySelectorAll(".filter-button");
    filterButtons[0].classList.add("filter-button--selected");

    for (let i = 0; i < filterButtons.length; i++) {
        filterButtons[i].addEventListener("click", () => {
            // retrait de la classe filter-button--selected pour chaque élément dans filterButtons
            filterButtons.forEach(button => button.classList.remove("filter-button--selected"));
            filterButtons[i].classList.add("filter-button--selected");
        })
    }

    filterWorks(filterButtons);
}

async function filterWorks(button) {
    const works = await getWorks();
    console.log(works);

    button[1].addEventListener("click", () => {
        const worksObjects = works.filter(function (element) {
            // filtrage et récupération des works avec la propriété categoryId égal à 1 uniquement
            return element.categoryId === 1;
        })
        const divGallery = document.querySelector(".gallery");
        divGallery.innerHTML = "";
        for (let i = 0; i < worksObjects.length; i++) {
            // Création du conteneur pour la photo et la description
            let figure = document.createElement("figure");
            let imgGallery = document.createElement("img");
            // Création d'une balise pour la description
            let figcaption = document.createElement("figcaption");
            imgGallery.src = worksObjects[i].imageUrl;
            imgGallery.alt = worksObjects[i].title;
            figcaption.innerText = worksObjects[i].title;
            figure.appendChild(imgGallery);
            figure.appendChild(figcaption);
            divGallery.appendChild(figure);
        }
    })

    button[2].addEventListener("click", () => {
        const worksAppartments = works.filter(function (element) {
            return element.categoryId === 2;
        })
        const divGallery = document.querySelector(".gallery");
        divGallery.innerHTML = "";
        for (let i = 0; i < worksAppartments.length; i++) {
            // Création du conteneur pour la photo et la description
            let figure = document.createElement("figure");
            let imgGallery = document.createElement("img");
            // Création d'une balise pour la description
            let figcaption = document.createElement("figcaption");
            imgGallery.src = worksAppartments[i].imageUrl;
            imgGallery.alt = worksAppartments[i].title;
            figcaption.innerText = worksAppartments[i].title;
            figure.appendChild(imgGallery);
            figure.appendChild(figcaption);
            divGallery.appendChild(figure);
        }
    })

    button[3].addEventListener("click", () => {
        const worksHotels = works.filter(function (element) {
            return element.categoryId === 3;
        })
        const divGallery = document.querySelector(".gallery");
        divGallery.innerHTML = "";
        for (let i = 0; i < worksHotels.length; i++) {
            // Création du conteneur pour la photo et la description
            let figure = document.createElement("figure");
            let imgGallery = document.createElement("img");
            // Création d'une balise pour la description
            let figcaption = document.createElement("figcaption");
            imgGallery.src = worksHotels[i].imageUrl;
            imgGallery.alt = worksHotels[i].title;
            figcaption.innerText = worksHotels[i].title;
            figure.appendChild(imgGallery);
            figure.appendChild(figcaption);
            divGallery.appendChild(figure);
        }
    })

    button[0].addEventListener("click", () => {
        addDivWorks();
    })

}

addFilters();
addDivWorks();
