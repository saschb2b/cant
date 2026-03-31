# Chemistry Lab Simulation

A falling-sand particle simulation with a full ecosystem, atmospheric system, and emergent life.

## Architecture

```
lib/lab/
  types.ts          - Element, behavior, particle, and grid types
  elements.ts       - Element definitions (color, density, behavior, lifetime)
  grid.ts           - Grid creation and cell access (get/set/swap/clear)
  reactions.ts      - Chemical reaction rules (45+ reactions in 11 groups)
  simulation.ts     - Physics engine, growth systems, creature AI
  atmosphere.ts     - Day/night cycle, clouds, celestial bodies, weather
  renderer.ts       - Canvas rendering with visual effects
  simulation.test.ts - Vitest tests for core ecosystem chain
```

## Elements (62 types)

| Category        | Elements                                                                                              | Behavior                     |
| --------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------- |
| Solids          | sand, stone, iron, copper, gold, coal, wood, ice, glass, gunpowder, salt, rust, ash, charcoal, patina | powder/static                |
| Reactive metals | sodium, potassium, magnesium                                                                          | powder                       |
| Liquids         | water, acid, oil, lava, mercury                                                                       | liquid                       |
| Gases           | chlorine, hydrogen, oxygen, smoke, steam, co2, methane                                                | gas                          |
| Energy          | fire, spark                                                                                           | fire                         |
| Organic         | seed, plant, stem, leaf, vine, flower, grass, moss, algae, fruit, mushroom, pollen, soil, compost     | various                      |
| Creatures       | worm, bee                                                                                             | critter                      |
| Engineered      | fuse, tnt, wax, dust                                                                                  | fuse/explosive/static/powder |

## Physics

Particles update bottom-to-top with alternating left/right scan direction per tick. The simulation runs every 2nd frame for calmer visuals while rendering at 60fps.

- **Powder**: falls, rolls off slopes. Denser particles sink through lighter ones.
- **Liquid**: falls, spreads horizontally (60% of ticks for calmer pools).
- **Gas**: rises with drift, moves 70% of ticks.
- **Fire**: rises like gas, spreads to all 8 flammable neighbors (30% chance, 15% per neighbor). Color animates over its 25-frame lifetime from bright yellow to dark red.
- **Reactions**: checked per particle against 4 cardinal neighbors. Each rule has a probability gate.

## Ecosystem

### The Life Cycle

```
sand + fire/wood -> ash -> ash + sand -> SOIL
                                           |
                              water + soil -> SEED (spontaneous)
                                               |
                     PLANT (growth tip rises, leaves stem behind)
                       |              |              |
                    TRUNK          BRANCHES        CANOPY
                  (stem cells)   (fork sideways)  (leaf dome)
                                                     |
                                          FLOWERS -> POLLEN (drifts)
                                             |          |
                                           BEES      lands on soil
                                        (pollinate)     |
                                             |       new SEED
                                           FRUIT
                                          (falls)
                                             |
                                          new SEED
```

### Biomes

Tree shape is determined by position using low-frequency spatial noise. Nearby seeds grow similar trees:

| Biome         | Chance | Trunk Height | Canopy    | Notes                 |
| ------------- | ------ | ------------ | --------- | --------------------- |
| Scrubland     | 20%    | 3-6 cells    | wide, low | Ground-hugging bushes |
| Temperate     | 35%    | 7-12 cells   | moderate  | Standard mixed forest |
| Tall forest   | 30%    | 10-18 cells  | narrow    | Dense vertical growth |
| Ancient grove | 15%    | 16-25 cells  | massive   | Rare mammoth trees    |

### Tree DNA

Each tree's shape is encoded in its particle's RGB values at sprout time:

- **R**: trunk height
- **G**: canopy width, lean direction and probability
- **B**: branching frequency

Trees lean left, right, or stay straight. Branches fork as new growth tips going the opposite direction with shorter trunks and smaller canopies.

### Decay and Renewal

- **Connected vegetation** (attached to stems) lives indefinitely with water
- **Disconnected vegetation** (broken leaves, wilted flowers) decomposes to compost
- **Compost** slowly becomes soil, faster when wet. Worms spawn in compost
- **Fire** burns vegetation to ash. Ash decomposes to soil when wet (0.015/tick)

### Creatures

**Worms** (lifetime: 800 ticks)

- Spawn in wet soil or compost
- Burrow through soil, sand, ash, compost
- Enrich ground: convert sand/ash/compost to soil as they pass
- Die into compost

**Bees** (lifetime: 600 ticks, extendable to 800)

- Spawn near mature flowers
- Fly toward flowers within 6 cells (purposeful AI)
- Pollinate: boost pollen production at visited flowers
- Lifetime extends when feeding on flowers
- Move only 50% of ticks for calmer flight

### Other Growth

- **Vine**: seeds near walls grow vines instead of trees
- **Moss**: water + stone reaction (0.001 probability)
- **Algae**: spreads into adjacent water cells
- **Mushroom**: spawns on wet soil near ash/charcoal decay
- **Grass**: spreads horizontally along soil, needs solid ground below

## Atmosphere

### Day/Night Cycle (2-minute full cycle)

```
0.00 -------- MIDNIGHT -------- 0.15
0.15 -------- DAWN ------------ 0.27  (eased transitions)
0.27 -------- MORNING --------- 0.38
0.38 -------- DAY ------------- 0.62
0.62 -------- DUSK ------------ 0.73
0.73 -------- EVENING --------- 0.85
0.85 -------- NIGHT ----------- 1.00
```

**Effects on simulation:**

- Plants, stems, leaves, grass only grow when daylight > 0.1
- Flowers only release pollen when daylight > 0.3
- Seeds sprout rate scales with daylight
- Fire/lava glow brighter at night
- Exposed water evaporates to steam during the day

### Celestial Bodies

**Sun**: rises left (t=0.22), arcs across sky, sets right (t=0.78). Radius 4px core + 12px glow. Shifts orange/red near horizon.

**Moon**: rises left (t=0.76), crosses through midnight, sets (t=0.24). Radius 3px + 7px glow. Crescent shadow on left side.

### Clouds

Three types generated from absorbed steam:

| Type    | Spawn Rate | Speed  | Height | Shape                             |
| ------- | ---------- | ------ | ------ | --------------------------------- |
| Cumulus | 45%        | medium | varies | Puffy, flat bottom, billowy peaks |
| Cirrus  | 30%        | fast   | high   | Thin wispy streaks                |
| Stratus | 25%        | slow   | mid    | Wide flat layers                  |

**Cloud lifecycle**: water evaporates (sun) -> steam rises -> absorbed in upper grid half -> steam buffer fills -> cloud spawns from edge -> drifts across -> accumulates moisture -> darkens -> rains real water particles -> moisture depletes -> cloud shrinks and fades.

Clouds morph slowly (puffs shift every 60 frames), have multi-octave noise edges, and are top-lit with brightness varying from highlight to shadow.

### Weather

- **Humidity**: builds from water/steam presence, decays slowly
- **Dawn dew**: when humidity > 0.15, water condenses on surfaces (stone, glass, metal, vegetation) during dawn
- **Solar evaporation**: exposed water becomes steam during the day (scales with daylight)
- **Rain**: clouds with moisture > 0.6 drop real water particles

### Night Sky

- **Bright stars** (0.08%): varied colors (white, blue, yellow, orange, red), slow twinkle with unique phase per star
- **Medium stars** (0.3%): gentler twinkle, soft white-blue
- **Star dust** (0.5%): faint, no twinkle, denser in upper sky
- **Milky Way**: diagonal band with dense star clusters and faint purple nebula glow
- **Shooting stars**: rare streaks (~every 40 seconds)

### Ambient Effects

- **Fireflies**: yellow-green pulsing dots near plants
- **Embers**: orange sparks drifting up near fire/lava
- **Haze**: subtle lighter spots in heavy smoke
- **Horizon glow**: warm orange band at dawn/dusk

## Rendering

Uses `ImageData` for direct pixel access. Each grid cell fills a `cellSize x cellSize` block.

**Per-particle effects**: fire glow (boosted at night), lava glow, spark color, flower shimmer, leaf depth variation, algae underwater blend, bee stripe pattern, fruit glow, pollen tint, TNT red.

**Translucent gases**: blended with background at element-specific opacity (steam 12%, smoke 40%, pollen 20%, etc.).

**Empty cell pipeline**: sky gradient -> sun/moon -> clouds -> ambient sparkles (stars/fireflies/embers).

## Testing

```bash
pnpm test     # run vitest
```

9 tests covering the full ecosystem chain:

1. Sand falls to bottom
2. Fire + wood produces ash/charcoal
3. Ash + sand reacts to form soil
4. Wet soil sprouts vegetation
5. Dry soil does not sprout
6. Sand + water does not sprout (no soil)
7. Full scenario: sand -> burn wood -> water -> life emerges
8. Water conservation: vegetation doesn't drain all water
9. Night stops plant growth
