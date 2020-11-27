---
title: Connection
description: A multi-arc adventure for Skyline
tags:
- print-module
---

<!-- +template module story/connection print-module -->


<a href="{{ '/story/connection' | relative_url }}" id="print-module-top-link" data-source-name="story/connection"></a>

{% assign fileNames = "010-front-matter|015-introduction|020-synopsis|025-hooks|030-background|080-before-you-begin|099-adventure|100-chapter-1|101-sigma-log|102-deeper-into-sigma|120-jupi-adri|121-southern-embrace-gate|122-winters-fork|123-tapwash|124-tapwash-night|125-hawks-song|126-delta3|127-delta3a|128-delta3-voice|129-delta3-door|130-delta3b|131-delta3-cauldron|132-delta3-exit|135-south-weave|136-delta4c|137-delta4-entrance|138-delta4-processing|139-delta4-exit|145-hanulis-heel|200-chapter-2|300-chapter-3|799-conclusion|800-narrator-guide|821-delta3a-voice|822-delta3b-voice|823-south-weave|824-delta4-voice|850-adapters|920-next-steps|940-errata|950-author-notes|955-author-bio|960-credits|980-legal" | split: "|" %}
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
		

<!-- -template module story/connection print-module -->
