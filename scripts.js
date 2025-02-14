const numberOfUsers = 12;
const galleryArea = document.getElementById('gallery');
let rawData = {};
let card = '';
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
    card = document.querySelector('.card')

}

async function fetchData() {
    try {
        const response = await fetch(`https://randomuser.me/api/?inc=name,picture,email,location&results=${numberOfUsers}`);
        const data = await response.json();
        // console.log(data);
        rawData = data.results;
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






galleryArea.addEventListener('click', (e) => {
    {console.log(e.target.closest('.card'))}
    
})


{/* <div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
                        <h3 id="name" class="modal-name cap">name</h3>
                        <p class="modal-text">email</p>
                        <p class="modal-text cap">city</p>
                        <hr>
                        <p class="modal-text">(555) 555-5555</p>
                        <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
                        <p class="modal-text">Birthday: 10/21/2015</p>
                    </div>
                </div>

                // IMPORTANT: Below is only for exceeds tasks 
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div> */}