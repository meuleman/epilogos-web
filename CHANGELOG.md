# epilogos-web

This is a change log for the epilogos-web project and related dependencies. 

Please refer to https://github.com/todomd/todo.md for the task list format used for this document.

## Tasks

- [ ] On popstate event for selected exemplar or ROI element, open drawer, select element, highlight region #ui @alexpreynolds 2021-04-05

- [ ] Add tabix files for hg19/hg38 Boix imputed_vs_observed tracks and other groups  #processing @alexpreynolds 2021-04-02

- [ ] Create PR for epilogos metadata from epilogos-meme and tsv files #processing @alexpreynolds 2021-03-29

- [ ] Remove commented dead code #debt @alexpreynolds 2021-04-05

## Completed ✓

### 2021

#### April

- [x] Implement web browser history debouncer when changing coordinates to allow discrete backwards navigation #ui @alexpreynolds 2021-04-05

- [x] Adjust `Viewer.parameterSummaryAsElement` call on window width resize #ui @alexpreynolds 2021-04-02

- [x] Disable recommender for Boix (ref. https://epilogos.altius.org:3001/?application=viewer&sampleSet=vC&mode=single&genome=hg38&model=18&complexity=KL&group=all&chrLeft=chr5&chrRight=chr5&start=178900672&stop=178980749) #ui @alexpreynolds 2021-04-02

- [x] Improvements to `ViewerMobile` #debt @alexpreynolds 2021-04-02
  - [x] Have gene annotation label (e.g. "GENCODE v19") show up in landscape paired mode #ui @alexpreynolds 2021-04-02

- [x] Improvements to `ViewerMobile` #debt @alexpreynolds 2021-04-01
  - [x] Fix zoom-extent #debt @alexpreynolds 2021-04-01
  - [x] Support Helper function calls for track UUIDs #debt @alexpreynolds 2021-04-01
  - [x] Set up chromInfoCache lookup/load for each ChromosomeInfo call #debt @alexpreynolds 2021-04-01
  - [x] Fix paired/single view track height offset problem #ui @alexpreynolds 2021-04-01

#### March

- [x] Redo hg38 Boix tracks to fix XIST-like bin shift issue #processing @alexpreynolds 2021-03-25
  - [x] Get jobs up on the cluster
  - [x] Upload
  - [x] Copy in-place
  - [x] Refresh cache

- [x] Autocomplete improvements #ui @alexpreynolds 2021-03-25
  - [x] Allow use of arrow keys in autocomplete field, when the drawer is closed #ui @alexpreynolds 2021-03-25
  - [x] Press Esc in autocomplete field to hide autocomplete results #ui @alexpreynolds 2021-03-25
  - [x] Allow leading spaces in specified gene name #ui @alexpreynolds 2021-03-22

- [x] Add new hg19/hg38 Boix imputed_vs_observed tracks #processing @alexpreynolds 2021-03-25
  - [x] A `/home/jquon/imputedVsObserved/allMostlyImputed` (hg19, S1)
  - [x] B `/home/jquon/imputedVsObserved/allMostlyObserved` (hg19, S1)
  - [x] AvsB `/home/jquon/imputedVsObserved/imputedObserved` (hg19, S1)
  - [x] Process hg19 greatestHits (exemplars)
  - [x] Make hg38 epilogos tracks from hg19 tracks
  - [x] Liftover/repad exemplars from hg19 to hg38
  - [x] Upload epilogos tracks and exemplars
    - [x] hg19
    - [x] hg38
  - [x] Ingest epilogos tracks and exemplars
    - [x] hg19
    - [x] hg38
  - [x] Browser metadata
    - [x] hg19
    - [x] hg38

- [x] Investigate hg38 bin shift strategy around XIST #processing @alexpreynolds 2021-03-22
  - [x] Get hg38 XIST coordinates
  - [x] Get raw hg38 epilogos bins for Cancer grouping
  - [x] Compare with adjusted hg38 bins for Cancer grouping
  - [x] Adjust the `shift_hg38_liftover_bins.py` script to adjust bins up- or downstream, based on remainder and half-bin width
  - [x] Remake Cancer epilogos track
  - [x] Remake Cancer chromatin states track
  - [x] Upload test tracks to explore, clear cache and review TSS edges of XIST and various other genes of either strand orientation

- [x] Get `eslint` pre-commit hook working #ci @alexpreynolds 2021-03-22
  - [x] Use `npm` to install `babel-eslint` and `eslint-plugin-react`
  - [x] Test pre-commit hook in `${ROOT}/../Altius/epilogos-web`
  - [x] Copy over `package.json` from `${ROOT}` to `${ROOT}/../Altius/epilogos-web`
  - [x] Investigate `.env` `SKIP_PREFLIGHT_CHECK` side-effects, if any
  - [x] Fix linting issues in `${ROOT}/src/components/Viewer.js` and other components

- [x] Via post-install hook, change `.pretty input:checked~.state.p-warning label:after, .pretty.p-toggle .state.p-warning label:after` coloring from `#f0ad4e` (orange) to `#0000ff` (blue) #debt @alexpreynolds 2021-03-22

- [x] Resolve `Helpers.js` range parser to order X and Y positions correctly (ref. https://github.com/Altius/epilogos-web/issues/1) #debt @alexpreynolds 2021-03-22