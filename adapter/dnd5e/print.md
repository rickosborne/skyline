---
title: Skyline Adapter for the D&D 5E System
description: Guidance on how to incorporate Skyline into your D&D 5E role-playing games.
tags:
- cypher-module
- print-module
---

<!-- +template module adapter/dnd5e print-module -->


<a href="{{ '/adapter/dnd5e' | relative_url }}" id="print-module-top-link" data-source-name="adapter/dnd5e"></a>

{% assign fileNames = "010-front-matter|015-synopsis|020-introduction|100-basics|200-classes|210-using-5e-classes|250-skyline-classes|253-brave|256-prowler|259-forager|262-archaeologist|600-machines|626-fireclaw|634-lancehorn|655-scrapper|667-stormbird|675-thunderjaw|681-watcher|900-appendices|940-errata|950-author-notes|955-author-bio|960-credits|980-legal" | split: "|" %}
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
		

<!-- -template module adapter/dnd5e print-module -->
