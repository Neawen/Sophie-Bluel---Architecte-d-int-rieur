
// wait for the first script to load before starting
setTimeout(() => {
    const modal = document.querySelector(".modal");
    const modalWrapper = document.querySelector(".modal-wrapper");

    // contain the whole size of the page with scroll
    const pageHeight = document.body.scrollHeight;

    const changeWorks = document.querySelector(".projects-lien");
    changeWorks.addEventListener("click", (event) => {
        event.preventDefault();

        // whole page size without the header size
        modal.style.height = `${pageHeight - 136}px`;
        modal.style.display = "flex";

        const removeModal = document.querySelector(".remove-modal");
        removeModal.addEventListener("click", () => {
            modal.style.display = "none";
        })
    })

    modal.addEventListener("click", (event) => {
        // if modalWrapper doesn't contain the click
        if (!modalWrapper.contains(event.target)) {
            modal.style.display = "none";
        }
    })

    const logout = document.querySelector("header a");
    logout.addEventListener("click", (event) => {
        event.preventDefault();

        //delete token in localStorage
        localStorage.removeItem("authToken");
        window.location.href = "../../index.html";
    })




    // showing works in modal
    putWorksModal();
    // adding second modal view from button "add photo"
    addSecondModal(modal);
    // adding new work
    addNewWork()

}, 1000);

async function getWorks() {
    const works = await fetch("http://localhost:5678/api/works");
    let worksJson = await works.json();
    return worksJson;
}

// show works in div Gallery in modalWrapper
async function putWorksModal() {
    let works = await getWorks();
    console.log(works);
    let modalGallery = document.querySelector(".modal-gallery");
    modalGallery.innerHTML = "";

    for (let j = 0; j < works.length; j++) {
        let containerWorksModal = document.createElement("div");
        containerWorksModal.classList.add("container-works-modal");

        let worksModal = document.createElement("img");
        worksModal.src = works[j].imageUrl;
        worksModal.alt = works[j].title;
        worksModal.classList.add("img-modal");

        let worksTrash = document.createElement("i");
        worksTrash.classList.add("fa-solid", "fa-trash-can", "works-trash");

        containerWorksModal.appendChild(worksModal);
        containerWorksModal.appendChild(worksTrash);
        modalGallery.appendChild(containerWorksModal);
    }

    // get trash can icons on work in modal
    let worksTrash = document.querySelectorAll('.works-trash');
    for (let i = 0; i < worksTrash.length; i++) {
        // store id of the work clicked
        const workId = works[i].id;
        worksTrash[i].addEventListener('click', () => {
            deleteWork(workId);
        })
    }
}

async function deleteWork(workId) {
    const token = localStorage.getItem("authToken");
    console.log(token);

    //send request to delete work from api
    const deleteWork = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    // if deleting work succeed
    if (deleteWork.ok) {
        //refresh modal's works
        putWorksModal();
        // Refresh gallery's works
        addDivWorks();
    } else {
        console.log("Erreur : " + deleteWork.status);
    }
}

function addNewWork() {
    let workTitle = document.querySelector("input[type=text]");
    let workCategory = document.querySelector("select");
    let workImageInput = document.querySelector("input[type=file]");
    let workImageButton = document.querySelector(".modal-add-photo");

    // Button in container to add photo in modal
    workImageButton.addEventListener("click", (event) => {
        event.preventDefault();

        // input type file
        workImageInput.click();
    })

    // show file loaded before submit
    showLoadPicture(workImageInput);

    // button to submit in second modal
    const buttonSubmit = document.querySelector(".button-second-view");
    buttonSubmit.style.cursor = "auto";

    const form = document.querySelector("form");
    form.addEventListener("change", () => {
        checkForm(workTitle, workCategory, workImageInput, buttonSubmit, form);
    })

    buttonSubmit.removeEventListener("click", sendNewWork);

    buttonSubmit.addEventListener("click", (event) => {
        event.preventDefault();

        // send data from form in second modal
        sendNewWork(workTitle, workCategory, workImageInput)
        checkForm(workTitle, workCategory, workImageInput, buttonSubmit, form);
        // renew tags form
        workTitle.value = "";
        workCategory.value = "";
        workImageInput.value = "";
    });
}

function showLoadPicture(tagInputFile) {
    tagInputFile.addEventListener("change", (event) => {
        const file = event.target.files[0];
        let imgPhotoPreview = document.querySelector(".photo-preview");
        let containerPhoto = document.querySelector(".container-add-photo");
        const iconPicture = document.querySelector(".container-add-photo i");
        const loadPictureButton = document.querySelector(".modal-add-photo");
        const textLoadPicture = document.querySelector(".container-add-photo p");

        if (file) {
            const reader = new FileReader();

            reader.addEventListener("load", (e) => {
                iconPicture.style.display = "none";
                loadPictureButton.style.display = "none";
                textLoadPicture.style.display = "none";
                imgPhotoPreview.src = e.target.result;
                containerPhoto.style.height = "9.5rem";
                containerPhoto.style.padding = "0";
                imgPhotoPreview.style.height = "9.5rem";
                imgPhotoPreview.style.display = "flex";
            })

            reader.readAsDataURL(file);
        }
    })
}

async function sendNewWork(workTitle, workCategory, workImageInput) {
    let formData = new FormData;
    formData.append("image", workImageInput.files[0]);
    formData.append("title", workTitle.value);
    formData.append("category", workCategory.value);
    console.log(formData)

    // get token from localStorage
    const token = localStorage.getItem("authToken");
    console.log(token);

    let sendNewWork = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
    })

    if (sendNewWork.ok) {
        // show works in first modal view
        putWorksModal();
        // send a message in form
        sendNewWorkMessage();
        // refresh gallery
        addDivWorks();
    } else {
        console.log("Erreur : " + sendNewWork.status);
    }
}

function sendNewWorkMessage() {
    const form = document.querySelector("form");
    let divResponse = document.querySelector(".form-response");

    if (!divResponse) {
        divResponse = document.createElement("div");
        divResponse.classList.add("form-response");
        divResponse.style.color = "green";
        divResponse.innerText = "Envoi réussi";
        form.appendChild(divResponse);
    }
}


function checkForm(firstTag, secondTag, thirdTag, button, form) {
    let divResponse = document.querySelector(".form-response");

    // if divRespone exist
    if (divResponse) {
        divResponse.remove();
        button.style.backgroundColor = "#1D6154";
        button.style.cursor = "pointer";
    }

    //if one of the fields is empty
    if (firstTag.value === "" || secondTag.value === "" || thirdTag.value === "") {
        divResponse = document.createElement("div");
        divResponse.classList.add("form-response");
        divResponse.innerText = "Tous les champs doivent être remplis";
        button.style.backgroundColor = "#A7A7A7";
        button.style.cursor = "auto";
        form.appendChild(divResponse);
    }
}


// copy from script.js
// add works in div Gallery
async function addDivWorks() {
    // get works with function getWorks
    let works = await getWorks();
    let divGallery = document.querySelector(".gallery");
    divGallery.innerHTML = "";
    for (let i = 0; i < works.length; i++) {
        // create container for photo and description
        let figure = document.createElement("figure");
        let imgGallery = document.createElement("img");
        // create tag (balise) for description
        let figcaption = document.createElement("figcaption");
        imgGallery.src = works[i].imageUrl;
        imgGallery.alt = works[i].title;
        figcaption.innerText = works[i].title;
        figure.appendChild(imgGallery);
        figure.appendChild(figcaption);
        divGallery.appendChild(figure);
    }
}

function addSecondModal(modal) {
    // button add photo on first modal view
    const modalButton = document.querySelector(".modal-button");
    // first modal view
    const firstModalHeader = document.querySelector(".container-remove-modal");
    const firstModalContent = document.querySelector(".container-edit-modal");
    // second modal view
    const secondModal = document.querySelector(".modal-second-page");

    modalButton.addEventListener("click", () => {
        firstModalContent.style.display = "none";
        firstModalHeader.style.display = "none";
        secondModal.style.display = "flex";
    })

    // trash can icon to close the second modal
    const secondRemoveModal = document.querySelector(".second-remove-modal");
    secondRemoveModal.addEventListener("click", () => {
        modal.style.display = "none";
    })

    // comeback to first modal
    const backModal = document.querySelector(".back-modal");
    backModal.addEventListener("click", () => {
        firstModalContent.style.display = "flex";
        firstModalHeader.style.display = "flex";
        secondModal.style.display = "none";
        resetPhotoUpload();
    })
}

function resetPhotoUpload() {
    let imgPhotoPreview = document.querySelector(".photo-preview");
    let containerPhoto = document.querySelector(".container-add-photo");
    const iconPicture = document.querySelector(".container-add-photo i");
    const loadPictureButton = document.querySelector(".modal-add-photo");
    const textLoadPicture = document.querySelector(".container-add-photo p");
    const formResponse = document.querySelector(".form-response");

    iconPicture.style.display = "flex";
    loadPictureButton.style.display = "flex";
    textLoadPicture.style.display = "flex";
    imgPhotoPreview.style.display = "none";
    containerPhoto.style.height = "auto";
    containerPhoto.style.padding = "1rem";
    // if there is any response in form
    formResponse.remove();
}
