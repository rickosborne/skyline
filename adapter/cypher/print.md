---
title: Skyline Adapter for the Cypher System
description: Guidance on how to incorporate Skyline into your Cypher System role-playing games.
tags:
- cypher-module
- print-module
---

<!-- +template module adapter/cypher print-module -->


<a href="{{ '/adapter/cypher' | relative_url }}" id="print-module-top-link" data-source-name="adapter/cypher"></a>

{% assign fileNames = "005-cover|600-machines|626-fireclaw|634-lancehorn|655-scrapper|667-stormbird|675-thunderjaw|681-watcher|980-legal" | split: "|" %}
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
		

<!-- -template module adapter/cypher print-module -->
