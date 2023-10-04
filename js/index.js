const BASE_URL = 'http://localhost:4000/characters';

// Ensure the dom is loaded before doing anything
document.addEventListener('DOMContentLoaded', () => {
	getCharacters();
});

// Render fetched characters
function renderCharacters(characters) {
	const container = document.querySelector('.characters');

	// iterate through each character and append to the dom
	characters.forEach((character) => {
		const characterName = document.createElement('h1');
		characterName.textContent = character.name;
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

	// create img tag to display character image
	const img = document.createElement('img');
	img.src = character.image;
	img.alt = character.name;
	container.appendChild(img);

	// create paragraph tag to display votes
	const p = document.createElement('p');
	p.textContent = `Votes: ${character.votes}`;
	container.appendChild(p);

	// create a button to add character vote count
	const button = document.createElement('button');
	button.textContent = 'Add vote';
	button.addEventListener('click', () => {
		character.votes++;
		// persist vote count to db.json
		updateCharacter(character);
		p.textContent = `Votes: ${character.votes}`;
	});
	container.appendChild(button);

	// create button to reset character vote count
	const resetButton = document.createElement('button');
	resetButton.textContent = 'Reset votes';
	resetButton.addEventListener('click', () => {
		character.votes = 0;
		// persist the reset vote count to db.json
		updateCharacter(character);
		p.textContent = `Votes: ${character.votes}`;
	});
	container.appendChild(resetButton);
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
