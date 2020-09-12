# Notes: Maps

Random thoughts on mapping, map assets, data integration, etc.

* Not keen on having map generation completely external to the rest of development.
  Dedicated apps, etc.
  Yuck.
* For my use cases, I don't have the artistic talent to make dedicated map development worth it.
* Source control!
  Wouldn't it be nice if we had semantically-meaningful maps?
  Where you could see the diffs, just like everything else?

## Tickets

* [#111: Mapmaker](https://github.com/rickosborne/skyline/issues/111)

## Proposal: Text Adventure Maps

**Overview:** Define maps in text and have something render them to something pretty _and_ functional.

I'm thinking something like old-school text-graphics adventure games.
Think _Dwarf Fortress_ but more keyboard-friendly:

> [Dwarf Fortress Example](https://oyster.ignimgs.com/wordpress/stg.ign.com/2019/03/DwarfFortress_JustinsTale-01.jpeg)

1. Use ASCII art to describe your layout.
   a. Required: outside layouts with terrain
   b. Required: indoor layouts with walls & doors
   c. Required: machines & points of interest
   d. Optional: path waypoints
2. Include a Key which tells the renderer which tiles to use for which symbols.
3. Vectorize it to SVG.

### Considerations

* Different tile types have different shape profiles. Grass wants to be round, while walls want to be rectilinear.
* Different tile types have different layering profiles. Buildings don't affect the shape of the ground, machines don't affect the shape of the grass, etc.
* The Key would probably need some way of setting attributes on certain tile types. This building is rotated by this much, this POI is in this color using this symbol, etc.

### Examples

**Outdoor area:**

    Map
      Title: All-Mother's Embrace
      Theme: Nora Lands
      Scale: 0.25mi per point
    ;;;;;;;;;;;;;;;;;;;;.r.ww........fffff...   Environment:
    ;;;;;;;;;;;;;;;;;;;.r.ww.....::.fffffff..   ; mountain
    .;;;;;;;;;;;;;;;;....r.ww...:::..ffff....   w river
    ...;;;;;;;;;;;;.....r.ww..:::::........rr   . plain
    ....;;;;;;;;222...rrrssrrr.::::.....rrrr.   : tall grass
    .....;;;;..222..rr..ww.ww.rrr...rrrr.3...   f trees
    ...rrr11rr.....r..ww....ww...rrrbbb333fff   r road
    rrr...11..rrrrr.ww........ww.::..bb33ffff   s shallows
    .....;;;...c4r.ww...........ww....bb..fff   b boulders
                                                c campfire
    Points of Interest:
    1. Main Embrace Gate  (tile: wood; rotate: 90)
    2. Strider site  (tile: plain; overlay: machine site; icon: strider)
    3. Grazer site  (tile: plain; overlay: machine site; icon: grazer)
    4. Hunting Goods  (icon: merchant)

In theory, this would then get parsed, rendered, linked, and embedded.
Changes to the content would then be detected, triggering updates down the pipeline.

The`Environment` and `Points of Interest` blocks seem similar but perform different functions.
The Environment area should be used for background setting — stock tiles and areas which _usually_ are not too interesting, but give the reader context.
The Points of Interest area should be used for foreground items with which players will likely interact.

**Indoor area:**

    Map
      Title: Mother's Watch Ruins, Level I
      Theme: Old Ones Indoor Delve
      Scale: 5ft per point
                                                       Environment:
              +------------+                           . office floor
             /:::w.......^..\                          D office door
            |::1.........+...|                         + office wall
    +-------+w...........]...+-----+-----+----------+  - office wall
    |....................]...D.....D.....D.........c|  / office wall
    |....................]...+-----+^^+--+..........|  \ office wall
    +-------+............]...|     |^^|22|..........|  | office wall
            |............+...|     |.....+----------+  ] railing
             \...........^../      +-----+             ^ stairs
              +------------+                           c crate
                                                       : rocks
                                                       w puddle
    Points of Interest:
    1. Entrance  (tile: office floor)
    2. Stairs to Level II  (tile: stairs; link: Mother's Watch Ruins, Level II)

### Metadata

* Map
  * Title — human readable, but also used to link between maps
  * Theme — Tileset
  * Scale
  * Compass?
* POI / Environment / Tile
  * tile
  * link
  * story — links to Story entries
  * icon
  * overlay — draw a bounding area with a given treatment
  * rotate — some tiles might need some manipulation

### Links

* [Potrace](http://potrace.sourceforge.net/) — Raster to SVG converter.
* [Autotrace](http://autotrace.sourceforge.net/) — Raster to SVG converter.

