const { Vue } = window;

const sharedMethods = {
  methods: {
    repoUrl(project) {
      return `https://github.com/EmbarkStudios/${project.name}`;
    },
    stargazersUrl(project) {
      return `https://github.com/EmbarkStudios/${project.name}/stargazers`;
    },
    issuesUrl(project) {
      return `https://github.com/EmbarkStudios/${project.name}/issues`;
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

Vue.component('newsletter', {
  props: ['newsletter'],
  template: `
  <section class="category">
  <div class="container">
    <h2>Previous Editions:</h2>
    <div class="projects-container">
      <a v-bind:href="repoUrl(n)" class="newsletter" v-for="n in newsletter">
        <div class="project-card">
          <h3 class="title">
            {{ n.name }}
          </h3>
          <p v-html="n.date"></p>
        </div>
      </a>
    </div>
    </div>
  </section>
  `,
});

Vue.component('star-count', {
  mixins: [sharedMethods],
  props: ['project'],
  template: `
    <div class="github-btn github-stargazers github-btn-large" v-if="project.stargazers_count != undefined">
      <a class="gh-btn" :href="repoUrl(project)" rel="noopener noreferrer" target="_blank">
        <span class="gh-ico" aria-hidden="true"></span>
        <span class="gh-text">Star</span>
      </a>
      <a class="gh-count" :href="stargazersUrl(project)" rel="noopener noreferrer" target="_blank" aria-hidden="true">{{project.stargazers_count}}</a>
    </div>
  `,
});

Vue.component('issues-count', {
  mixins: [sharedMethods],
  props: ['project'],
  template: `
    <div class="github-btn github-stargazers github-btn-large" v-if="project.open_issues_count != undefined">
      <a class="gh-btn" :href="issuesUrl(project)" rel="noopener noreferrer" target="_blank">
        <span class="gh-ico" aria-hidden="true"></span>
        <span class="gh-text">Issues</span>
      </a>
      <a class="gh-count" :href="issuesUrl(project)" rel="noopener noreferrer" target="_blank" aria-hidden="true">{{project.open_issues_count}}</a>
    </div>
  `,
});

Vue.component('github-stats', {
  props: ['project'],
  template: `
    <div class="github-buttons-container">
      <star-count :project="project" />
      <issues-count :project="project" />
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
          <div class="project-card">
            <h3 class="title">
              <span class="emoji">{{ p.emoji }}</span>
              {{ p.name }}
            </h3>
            <p v-html="p.description"></p>
            <tags v-bind:tags="p.tags"></tags>
            <github-stats :project="p" />
          </div>
        </a>
      </div>
    </section>
  `,
});

window.addEventListener('load', () => {
  new Vue({ // eslint-disable-line no-new
    el: '#app',
    mixins: [sharedMethods],
    data: {
      showSearch: false,
      search: '',
      projects: [],
    },
    async mounted() {
      try {
        const dataPromise = fetch('./data.json');

        // We don't want the whole website to break if the GH API is down or rate limit is hit
        // so it's wrapped in a different try/catch
        let fetchedRepos;
        try {
          const reposPromise = fetch('https://api.github.com/search/repositories?q=+org:EmbarkStudios+is:public&sort=created&order=asc&per_page=100');
          fetchedRepos = await reposPromise;
        } catch (err) {
          console.log(`Failed to get repos info: ${err}`); // eslint-disable-line no-console
        }

        // data is awaited here instead of in the fetch, so the GitHub request can start in parallel
        const fetchedData = await dataPromise;
        const { projects } = await fetchedData.json();

        // If GitHub API request succeeded, we add the extra data to the projects array
        if (fetchedRepos && fetchedRepos.ok) {
          const { items: repos } = await fetchedRepos.json();

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

        this.projects = projects;
      } catch (err) {
        console.log(`Failed to get project data: ${err}`); // eslint-disable-line no-console
      }
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
      toggleSearch() {
        this.showSearch = !this.showSearch;
        if (this.showSearch) {
          document.body.classList.add('search-open');
          this.$nextTick(() => this.$refs.search.focus());
        } else {
          document.body.classList.remove('search-open');
          this.search = '';
        }
      },
    },
  });
});
