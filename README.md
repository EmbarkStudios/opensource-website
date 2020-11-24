🌐 opensource-website
=================

[![Netlify Status](https://api.netlify.com/api/v1/badges/a509a033-951d-4d9b-a2c0-3702a8cf9107/deploy-status)](https://app.netlify.com/sites/embark-dev-opensource/deploys)
[![Contributor Covenant](https://img.shields.io/badge/contributor%20covenant-v2.0%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)
[![Embark](https://img.shields.io/badge/embark-open%20source-blueviolet.svg)](https://github.com/EmbarkStudios)

Hub for Embark's open source efforts.

## About

This is a static site made using Vue.js.

Project data is provided by a small JSON file, but in the future this should be grabbed from an API.

All non-project data and text is hardcoded for now, but in the future this should be provided by a CMS.

We should also add routing, multiple pages, and all sorts of other things 🙂

## User Guide

### Adding or Changing Projects

The site's data comes from `data.json`. You can add a new project by adding its info to this file.

```javascript
{
  // Make sure the name is exactly the same as the GitHub repo name
  "name": "texture-synthesis",
  // The most important part
  "emoji": "🎨",
  // Add tags that you find relevant, as a comma-separated array
  "tags": ["rust"],
  // Short description to display on the card
  "description": "Example-based texture synthesis written in Rust",
  
  // The following fields are only required if the project will be featured:
  "featured": true,
  // Longer description, displayed on the featured card
  "extendedDescription": "A light Rust API for Multiresolution Stochastic Texture Synthesis, a non-parametric example-based algorithm for image generation.",
  // URL to an image to display on the featured card
  "featureImage": "https://camo.githubusercontent.com/c279dea27db2c10f64cd27563d8d7cc86048c5c1/68747470733a2f2f692e696d6775722e636f6d2f43735a6f5350532e6a7067"
}
```

### Adding or Changing Category Sections

You can insert a section showing all projects with a specified tag by putting the following into `index.html`:

```html
<!-- Replace "rust" with your tag -->
<project-category
  tag="rust"
  v-bind:projects="projectsWithTag('rust')"
></project-category>
```

## Contributing

We welcome community contributions to this project.

Please read our [Contributor Guide](CONTRIBUTING.md) for more information on how to get started.

## License

Licensed under either of

* Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
* MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
