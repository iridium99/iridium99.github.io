(() => {
  const SEED_URL = 'tournament_structured_data.json';
  const LIVE_EVENTS_KEY = 'ldc-rs-legends-tournament-live-events';
  const SOFT_CAP_RATING = 90;
  const MAX_DISPLAY_RATING = 95;
  const ELITE_CURVE_RATE = 0.12;
  const TEAM_COMPETITIVE_SPREAD = 1.05;
  const PLAYER_COMPETITIVE_SPREAD = 1.8;
  const ACTIVE_TEAM_RATING_FLOOR = 65;
  const TEAM_BASELINE_RATING = 70;
  const TEAM_MATCHES_FOR_FULL_CONFIDENCE = 4;
  const TEAM_CONFIDENCE_FLOOR = 0.8;
  const TEAM_CONFIDENCE_SPAN = 0.4;
  const PLAYER_RELIABILITY_GAMES = 2.5;
  const TOP10_PLAYER_MIN_MATCHES = 3;
  const DEBUG_COUNTRY_TRACE = true;

  const IMPACT_WEIGHTS = {
    total: {
      goals: 1.0,
      assists: 0.7,
      mvps: 2.0,
      cleanSheets: 1.0
    },
    knockout: {
      goals: 1.5,
      assists: 1.0,
      mvps: 2.5,
      cleanSheets: 1.5
    }
  };

  const TEAM_STRENGTHS = {
    'England / UK': 0.200,
    'Poland + Balkans': 0.205,
    Germany: 0.167,
    Netherlands: 0.170,
    Spain: 0.125,
    Italy: 0.110,
    Egypt: 0.115,
    'World XI': 0.048,
    'Tunisia + Algeria': 0.042,
    France: 0.038
  };

  const TEAM_NAME_ALIASES = {
    england: 'England / UK',
    englanduk: 'England / UK',
    poland: 'Poland + Balkans',
    polandbalkans: 'Poland + Balkans',
    tunisiaandalgeria: 'Tunisia + Algeria'
  };

  // Source-of-truth override for current tournament state, kept in sync with index data.
  const STATS_OVERRIDE = {
    worldCupGroups: {
      groupA: [
        { team: 'Netherlands', MP: 4, W: 4, D: 0, L: 0, GF: 14, GA: 0, GD: 14, Pts: 12 },
        { team: 'Spain', MP: 4, W: 2, D: 0, L: 2, GF: 3, GA: 3, GD: 0, Pts: 6 },
        { team: 'Italy', MP: 4, W: 1, D: 2, L: 1, GF: 2, GA: 5, GD: -3, Pts: 5 },
        { team: 'Germany', MP: 4, W: 1, D: 1, L: 2, GF: 5, GA: 2, GD: 3, Pts: 4 },
        { team: 'World XI', MP: 4, W: 0, D: 1, L: 3, GF: 1, GA: 15, GD: -14, Pts: 1 }
      ],
      groupB: [
        { team: 'Poland + Balkans', MP: 4, W: 3, D: 1, L: 0, GF: 13, GA: 2, GD: 11, Pts: 10 },
        { team: 'England / UK', MP: 4, W: 2, D: 2, L: 0, GF: 11, GA: 2, GD: 9, Pts: 8 },
        { team: 'Egypt', MP: 4, W: 2, D: 0, L: 2, GF: 8, GA: 10, GD: -2, Pts: 6 },
        { team: 'France', MP: 4, W: 0, D: 2, L: 2, GF: 3, GA: 9, GD: -6, Pts: 2 },
        { team: 'Tunisia + Algeria', MP: 4, W: 0, D: 1, L: 3, GF: 1, GA: 13, GD: -12, Pts: 1 }
      ]
    },
    teamStats: [
      { team: 'Spain', halves: 7, passes: 295, possession: 344.9, shots: 18 },
      { team: 'Germany', halves: 7, passes: 356, possession: 350.6, shots: 31 },
      { team: 'Egypt', halves: 8, passes: 332, possession: 414.4, shots: 14 },
      { team: 'Tunisia and Algeria', halves: 6, passes: 212, possession: 279.6, shots: 17 },
      { team: 'Netherlands', halves: 8, passes: 528, possession: 423.5, shots: 56 },
      { team: 'Italy', halves: 8, passes: 400, possession: 409.5, shots: 24 },
      { team: 'World XI', halves: 8, passes: 280, possession: 371.4, shots: 15 },
      { team: 'France', halves: 8, passes: 320, possession: 378.0, shots: 20 },
      { team: 'England / UK', halves: 8, passes: 525, possession: 408.0, shots: 34 },
      { team: 'Poland + Balkans', halves: 6, passes: 343, possession: 320.0, shots: 34 }
    ],
    playerStats: {
      cleanSheets: [
        { player: 'Mbappe', value: 5 },
        { player: 'ShIeLd', value: 5 },
        { player: 'Nympex', value: 5 },
        { player: 'atrocity exhibition', value: 4 },
        { player: 'luur', value: 6 },
        { player: 'Zenon', value: 4 },
        { player: 'Naeh', value: 6 },
        { player: 'ShadiOzz', value: 3 },
        { player: 'Timber', value: 3 },
        { player: 'Praetor', value: 2 },
        { player: 'evilpedri', value: 2 },
        { player: 'Wizop', value: 2 },
        { player: 'Misimaro', value: 1 },
        { player: 'kakii', value: 1 },
        { player: 'MRN', value: 1 },
        { player: 'Refix', value: 1 }
      ],
      mvps: [
        { player: 'A7mdBibo', value: 2 },
        { player: 'Pedri', value: 1 },
        { player: 'BananaJoe', value: 1 },
        { player: 'cYn', value: 1 },
        { player: 'Toshiba', value: 1 },
        { player: 'FullMetal', value: 1 },
        { player: 'zenix', value: 1 },
        { player: 'yonko', value: 2 },
        { player: 'Wakanda', value: 1 },
        { player: 'Perkz', value: 1 },
        { player: 'Razor', value: 1 },
        { player: 'Shinsuke Nakamura', value: 2 },
        { player: 'cytro', value: 1 },
        { player: 'Johnny Sins', value: 1 },
        { player: 'Refix', value: 1 },
        { player: 'Isagi Yoichi', value: 1 },
        { player: 'Triple G', value: 1 },
        { player: 'drkuu', value: 1 }
      ],
      goals: [
        { player: 'zenix', value: 6 },
        { player: 'yonko', value: 5 },
        { player: 'Luisdiaz', value: 3 },
        { player: 'Wakanda', value: 3 },
        { player: 'Refix', value: 3 },
        { player: 'A7mdBibo', value: 3 },
        { player: 'Kong', value: 2 },
        { player: 'Gnagna', value: 2 },
        { player: 'Shinsuke Nakamura', value: 3 },
        { player: 'tsukuyomi', value: 3 },
        { player: 'Isagi Yoichi', value: 2 },
        { player: 'SUCA', value: 1 },
        { player: 'Tiki', value: 1 },
        { player: 'BananaJoe', value: 1 },
        { player: 'Toshiba', value: 1 },
        { player: 'zaQu', value: 1 },
        { player: 'ToughBaby', value: 1 },
        { player: 'cytro', value: 1 },
        { player: 'zalofa', value: 1 },
        { player: 'atrocity exhibition', value: 1 },
        { player: 'luur', value: 1 },
        { player: 'DOOM', value: 1 },
        { player: 'Razor', value: 1 },
        { player: 'Macallan 18', value: 1 },
        { player: 'Arshavin', value: 1 },
        { player: 'Johnny Sins', value: 1 },
        { player: 'Pitarch', value: 1 },
        { player: 'drkuu', value: 1 },
        { player: 'Perkz', value: 1 },
        { player: 'poppa', value: 1 },
        { player: 'blue', value: 1 }
      ],
      assists: [
        { player: 'Wakanda', value: 4 },
        { player: 'poppa', value: 4 },
        { player: 'MRN', value: 2 },
        { player: 'tsukuyomi', value: 2 },
        { player: 'Kong', value: 2 },
        { player: 'cytro', value: 2 },
        { player: 'Shinsuke Nakamura', value: 3 },
        { player: 'A7mdBibo', value: 1 },
        { player: 'aaron', value: 1 },
        { player: 'Lookman', value: 1 },
        { player: 'Virgil Van Dijk', value: 1 },
        { player: 'zenix', value: 1 },
        { player: 'grmii', value: 1 },
        { player: 'zaQu', value: 1 },
        { player: 'ShadiOzz', value: 1 },
        { player: 'santos', value: 1 },
        { player: 'Luisdiaz', value: 1 },
        { player: 'DOOM', value: 1 },
        { player: 'Razor', value: 1 },
        { player: 'Spero', value: 1 },
        { player: 'Toshiba', value: 1 },
        { player: 'Macallan 18', value: 1 },
        { player: 'ToughBaby', value: 1 },
        { player: 'Vonmacron', value: 1 },
        { player: 'SVimes', value: 1 },
        { player: 'Blazing', value: 1 },
        { player: 'Slimani', value: 1 },
        { player: 'Johnny Sins', value: 1 },
        { player: 'Perkz', value: 1 },
        { player: 'Passi', value: 1 },
        { player: 'Isagi Yoichi', value: 1 },
        { player: 'yonko', value: 1 },
        { player: 'Triple G', value: 1 }
      ],
      ownGoals: [
        { player: 'Saygex', value: 1 },
        { player: 'SergioRamoss', value: 1 },
        { player: 'ToughBaby', value: 1 },
        { player: 'Vonmacron', value: 1 }
      ]
    }
  };

  const WEIGHTS = {
    team: {
      base: 50,
      actual: 16,
      goalDifference: 4,
      shotDifference: 3,
      possessionDifference: 2,
      passDifference: 2,
      upset: 14
    },
    player: {
      goals: 6,
      assists: 4,
      shots: 1.5,
      passes: 0.15,
      kicks: 0.05,
      cleanSheets: 4,
      ownGoals: 8,
      goalkeeperCleanSheetBonus: 2,
      mvpBase: 5,
      mvpTeamScoreFactor: 0.2
    },
    tournament: {
      base: 72,
      pointsPerGame: 6,
      goalDifferencePerGame: 3,
      outcomeVsExpectationPerGame: 8,
      averageTeamScoreDelta: 1.2,
      shotsPerHalfDelta: 1.0,
      possessionPerHalfDelta: 0.7,
      passesPerHalfDelta: 0.5
    }
  };

  const MANUAL_PLAYER_IMPACT = [
    { country: 'Netherlands', totalScore: 34.3, playerCount: 7 },
    { country: 'England / UK', totalScore: 27.3, playerCount: 9 },
    { country: 'Poland + Balkans', totalScore: 22.5, playerCount: 7 },
    { country: 'Egypt', totalScore: 20.6, playerCount: 7 },
    { country: 'Italy', totalScore: 17.1, playerCount: 6 },
    { country: 'Germany', totalScore: 16.4, playerCount: 6 },
    { country: 'Spain', totalScore: 12.4, playerCount: 5 },
    { country: 'France', totalScore: 9.1, playerCount: 4 },
    { country: 'World XI', totalScore: 3.0, playerCount: 2 },
    { country: 'Tunisia + Algeria', totalScore: 2.7, playerCount: 3 }
  ];

  const state = {
    seed: null,
    roster: new Map(),
    aliases: new Map(),
    goalkeepers: new Set(),
    results: null
  };

  let topTeamsViewMode = 'teams';

  function normalizeName(value) {
    return (value || '')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '');
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function round1(value) {
    return Math.round(value * 10) / 10;
  }

  function toNumber(value, fallback = 0) {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  }

  function scrubPlayerName(playerName) {
    return String(playerName || '')
      .replace(/NEW/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function toRating1(value, min = 0, max = MAX_DISPLAY_RATING) {
    return round1(clamp(value, min, max));
  }

  function applySoftCapCurve(rawRating) {
    if (rawRating <= SOFT_CAP_RATING) {
      return rawRating;
    }
    const eliteDelta = rawRating - SOFT_CAP_RATING;
    const eliteRange = MAX_DISPLAY_RATING - SOFT_CAP_RATING;
    const curvedGain = eliteRange * (1 - Math.exp(-eliteDelta * ELITE_CURVE_RATE));
    return SOFT_CAP_RATING + curvedGain;
  }

  function compressTowardMean(value, mean, factor) {
    return mean + ((value - mean) * factor);
  }

  function getConfidenceFromMatches(matchesPlayed) {
    const safeMatches = Math.max(0, toNumber(matchesPlayed));
    return TEAM_CONFIDENCE_FLOOR + (TEAM_CONFIDENCE_SPAN * clamp(safeMatches / TEAM_MATCHES_FOR_FULL_CONFIDENCE, 0, 1));
  }

  function getMissingDataFallbackTeamRating(teamName) {
    const strengths = Object.values(TEAM_STRENGTHS).filter(Number.isFinite);
    const minStrength = strengths.length ? Math.min(...strengths) : 0;
    const maxStrength = strengths.length ? Math.max(...strengths) : 1;
    const teamStrength = toNumber(TEAM_STRENGTHS[teamName], (minStrength + maxStrength) / 2);
    const normalizedStrength = maxStrength > minStrength
      ? (teamStrength - minStrength) / (maxStrength - minStrength)
      : 0.5;

    // Fallback is only used when a team has no match data at all.
    // Spread by team strength so missing teams do not collapse to one value.
    return toRating1(TEAM_BASELINE_RATING + ((normalizedStrength - 0.5) * 6));
  }

  function weightedAverage(items) {
    const totals = items.reduce((accumulator, item) => {
      accumulator.weight += item.weight;
      accumulator.value += item.value * item.weight;
      return accumulator;
    }, { weight: 0, value: 0 });

    return totals.weight > 0 ? (totals.value / totals.weight) : 0;
  }

  function toLeaderboard(rows, key) {
    return (rows || []).map(row => ({
      player: row.player,
      [key]: toNumber(row.value)
    }));
  }

  function buildCurrentStateOverride(baseCurrentState) {
    return {
      ...(baseCurrentState || {}),
      groupTables: {
        'Group A': (STATS_OVERRIDE.worldCupGroups.groupA || []).map(row => ({ ...row })),
        'Group B': (STATS_OVERRIDE.worldCupGroups.groupB || []).map(row => ({ ...row }))
      },
      teamRawStats: (STATS_OVERRIDE.teamStats || []).map(team => ({
        team: team.team,
        halvesRecorded: toNumber(team.halves),
        passes: toNumber(team.passes),
        possessionPercent: toNumber(team.possession),
        shotsOnGoal: toNumber(team.shots)
      })),
      goalsLeaderboard: toLeaderboard(STATS_OVERRIDE.playerStats.goals, 'goals'),
      assistsLeaderboard: toLeaderboard(STATS_OVERRIDE.playerStats.assists, 'assists'),
      mvpLeaderboard: toLeaderboard(STATS_OVERRIDE.playerStats.mvps, 'mvps'),
      cleanSheetsLeaderboard: toLeaderboard(STATS_OVERRIDE.playerStats.cleanSheets, 'cleanSheets'),
      ownGoalsLeaderboard: toLeaderboard(STATS_OVERRIDE.playerStats.ownGoals, 'ownGoals')
    };
  }

  function buildAliasMap() {
    const map = new Map();
    const aliases = {
      luisdiaz: 'LuisDiaz',
      iiMbappeii: 'Mbappe',
      mbappe: 'Mbappe',
      slimani: 'Slimani',
      limani: 'Slimani',
      neuer: 'Mbappe',
      drku: 'Drkuu',
      drkuu: 'Drkuu',
      sergioramoss: 'Sergio Ramos',
      sergioramos: 'Sergio Ramos',
      v4ks: 'V4ks',
      vaks: 'V4ks',
      wpi: 'Wakanda',
      W: 'Wakanda',
      wakanda: 'Wakanda',
      zenix: 'Zenix',
      zenix: 'Zenix',
      zenon: 'Zenon',
      znon: 'Zenon',
      johnnysins: 'Johnny Sins',
      jhonnysins: 'Johnny Sins',
      valotti: 'Valotii',
      valotii: 'Valotii',
      vannystelroy: 'Van Nistelrooy',
      vannistelrooy: 'Van Nistelrooy',
      vanNistelrooy: 'Van Nistelrooy',
      tikiahmadfutuh: 'Tiki',
      safff: 'SAFF',
      praetor: 'Praetor',
      'praetor.': 'Praetor',
      vonmacron: 'Vonmacron',
      bern: 'Berniee',
      col268: 'Col',
      maksredondo: 'MaksLuburic',
      jesus: 'Jesus',
      shush: 'Shush',
      nxen: 'Nxen',
      arshahaxballradarcom: 'Arshavin',
      kiyoharusaeyama: 'Wakanda',
      mohamedsalah: 'ZaQu',
      burakt09: 'Burak',
      perkzbutdiffpcandlag: 'Perkz',
      alexanderisak: 'Razor',
      alexisak: 'Razor',
      pitarchpitbull: 'Pitarch',
      virgilvandijk: 'VVD',
      yeet: 'YEET',
      ryzen: 'Ryzen'
    };

    Object.keys(aliases).forEach(raw => map.set(normalizeName(raw), aliases[raw]));
    return map;
  }

  function buildRoster() {
    const roster = new Map();
    const teams = Array.isArray(window.teams) ? window.teams : [];
    teams.forEach(team => {
      (team.players || []).forEach(playerName => {
        const cleanName = scrubPlayerName(playerName);
        roster.set(normalizeName(cleanName), {
          canonical: cleanName,
          team: team.name
        });
      });
    });
    return roster;
  }

  function canonicalizePlayerName(rawName) {
    const cleanRawName = scrubPlayerName(rawName);
    const normalized = normalizeName(cleanRawName);
    if (!normalized) return 'Unknown';

    if (state.aliases.has(normalized)) {
      return scrubPlayerName(state.aliases.get(normalized));
    }

    if (state.roster.has(normalized)) {
      return scrubPlayerName(state.roster.get(normalized).canonical);
    }

    return cleanRawName || 'Unknown';
  }

  function getTeamFlag(teamName) {
    const teams = Array.isArray(window.teams) ? window.teams : [];
    const match = teams.find(team => team.name === teamName);
    return (match && match.flag) ? match.flag : '';
  }

  function getPlayerFlag(playerName) {
    const normalized = normalizeName(scrubPlayerName(playerName));
    const rosterEntry = state.roster.get(normalized);
    if (!rosterEntry) return '';
    return getTeamFlag(rosterEntry.team);
  }

  function canonicalizeTeamName(rawTeamName) {
    const cleanTeamName = String(rawTeamName || '').trim();
    if (!cleanTeamName) return '';
    const normalized = normalizeName(cleanTeamName);
    return TEAM_NAME_ALIASES[normalized] || cleanTeamName;
  }

  function buildPlayerCountryLookup() {
    const sourcePlayers = Array.isArray(window.allPlayers)
      ? window.allPlayers
      : (typeof allPlayers !== 'undefined' && Array.isArray(allPlayers) ? allPlayers : []);

    const lookup = new Map();
    sourcePlayers.forEach(player => {
      const displayName = scrubPlayerName(player.display_name || player.name || '');
      const canonicalName = canonicalizePlayerName(displayName);
      const normalized = normalizeName(canonicalName);
      if (!normalized) return;

      const country = String(player.country || player.nation || 'Unknown').trim() || 'Unknown';
      lookup.set(normalized, country);
    });

    return lookup;
  }

  function buildLeaderboardStatMap(rows, key) {
    const map = new Map();
    (rows || []).forEach(row => {
      const canonical = canonicalizePlayerName(row.player || 'Unknown');
      const normalized = normalizeName(canonical);
      if (!normalized) return;
      map.set(normalized, (map.get(normalized) || 0) + toNumber(row[key]));
    });
    return map;
  }

  function computeCountryContributions(sortedPlayerRows) {
    const countriesTop10 = MANUAL_PLAYER_IMPACT.map(item => ({
      country: item.country,
      totalScore: round1(item.totalScore),
      playerCount: item.playerCount
    }));

    const countryStats = Object.fromEntries(
      MANUAL_PLAYER_IMPACT.map(item => [item.country, {
        totalScore: round1(item.totalScore),
        playerCount: item.playerCount
      }])
    );

    return {
      countryStats,
      countriesTop10
    };
  }

  function cycleTopTeamsViewMode() {
    topTeamsViewMode = topTeamsViewMode === 'teams' ? 'countries' : 'teams';
  }

  function renderTeamsTop10Rows(teams) {
    return (teams || []).map(team => {
      const displayTeamName = canonicalizeTeamName(team.team);
      return `<tr><td>${displayTeamName}</td><td>${round1(team.teamRating).toFixed(1)}</td></tr>`;
    }).join('');
  }

  function renderCountriesTop10Rows(countries) {
    return (countries || []).map(country => `
      <tr>
        <td>${country.country || 'Unknown'}</td>
        <td>${round1(country.totalScore).toFixed(1)}</td>
        <td>${country.playerCount}</td>
      </tr>
    `).join('');
  }

  function matchKey(match) {
    return `${toNumber(match.matchNumber)}-${toNumber(match.halfNumber)}`;
  }

  function ensureImpactRecord(map, canonical, team) {
    if (!map.has(canonical)) {
      map.set(canonical, {
        player: canonical,
        team: team || '',
        goals_group: 0,
        assists_group: 0,
        mvp_group: 0,
        cs_group: 0,
        goals_ko: 0,
        assists_ko: 0,
        mvp_ko: 0,
        cs_ko: 0
      });
    }

    const record = map.get(canonical);
    if (!record.team && team) {
      record.team = team;
    }
    return record;
  }

  function computeGroupStageMatchCount(groupTables) {
    const groups = Object.values(groupTables || {});
    if (!groups.length) return 0;

    return groups.reduce((sum, rows) => {
      const teamsCount = Array.isArray(rows) ? rows.length : 0;
      if (teamsCount < 2) return sum;
      return sum + ((teamsCount * (teamsCount - 1)) / 2);
    }, 0);
  }

  function normalizeStageLabel(stageValue) {
    const stage = normalizeName(stageValue);
    if (!stage) return '';
    if (stage.includes('group')) return 'group';
    if (stage.includes('knockout') || stage.includes('ko') || stage.includes('quarter') || stage.includes('semi') || stage.includes('final')) {
      return 'ko';
    }
    return '';
  }

  function getMatchStage(match, groupStageMatchCount) {
    const explicitStage = normalizeStageLabel(match?.stage);
    if (explicitStage) {
      return explicitStage;
    }

    if (typeof match?.isKnockout === 'boolean') {
      return match.isKnockout ? 'ko' : 'group';
    }

    if (groupStageMatchCount > 0) {
      return toNumber(match?.matchNumber) <= groupStageMatchCount ? 'group' : 'ko';
    }

    return 'group';
  }

  function extractMvpNames(match) {
    const names = [];
    const visit = (value) => {
      if (value == null) return;

      if (typeof value === 'string') {
        const clean = scrubPlayerName(value);
        if (clean) names.push(clean);
        return;
      }

      if (Array.isArray(value)) {
        value.forEach(visit);
        return;
      }

      if (typeof value === 'object') {
        if (typeof value.player === 'string') visit(value.player);
        if (typeof value.name === 'string') visit(value.name);
        if (value.mvp) visit(value.mvp);
        if (value.mvps) visit(value.mvps);
        return;
      }
    };

    visit(match?.mvp);
    visit(match?.mvps);
    visit(match?.mvpA);
    visit(match?.mvpB);
    visit(match?.mvpTeamA);
    visit(match?.mvpTeamB);
    visit(match?.mvpPlayer);
    visit(match?.mvpPlayers);

    return Array.from(new Set(names.map(name => canonicalizePlayerName(name))));
  }

  function computeImpactScore(record, mode) {
    const groupScore =
      (record.goals_group * IMPACT_WEIGHTS.total.goals) +
      (record.assists_group * IMPACT_WEIGHTS.total.assists) +
      (record.mvp_group * IMPACT_WEIGHTS.total.mvps) +
      (record.cs_group * IMPACT_WEIGHTS.total.cleanSheets);

    const koScore =
      (record.goals_ko * IMPACT_WEIGHTS.knockout.goals) +
      (record.assists_ko * IMPACT_WEIGHTS.knockout.assists) +
      (record.mvp_ko * IMPACT_WEIGHTS.knockout.mvps) +
      (record.cs_ko * IMPACT_WEIGHTS.knockout.cleanSheets);

    if (mode === 'ko') return koScore;
    if (mode === 'clutch') return groupScore + koScore;

    return (
      ((record.goals_group + record.goals_ko) * IMPACT_WEIGHTS.total.goals) +
      ((record.assists_group + record.assists_ko) * IMPACT_WEIGHTS.total.assists) +
      ((record.mvp_group + record.mvp_ko) * IMPACT_WEIGHTS.total.mvps) +
      ((record.cs_group + record.cs_ko) * IMPACT_WEIGHTS.total.cleanSheets)
    );
  }

  function loadLiveEvents() {
    try {
      const raw = localStorage.getItem(LIVE_EVENTS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function actualResult(scoreA, scoreB) {
    if (scoreA > scoreB) return 1;
    if (scoreA === scoreB) return 0.5;
    return 0;
  }

  function teamScore(match, side) {
    const scoreA = toNumber(match.scoreA);
    const scoreB = toNumber(match.scoreB);
    const stats = match.stats || {};

    const actualA = actualResult(scoreA, scoreB);
    const actual = side === 'A' ? actualA : (1 - actualA);

    const goalDifference = side === 'A' ? (scoreA - scoreB) : (scoreB - scoreA);
    const shotDifference = side === 'A'
      ? (toNumber(stats.shotsA) - toNumber(stats.shotsB))
      : (toNumber(stats.shotsB) - toNumber(stats.shotsA));
    const possessionDifference = side === 'A'
      ? (toNumber(stats.possessionA) - toNumber(stats.possessionB))
      : (toNumber(stats.possessionB) - toNumber(stats.possessionA));
    const passDifference = side === 'A'
      ? (toNumber(stats.passesA) - toNumber(stats.passesB))
      : (toNumber(stats.passesB) - toNumber(stats.passesA));

    const teamName = canonicalizeTeamName(side === 'A' ? match.teamA : match.teamB);
    const opponent = canonicalizeTeamName(side === 'A' ? match.teamB : match.teamA);
    const strength = TEAM_STRENGTHS[teamName] ?? 0;
    const opponentStrength = TEAM_STRENGTHS[opponent] ?? 0;
    const expected = strength + opponentStrength > 0 ? strength / (strength + opponentStrength) : 0.5;
    const upset = actual - expected;

    return WEIGHTS.team.base
      + (WEIGHTS.team.actual * actual)
      + (WEIGHTS.team.goalDifference * clamp(goalDifference, -3, 3))
      + (WEIGHTS.team.shotDifference * clamp(shotDifference / 3, -3, 3))
      + (WEIGHTS.team.possessionDifference * clamp(possessionDifference / 10, -3, 3))
      + (WEIGHTS.team.passDifference * clamp(passDifference / 20, -3, 3))
      + (WEIGHTS.team.upset * upset);
  }

  function ensureTeamRecord(map, name) {
    if (!map.has(name)) {
      map.set(name, {
        team: name,
        halvesRecorded: 0,
        passes: 0,
        possession: 0,
        shots: 0,
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        expectedPoints: 0,
        opponentStrengthTotal: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        teamScores: []
      });
    }
    return map.get(name);
  }

  function ensurePlayerRecord(map, canonical, team) {
    if (!map.has(canonical)) {
      map.set(canonical, {
        canonical,
        team,
        matchesPlayed: 0,
        matchRatings: []
      });
    }
    const record = map.get(canonical);
    if (!record.team && team) record.team = team;
    return record;
  }

  function applyKnownCorrection(event) {
    if (toNumber(event.matchNumber) === 6 && toNumber(event.halfNumber) === 2) {
      const goals = Array.isArray(event.goals) ? event.goals : [];
      goals.forEach(goal => {
        if (normalizeName(goal.scorer) === 'zenon' && goal.ownGoal) {
          goal.scorer = 'Luisdiaz';
          goal.assist = 'Wakanda';
          goal.ownGoal = false;
        }
      });
    }
  }

  function computeAll() {
    const seedMatches = Array.isArray(state.seed?.matches) ? state.seed.matches : [];
    const liveMatches = loadLiveEvents();
    const byKey = new Map();

    seedMatches.forEach(match => byKey.set(matchKey(match), JSON.parse(JSON.stringify(match))));
    liveMatches.forEach(match => byKey.set(matchKey(match), JSON.parse(JSON.stringify(match))));

    const matches = Array.from(byKey.values()).sort((a, b) => {
      const diffMatch = toNumber(a.matchNumber) - toNumber(b.matchNumber);
      return diffMatch !== 0 ? diffMatch : (toNumber(a.halfNumber) - toNumber(b.halfNumber));
    });

    const teamMap = new Map();
    Object.keys(TEAM_STRENGTHS).forEach(teamName => ensureTeamRecord(teamMap, teamName));

    const playerMap = new Map();
    const impactMap = new Map();
    const mvpMap = new Map();
    (state.seed?.currentState?.mvpLeaderboard || []).forEach(item => {
      mvpMap.set(normalizeName(item.player), toNumber(item.mvps));
    });

    const groupStageMatchCount = computeGroupStageMatchCount(state.seed?.currentState?.groupTables || {});
    const stageMvpMap = {
      group: new Map(),
      ko: new Map()
    };

    // Preferred source for stage MVP split: explicit stage MVP leaderboards when available.
    (state.seed?.currentState?.mvpLeaderboardGroup || []).forEach(item => {
      const canonical = canonicalizePlayerName(item.player || 'Unknown');
      stageMvpMap.group.set(canonical, (stageMvpMap.group.get(canonical) || 0) + toNumber(item.mvps));
    });
    (state.seed?.currentState?.mvpLeaderboardKnockout || []).forEach(item => {
      const canonical = canonicalizePlayerName(item.player || 'Unknown');
      stageMvpMap.ko.set(canonical, (stageMvpMap.ko.get(canonical) || 0) + toNumber(item.mvps));
    });

    matches.forEach(match => {
      applyKnownCorrection(match);

      const stage = getMatchStage(match, groupStageMatchCount);
      const stageSuffix = stage === 'ko' ? 'ko' : 'group';

      const teamA = canonicalizeTeamName(match.teamA);
      const teamB = canonicalizeTeamName(match.teamB);
      const scoreA = toNumber(match.scoreA);
      const scoreB = toNumber(match.scoreB);
      const scoreTeamA = teamScore(match, 'A');
      const scoreTeamB = teamScore(match, 'B');
      const strengthA = TEAM_STRENGTHS[teamA] ?? 0;
      const strengthB = TEAM_STRENGTHS[teamB] ?? 0;
      const expectedA = strengthA + strengthB > 0 ? strengthA / (strengthA + strengthB) : 0.5;
      const expectedB = 1 - expectedA;

      const teamARecord = ensureTeamRecord(teamMap, teamA);
      const teamBRecord = ensureTeamRecord(teamMap, teamB);

      teamARecord.teamScores.push(scoreTeamA);
      teamBRecord.teamScores.push(scoreTeamB);
      teamARecord.opponentStrengthTotal += strengthB;
      teamBRecord.opponentStrengthTotal += strengthA;

      teamARecord.matchesPlayed += 1;
      teamBRecord.matchesPlayed += 1;
      teamARecord.expectedPoints += (3 * expectedA);
      teamBRecord.expectedPoints += (3 * expectedB);

      if (scoreA > scoreB) {
        teamARecord.wins += 1;
        teamBRecord.losses += 1;
        teamARecord.points += 3;
      } else if (scoreA < scoreB) {
        teamBRecord.wins += 1;
        teamARecord.losses += 1;
        teamBRecord.points += 3;
      } else {
        teamARecord.draws += 1;
        teamBRecord.draws += 1;
        teamARecord.points += 1;
        teamBRecord.points += 1;
      }

      teamARecord.goalsFor += scoreA;
      teamARecord.goalsAgainst += scoreB;
      teamBRecord.goalsFor += scoreB;
      teamBRecord.goalsAgainst += scoreA;

      const stats = match.stats || {};
      teamARecord.halvesRecorded += 1;
      teamBRecord.halvesRecorded += 1;
      teamARecord.passes += toNumber(stats.passesA);
      teamBRecord.passes += toNumber(stats.passesB);
      teamARecord.possession += toNumber(stats.possessionA);
      teamBRecord.possession += toNumber(stats.possessionB);
      teamARecord.shots += toNumber(stats.shotsA);
      teamBRecord.shots += toNumber(stats.shotsB);

      const goalByPlayer = new Map();
      const assistByPlayer = new Map();
      const ownGoalByPlayer = new Map();
      (match.goals || []).forEach(goal => {
        const scorer = canonicalizePlayerName(goal.scorer || '');
        if (goal.ownGoal) {
          ownGoalByPlayer.set(scorer, (ownGoalByPlayer.get(scorer) || 0) + 1);
        } else {
          goalByPlayer.set(scorer, (goalByPlayer.get(scorer) || 0) + 1);
          if (goal.assist) {
            const assist = canonicalizePlayerName(goal.assist);
            assistByPlayer.set(assist, (assistByPlayer.get(assist) || 0) + 1);
          }
        }
      });

      const seen = new Set();
      (match.players || []).forEach(playerEntry => {
        const canonical = canonicalizePlayerName(playerEntry.name || 'Unknown');
        const playerTeam = canonicalizeTeamName(playerEntry.team || null);
        const player = ensurePlayerRecord(playerMap, canonical, playerTeam);
        const impact = ensureImpactRecord(impactMap, canonical, playerTeam);
        const norm = normalizeName(canonical);
        if (seen.has(`${norm}-${playerTeam}`)) {
          return;
        }
        seen.add(`${norm}-${playerTeam}`);

        // Avoid double-counting when both player rows and goal events include the same actions.
        const goals = Math.max(toNumber(playerEntry.goals), (goalByPlayer.get(canonical) || 0));
        const assists = Math.max(toNumber(playerEntry.assists), (assistByPlayer.get(canonical) || 0));
        const shots = toNumber(playerEntry.shots);
        const ownGoals = Math.max(toNumber(playerEntry.ownGoals), (ownGoalByPlayer.get(canonical) || 0));
        const cleanSheet = (normalizeName(playerTeam) === normalizeName(teamA) && scoreB === 0)
          || (normalizeName(playerTeam) === normalizeName(teamB) && scoreA === 0) ? 1 : 0;

        impact[`goals_${stageSuffix}`] += goals;
        impact[`assists_${stageSuffix}`] += assists;
        impact[`cs_${stageSuffix}`] += cleanSheet;

        const rating = 72
          + (goals * 6)
          + (assists * 4)
          + (shots * 0.6)
          + (cleanSheet * 2.5)
          - (ownGoals * 7);

        player.matchesPlayed += 1;
        player.matchRatings.push(clamp(rating, 0, MAX_DISPLAY_RATING));
      });

      const matchMvps = extractMvpNames(match);
      matchMvps.forEach(mvpName => {
        stageMvpMap[stageSuffix].set(mvpName, (stageMvpMap[stageSuffix].get(mvpName) || 0) + 1);
      });
    });

    // Legacy fallback: when stage MVPs are unavailable and no knockout stage exists yet,
    // retain current total MVP leaderboard by assigning to group stage.
    const hasStageMvpData = stageMvpMap.group.size > 0 || stageMvpMap.ko.size > 0;
    const hasKnockoutMatches = matches.some(match => getMatchStage(match, groupStageMatchCount) === 'ko');
    if (!hasStageMvpData && !hasKnockoutMatches) {
      (state.seed?.currentState?.mvpLeaderboard || []).forEach(item => {
        const canonical = canonicalizePlayerName(item.player || 'Unknown');
        stageMvpMap.group.set(canonical, (stageMvpMap.group.get(canonical) || 0) + toNumber(item.mvps));
      });
    }

    ['group', 'ko'].forEach(stage => {
      stageMvpMap[stage].forEach((mvps, playerName) => {
        const impact = ensureImpactRecord(impactMap, playerName, '');
        impact[`mvp_${stage}`] += toNumber(mvps);
      });
    });

    const teamRows = Array.from(teamMap.values());
    const avgShots = teamRows.reduce((sum, team) => sum + (team.halvesRecorded ? team.shots / team.halvesRecorded : 0), 0) / Math.max(teamRows.length, 1);
    const avgPasses = teamRows.reduce((sum, team) => sum + (team.halvesRecorded ? team.passes / team.halvesRecorded : 0), 0) / Math.max(teamRows.length, 1);
    const maxObservedStrength = Math.max(...Object.values(TEAM_STRENGTHS));

    teamRows.forEach(team => {
      const halves = team.halvesRecorded || 1;
      const passesPerHalf = team.passes / halves;
      const possessionPerHalf = team.possession / halves;
      const shotsPerHalf = team.shots / halves;
      const pointsPerGame = team.matchesPlayed ? team.points / team.matchesPlayed : 0;
      const expectedPointsPerGame = team.matchesPlayed ? team.expectedPoints / team.matchesPlayed : 0;
      const outcomeVsExpectationPerGame = pointsPerGame - expectedPointsPerGame;
      const gdPerGame = team.matchesPlayed ? ((team.goalsFor - team.goalsAgainst) / team.matchesPlayed) : 0;
      const avgOpponentStrength = team.matchesPlayed ? (team.opponentStrengthTotal / team.matchesPlayed) : 0;

      const resultScore = clamp(40 + (pointsPerGame * 30), 0, 100);
      const expectationScore = clamp(50 + (outcomeVsExpectationPerGame * 40), 0, 100);
      const scheduleScore = clamp(35 + ((avgOpponentStrength / Math.max(maxObservedStrength, 0.001)) * 65), 0, 100);
      const goalDifferenceScore = clamp(50 + (gdPerGame * 22), 0, 100);
      const statsScore = clamp(
        50
          + ((shotsPerHalf - avgShots) * 6)
          + ((possessionPerHalf - 50) * 0.6)
          + ((passesPerHalf - avgPasses) * 0.35),
        0,
        100
      );

      const weightedComposite = weightedAverage([
        { value: resultScore, weight: 0.55 },
        { value: goalDifferenceScore, weight: 0.25 },
        { value: expectationScore, weight: 0.05 },
        { value: scheduleScore, weight: 0.05 },
        { value: statsScore, weight: 0.10 }
      ]);

      const activityFactor = clamp(team.matchesPlayed / 3, 0, 1);
      const blendedRating = (TEAM_BASELINE_RATING * (1 - activityFactor)) + (weightedComposite * activityFactor);

      team.rawTeamRating = blendedRating;
    });

    const meanRawTeamRating = teamRows.length
      ? (teamRows.reduce((sum, team) => sum + team.rawTeamRating, 0) / teamRows.length)
      : WEIGHTS.tournament.base;

    teamRows.forEach(team => {
      const spreadAdjustedTeamRating = compressTowardMean(team.rawTeamRating, meanRawTeamRating, TEAM_COMPETITIVE_SPREAD);
      const curvedTeamRating = applySoftCapCurve(spreadAdjustedTeamRating);
      const hasComputedData = team.matchesPlayed > 0 && team.halvesRecorded > 0;

      if (hasComputedData) {
        // Use the computed score directly when real match data exists.
        team.teamRating = toRating1(curvedTeamRating);
      } else {
        team.teamRating = getMissingDataFallbackTeamRating(team.team);
      }
    });

    const playerRows = Array.from(playerMap.values())
      .filter(player => player.matchesPlayed > 0)
      .map(player => ({
        ...player,
        rawTournamentRating: player.matchRatings.reduce((sum, value) => sum + value, 0) / player.matchRatings.length
      }));

    const meanRawPlayerRating = playerRows.length
      ? (playerRows.reduce((sum, player) => sum + player.rawTournamentRating, 0) / playerRows.length)
      : SOFT_CAP_RATING;

    playerRows.forEach(player => {
      const spreadAdjustedPlayerRating = compressTowardMean(player.rawTournamentRating, meanRawPlayerRating, PLAYER_COMPETITIVE_SPREAD);
      const reliability = clamp(player.matchesPlayed / (player.matchesPlayed + PLAYER_RELIABILITY_GAMES), 0, 1);
      const reliabilityAdjustedPlayerRating = meanRawPlayerRating + ((spreadAdjustedPlayerRating - meanRawPlayerRating) * reliability);
      player.tournamentRating = toRating1(applySoftCapCurve(reliabilityAdjustedPlayerRating));
    });

    const sortedPlayerRows = [...playerRows].sort((a, b) => b.tournamentRating - a.tournamentRating);
    const countryContribution = computeCountryContributions(sortedPlayerRows);

    const impactRows = Array.from(impactMap.values()).map(record => {
      const normalizedTeam = canonicalizeTeamName(record.team || '');
      const total_goals = record.goals_group + record.goals_ko;
      const total_assists = record.assists_group + record.assists_ko;
      const total_mvps = record.mvp_group + record.mvp_ko;
      const total_cs = record.cs_group + record.cs_ko;

      return {
        ...record,
        team: normalizedTeam,
        total_goals,
        total_assists,
        total_mvps,
        total_cs,
        impact_total: round1(computeImpactScore(record, 'total')),
        impact_ko: round1(computeImpactScore(record, 'ko')),
        impact_clutch: round1(computeImpactScore(record, 'clutch'))
      };
    }).filter(row => {
      return (row.total_goals + row.total_assists + row.total_mvps + row.total_cs) > 0;
    });

    const compareImpact = (key) => (a, b) => {
      const diff = toNumber(b[key]) - toNumber(a[key]);
      if (diff !== 0) return diff;

      const tieBreak =
        (toNumber(b.total_goals) - toNumber(a.total_goals)) ||
        (toNumber(b.total_assists) - toNumber(a.total_assists)) ||
        (toNumber(b.total_mvps) - toNumber(a.total_mvps)) ||
        (toNumber(b.total_cs) - toNumber(a.total_cs));
      if (tieBreak !== 0) return tieBreak;

      return String(a.player || '').localeCompare(String(b.player || ''));
    };

    const impactLeaderboards = {
      total: [...impactRows].sort(compareImpact('impact_total')),
      ko: [...impactRows].sort(compareImpact('impact_ko')),
      clutch: [...impactRows].sort(compareImpact('impact_clutch'))
    };

    state.results = {
      playersAll: sortedPlayerRows,
      playersTop10: sortedPlayerRows
        .filter(player => player.matchesPlayed >= TOP10_PLAYER_MIN_MATCHES)
        .slice(0, 10),
      teamsTop10: teamRows
        .filter(team => team.matchesPlayed > 0)
        .sort((a, b) => b.teamRating - a.teamRating)
        .slice(0, 10),
      countryStats: countryContribution.countryStats,
      countriesTop10: countryContribution.countriesTop10,
      impactRows,
      impactLeaderboards
    };
  }

  function renderInlineCards() {
    const countryRankingsSlot = document.querySelector('#world-cup-container #world-cup-country-rankings-slot');
    const topPlayersSlot = document.querySelector('#world-cup-container #world-cup-top-players-slot');
    const statsRow = document.querySelector('#world-cup-container .world-cup-stats-row');
    if (!state.results) return;
    if (!countryRankingsSlot && !topPlayersSlot && !statsRow) return;

    const players = state.results.playersTop10;
    const teams = state.results.teamsTop10;
    const countries = state.results.countriesTop10 || [];

    let playersCard = document.getElementById('world-cup-top10-players-card');
    if (!playersCard) {
      playersCard = document.createElement('div');
      playersCard.id = 'world-cup-top10-players-card';
      playersCard.className = 'world-cup-card';
    }

    let teamsCard = document.getElementById('world-cup-top10-teams-card');
    if (!teamsCard) {
      teamsCard = document.createElement('div');
      teamsCard.id = 'world-cup-top10-teams-card';
      teamsCard.className = 'world-cup-card';
    }

    playersCard.innerHTML = `
      <div class="world-cup-info-header">
        <h2 class="world-cup-title">Top 10 Players</h2>
        <button class="world-cup-info-btn" type="button" data-info-target="players-rating-info" aria-expanded="false" aria-label="How player rating is calculated">i</button>
      </div>
      <p id="players-rating-info" class="world-cup-info-text" hidden>
        Ratings are based on match impact: results, goal difference, goals/assists/clean sheets, and team stats like possession, passes, and shots. More matches = more reliable rating.
      </p>
      <div class="world-cup-table-wrap">
        <table class="world-cup-stat-table">
          <thead>
            <tr><th>Player</th><th>Rating</th></tr>
          </thead>
          <tbody>
            ${players.map((player) => {
              const cleanName = scrubPlayerName(player.canonical) || 'Unknown';
              const flag = getPlayerFlag(cleanName);
              const playerLabel = flag ? `${flag} ${cleanName}` : cleanName;
              return `<tr><td>${playerLabel}</td><td>${round1(player.tournamentRating).toFixed(1)}</td></tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    const teamsHeaderLabel = topTeamsViewMode === 'teams' ? 'Country Ratings' : 'Player Impact';
    const teamsInfoText = topTeamsViewMode === 'teams'
      ? 'Team ratings mostly reward results first (wins, draws, losses), then goal difference and team performance stats (possession, passes, shots). More games means the rating reflects real form better.'
      : 'Player Impact = goals (x1.0) + assists (x0.7) + MVPs (x2.0) + clean sheets (x1.0), summed across all players from that country. This highlights countries with strong overall contributions, even if they don\'t have a top-rated player.';
    const teamsTableHeader = topTeamsViewMode === 'teams'
      ? '<tr><th>Team</th><th>Rating</th></tr>'
      : '<tr><th>Country</th><th>Score</th><th>Players</th></tr>';
    const teamsTableRows = topTeamsViewMode === 'teams'
      ? renderTeamsTop10Rows(teams)
      : renderCountriesTop10Rows(countries);

    teamsCard.innerHTML = `
      <div class="world-cup-info-header">
        <h2 class="world-cup-title">${teamsHeaderLabel}</h2>
        <div class="world-cup-top-teams-controls">
          <button class="world-cup-nav-btn" type="button" data-top-teams-nav="left" aria-label="Show previous view">&#8592;</button>
          <button class="world-cup-nav-btn" type="button" data-top-teams-nav="right" aria-label="Show next view">&#8594;</button>
          <button class="world-cup-info-btn" type="button" data-info-target="teams-rating-info" aria-expanded="false" aria-label="How this ranking is calculated">i</button>
        </div>
      </div>
      <p id="teams-rating-info" class="world-cup-info-text" hidden>
        ${teamsInfoText}
      </p>
      <div class="world-cup-table-wrap">
        <table class="world-cup-stat-table">
          <thead>
            ${teamsTableHeader}
          </thead>
          <tbody>
            ${teamsTableRows}
          </tbody>
        </table>
      </div>
    `;

    [playersCard, teamsCard].forEach(card => {
      card.querySelectorAll('.world-cup-info-btn').forEach(button => {
        button.addEventListener('click', () => {
          const targetId = button.getAttribute('data-info-target');
          const infoEl = card.querySelector(`#${targetId}`);
          if (!infoEl) return;

          const willOpen = infoEl.hidden;
          infoEl.hidden = !willOpen;
          button.setAttribute('aria-expanded', String(willOpen));
        });
      });
    });

    teamsCard.querySelectorAll('[data-top-teams-nav]').forEach(button => {
      button.addEventListener('click', () => {
        cycleTopTeamsViewMode();
        renderInlineCards();
      });
    });

    if (countryRankingsSlot && topPlayersSlot) {
      countryRankingsSlot.innerHTML = '';
      topPlayersSlot.innerHTML = '';
      countryRankingsSlot.appendChild(teamsCard);
      topPlayersSlot.appendChild(playersCard);
      return;
    }

    const statCards = Array.from(statsRow.querySelectorAll('.world-cup-card'));
    const ownGoalsCard = statCards.find(card => {
      const title = card.querySelector('.world-cup-title');
      return title && title.textContent === 'Own Goals';
    });

    if (ownGoalsCard) {
      statsRow.insertBefore(teamsCard, ownGoalsCard);
      statsRow.insertBefore(playersCard, ownGoalsCard);
    } else {
      statsRow.appendChild(playersCard);
      statsRow.appendChild(teamsCard);
    }
  }

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #world-cup-top10-players-card,
      #world-cup-top10-teams-card {
        min-width: 0;
      }

      .world-cup-info-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
      }

      .world-cup-info-btn {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1px solid rgba(255, 215, 0, 0.8);
        background: rgba(255, 215, 0, 0.12);
        color: #ffd700;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        line-height: 1;
      }

      .world-cup-info-btn:hover {
        background: rgba(255, 215, 0, 0.2);
      }

      .world-cup-info-text {
        margin: 0 0 10px;
        padding: 8px 10px;
        border-radius: 8px;
        font-size: 12px;
        line-height: 1.4;
        color: #d9dee8;
        background: rgba(255, 255, 255, 0.06);
      }

      .world-cup-top-teams-controls {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .world-cup-nav-btn {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1px solid rgba(255, 215, 0, 0.8);
        background: rgba(255, 215, 0, 0.12);
        color: #ffd700;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        line-height: 1;
      }

      .world-cup-nav-btn:hover {
        background: rgba(255, 215, 0, 0.2);
      }
    `;
    document.head.appendChild(style);
  }

  async function init() {
    injectStyles();
    state.aliases = buildAliasMap();
    state.roster = buildRoster();

    const response = await fetch(SEED_URL, { cache: 'no-store' });
    state.seed = await response.json();
    state.seed.currentState = buildCurrentStateOverride(state.seed?.currentState);

    const gkList = state.seed?.currentState?.goalkeepers || [];
    gkList.forEach(name => state.goalkeepers.add(normalizeName(name)));

    const originalRender = window.renderWorldCupTab;
    if (typeof originalRender === 'function') {
      window.renderWorldCupTab = function patchedRenderWorldCupTab() {
        originalRender();
        computeAll();
        renderInlineCards();
      };
      window.renderWorldCupTab();
    } else {
      computeAll();
      renderInlineCards();
    }
  }

  init().catch(error => {
    console.error('World Cup top 10 injection failed', error);
  });
})();


