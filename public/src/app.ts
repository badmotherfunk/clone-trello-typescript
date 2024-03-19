// Récupération de tous les containers
const itemsContainer = document.querySelectorAll('.items-container') as NodeListOf<HTMLDivElement>

// Initialisation des types de nos variables
let actualContainer: HTMLDivElement,
    actualBtn: HTMLButtonElement,
    actualUL: HTMLUListElement,
    actualForm: HTMLFormElement,
    actualTextInput: HTMLInputElement,
    actualValidation: HTMLSpanElement

// Ajout des eventListeners sur chacun des élément des containers    
function addContainerListeners(currentContainer: HTMLDivElement) {

    const currentContainerDeletionBtn = currentContainer.querySelector('.delete-container-btn') as HTMLButtonElement
    const currentAddItemBtn = currentContainer.querySelector('.add-item-btn') as HTMLButtonElement
    const currentCloseFormBtn = currentContainer.querySelector('.close-form-btn') as HTMLButtonElement
    const currentForm = currentContainer.querySelector('form') as HTMLFormElement

    deleteBtnListeners(currentContainerDeletionBtn)
    addItemBtnListeners(currentAddItemBtn)
    closingFormBtnsListeners(currentCloseFormBtn)
    addFormSubmitListeners(currentForm)
}

// Envoi chacun des container dans la fonction addContainerListener
itemsContainer.forEach((container: HTMLDivElement) => {
    addContainerListeners(container)
})

// Ajout de l'eventListener sur les boutons "supprimer"
function deleteBtnListeners(btn: HTMLButtonElement) {
    btn.addEventListener('click', handleContainerDeletion)
}

// Ajout de l'eventListener sur les boutons "ajouter"
function addItemBtnListeners(btn: HTMLButtonElement) {
    btn.addEventListener('click', handleAddItem)
}

// Ajoute un événement qui permet de toggle le bouton du formulaire actif
function closingFormBtnsListeners(btn: HTMLButtonElement) {
    btn.addEventListener('click', () => toggleForm(actualBtn, actualForm, false))
}

// Ajoute un listeners sur le formulaire qui envoie la fonction pour créer le contenu
function addFormSubmitListeners(form: HTMLFormElement) {
    form.addEventListener('submit', createNewItem)
}

// Suppression du container en fonction de l'index du bouton cliqué
function handleContainerDeletion(e: MouseEvent) {
    const btn = e.target as HTMLButtonElement
    const btnsArray = [...document.querySelectorAll('.delete-container-btn')] as HTMLButtonElement[]
    const containers = [...document.querySelectorAll('.items-container')] as HTMLDivElement[]
    containers[btnsArray.indexOf(btn)].remove()
}

// Toggle le contenu pour ajouter un item au container, en fonction du bouton cliqué
function handleAddItem(e: MouseEvent) {
    const btn = e.target as HTMLButtonElement
    if(actualContainer) toggleForm(actualBtn, actualForm, false)
    setContainerItems(btn)
    toggleForm(actualBtn, actualForm, true)
}

// Gère le comportement des éléments au toggle
function toggleForm(btn: HTMLButtonElement, form: HTMLFormElement, action: Boolean) {
    if(!action) {
        form.style.display = "none"
        btn.style.display = "block"
    } else if(action) {
        form.style.display = "block"
        btn.style.display = "none"
    }
}

// Attribut et link les différents éléments du container en fonction du bouton cliqué
function setContainerItems(btn: HTMLButtonElement) {
    actualBtn = btn
    actualContainer = btn.parentElement as HTMLDivElement
    actualUL = actualContainer.querySelector('ul') as HTMLUListElement
    actualForm = actualContainer.querySelector('form') as HTMLFormElement
    actualTextInput = actualContainer.querySelector('input') as HTMLInputElement
    actualValidation = actualContainer.querySelector('.validation-msg') as HTMLSpanElement
}

function createNewItem(e: Event) {
    e.preventDefault()
    // Validation
    if(actualTextInput.value.length === 0) {
        actualValidation.textContent = "Item can't be empty"
        return
    } else {
        actualValidation.textContent = ""
    }

    // Création Item
    const itemContent = actualTextInput.value;
    const li = `
    <li class="item" draggable="true">
    <p>${itemContent}</p>
    <button>X</button>
    `
    actualUL.insertAdjacentHTML('beforeend', li)

    const item = actualUL.lastElementChild as HTMLLIElement
    const liBtn = item.querySelector('button') as HTMLButtonElement
    handleItemDeletion(liBtn)
    actualTextInput.value = ""
}


// Remove le parent du boutton clické
function handleItemDeletion(btn: HTMLButtonElement) {
    btn.addEventListener('click', () => {
        const elToRemove = btn.parentElement as HTMLLIElement
        elToRemove.remove()
    })
}