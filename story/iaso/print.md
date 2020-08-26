---
title: IASO
description: A beginning adventure for Skyline
tags:
- print-module
---

<!-- +template module story/iaso print-module -->


<a href="{{ '/story/iaso' | relative_url }}" id="print-module-top-link" data-source-name="story/iaso"></a>

{% assign fileNames = "010-front-matter|015-synopsis|020-introduction|022-starting-out|025-hooks|030-background|040-starter-characters|042-fighter|044-rogue|046-ranger|048-engineer|050-monk|060-additional-character-options|099-adventure|100-mothers-crown|101-road-to-mothers-watch|102-olaras-cave|103-cardiac-event|104-clear|105-striders|106-all-mother-mountain|107-lab|108-exit|112-leave-tonight|113-olara-and-brom-night|117-medical-focus|118-focus|120-scrappers-incoming|121-scrappers-treeline|123-iaso-brom-olara|124-back-to-mothers-watch|129-teb|134-synchronize|136-leave-tomorrow|137-leave-morning|141-iaso-brom|146-scrappers-deaf|147-striders-blind|150-the-blinking-light|156-mothers-watch|162-scrappers-surprise|168-power-wall|173-ruins-entrance|186-no-synchronize|191-not-interested|198-corruptor-module|199-what-next|400-npc|405-arund|450-pren|500-maps-tables|505-mothers-cradle|510-mothers-watch-ruins|515-mothers-watch|580-story-graph|590-artifacts|600-adapters|605-5e|606-barbarian|607-rogue|608-ranger|609-artificer|610-monk|620-cypher|621-barbarian|940-errata|950-author-notes|955-author-bio|960-credits|980-legal" | split: "|" %}
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
		

<!-- -template module story/iaso print-module -->
