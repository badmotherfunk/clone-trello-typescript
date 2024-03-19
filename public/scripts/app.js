"use strict";
// Récupération de tous les containers
const itemsContainer = document.querySelectorAll('.items-container');
// Initialisation des types de nos variables
let actualContainer, actualBtn, actualUL, actualForm, actualTextInput, actualValidation;
// Ajout des eventListeners sur chacun des élément des containers    
function addContainerListeners(currentContainer) {
    const currentContainerDeletionBtn = currentContainer.querySelector('.delete-container-btn');
    const currentAddItemBtn = currentContainer.querySelector('.add-item-btn');
    const currentCloseFormBtn = currentContainer.querySelector('.close-form-btn');
    const currentForm = currentContainer.querySelector('form');
    deleteBtnListeners(currentContainerDeletionBtn);
    addItemBtnListeners(currentAddItemBtn);
    closingFormBtnsListeners(currentCloseFormBtn);
    addFormSubmitListeners(currentForm);
    addDDlisteners(currentContainer);
}
// Envoi chacun des container dans la fonction addContainerListener
itemsContainer.forEach((container) => {
    addContainerListeners(container);
});
// Ajout de l'eventListener sur les boutons "supprimer"
function deleteBtnListeners(btn) {
    btn.addEventListener('click', handleContainerDeletion);
}
// Ajout de l'eventListener sur les boutons "ajouter"
function addItemBtnListeners(btn) {
    btn.addEventListener('click', handleAddItem);
}
// Ajoute un événement qui permet de toggle le bouton du formulaire actif
function closingFormBtnsListeners(btn) {
    btn.addEventListener('click', () => toggleForm(actualBtn, actualForm, false));
}
// Ajoute un eventListeners sur le formulaire qui envoie la fonction pour créer le contenu
function addFormSubmitListeners(form) {
    form.addEventListener('submit', createNewItem);
}
// Ajoute des eventListeners sur le container qui est déplacé
function addDDlisteners(element) {
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);
    element.addEventListener('dragend', handleDragEnd);
}
// Suppression du container en fonction de l'index du bouton cliqué
function handleContainerDeletion(e) {
    const btn = e.target;
    const btnsArray = [...document.querySelectorAll('.delete-container-btn')];
    const containers = [...document.querySelectorAll('.items-container')];
    containers[btnsArray.indexOf(btn)].remove();
}
// Toggle le contenu pour ajouter un item au container, en fonction du bouton cliqué
function handleAddItem(e) {
    const btn = e.target;
    if (actualContainer)
        toggleForm(actualBtn, actualForm, false);
    setContainerItems(btn);
    toggleForm(actualBtn, actualForm, true);
}
// Gère le comportement des éléments au toggle
function toggleForm(btn, form, action) {
    if (!action) {
        form.style.display = "none";
        btn.style.display = "block";
    }
    else if (action) {
        form.style.display = "block";
        btn.style.display = "none";
    }
}
// Attribut et link les différents éléments du container en fonction du bouton cliqué
function setContainerItems(btn) {
    actualBtn = btn;
    actualContainer = btn.parentElement;
    actualUL = actualContainer.querySelector('ul');
    actualForm = actualContainer.querySelector('form');
    actualTextInput = actualContainer.querySelector('input');
    actualValidation = actualContainer.querySelector('.validation-msg');
}
function createNewItem(e) {
    e.preventDefault();
    // Validation
    if (actualTextInput.value.length === 0) {
        actualValidation.textContent = "Item can't be empty";
        return;
    }
    else {
        actualValidation.textContent = "";
    }
    // Création Item
    const itemContent = actualTextInput.value;
    const li = `
    <li class="item" draggable="true">
    <p>${itemContent}</p>
    <button>X</button>
    `;
    actualUL.insertAdjacentHTML('beforeend', li);
    const item = actualUL.lastElementChild;
    const liBtn = item.querySelector('button');
    handleItemDeletion(liBtn);
    addDDlisteners(item);
    actualTextInput.value = "";
}
// Remove le parent du boutton clické
function handleItemDeletion(btn) {
    btn.addEventListener('click', () => {
        const elToRemove = btn.parentElement;
        elToRemove.remove();
    });
}
// Drag & Drop
let dragSrcEl;
function handleDragStart(e) {
    var _a;
    e.stopPropagation();
    if (actualContainer)
        toggleForm(actualBtn, actualForm, false);
    dragSrcEl = this,
        // Copie l'innerHTML de l'élément qui est déplacé
        (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text/html', this.innerHTML);
}
function handleDragOver(e) {
    e.preventDefault();
}
function handleDrop(e) {
    var _a;
    e.stopPropagation();
    const receptionEl = this;
    // Si l'élément déplacé est un LI alors et qu'on le drop dans un container, alors on l'ajoute a la list du container cible
    if (dragSrcEl.nodeName === "LI" && receptionEl.classList.contains("items-container")) {
        receptionEl.querySelector('ul').appendChild(dragSrcEl);
        // On rajoute tous les événements
        addDDlisteners(dragSrcEl);
        handleItemDeletion(dragSrcEl.querySelector("button"));
    }
    // Si on swap un item ou un container alors on lui donne les données de l'élément cible et inversement
    if (dragSrcEl !== this && this.classList[0] === dragSrcEl.classList[0]) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/html');
        // Si c'est un container un rjaoute tous les événements de drag and drop sinon on rajoute tous les évenements à notre item
        if (this.classList.contains("items-container")) {
            addContainerListeners(this);
            this.querySelectorAll('li').forEach((li) => {
                handleItemDeletion(li.querySelector('button'));
                addDDlisteners(li);
            });
        }
        else {
            addDDlisteners(this);
            handleItemDeletion(this.querySelector("button"));
        }
    }
}
function handleDragEnd(e) {
    e.stopPropagation();
    // Si l'élement swapé est un container alors on rajoute les événements sinon on rajoute les événement de drag and drop
    if (this.classList.contains('items-container')) {
        addContainerListeners(this);
        this.querySelectorAll('li').forEach((li) => {
            handleItemDeletion(li.querySelector('button'));
            addDDlisteners(li);
        });
    }
    else {
        addDDlisteners(this);
    }
}
// Add New Container
const addContainerBtn = document.querySelector('.add-container-btn');
const addContainerForm = document.querySelector('.add-new-container form');
const addContainerFormInput = document.querySelector('.add-new-container input');
const validationNewContainer = document.querySelector('.add-new-container .validation-msg');
const addContainerCloseBtn = document.querySelector('.close-add-list');
const addNewContainer = document.querySelector('.add-new-container');
const containersList = document.querySelector('.main-content');
// Gère le toggle du nouveau container créé
addContainerBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, true);
});
addContainerCloseBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, false);
});
// Au submit de notre nouveau container, on lance la fonction pour créer son contenu
addContainerForm.addEventListener('submit', createNewContainer);
// Gère la création du contenu du nouveau container
function createNewContainer(e) {
    e.preventDefault();
    // Validation
    if (addContainerFormInput.value.length === 0) {
        validationNewContainer.textContent = "Item can't be empty";
        return;
    }
    else {
        validationNewContainer.textContent = "";
    }
    const itemsContainer = document.querySelector('.items-container');
    const newContainer = itemsContainer.cloneNode();
    const newContainerContent = `
    <div class="top-container">
        <h2>${addContainerFormInput.value}</h2>
        <button class="delete-container-btn">X</button>
    </div>
    <ul></ul>
    <button class="add-item-btn">Add an item</button>
    <form autocomplete="off">
        <div class="top-form-container">
            <label for="item">Add a new item</label>
            <button type="button" class="close-form-btn">X</button>
        </div>
        <input type="text" id="item">
        <span class="validation-msg"></span>
        <button type="submit">Submit</button>
    </form>
    `;
    newContainer.innerHTML = newContainerContent;
    containersList.insertBefore(newContainer, addNewContainer);
    addContainerFormInput.value = "";
    addContainerListeners(newContainer);
}
