const { Vue } = window;

const sharedMethods = {
  methods: {
    repoUrl(project) {
      return `https://github.com/EmbarkStudios/${project.name}`;
    },
    stargazersUrl(project) {
      return `https://github.com/EmbarkStudios/${project.name}/stargazers`;
    },
  },
};

Vue.component('tags', {
  props: ['tags'],
  template: `
    <div class="tags">
      <div v-for="tag in tags" v-bind:class="'tag tag-' + tag">
        <a v-bind:href="tagUrl(tag)">{{ tag }}</a>
      </div>
    </div>
  `,
  methods: {
    tagUrl(tag) {
      return `/tags?tag=${tag}`;
    },
  },
});

Vue.component('star-count', {
  mixins: [sharedMethods],
  props: ['project'],
  template: `
    <div class="github-btn github-stargazers github-btn-large">
      <a class="gh-btn" :href="repoUrl(project)" rel="noopener noreferrer" target="_blank">
        <span class="gh-ico" aria-hidden="true"></span>
        <span class="gh-text">Star</span>
      </a>
      <a class="gh-count" :href="stargazersUrl(project)" rel="noopener noreferrer" target="_blank" aria-hidden="true">{{project.stargazers_count}}</a>
    </div>
  `,
});

Vue.component('project-category', {
  mixins: [sharedMethods],
  props: ['projects', 'tag'],
  template: `
    <section class="category">
      <h2 class="category-title">Our <span class="category-tag">{{ tag }}</span> projects</h2>
      <div class="projects-container" v-bind:id="tag">
        <a v-bind:href="repoUrl(p)" class="project" v-for="p in projects">
          <div>
            <h3 class="title">
              <span class="emoji">{{ p.emoji }}</span>
              {{ p.name }}
            </h3>
            <p v-html="p.description"></p>
            <tags v-bind:tags="p.tags"></tags>
            <star-count :project="p" />
          </div>
          <!-- <iframe class="star-button" v-bind:src="starButton(p)" frameborder="0" scrolling="0" width="160px" height="30px"></iframe> -->
        </a>
      </div>
    </section>
  `,
});

/**
 * Loads the Vue instance with the projects array
 */
function loadVue(projects) {
  new Vue({ // eslint-disable-line no-new
    el: '#app',
    mixins: [sharedMethods],
    data: {
      showSearch: false,
      search: '',
      projects,
    },

    computed: {
      featuredProjects() {
        return this.projects.filter((p) => p.featured);
      },
      alphabetisedProjects() {
        const { projects: unsortedProjects } = this;
        return unsortedProjects.sort((a, b) => a.name.localeCompare(b.name));
      },
      searchedProjects() {
        return this.projects.filter(
          (p) => JSON.stringify(p).toLowerCase().includes(this.search.toLowerCase()),
        );
      },
    },

    methods: {
      // Return a filtered array of all projects with a tag
      projectsWithTag(tag) {
        return this.projects.filter((p) => p.tags.includes(tag));
      },
      getTagFromUrl() {
        return new URL(document.location).searchParams.get('tag');
      },
      openSearch() {
        document.body.classList.add('search-open');
        this.showSearch = true;
        this.$nextTick(() => this.$refs.search.focus());
      },
      closeSearch() {
        document.body.classList.remove('search-open');
        this.search = '';
        this.showSearch = false;
      },
    },
  });
}

/**
 * Loads the data from json and GitHub API, then initializes Vue
 */
async function main() {
  const [
    fetchedData,
    fetchedRepos,
  ] = await Promise.allSettled([
    fetch('./data.json'),
    fetch('https://api.github.com/search/repositories?q=+org:EmbarkStudios+is:public&sort=created&order=asc&per_page=100'),
    // TODO Currently there are less than 100 repos.
    // If the number exceeds it some time in the future, pagination should be implemented
  ]);

  try {
    if (fetchedData.status === 'rejected') throw Error(fetchedData.reason);
    const { projects } = await fetchedData.value.json();

    // If GitHub API request succeeded, we add the extra data to the projects array
    if (fetchedRepos.status === 'fulfilled') {
      const jsonRepos = await fetchedRepos.value.json();
      const repos = jsonRepos.items;
      for (let i = 0; i < projects.length; i += 1) {
        const project = projects[i];
        const repo = repos.find((el) => el.name === project.name);
        if (repo) {
          project.description = repo.description;
          project.stargazers_count = repo.stargazers_count;
          project.language = repo.language;
          project.forks_count = repo.forks_count;
          project.open_issues_count = repo.open_issues_count;
        }
      }
    }

    loadVue(projects);
  } catch (err) {
    console.log(`Failed to get project data: ${err}`); // eslint-disable-line no-console
  }
}

main();
