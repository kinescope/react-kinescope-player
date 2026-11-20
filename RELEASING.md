# Releasing

The package is staged on npm by GitHub Actions (`.github/workflows/npm-publish.yml`)
when a GitHub Release is published, and becomes installable after a package owner
approves it with 2FA ([staged publishing](https://docs.npmjs.com/staged-publishing)).
Nobody publishes from a local machine.

## One-time setup

- **npm Trusted Publisher.** On npmjs.com: package `@kinescope/react-kinescope-player` →
  Settings → Trusted Publisher → GitHub Actions:
  - organization: `kinescope`
  - repository: `react-kinescope-player`
  - workflow filename: `npm-publish.yml`
  - allowed actions: leave only `npm stage publish` (always on). Do **not** enable
    `npm publish` or `npm dist-tag`: the workflow only stages, the tag is set when staging.

  If the values do not match the workflow run exactly, staging fails with `E404`.
  After the first successful release remove the old `NPM_TOKEN` repository secret
  and, in the package settings, disallow publishing with tokens.
- **2FA** for the owners who approve releases; approving needs npm CLI >= 11.15.0
  if done from the command line.

## Release

1. On an up-to-date `main` (or a release branch merged into `main` by a PR):

   ```sh
   npm ci
   npm run release -- --release-as minor --prerelease beta   # 0.5.4 -> 0.6.0-beta.0
   npm run release -- --prerelease beta                      # 0.6.0-beta.0 -> 0.6.0-beta.1
   npm run release -- --release-as minor                     # 0.6.0-beta.1 -> 0.6.0
   npm run release                                           # bump from commits since the last tag
   ```

   While the version is `0.x`, `feat:` commits bump only the patch version, so pass
   `--release-as minor` for a release with new features or behavior changes.

   This bumps the version in `package.json` / `package-lock.json`, adds a section to
   `CHANGELOG.md` (from Conventional Commits) and commits them as `chore: release X.Y.Z`.
   No tag is created. Review and edit `CHANGELOG.md` if needed (`git commit --amend`).

2. Push the commit to `main`. CI must be green: tests on React 18 and 19, and
   the committed `dist` must match `npm run build`.

3. Create a GitHub Release on that commit with a **new tag `vX.Y.Z`** equal to the version
   in `package.json`:
   - a prerelease version (`0.6.0-beta.0`): tick **"Set as a pre-release"**, it is published
     with the `next` dist-tag (`npm i @kinescope/react-kinescope-player@next`);
   - a stable version: no pre-release flag, it is published as `latest`.

   The workflow fails without staging if the tag does not match the version or
   the pre-release flag does not match the version.

4. Approve the staged package. The stage id is in the summary of the workflow run.
   - npmjs.com → the package → **Staged Packages** → **Approve** (asks for 2FA), or
   - `npm stage approve <stage-id>` (asks for 2FA).

   Before approving you can inspect it: `npm stage view <stage-id>`,
   `npm stage download <stage-id>`. A wrong package: `npm stage reject <stage-id>`.
   The dist-tag is fixed when staging; to change it, reject and re-run the workflow.

5. Check the result: `npm view @kinescope/react-kinescope-player dist-tags`, and the
   provenance badge on the npm package page.

## If publishing fails

Nothing is published until a staged package is approved.

- The cause is outside the repository (e.g. Trusted Publisher settings): fix it and
  re-run the failed workflow run. A staged but rejected package can be staged again
  by re-running the workflow.
- The fix needs a new commit: delete the GitHub Release and its tag, fix, and create
  the release again. The same version can be reused only if it has not reached npm:
  a version published to npm can never be published again, even after unpublishing.
