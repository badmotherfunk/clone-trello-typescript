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
// Ajoute un listeners sur le formulaire qui envoie la fonction pour créer le contenu
function addFormSubmitListeners(form) {
    form.addEventListener('submit', createNewItem);
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
    actualTextInput.value = "";
}
// Remove le parent du boutton clické
function handleItemDeletion(btn) {
    btn.addEventListener('click', () => {
        const elToRemove = btn.parentElement;
        elToRemove.remove();
    });
}
