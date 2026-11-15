
const input = document.querySelector("#username");
const btn = document.querySelector("#search-btn");
const profile = document.querySelector("#profile");
const showError = document.querySelector(".error");
const repositories = document.querySelector("#repositories");

// Get GitHub user
async function getUser() {
    profile.innerHTML = "";
    repositories.innerHTML = "";
    showError.textContent = "";

    const username = input.value.trim();

    if (!username) {
        showError.textContent = "Please enter a username.";
        return;
    }

    try {
        const response = await fetch(
            `https://api.github.com/users/${username}`
        );

        if (!response.ok) {
            throw new Error("User not found");
        }

        const userData = await response.json();

        showProfile(userData);
        getRepos(username);

    } catch (error) {
        showError.textContent = error.message;
    }
}

// Display user profile
function showProfile(userData) {
    profile.innerHTML = "";

    const image = document.createElement("img");
    image.classList.add("image-profile");
    image.src = userData.avatar_url;
    image.alt = `${userData.login}'s profile picture`;

    const name = document.createElement("h2");
    name.textContent = userData.name || userData.login;

    const bio = document.createElement("h4");
    bio.classList.add("bio");
    bio.textContent = userData.bio || "No bio available";

    const location = document.createElement("h4");
    location.classList.add("location");
    location.textContent = `Location: ${userData.location || "Not available"}`;

    const followers = document.createElement("h3");
    followers.classList.add("followers");
    followers.textContent = `Followers: ${userData.followers}`;

    const following = document.createElement("h3");
    following.classList.add("following");
    following.textContent = `Following: ${userData.following}`;

    const repos = document.createElement("h3");
    repos.classList.add("repos");
    repos.textContent = `Public Repositories: ${userData.public_repos}`;

    const link = document.createElement("a");
    link.href = userData.html_url;
    link.textContent = "Visit GitHub Profile";
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    profile.append(
        image,
        name,
        bio,
        location,
        followers,
        following,
        repos,
        link
    );
}

// Get user repositories
async function getRepos(username) {
    try {
        const response = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`
        );

        if (!response.ok) {
            throw new Error("Could not load repositories");
        }

        const repoData = await response.json();

        showRepos(repoData);

    } catch (error) {
        showError.textContent = error.message;
    }
}

// Display repositories
function showRepos(repoData) {
    repositories.innerHTML = "";

    repoData.forEach(repo => {
        const card = document.createElement("div");
        card.classList.add("repo-card");

        const title = document.createElement("h3");
        title.textContent = repo.name;

        const description = document.createElement("p");
        description.textContent =
            repo.description || "No description available";

        const link = document.createElement("a");
        link.href = repo.html_url;
        link.textContent = "View Repository";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        card.append(title, description, link);
        repositories.append(card);
    });
}

// Search button
btn.addEventListener("click", getUser);
