const numberOfUsers = 12;
const galleryArea = document.getElementById('gallery');
let userData = {};
let card = '';
console.log(userData.length)
//----------------------// 
//-- Gallery Of Users --//
//----------------------// 


//Show Initial Users
displayUsers()

//displayUsers(): Main fucution for gathering, processing and posting users
async function displayUsers() {
    const user = await fetchData();
    // console.log(user)
    let finalHTML = '';
    for(let i = 0; i < user.length; i++){
        finalHTML += generateUserHTML(user[i],i)
    }
    // console.log(finalHTML)
    galleryArea.insertAdjacentHTML('beforeend', finalHTML)
    card = document.querySelectorAll('.card');

}

//fetchData() reach out to the API to generate users
async function fetchData() {
    try {
        const response = await fetch(`https://randomuser.me/api/?inc=name,picture,email,location,dob,phone,id&results=${numberOfUsers}`);
        const data = await response.json();
        userData = data.results;
        return data.results;

    } catch (error) {
        console.error('Error:', error);
    }
};



function generateUserHTML(data,id) {
    // console.log(data)

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
//-- Event Listeners --//
//----------------------// 

//Event Listener: Watching for card clicks to initate popup
galleryArea.addEventListener('click', (e) => {
    const activeCard = e.target.closest('.card')  //get the card
    if(!activeCard) return //if card not found, do nothing.
    const activeCardIndex = Number(activeCard.dataset.id) //get the card id
    createModal(activeCardIndex)
})

function createModal(cardIndex){
    const activeCardData = userData[cardIndex] //get the corresponding dataset
    const activeModal = new Modal(activeCardData, cardIndex) //pass it to the Modal class
    activeModal.launchModal()
}

//----------------------// 
//-- Modal Popup Code --//
//----------------------// 

class Modal {
    constructor(data, index){
        this.data = data;
        this.index = Number(index)
        this.html = ''
        this.modalContainer = ''
        this.modalClose = ''
        this.modalNext = ''
        this.modalPrevious = ''
    }

    launchModal(){
        this.buildModalHTML(this.data);
        galleryArea.insertAdjacentHTML('afterend', this.html);
        this.modalContainer = document.querySelector('.modal-container');
        this.modalClose  = document.querySelector('#modal-close-btn');
        this.modalNext  = document.querySelector('#modal-next');
        this.modalPrevious  = document.querySelector('#modal-prev');
        this.initiateEventListers();
    }

    initiateEventListers(){
        this.modalClose.addEventListener('click', (e) => {
            this.modalContainer.remove()

        })

        this.modalNext.addEventListener('click', (e) => {
            this.modalContainer.remove()
            let newIndex = (this.index + 1)
            if(this.index === (numberOfUsers - 1)) {
                newIndex = 0
            }
            console.log(newIndex)
            console.log(typeof newIndex)
            createModal(newIndex)
        });

        this.modalPrevious.addEventListener('click', (e) => {
            this.modalContainer.remove()
            let newIndex = (this.index - 1)
            if(this.index === 0) {
                newIndex = (numberOfUsers - 1)
            }

            console.log(newIndex)
            console.log(typeof newIndex)
            createModal(newIndex)
        });
    }

    buildModalHTML(){
        console.log(this.data)
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
                    <p class="modal-text">${this.data.location.street.number} ${this.data.location.street.name}, ${this.data.location.city}, ${this.data.location.state} ${this.data.location.postcode}</p>
                    <p class="modal-text">Birthday: ${this.convertDate()}</p>
                </div>
            </div>
        
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>`;
        }
        
        
    convertDate(){
        const date = new Date(this.data.dob.date);
        const formattedDate = date.toLocaleDateString('en-US'); 
        return formattedDate
    };
}