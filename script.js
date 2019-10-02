Vue.component('tags', {
  props: ['tags'],
  template: `
    <div class="tags">
      <span v-for="tag in tags" v-bind:class="'tag tag-' + tag">{{ tag }}</span>
    </div>
  `
})

Vue.component('project-category', {
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
  `,
  methods: {
    repoUrl: function (project) {
      return "https://github.com/EmbarkStudios/" + project.name
    },
    starButton: function(project) {
      return `https://ghbtns.com/github-btn.html?user=EmbarkStudios&repo=${project.name}&type=star&count=true&size=large`;
    }
  }
})

fetch('./data.json').then(response => {
  return response.json();
}).then(data => {
  console.log(data)

  new Vue({  
    el: '#app',
    data: data,

    computed: {
      featuredProjects: function() {
        return this.projects.filter(p => p.featured);
      },
      alphabetisedProjects: function() {
        return this.projects.sort((a, b) => a.name.localeCompare(b.name));
      }
    },

    methods: {
      repoUrl: function (project) {
        return "https://github.com/EmbarkStudios/" + project.name
      },
      // Return a filtered array of all projects with a tag
      projectsWithTag: function (tag) {
        return this.projects.filter(function (p) {
          return p.tags.includes(tag)
        })
      }
    }  
  })

}).catch(err => {
  console.log('Failed to get project data'); 
});
