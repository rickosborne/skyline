---
title: Skyline Narrator Guide
description: Guidance for Skyline narrators interested in coordinating games and guiding stories.
tags:
- cypher-module
- print-module
---

<!-- +template module guide/narrator print-module -->


<a href="{{ '/guide/narrator' | relative_url }}" id="print-module-top-link" data-source-name="guide/narrator"></a>

{% assign fileNames = "010-front-matter|015-introduction|230-magic|250-human-combat|260-machine-combat|900-appendices|940-errata|950-author-notes|955-author-bio|960-credits|980-legal" | split: "|" %}
{% for fileName in fileNames %}

<div data-source-file="{{ fileName }}">
    {%- capture content %}{% include_relative {{ fileName | append: ".md" }} %}{% endcapture -%}
    {%- assign lines = content | split: "
" -%}
    {%- assign firstLine = lines | first -%}
    {%- if firstLine == "---" -%}
        {%- assign dashCount = 0 -%}
        {%- assign noFM = "" -%}
        {%- for line in lines -%}
            {%- if dashCount > 1 -%}
                {%- assign noFM = noFM | append: line | append: "
" -%}
            {%- elsif line == "---" -%}
                {%- assign dashCount = dashCount | plus: 1 -%}
            {%- endif -%}
        {%- endfor -%}
{{ noFM | markdownify }}
    {%- else -%}
{{ content | markdownify }}
    {%- endif -%}
</div>

{% endfor %}
		

<!-- -template module guide/narrator print-module -->
