import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";

const issueCountCssPrefix = "issue-count-";
const starCountCssPrefix = "star-count-";
const projectDescriptionCssPrefix = "project-description-";

let state = {
  projects: [],
  newsletter: [],
  showSearch: false,
};

document.addEventListener("DOMContentLoaded", () => {
  init();
});

async function init() {
  window.toggleSearch = toggleSearch;
  window.escapeSearch = escapeSearch;

  await loadProjectAndNewsletterData();
  await loadGitHubData();
  handleSearchInput();
}

async function loadProjectAndNewsletterData() {
  const data = await (await fetch("/data/data.json")).json();
  if (data.projects && data.newsletter) {
    data.projects = data.projects.filter((project) => !project.hidden);

    state.projects = data.projects.sort((a, b) => a.name.localeCompare(b.name));
    state.newsletter = data.newsletter;
  }
}

async function loadGitHubData() {
  const octokit = new Octokit();

  const repos = await octokit.paginate(octokit.repos.listForOrg, {
    org: "EmbarkStudios",
    per_page: 100,
  });

  for (let i = 0; i < state.projects.length; i++) {
    const project = state.projects[i];
    const repo = repos.find(
      (el) => el.name === project.name || el.html_url === project.repo
    );
    if (repo) {
      project.description = repo.description;
      project.stargazers_count = repo.stargazers_count;
      project.language = repo.language;
      project.forks_count = repo.forks_count;
      project.open_issues_count = repo.open_issues_count;

      if (project.repo === null) {
        project.repo = repo.html_url;
      }
    }
  }

  hydrateHtmlWithGitHubData();
}

function hydrateHtmlWithGitHubData() {
  for (let i = 0; i < state.projects.length; i++) {
    const project = state.projects[i];
    updateHtml(project.name, starCountCssPrefix, project.stargazers_count);
    updateHtml(project.name, issueCountCssPrefix, project.open_issues_count);
    updateHtml(project.name, projectDescriptionCssPrefix, project.description);
  }
}

function updateHtml(projectName, cssClass, innerHtml) {
  const htmlTags = document.body.querySelectorAll("." + cssClass + projectName);
  if (htmlTags) {
    if (innerHtml !== undefined && innerHtml !== null) {
      // add innerHTML if given
      for (let j = 0; j < htmlTags.length; j++) {
        htmlTags[j].innerHTML = innerHtml;
      }
    } else {
      // remove HTML if no innerHtml value
      for (let j = 0; j < htmlTags.length; j++) {
        if (cssClass == starCountCssPrefix || cssClass == issueCountCssPrefix) {
          // if its issue-count or star-count for GitHub Stats and no GitHub Data remove whole GitHub Stats
          htmlTags[j].parentNode.parentNode.removeChild(htmlTags[j].parentNode);
        }
      }
    }
  }
}

// search start
function toggleSearch() {
  state.showSearch = !state.showSearch;
  const searchOverlay = document.body.querySelector("#search-overlay");
  if (!searchOverlay) return;
  if (state.showSearch) {
    searchOverlay.style.display = "";
    document.body.querySelector("#search-input").focus();
  } else {
    searchOverlay.style.display = "none";

    const searchInput = document.body.querySelector("#search-input");
    if (!searchInput) return;
    searchInput.value = "";
    showAllSearchedProjects(state.projects);
  }
}

function escapeSearch(event) {
  if (event.key == "Escape") {
    toggleSearch();
  }
}

function handleSearchInput() {
  const searchInput = document.body.querySelector("#search-input");
  if (!searchInput) return;

  searchInput.addEventListener("input", (event) => {
    const search = event.target.value;
    const searchedProjects = state.projects.filter((p) =>
      JSON.stringify(p).toLowerCase().includes(search.toLowerCase())
    );
    showAllSearchedProjects(searchedProjects);
  });
}

function showAllSearchedProjects(searchedProjects) {
  for (let i = 0; i < state.projects.length; i++) {
    const card = document.body.querySelector(
      "#search-project-card-" + state.projects[i].name
    );
    if (!card) return;

    const isInSearchedProjects = searchedProjects.some((p) =>
      p.name.includes(state.projects[i].name)
    );
    if (isInSearchedProjects) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  }
}
// search end
