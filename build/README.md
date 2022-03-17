# Keep this directory

The [zola-deploy-action](https://github.com/shalzz/zola-deploy-action/blob/master/entrypoint.sh) doesn't create the build directory, hence it must exist before the build action is started.
Build directory can be specified in `./.github/workflows/build.yml`
