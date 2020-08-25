---
title: Skyline Adventurer Guide
description: Guidance for Skyline players.
tags:
- cypher-module
- print-module
---

<!-- +template module guide/adventurer print-module -->


<a href="{{ '/guide/adventurer' | relative_url }}" id="print-module-top-link" data-source-name="guide/adventurer"></a>

{% assign fileNames = "010-front-matter|015-introduction|300-skills|303-brave|306-prowler|309-forager|312-archaeologist|315-weaver|900-appendices|940-errata|950-author-notes|955-author-bio|960-credits|980-legal" | split: "|" %}
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
		

<!-- -template module guide/adventurer print-module -->
