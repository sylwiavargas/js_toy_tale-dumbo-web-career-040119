const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const submitForm = document.querySelector('.add-toy-form')
let addToy = false

// List of toys, so cards can be added
const toyList = document.querySelector('#toy-collection')

// Get all toys from localhost API on page load (render is in the HTML)
fetch('http://localhost:3000/toys')
  .then(res => res.json())
  .then(toys => toys.forEach(slapItOnTheList))

function slapItOnTheList(toy) {
  const div = document.createElement('div');
  div.className = 'card'
  div.innerHTML = `<h2>${toy.name}</h2>
  <img src=${toy.image} class='toy-avatar' alt='${toy.name} Picture' />
  <p>${toy.likes} likes</p>
  <button class='like-btn'>Like <3</button>`;
  const likeButton = div.querySelector('.like-btn');
  likeButton.dataset.toyId = toy.id
  likeButton.addEventListener('click', () => {
    likeIt(event, toy);
  })
  toyList.appendChild(div);
}

function likeIt(event, toy) {
  let toyId = event.target.dataset.toyId
  let newToyLikes = toy.likes + 1
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify( { likes: newToyLikes} )
  })
  .then(res => res.json())
  .then(newToy => (slapItOnTheList(newToy)));
  document.location.reload()
}

function createNewToy(event) {
  event.preventDefault();
  const toyName = submitForm.name.value;
  const toyImage = submitForm.image.value;
  if (toyName !== "" && toyImage !== "") {
    fetch('http://localhost:3000/toys', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify( { name: toyName, image: toyImage, likes: 0 } )
    })
    .then(res => res.json())
    .then(newToy => (slapItOnTheList(newToy)));
  }
  else {
    alert("You must enter a name and an image.");
  }
}

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    submitForm.addEventListener('submit', createNewToy)
  } else {
    toyForm.style.display = 'none'
  }
})
