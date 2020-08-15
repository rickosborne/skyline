# Contributing

The good news:

* Most everything is automated through `npm` scripts and `package.json`.

The bad news:

* It's a little ... byzantine.

## Required Tooling

* [node & npm](https://www.npmjs.com/get-npm)
* [jekyll](https://jekyllrb.com/) to work on the content locally — yes, this will require getting a working Ruby installation
* [plantuml](https://plantuml.com/download) to generate lovely diagrams, such as the one later in this doc
* [dart-sass](https://sass-lang.com/dart-sass) to compile CSS — technically, any sass will do, but you'll have performance problems with the others

## Build Pipeline

For performance and consistency, most of the content for Skyline is actually data driven.
That is, if you're writing HTML by hand you're probably doing it wrong.
Visually, the system looks like this:

{% plantuml %}

!include ../assets/puml/buildpipeline.puml

' Comment iteration: 2

{% endplantuml %}
