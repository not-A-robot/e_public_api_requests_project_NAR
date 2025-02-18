//Gloabl Variables
const numberOfUsers = 12;  //amount of users to get in initial api call
const galleryArea = document.getElementById('gallery');
let userData = {}; //original data download
let filteredUserData = []; //changing data
let card = '';

//----------------------// 
//--   User Gallery   --//
//----------------------// 

//Initial Load: Show initial Users
displayUsers()

//displayUsers() - Main fucution for gathering, processing and posting users
async function displayUsers() {
    const user = await fetchData();
    if(!user) return
    let finalHTML = '';
    for(let i = 0; i < user.length; i++){
        finalHTML += generateUserHTML(user[i],i)
    }
    galleryArea.insertAdjacentHTML('beforeend', finalHTML)

    //add event listeners to cards
    card = document.querySelectorAll('.card');
    card.forEach(cardElement => {
        addCardClickListener(cardElement)
    })
}

//fetchData() -  Reach out to the API to set of users for userData
async function fetchData() {
    try {
        const response = await fetch(`https://randomuser.me/api/?inc=name,picture,email,location,dob,phone,id&results=${numberOfUsers}`);
        const data = await response.json();
        userData = data.results;
        filteredUserData = data.results;
        return data.results;

    } catch (error) {
        console.error('Error:', error);
    }
};

//generateUserHTML() - Creates the HTML for the main gallery view
function generateUserHTML(data,id) {
    const userHTML = 
    `<div class="card" data-id="${id}">
        <div class="card-img-container">
            <img class="card-img" src="${data.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${data.name.first} ${data.name.last}</h3>
            <p class="card-text">${data.email}</p>
            <p class="card-text cap">${data.location.city}, ${data.location.state}</p>
        </div>
    </div>`
    return userHTML
};

//----------------------// 
//--     Searchbar    --//
//----------------------//

//Inital Load: Insert the Searchbar HTML
const searchDiv = document.querySelector('.search-container')
const searchHTML = `<form action="#" method="get"><input type="search" id="search-input" class="search-input" placeholder="Search..."><input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit"></form>`
searchDiv.insertAdjacentHTML('afterbegin', searchHTML)
const searchBtn = document.querySelector('#search-submit')

//Event Listener: Listen for Search Button click
searchBtn.addEventListener('click', (e) => {
    const inputText = document.querySelector('#search-input').value.toLowerCase()
    filterSearch(inputText)
});

//filterSearch() - Filter based on the search
function filterSearch(inputText) {
    let finalHTML = '';
    filteredUserData = [];

    //Update filteredUserData with new data that matches search params
    for(let i = 0; i < userData.length; i++){
        const userFullName = `${userData[i].name.first}${userData[i].name.last}`.toLowerCase()
        if(userFullName.includes(inputText) ){
            filteredUserData.push(userData[i])
        }
    }

    //Update the HTML Gallery with the updated filteredUserData
    for(let i = 0; i < filteredUserData.length; i++){
        finalHTML += generateUserHTML(filteredUserData[i],i)
    }

    //Update/display new filtered HTML
    galleryArea.innerHTML = finalHTML

    //add event listeners to new filtered cards
    card = document.querySelectorAll('.card');
    card.forEach(cardElement => {
        addCardClickListener(cardElement)
    })
}


//----------------------// 
//-- Modal Popup Code --//
//----------------------// 

//addCardClickListener() -  add listener for card clicks to build and popup
function addCardClickListener(cardElement) {
    cardElement.addEventListener('click', (e) => {
        const activeCard = e.target.closest('.card')  //get the card
        if(!activeCard) return //if card not found, do nothing.
        const activeCardIndex = Number(activeCard.dataset.id) //get the card index from the HTML Dataset
        createModal(activeCardIndex)
    })
}

//createModal() - Create the Modal class, popup html and deploy.
function createModal(cardIndex){
    const activeCardData = filteredUserData[cardIndex] //get the corresponding dataset
    const activeModal = new Modal(activeCardData, cardIndex) //create Modal Object with selected person data
    activeModal.launchModal()
}

class Modal {
    constructor(data, index){
        this.data = data;  //card data of single profile
        this.index = Number(index)  //index of card's data-id html
        this.html = ''
        this.modalContainer = ''
        this.modalClose = ''
        this.modalNext = ''
        this.modalPrevious = ''
        this.currentUserCount = ''
    }

    //launchModal() - Main fuction: Create & Deploy the Modal
    launchModal(){
        this.buildModalHTML(this.data);  //build the html
        galleryArea.insertAdjacentHTML('afterend', this.html); //deploy html

        //create variables the newly created HTML buttons & divs
        this.modalContainer = document.querySelector('.modal-container');
        this.modalClose  = document.querySelector('#modal-close-btn');
        this.modalNext  = document.querySelector('#modal-next');
        this.modalPrevious  = document.querySelector('#modal-prev');

        this.currentUserCount = Number(filteredUserData.length);  //latest count

        this.initiateEventListeners(); //add event listeners to each button
    }

    //initiateEventListeners()- Add Popup Button Event Listeners
    initiateEventListeners(){
        //X button - clear current modal html
        this.modalClose.addEventListener('click', (e) => {
            this.modalContainer.remove() 
        })

        //Next & Previous Buttons

        //if displaying only 1 user, hide next/previous buttons
        if(this.currentUserCount === 1){
            this.modalNext.parentElement.style.display = 'none';

        //else add event listners to the buttons
        } else {

            //Next Button
            this.modalNext.addEventListener('click', (e) => {
                this.modalContainer.remove()

                //determine the Next user index number & loop if at the end
                let newIndex = (this.index + 1)
                if(this.index === (this.currentUserCount - 1)) {
                    newIndex = 0
                }
                createModal(newIndex)
            });
            
            //Previous Button
            this.modalPrevious.addEventListener('click', (e) => {
                this.modalContainer.remove()

                //determine the Previous user index number & loopback if at the end
                let newIndex = (this.index - 1)
                if(this.index === 0) {
                    newIndex = (this.currentUserCount - 1)
                }
                createModal(newIndex)
            });
        }
    }

    //buildModalHTML() - Creates HTML for Popup Modal
    buildModalHTML(){
        this.html = 
        `<div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${this.data.picture.large}" alt="profile picture of ${this.data.name.first} ${this.data.name.last}">
                    <h3 id="name" class="modal-name cap">${this.data.name.first} ${this.data.name.last}</h3>
                    <p class="modal-text">${this.data.email}</p>
                    <p class="modal-text cap">${this.data.location.city}</p>
                    <hr>
                    <p class="modal-text">${this.data.phone}</p>
                    <p class="modal-text">${this.data.location.street.number} ${this.data.location.street.name}, ${this.data.location.city}, ${this.data.location.state} ${this.data.location.postcode}, ${this.data.location.country}</p>
                    <p class="modal-text">Birthday: ${this.convertDate()}</p>
                </div>
            </div>
        
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>`;
        }
        
    //convertDate() - convert UTC to local date US
    convertDate(){
        const date = new Date(this.data.dob.date);
        const formattedDate = date.toLocaleDateString('en-US'); 
        return formattedDate
    };
}