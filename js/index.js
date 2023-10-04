const BASE_URL = 'http://localhost:4000/characters';

// Ensure the dom is loaded before doing anything
document.addEventListener('DOMContentLoaded', () => {
	getCharacters();

	addCharacter();
});

// handle adding a new character
function addCharacter() {
	const form = document.getElementById('character-form');

	form.addEventListener('submit', (e) => {
		// prevent default form behaviour when submitting
		e.preventDefault();

		// get all values at ago
		// const formData = new FormData(form);
		// const data = Object.fromEntries(formData);
		// console.log(data);

		// get form values
		const name = document.getElementById('name');
		const image = document.getElementById('image');
		const votes = document.getElementById('votes');

		// check if the values are not empty
		if (!name.value || !image.value || !votes.value) {
			return alert('Character details are required');
		}

		fetch(BASE_URL, {
			method: 'POST',
			body: JSON.stringify({
				name: name.value,
				image: image.value,
				votes: votes.value,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.then(() => {
				// reset the form
				name.value = '';
				image.value = '';
				votes.value = '';

				// refetch all characters
				getCharacters();
			})
			.catch((err) => console.log(err));
	});
}

// Render fetched characters
function renderCharacters(characters) {
	const container = document.querySelector('.characters');

	// clear the characters container
	container.innerHTML = '';

	// iterate through each character and append to the dom
	characters.forEach((character) => {
		const characterName = document.createElement('button');
		characterName.textContent = character.name;
		characterName.classList.add(
			'list-group-item',
			'list-group-item-action'
		);
		characterName.addEventListener('click', () => {
			renderCharacter(character.id);
		});

		container.appendChild(characterName);
	});
}

// render single character
async function renderCharacter(id) {
	const character = await getCharacter(id);

	const container = document.querySelector('.character-details');

	// Clear character details div
	container.innerHTML = '';

	// Card header
	const cardHeader = document.createElement('div');
	cardHeader.textContent = character.name;
	cardHeader.classList.add('card-header');
	container.appendChild(cardHeader);

	// create img tag to display character image
	const img = document.createElement('img');
	img.src = character.image;
	img.alt = character.name;
	img.style.height = '70%';
	// img.height = 300;
	// img.width = 460;
	container.appendChild(img);

	const cardBody = document.createElement('div');
	cardBody.classList.add('card-body');
	container.appendChild(cardBody);

	// const title = document.createElement('h5');
	// title.textContent = character.name;
	// title.classList.add('card-title');
	// cardBody.appendChild(title);

	// create paragraph tag to display votes
	const p = document.createElement('p');
	p.textContent = `Votes: ${character.votes}`;
	p.classList.add('card-text');
	cardBody.appendChild(p);

	// create a button to add character vote count
	const button = document.createElement('button');
	button.textContent = 'Add vote';
	button.classList.add('btn', 'btn-primary');
	button.addEventListener('click', () => {
		character.votes++;
		// persist vote count to db.json
		updateCharacter(character);
		p.textContent = `Votes: ${character.votes}`;
	});
	cardBody.appendChild(button);

	// create button to reset character vote count
	const resetButton = document.createElement('button');
	resetButton.textContent = 'Reset votes';
	resetButton.classList.add('btn', 'btn-warning');
	resetButton.addEventListener('click', () => {
		character.votes = 0;
		// persist the reset vote count to db.json
		updateCharacter(character);
		p.textContent = `Votes: ${character.votes}`;
	});
	cardBody.appendChild(resetButton);

	const deleteButton = document.createElement('button');
	deleteButton.textContent = 'Delete';
	deleteButton.classList.add('btn', 'btn-danger');
	cardBody.appendChild(deleteButton);
}

// Updating a single character
function updateCharacter(character) {
	fetch(`${BASE_URL}/${character.id}`, {
		method: 'PATCH',
		body: JSON.stringify(character),
		headers: {
			// this indicates that the content being sent or received is in JSON format
			'Content-Type': 'application/json',
		},
	})
		.then((res) => res.json())
		.then((data) => console.log(data))
		.catch((err) => console.log(err));
}

// Fetch all characters from the json server
function getCharacters() {
	fetch(BASE_URL)
		.then((res) => res.json())
		// passing the renderCharacters function as a callback
		.then(renderCharacters)
		// handle any errors during a fetch request
		.catch((err) => {
			console.log(err);
		});
}

// Get a single character
// using async/await syntax
async function getCharacter(id) {
	try {
		const res = await fetch(`${BASE_URL}/${id}`);

		return res.json();
	} catch (error) {
		// handle any errors during a fetch request
		console.log(error);
	}
}
