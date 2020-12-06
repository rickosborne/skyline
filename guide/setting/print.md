---
title: Skyline Setting Guide
description: Background and story details for Skyline adventures.
tags:
- cypher-module
- print-module
---

<!-- +template module guide/setting print-module -->


<a href="{{ '/guide/setting' | relative_url }}" id="print-module-top-link" data-source-name="guide/setting"></a>

{% assign fileNames = "010-front-matter|015-introduction|020-synopsis|100-history|140-location|150-language|200-ai|203-ai-gender|205-gaia|210-hades|215-hephaestus|220-demeter|225-apollo|230-artemis|235-cyan|240-eleuthia|245-minerva|250-poseidon|255-aether|260-vast-silver|280-creating-your-own|300-people|305-old-ones|310-nora|315-carja|320-shadow-carja|325-oseram|330-banuk|335-tenakth|340-utaru|345-eclipse|380-creating-your-own|400-beliefs|405-all-mother|410-blue-light|415-the-cycle|430-sun-faith|445-world-machine|500-places|550-deeproot|600-machines|605-crucibles|610-behemoth|612-bellowback|614-broadhead|616-charger|618-control-tower|620-corruptor|622-deathbringer|626-fireclaw|628-frostclaw|630-glinthawk|632-grazer|634-lancehorn|636-longleg|640-metal-devil|643-ravager|646-rockbreaker|649-sawtooth|652-scorcher|655-scrapper|658-shell-walker|661-snapmaw|664-stalker|667-stormbird|670-strider|672-tallneck|675-thunderjaw|678-trampler|681-watcher|690-forbidden-west|695-creating-your-own|700-environment|720-plants|740-animals|750-technology|751-focus|900-appendices|940-errata|950-author-notes|955-author-bio|960-credits|980-legal" | split: "|" %}
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
		

<!-- -template module guide/setting print-module -->
