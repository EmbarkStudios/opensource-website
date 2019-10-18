var sharedMethods = {
  methods: {
    repoUrl: function (project) {
      return "https://github.com/EmbarkStudios/" + project.name
    },
    starButton: function(project) {
      return `https://ghbtns.com/github-btn.html?user=EmbarkStudios&repo=${project.name}&type=star&count=true&size=large`;
    }
  }
}

Vue.component('tags', {
  props: ['tags'],
  template: `
    <div class="tags">
      <span v-for="tag in tags" v-bind:class="'tag tag-' + tag">{{ tag }}</span>
    </div>
  `
})

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
            <p>{{ p.description }}</p>
            <tags v-bind:tags="p.tags"></tags>
          </div>
          <iframe class="star-button" v-bind:src="starButton(p)" frameborder="0" scrolling="0" width="160px" height="30px"></iframe>
        </a>
      </div>
    </section>
  `
})

fetch('./data.json').then(response => {
  return response.json();
}).then(data => {
  new Vue({
    el: '#app',
    mixins: [sharedMethods],
    data: {
      showSearch: false,
      search: '',
      ...data
    },

    computed: {
      featuredProjects: function() {
        return this.projects.filter(p => p.featured);
      },
      alphabetisedProjects: function() {
        return this.projects.sort((a, b) => a.name.localeCompare(b.name));
      },
      searchedProjects: function () {
        return this.projects.filter(p => {
          return JSON.stringify(p).toLowerCase().includes(this.search.toLowerCase());
        })
      }
    },

    methods: {
      // Return a filtered array of all projects with a tag
      projectsWithTag: function (tag) {
        return this.projects.filter(function (p) {
          return p.tags.includes(tag)
        })
      },
      openSearch: function () {
        document.body.classList.add('search-open');
        this.showSearch = true;
        this.$nextTick(() => this.$refs.search.focus())
      },
      closeSearch: function () {
        document.body.classList.remove('search-open');
        this.search = '';
        this.showSearch = false;
      }
    }
  })
}).catch(err => {
  console.log('Failed to get project data');
});
