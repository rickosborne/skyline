---
title: Connection
description: A multi-arc adventure for Skyline
tags:
- print-module
---

<!-- +template module story/connection print-module -->


<a href="{{ '/story/connection' | relative_url }}" id="print-module-top-link" data-source-name="story/connection"></a>

{% assign fileNames = "010-front-matter|015-introduction|020-synopsis|025-hooks|030-background|080-before-you-begin|099-adventure|100-chapter-1|101-sigma-log|102-deeper-into-sigma|120-jupi-adri|121-southern-embrace-gate|122-winters-fork|123-tapwash|124-tapwash-night|125-hawks-song|126-delta3|127-delta3a|128-delta3-voice|129-delta3-door|130-delta3b|131-delta3-cauldron|132-delta3-exit|135-south-weave|136-delta4c|137-delta4-entrance|138-delta4-processing|139-delta4-exit|145-hanulis-heel|146-lonely-one|147-hanulis-heel-cauldron|150-sparkling-shores|151-sparkling-dunes|152-theta-cp19-entrance|153-theta-cp19-core|154-unlocked-bioschemata|155-locked-bioschemata|156-unlocked-production|157-locked-reset-restart|158-locked-no-reset|159-unlocked-reset-restart|160-artemis|161-theta-cp19-exit|165-salty-desert|166-pi253-entrance|167-pi253-control|168-pi253-poseidon|169-pi253-exit|200-chapter-2|300-chapter-3|799-conclusion|800-narrator-guide|802-story-graph|821-delta3a-voice|822-delta3b-voice|823-south-weave|824-delta4-voice|840-npc-notes|841-adri|845-jupi|850-adapters|852-free-tail|870-ai-patrons|920-next-steps|940-errata|950-author-notes|955-author-bio|960-credits|980-legal" | split: "|" %}
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
