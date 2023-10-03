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
			renderCharacter(character);
		});

		container.appendChild(characterName);
	});
}

// render single character
function renderCharacter(character) {
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
		p.textContent = `Votes: ${character.votes}`;
	});
	container.appendChild(button);
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
