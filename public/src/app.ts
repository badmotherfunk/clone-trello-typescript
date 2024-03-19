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
    addDDlisteners(currentContainer)
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

// Ajoute un eventListeners sur le formulaire qui envoie la fonction pour créer le contenu
function addFormSubmitListeners(form: HTMLFormElement) {
    form.addEventListener('submit', createNewItem)
}

// Ajoute des eventListeners sur le container qui est déplacé
function addDDlisteners(element: HTMLElement) {
    element.addEventListener('dragstart', handleDragStart)
    element.addEventListener('dragover', handleDragOver)
    element.addEventListener('drop', handleDrop)
    element.addEventListener('dragend', handleDragEnd)
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
    addDDlisteners(item)
    actualTextInput.value = ""
}


// Remove le parent du boutton clické
function handleItemDeletion(btn: HTMLButtonElement) {
    btn.addEventListener('click', () => {
        const elToRemove = btn.parentElement as HTMLLIElement
        elToRemove.remove()
    })
}

// Drag & Drop

let dragSrcEl: HTMLElement
function handleDragStart(this: HTMLElement, e: DragEvent) {
    e.stopPropagation()

    if(actualContainer) toggleForm(actualBtn, actualForm, false)
    dragSrcEl = this,
    // Copie l'innerHTML de l'élément qui est déplacé
    e.dataTransfer?.setData('text/html', this.innerHTML)
}

function handleDragOver(e: DragEvent) {
    e.preventDefault()
}

function handleDrop(this: HTMLElement, e: DragEvent) {
    e.stopPropagation()
    const receptionEl = this

    // Si l'élément déplacé est un LI alors et qu'on le drop dans un container, alors on l'ajoute a la list du container cible
    if(dragSrcEl.nodeName === "LI" && receptionEl.classList.contains("items-container")) {
        (receptionEl.querySelector('ul') as HTMLUListElement).appendChild(dragSrcEl)
        // On rajoute tous les événements
        addDDlisteners(dragSrcEl)
        handleItemDeletion(dragSrcEl.querySelector("button") as HTMLButtonElement)
    }

    // Si on swap un item ou un container alors on lui donne les données de l'élément cible et inversement
    if(dragSrcEl !== this && this.classList[0] === dragSrcEl.classList[0]) {
        dragSrcEl.innerHTML = this.innerHTML
        this.innerHTML = e.dataTransfer?.getData('text/html') as string

        // Si c'est un container un rjaoute tous les événements de drag and drop sinon on rajoute tous les évenements à notre item
        if(this.classList.contains("items-container")) {
            addContainerListeners(this as HTMLDivElement)

            this.querySelectorAll('li').forEach((li: HTMLLIElement) => {
                handleItemDeletion(li.querySelector('button') as HTMLButtonElement)
                addDDlisteners(li)
            })
        } else {
            addDDlisteners(this)
            handleItemDeletion(this.querySelector("button") as HTMLButtonElement)
        }
        
    }

}

function handleDragEnd(this: HTMLElement, e: DragEvent) {
    e.stopPropagation()
    // Si l'élement swapé est un container alors on rajoute les événements sinon on rajoute les événement de drag and drop
    if(this.classList.contains('items-container')) {
        addContainerListeners(this as HTMLDivElement)
        this.querySelectorAll('li').forEach((li: HTMLLIElement) => {
            handleItemDeletion(li.querySelector('button') as HTMLButtonElement)
            addDDlisteners(li)
        })
    } else {
        addDDlisteners(this)
    }
}


// Add New Container

const addContainerBtn = document.querySelector('.add-container-btn') as HTMLButtonElement
const addContainerForm = document.querySelector('.add-new-container form') as HTMLFormElement
const addContainerFormInput = document.querySelector('.add-new-container input') as HTMLInputElement
const validationNewContainer = document.querySelector('.add-new-container .validation-msg') as HTMLSpanElement
const addContainerCloseBtn = document.querySelector('.close-add-list') as HTMLButtonElement
const addNewContainer = document.querySelector('.add-new-container') as HTMLDivElement
const containersList = document.querySelector('.main-content') as HTMLDivElement

// Gère le toggle du nouveau container créé
addContainerBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, true)
})
addContainerCloseBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, false)
})

// Au submit de notre nouveau container, on lance la fonction pour créer son contenu
addContainerForm.addEventListener('submit', createNewContainer)

// Gère la création du contenu du nouveau container
function createNewContainer(e: Event) {
    e.preventDefault()
        // Validation
    if(addContainerFormInput.value.length === 0) {
        validationNewContainer.textContent = "Item can't be empty"
        return
    } else {
        validationNewContainer.textContent = ""
    }

    const itemsContainer = document.querySelector('.items-container') as HTMLDivElement
    const newContainer = itemsContainer.cloneNode() as HTMLDivElement
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
    `
    newContainer.innerHTML = newContainerContent
    containersList.insertBefore(newContainer, addNewContainer)
    addContainerFormInput.value = ""
    addContainerListeners(newContainer)

}