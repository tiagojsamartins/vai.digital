import React, { useState, useMemo } from 'react';

// ============================================================================
// CONTEXTUAL DOMAIN OBJECTS
// ============================================================================

export const PLANETARY_LINEUP_OBJECT = {
  unitMultiplierKm: 387942, // Sum of Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune
  earthToMoonApogeeKm: 405696,
  earthToSunAverageKm: 149600000,
  planets: [
    { id: 'mercury', name: 'Mercury', diameterKm: 4879, color: '#94a3b8', note: 'Smallest rocky planet' },
    { id: 'venus', name: 'Venus', diameterKm: 12104, color: '#facc15', note: 'Earth’s twin in size' },
    { id: 'mars', name: 'Mars', diameterKm: 6779, color: '#ef4444', note: 'The Red Planet' },
    { id: 'jupiter', name: 'Jupiter', diameterKm: 139820, color: '#f97316', note: '36% of the entire lineup' },
    { id: 'saturn', name: 'Saturn', diameterKm: 116460, color: '#fde047', note: '30% of the entire lineup' },
    { id: 'uranus', name: 'Uranus', diameterKm: 50724, color: '#38bdf8', note: 'Ice giant' },
    { id: 'neptune', name: 'Neptune', diameterKm: 49244, color: '#3b82f6', note: 'Outermost giant' },
  ],
};

export const COSMIC_MILESTONES = [
  {
    id: 'moon',
    multiplier: 1,
    targetName: 'The Moon',
    subLabel: 'At its farthest point',
    distanceKm: 387942,
    scriptQuote:
      "If you lined up all of the planets in our solar system, you'd make it only from Earth to the Moon!",
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  },
  {
    id: 'venus',
    multiplier: 95,
    targetName: 'Venus',
    subLabel: 'At its closest point',
    distanceKm: 36854490,
    scriptQuote: "If you did it 95 times, you'd make it to Venus!",
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  },
  {
    id: 'mercury',
    multiplier: 192,
    targetName: 'Mercury',
    subLabel: 'At its closest point',
    distanceKm: 74484864,
    scriptQuote:
      "If you did it 192 times, you'd make it all the way to Mercury. So you've got to keep going!",
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  },
  {
    id: 'sun',
    multiplier: 374,
    targetName: 'The Sun',
    subLabel: '149,600,000 km on average',
    distanceKm: 149600000,
    scriptQuote:
      'To reach the Sun, you need to line up all the planets 374 times!',
    badgeColor: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
  },
];

export const PHYSICAL_ANALOGIES = [
  {
    id: 'basketball',
    title: 'Cleo’s Basketball Court Scale',
    sunObject: 'Standard Basketball (24 cm)',
    earthObject: 'Tiny Pinhead (2.2 mm)',
    separationMetric: '28 Meters (1 Full Basketball Court)',
    ratioDescription: '1 : 5.8 Billion Scale',
  },
  {
    id: 'football',
    title: 'Stadium Pitch Scale',
    sunObject: 'Giant Beach Ball (90 cm)',
    earthObject: 'Glass Marble (8.2 mm)',
    separationMetric: '105 Meters (1 FIFA Football Pitch)',
    ratioDescription: '1 : 1.4 Billion Scale',
  },
];

// ============================================================================
// MAIN REACT COMPONENT
// ============================================================================

export default function CosmicScaleExplorer() {
  const [guessInput, setGuessInput] = useState('');
  const [lockedGuess, setLockedGuess] = useState(null);
  const [multiplier, setMultiplier] = useState(1);
  const [selectedAnalogyId, setSelectedAnalogyId] = useState('basketball');
  const [showSunDiveTeaser, setShowSunDiveTeaser] = useState(false);

  const activeMilestone = useMemo(() => {
    let current = COSMIC_MILESTONES[0];
    for (const m of COSMIC_MILESTONES) {
      if (multiplier >= m.multiplier) current = m;
    }
    return current;
  }, [multiplier]);

  const computedDistanceKm = useMemo(() => {
    if (multiplier === 374) return PLANETARY_LINEUP_OBJECT.earthToSunAverageKm;
    return multiplier * PLANETARY_LINEUP_OBJECT.unitMultiplierKm;
  }, [multiplier]);

  const activeAnalogy = useMemo(
    () => PHYSICAL_ANALOGIES.find((a) => a.id === selectedAnalogyId) || PHYSICAL_ANALOGIES[0],
    [selectedAnalogyId]
  );

  const handleLockGuess = (e) => {
    e.preventDefault();
    const parsed = parseInt(guessInput, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setLockedGuess(parsed);
    }
  };

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-lime-400/10 text-lime-400 border border-lime-400/20">
              Solar System Scale Simulator
            </span>
            <h1 className="text-2xl md:text-4xl font-bold mt-2">
              Guess How Far The Sun Really Is
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Interactive model based on planetary diameter stacking & physical court analogies.
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-right font-mono">
            <div className="text-xs text-slate-400">1x Lineup (7 Planets)</div>
            <div className="text-xl font-bold text-lime-400">
              {PLANETARY_LINEUP_OBJECT.unitMultiplierKm.toLocaleString()} km
            </div>
          </div>
        </header>

        {/* Challenge Banner: Remember Your Guess */}
        <section className="bg-slate-900/60 border border-lime-500/30 rounded-2xl p-5">
          {lockedGuess === null ? (
            <form
              onSubmit={handleLockGuess}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div>
                <h2 className="text-base font-bold text-lime-300">
                  "Remember your guess. Don't change it!"
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  If 1x planetary lineup reaches the Moon, how many lineups reach the Sun?
                </p>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <input
                  type="number"
                  min="1"
                  max="2000"
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  placeholder="Your guess (e.g. 150)"
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-mono text-white w-44 focus:outline-none focus:border-lime-400"
                />
                <button
                  type="submit"
                  className="bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-sm px-4 py-2 rounded-xl transition"
                >
                  Lock It In
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xs text-slate-400">Your Locked Guess</div>
                  <div className="text-2xl font-bold font-mono text-lime-400">{lockedGuess}x</div>
                </div>
                <div className="border-l border-slate-800 pl-6">
                  <div className="text-xs text-slate-400">Actual Sun Distance</div>
                  <div className="text-2xl font-bold font-mono text-amber-400">
                    {multiplier === 374 ? '374x' : '??? (Scrub to 374x)'}
                  </div>
                </div>
              </div>
              {multiplier === 374 && (
                <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl font-mono text-sm">
                  Accuracy:{' '}
                  <span className="text-lime-400 font-bold">
                    {Math.abs(374 - lockedGuess) === 0
                      ? 'Exact Match!'
                      : `Off by ${Math.abs(374 - lockedGuess)}x lineups`}
                  </span>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Main Interactive Multiplier Scrubber */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold">Planetary Lineup Multiplier</h2>
              <p className="text-xs text-slate-400">
                Scrub from 1x (Earth → Moon) up to 374x (Earth → Sun)
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {COSMIC_MILESTONES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMultiplier(m.multiplier)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition ${
                    multiplier === m.multiplier
                      ? 'bg-lime-400 text-slate-950 border-lime-400'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  {m.multiplier}x ({m.targetName})
                </button>
              ))}
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400">Lineup Multiplier</div>
              <div className="text-3xl font-bold font-mono text-lime-400 mt-1">{multiplier}x</div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400">Total Distance Bridged</div>
              <div className="text-2xl font-bold font-mono text-sky-400 mt-1">
                {computedDistanceKm.toLocaleString()} km
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400">Active Milestone</div>
              <div className="text-lg font-bold text-amber-400 mt-1">
                {activeMilestone.targetName}{' '}
                <span className="text-xs text-slate-400 block font-normal">
                  {activeMilestone.subLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Range Input */}
          <div>
            <input
              type="range"
              min="1"
              max="374"
              value={multiplier}
              onChange={(e) => setMultiplier(Number(e.target.value))}
              className="w-full h-3 bg-slate-800 rounded-lg cursor-pointer accent-lime-400"
            />
            <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-200 italic">"{activeMilestone.scriptQuote}"</p>
              {multiplier === 374 && (
                <button
                  onClick={() => setShowSunDiveTeaser(!showSunDiveTeaser)}
                  className="shrink-0 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg transition"
                >
                  {showSunDiveTeaser ? 'Hide Sun Dive' : 'What if you dove into the Sun?'}
                </button>
              )}
            </div>
          </div>

          {/* Bonus Sun Dive Teaser */}
          {showSunDiveTeaser && (
            <div className="bg-gradient-to-r from-orange-950/60 to-amber-950/40 border border-amber-500/40 rounded-xl p-4 text-xs text-amber-200 space-y-1">
              <div className="font-bold text-sm text-amber-300">
                🔥 Bonus Teaser: Diving Into The Sun ([00:00:36])
              </div>
              <p>
                With no solid surface, a probe diving into the Sun passes through the 1,000,000°C corona,
                crosses the blinding photosphere at 5,500°C, and faces crushing plasma pressure long before
                reaching the radiative zone!
              </p>
            </div>
          )}
        </section>

        {/* Bottom 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: 1x Lineup Object Breakdown */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold">1x Planetary Lineup Object Inspector</h3>
            <p className="text-xs text-slate-400 mt-1">
              Jupiter and Saturn alone account for 66% of the Earth-to-Moon planetary bridge.
            </p>
            <div className="mt-4 space-y-3">
              {PLANETARY_LINEUP_OBJECT.planets.map((planet) => {
                const share = (
                  (planet.diameterKm / PLANETARY_LINEUP_OBJECT.unitMultiplierKm) *
                  100
                ).toFixed(1);
                return (
                  <div key={planet.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: planet.color }}
                        />
                        {planet.name}
                        <span className="text-slate-500 font-normal">({planet.note})</span>
                      </span>
                      <span className="font-mono text-slate-300">
                        {planet.diameterKm.toLocaleString()} km ({share}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(Number(share), 2)}%`,
                          backgroundColor: planet.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Column 2: Physical Scale Analogy Switcher */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center gap-2">
                <h3 className="text-base font-bold">Physical Scale Analogy Engine</h3>
                <div className="flex gap-1">
                  {PHYSICAL_ANALOGIES.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setSelectedAnalogyId(a.id)}
                      className={`px-2.5 py-1 rounded text-xs font-mono ${
                        selectedAnalogyId === a.id
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {a.id === 'basketball' ? 'Basketball Court' : 'Football Pitch'}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1">{activeAnalogy.ratioDescription}</p>

              <div className="mt-5 space-y-3">
                <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex justify-between items-center">
                  <span className="text-xs text-slate-400">Scaled Sun Size</span>
                  <span className="text-sm font-bold font-mono text-amber-400">
                    {activeAnalogy.sunObject}
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex justify-between items-center">
                  <span className="text-xs text-slate-400">Scaled Earth Size</span>
                  <span className="text-sm font-bold font-mono text-sky-400">
                    {activeAnalogy.earthObject}
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex justify-between items-center">
                  <span className="text-xs text-slate-400">Separation Distance</span>
                  <span className="text-sm font-bold font-mono text-lime-400">
                    {activeAnalogy.separationMetric}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex justify-between font-mono">
              <span>Sun/Earth Ratio: ~109x diameter</span>
              <span>Distance/Sun Ratio: ~107.5x diameter</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
