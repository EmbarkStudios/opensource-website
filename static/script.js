// const appDiv = document.querySelector('#app');
// appDiv.innerHTML = '<p>Hello</p>'
function clicked(message) {
    console.log(message);
}


function repoUrl(project) {
    return `https://github.com/EmbarkStudios/${project.name}`;
}

function stargazersUrl(project) {
    return `https://github.com/EmbarkStudios/${project.name}/stargazers`;
}

function issuesUrl(project) {
    return `https://github.com/EmbarkStudios/${project.name}/issues`;
}

function newsletterUrl(newsletter) {
    return `${newsletter.link}`;
}





let state = {
    projects: [],
    newsletter: [],
    showSearch: false,
    // search: ''
}

init();

function init() {
    loadData();
    handleSearchInput();
}

async function loadData() {
    const data = await (await fetch('./data/data.json')).json();
    if (data.projects && data.newsletter) {
        data.projects = data.projects.filter((project) => !project.hidden);

        state.projects = data.projects.sort((a, b) => a.name.localeCompare(b.name));
        state.newsletter = data.newsletter;
    }
    console.log(data);
}

// search start
function toggleSearch() {
    state.showSearch = !state.showSearch;
    const searchOverlay = document.body.querySelector('#search-overlay');
    if (!searchOverlay) return;
    if (state.showSearch) {
        searchOverlay.style.display = '';
        document.body.querySelector('#search-input').focus();
    } else {
        searchOverlay.style.display = 'none';

        const searchInput = document.body.querySelector('#search-input');
        if (!searchInput) return;
        searchInput.value = '';
        showAllSearchedProjects(state.projects);
    }
}

function escapeSearch(event) {
    if (event.key == 'Escape') {
        toggleSearch();
    }
}

function handleSearchInput() {
    const searchInput = document.body.querySelector('#search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (event) => {
        const search = event.target.value;
        const searchedProjects = state.projects.filter((p) => JSON.stringify(p).toLowerCase().includes(search.toLowerCase()));
        console.log(searchedProjects);
        showAllSearchedProjects(searchedProjects);
    });

}

function showAllSearchedProjects(searchedProjects) {
    for (let i = 0; i < state.projects.length; i++) {
        // instead of template-strings to be able to support IE
        const card = document.body.querySelector('#search-project-card-' + state.projects[i].name);
        if (!card) return;

        const isInSearchedProjects = searchedProjects.some((p) => p.name.includes(state.projects[i].name));
        if(isInSearchedProjects) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    }
}

// search end