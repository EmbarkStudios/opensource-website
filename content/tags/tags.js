document.addEventListener('DOMContentLoaded', async () => {
    // init global state loading
    await init();

    const urlParams = new URLSearchParams(window.location.search);
    const tag = urlParams.get('tag');
    if (tag !== null && tag !== '') {
        const categoryTagHeadline = document.body.querySelector('#category-tag-headline');
        if (categoryTagHeadline) {
            categoryTagHeadline.innerHTML = tag;
        }

        const projectsWithTag = state.projects.filter(project => project.tags.includes(tag));
        for (let i = 0; i < state.projects.length; i++) {
            const projectHtml = document.body.querySelector('#project-category-' + state.projects[i].name);
            if (projects) {
                const hasTag = projectsWithTag.some((project) => project.name.includes(state.projects[i].name));
                if (hasTag) {
                    projectHtml.classList.remove('hidden');
                } else {
                    projectHtml.classList.add('hidden');
                }
            }
        }
    }
});

