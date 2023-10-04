const BASE_URL = 'http://localhost:4000/characters';

// Ensure the dom is loaded before doing anything
document.addEventListener('DOMContentLoaded', () => {
	getCharacters();
});

// Render fetched characters
function renderCharacters(characters) {
	const container = document.querySelector('.characters');

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

	const img = document.createElement('img');
	img.src = character.image;
	img.alt = character.name;
	container.appendChild(img);

	const p = document.createElement('p');
	p.textContent = `Votes: ${character.votes}`;
	container.appendChild(p);

	const button = document.createElement('button');
	button.textContent = 'Add vote';
	button.addEventListener('click', () => {
		character.votes++;
		updateCharacter(character);
		p.textContent = `Votes: ${character.votes}`;
	});
	container.appendChild(button);

	const resetButton = document.createElement('button');
	resetButton.textContent = 'Reset votes';
	resetButton.addEventListener('click', () => {
		character.votes = 0;
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
		.then(renderCharacters)
		.catch((err) => {
			console.log(err);
		});
}

// Get a single character
async function getCharacter(id) {
	try {
		const res = await fetch(`${BASE_URL}/${id}`);

		return res.json();
	} catch (error) {
		console.log(error);
	}
}
