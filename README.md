🌐 opensource-website
=================

[![Contributor Covenant](https://img.shields.io/badge/contributor%20covenant-v2.0%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)
[![Embark](https://img.shields.io/badge/embark-open%20source-blueviolet.svg)](https://github.com/EmbarkStudios)

Hub for [Embark's open source efforts](https://www.embark.dev/).

## About

This is a website using [Zola](https://www.getzola.org/) as static site generator.

Project data is provided by a small JSON file, but in the future this should be grabbed from an API.

All non-project data and text is hardcoded for now, but in the future this should be provided by a CMS.

## User Guide

### Zola usage
```sh
# locally serve the site
zola serve
```
```sh
# build the static content
# default output dir `public/`
zola build
```

### Adding or Changing Projects

The site's data comes from `static/data/data.json`. You can add a new project by adding its info to this file.

```json
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
  "featureImage": "https://camo.githubusercontent.com/c279dea27db2c10f64cd27563d8d7cc86048c5c1/68747470733a2f2f692e696d6775722e636f6d2f43735a6f5350532e6a7067",

  // Lastly, if this property is included the project will be hidden 
  // from the website.
  "hidden": "This project is being soft-launched, so don't show it on the website"
}
```

### Adding or Changing Category Sections

You can insert a section showing all projects with a specified tag by putting the following into `templates/index.html`:

```html
<!-- Replace "rust" with your tag -->
{{ macros::project_category(projects=data.projects, tag="rust") }}
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
