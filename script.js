const { Vue } = window;

const sharedMethods = {
  methods: {
    repoUrl(project) {
      return `https://github.com/EmbarkStudios/${project.name}`;
    },
    starButton(project) {
      return `https://ghbtns.com/github-btn.html?user=EmbarkStudios&repo=${project.name}&type=star&count=true&size=large`;
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
          </div>
          <iframe class="star-button" v-bind:src="starButton(p)" frameborder="0" scrolling="0" width="160px" height="30px"></iframe>
        </a>
      </div>
    </section>
  `,
});

fetch('./data.json').then((response) => response.json()).then((data) => {
  new Vue({ // eslint-disable-line no-new
    el: '#app',
    mixins: [sharedMethods],
    data: {
      showSearch: false,
      search: '',
      ...data,
    },

    computed: {
      featuredProjects() {
        return this.projects.filter((p) => p.featured);
      },
      alphabetisedProjects() {
        const { projects } = this;
        return projects.sort((a, b) => a.name.localeCompare(b.name));
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
}).catch((err) => {
  console.log(`Failed to get project data: ${err}`); // eslint-disable-line no-console
});
