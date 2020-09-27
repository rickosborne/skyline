---
title: IASO
description: A beginning adventure for Skyline
tags:
- print-module
---

<!-- +template module story/iaso print-module -->


<a href="{{ '/story/iaso' | relative_url }}" id="print-module-top-link" data-source-name="story/iaso"></a>

{% assign fileNames = "010-front-matter|015-synopsis|020-introduction|022-starting-out|025-hooks|030-background|040-starter-characters|042-fighter|044-rogue|046-ranger|048-engineer|050-monk|060-additional-character-options|099-adventure|100-mothers-crown|101-road-to-mothers-watch|102-olaras-cave|103-cardiac-event|104-clear|105-striders|106-all-mother-mountain|107-lab|108-exit|109-dinner|110-carja-refugee-family|111-tradespeople|112-leave-tonight|113-olara-and-brom-night|114-grethe-uln-jineko|115-lodging|116-logging|117-medical-focus|118-focus|119-timber-and-striders|120-scrappers-incoming|121-scrappers-treeline|122-lumber-carts|123-iaso-brom-olara|124-back-to-mothers-watch|125-investigate|129-teb|130-mothers-watch-afternoon|131-jineko-focus|132-second-dinner|133-midnight|134-synchronize|135-ruins-night|136-leave-tomorrow|137-leave-morning|141-iaso-brom|146-scrappers-deaf|147-striders-blind|150-the-blinking-light|156-mothers-watch|162-scrappers-surprise|163-jineko-focus-night-bts|168-power-wall|172-jineko-focus-bts|173-ruins-entrance|178-ostealign|179-nanopatch|180-neural-interface|181-hover-harness|182-wheelchair|183-hoverchair|184-autosuture|185-medbed|186-no-synchronize|187-search-complete|191-not-interested|198-corruptor-module|199-what-next|400-npc|405-arund|450-pren|455-verdant-faruk-and-golden-elin|500-maps-tables|505-mothers-cradle|510-mothers-watch-ruins|515-mothers-watch|520-embrace|580-story-graph|590-artifacts|600-adapters|605-5e|606-barbarian|607-rogue|608-ranger|609-artificer|610-monk|620-cypher|621-barbarian|622-rogue|623-brave|624-explorer|625-speaker|940-errata|950-author-notes|955-author-bio|960-credits|980-legal" | split: "|" %}
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
