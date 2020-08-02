# To-Do Code

This isn't supposed to be a coding project, dammit!

* Book converters
  * Tooling: https://github.com/rickosborne/skyline/issues/20
  * Decision: https://github.com/rickosborne/skyline/issues/4
  * Implementation: https://github.com/rickosborne/skyline/issues/3
  * Maybe [Electric Book](https://github.com/electricbookworks/electric-book)?
    * Not keen on the toolchain
    * Themes
    * POC: https://github.com/rickosborne/skyline/issues/1
  * Maybe [Gitbook](https://www.gitbook.com/)?
    * Would need to find old v1, or be willing to go with (yet another) cloud hosting
  * Maybe just [Hugo](https://gohugo.io/documentation/)
    * No built-in PDF support? Have to build my own via Pandoc?  (Nahhhh, there's got to be someone else who wants to build PDFs)
    * Very nice themes!
    * POC: https://github.com/rickosborne/skyline/issues/2
  * Custom Web theme: https://github.com/rickosborne/skyline/issues/8

* Stats data schema and tooling
  * Because I really don't want to maintain all those adapters by hand
  * CI tests to ensure correct materialization: https://github.com/rickosborne/skyline/issues/7
  * Tooling: https://github.com/rickosborne/skyline/issues/6
  * Entities: https://github.com/rickosborne/skyline/issues/5
    * Character stats
    * Character maneuvers
    * Equipment stats
    * Destructibles
  * [HZD Machine Stats](https://ricko.is/hzd-machines)

* My intuition is that I'm going to want _some_ amount of a Markdown-based #include preprocessing functionality
  * Front matter & back matter
  * DRY & consistency
  * But how do I want this to work with GitHub and Pages?
    * Materialized include blocks, like the old $Version$ processing?

* More advanced linting than just IJ code scanning

* CI job to build and release PDFs

* Custom Pages/Jekyll theme

* If I ever get art assets, how do I want to manage that?
  * Large asset files
  * SVG preferred, obv
  * External artifact repo permission management (ugh)
