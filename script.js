// Function to fetch and display a new joke
function fetchJoke() {
    fetch('https://icanhazdadjoke.com/slack', {
        headers: { 'Accept': 'application/json' }
    })
    .then(response => response.json())
    .then(jokeData => {
        const jokeText = jokeData.attachments[0].text;
        const jokeElement = document.getElementById('jokeElement');
        jokeElement.innerHTML = jokeText;
    })
    .catch(() => {
        const jokeElement = document.getElementById('jokeElement');
        jokeElement.innerHTML = "Couldn't fetch a joke. Check your internet connection.";
    });
}

// Event listener for the refresh button
document.getElementById('refreshButton').addEventListener('click', fetchJoke);

// Fetch a joke when the popup is loaded
fetchJoke();
