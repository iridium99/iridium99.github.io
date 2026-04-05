(() => {
  const CONSTANTS = {
    TEAM_STRENGTHS: {
      England: 0.200,
      Poland: 0.205,
      Germany: 0.167,
      Netherlands: 0.170,
      Spain: 0.125,
      Italy: 0.110,
      Egypt: 0.115,
      'World XI': 0.048,
      'Tunisia + Algeria': 0.042,
      France: 0.038
    },
    WEIGHTS: {
      team: {
        actual: 12,
        goalDifference: 4,
        shotDifference: 3,
        possessionDifference: 2,
        passDifference: 2,
        upset: 10,
        base: 50
      },
      player: {
        teamScore: 1,
        goals: 6,
        assists: 4,
        shots: 1.5,
        passes: 0.15,
        kicks: 0.05,
        cleanSheets: 4,
        mvpBase: 5,
        mvpTeamScoreFactor: 0.2,
        ownGoals: 8,
        goalkeeperCleanSheets: 2
      },
      tournament: {
        base: 50,
        pointsPerGame: 5,
        goalDifferencePerGame: 3,
        shotsPerHalfDelta: 2,
        possessionPerHalfDelta: 1.5,
        passesPerHalfDelta: 1
      }
    },
    GOALKEEPERS: [
      'atrocity exhibition',
      'Zenon',
      'ShadiOzz',
      'Mbappe',
      'luur',
      'Misimaro',
      'ShIeLd',
      'kakii',
      'Praetor',
      'Himothy',
      'Kaka',
      'SAFF'
    ]
  };

  const INITIAL_STATE_URL = 'tournament_structured_data.json';
  const STORAGE_KEY = 'ldc-rs-legends-tournament-live-events';

  const state = {
    seed: null,
    events: [],
    computed: null,
    roster: new Map(),
    rosterTeams: new Map(),
    aliases: new Map(),
    reviewItems: [],
    activeTeamStatsMode: 'raw'
  };

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

  function safeNumber(value, fallback = 0) {
    return Number.isFinite(Number(value)) ? Number(value) : fallback;
  }

  function levenshtein(a, b) {
    const source = a || '';
    const target = b || '';
    if (source === target) return 0;
    if (!source.length) return target.length;
    if (!target.length) return source.length;

    const rows = Array.from({ length: source.length + 1 }, () => new Array(target.length + 1).fill(0));
    for (let i = 0; i <= source.length; i += 1) rows[i][0] = i;
    for (let j = 0; j <= target.length; j += 1) rows[0][j] = j;

    for (let i = 1; i <= source.length; i += 1) {
      for (let j = 1; j <= target.length; j += 1) {
        const cost = source[i - 1] === target[j - 1] ? 0 : 1;
        rows[i][j] = Math.min(
          rows[i - 1][j] + 1,
          rows[i][j - 1] + 1,
          rows[i - 1][j - 1] + cost
        );
      }
    }

    return rows[source.length][target.length];
  }

  function similarity(a, b) {
    const left = normalizeName(a);
    const right = normalizeName(b);
    const longest = Math.max(left.length, right.length);
    if (longest === 0) return 1;
    return 1 - (levenshtein(left, right) / longest);
  }

  function teamStrength(team) {
    return CONSTANTS.TEAM_STRENGTHS[team] ?? 0;
  }

  function currentUserRosters() {
    const teams = Array.isArray(window.teams) ? window.teams : [];
    const roster = new Map();
    const rosterTeams = new Map();

    teams.forEach(team => {
      (team.players || []).forEach(playerName => {
        const canonical = playerName.trim();
        roster.set(normalizeName(canonical), {
          canonical,
          team: team.name,
          registered: true
        });
        rosterTeams.set(canonical, team.name);
      });
    });

    return { roster, rosterTeams };
  }

  function buildAliasMap() {
    const entries = [
      ['luisdiaz', 'LuisDiaz'],
      ['luisdiaz', 'Luisdiaz'],
      ['zenon', 'Zenon'],
      ['zénon', 'Zenon'],
      ['v4ks', 'Vaks'],
      ['vakanda', 'Wakanda'],
      ['w-pi', 'Wakanda'],
      ['wpi', 'Wakanda'],
      ['drkuu', 'Drkuu'],
      ['drku', 'Drkuu'],
      ['fayalev', 'Faya'],
      ['faya', 'Faya'],
      ['faya lev', 'Faya'],
      ['jhonnysins', 'Johnny Sins'],
      ['johnnysins', 'Johnny Sins'],
      ['valotti', 'Valotii'],
      ['valotii', 'Valotii'],
      ['vannystelroy', 'Van Nistelrooy'],
      ['vannistelrooy', 'Van Nistelrooy'],
      ['sergioramoss', 'Sergio Ramos'],
      ['sergioramos', 'Sergio Ramos'],
      ['tiki', 'Tiki'],
      ['tikiahmadfutuh', 'Tiki'],
      ['mrn', 'MRN'],
      ['a7mdbibo', 'A7mdBibo'],
      ['shaidozz', 'ShadiOzz'],
      ['shield', 'ShIeLd'],
      ['kakii', 'kakii'],
      ['praetor', 'Praetor'],
      ['fullmetal', 'FullMetal'],
      ['bananajoe', 'Bananajoe'],
      ['saygex', 'Saygex'],
      ['vaks', 'Vaks'],
      ['zenix', 'zenix'],
      ['atrocityexhibition', 'atrocity exhibition'],
      ['lumur', 'luur'],
      ['luur', 'luur']
    ];

    const map = new Map();
    entries.forEach(([from, to]) => map.set(normalizeName(from), to));
    return map;
  }

  function canonicalizeName(rawName, teamName) {
    const raw = (rawName || '').trim();
    const normalized = normalizeName(raw);
    if (!normalized) return { canonical: raw || 'Unknown', registered: false, team: teamName || null, review: null };

    if (state.aliases.has(normalized)) {
      return {
        canonical: state.aliases.get(normalized),
        registered: true,
        team: state.rosterTeams.get(state.aliases.get(normalized)) || teamName || null,
        review: null
      };
    }

    if (state.roster.has(normalized)) {
      const entry = state.roster.get(normalized);
      return {
        canonical: entry.canonical,
        registered: true,
        team: entry.team || teamName || null,
        review: null
      };
    }

    let bestMatch = null;
    let bestScore = 0;
    state.roster.forEach(entry => {
      const score = similarity(raw, entry.canonical);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry.canonical;
      }
    });

    const review = bestScore > 0.8 ? { raw: rawName, suggestion: bestMatch, score: round1(bestScore) } : null;
    if (review) {
      state.reviewItems.push(review);
    }

    return {
      canonical: raw || 'Unknown',
      registered: false,
      team: teamName || null,
      review
    };
  }

  function parseStructuredPayload(inputText) {
    const trimmed = (inputText || '').trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.matches)) return parsed.matches;
      if (parsed && parsed.matchNumber !== undefined) return [parsed];
      return [];
    } catch (error) {
      return trimmed
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    }
  }

  function seedEventKey(match) {
    return `${safeNumber(match.matchNumber)}-${safeNumber(match.halfNumber)}`;
  }

  function canonicalizeGoalEvent(event, match) {
    const rawScorer = event.scorer || event.player || '';
    const rawAssist = event.assist || null;

    if (safeNumber(match.matchNumber) === 6 && safeNumber(match.halfNumber) === 2 && normalizeName(rawScorer) === 'zenon') {
      return {
        ...event,
        scorer: 'Luisdiaz',
        assist: 'Wakanda',
        ownGoal: false
      };
    }

    const scorer = rawScorer ? canonicalizeName(rawScorer, match.teamA).canonical : null;
    const assist = rawAssist ? canonicalizeName(rawAssist, match.teamA).canonical : null;

    return {
      ...event,
      scorer,
      assist
    };
  }

  function actualResultForScore(scoreA, scoreB) {
    if (scoreA > scoreB) return 1;
    if (scoreA === scoreB) return 0.5;
    return 0;
  }

  function teamScore(match, teamSide) {
    const scoreA = safeNumber(match.scoreA);
    const scoreB = safeNumber(match.scoreB);
    const resultA = actualResultForScore(scoreA, scoreB);
    const actual = teamSide === 'A' ? resultA : (1 - resultA);
    const goalDifference = teamSide === 'A' ? (scoreA - scoreB) : (scoreB - scoreA);

    const stats = match.stats || {};
    const possessionA = safeNumber(stats.possessionA);
    const possessionB = safeNumber(stats.possessionB);
    const passesA = safeNumber(stats.passesA);
    const passesB = safeNumber(stats.passesB);
    const shotsA = safeNumber(stats.shotsA);
    const shotsB = safeNumber(stats.shotsB);

    const possessionDifference = teamSide === 'A' ? (possessionA - possessionB) : (possessionB - possessionA);
    const passDifference = teamSide === 'A' ? (passesA - passesB) : (passesB - passesA);
    const shotDifference = teamSide === 'A' ? (shotsA - shotsB) : (shotsB - shotsA);

    const teamName = teamSide === 'A' ? match.teamA : match.teamB;
    const opponent = teamSide === 'A' ? match.teamB : match.teamA;
    const strength = teamStrength(teamName);
    const opponentStrength = teamStrength(opponent);
    const expected = (strength + opponentStrength) > 0 ? (strength / (strength + opponentStrength)) : 0.5;
    const upset = actual - expected;

    return CONSTANTS.WEIGHTS.team.base
      + (CONSTANTS.WEIGHTS.team.actual * actual)
      + (CONSTANTS.WEIGHTS.team.goalDifference * clamp(goalDifference, -3, 3))
      + (CONSTANTS.WEIGHTS.team.shotDifference * clamp(shotDifference / 3, -3, 3))
      + (CONSTANTS.WEIGHTS.team.possessionDifference * clamp(possessionDifference / 10, -3, 3))
      + (CONSTANTS.WEIGHTS.team.passDifference * clamp(passDifference / 20, -3, 3))
      + (CONSTANTS.WEIGHTS.team.upset * upset);
  }

  function isGoalkeeper(name, teamName) {
    const normalized = normalizeName(name);
    if (CONSTANTS.GOALKEEPERS.some(gk => normalizeName(gk) === normalized)) return true;
    const teamPlayers = Array.isArray(window.allPlayers) ? window.allPlayers : [];
    const exactRoster = teamPlayers.find(player => normalizeName(player.name) === normalized || normalizeName(player.display_name) === normalized);
    return exactRoster ? exactRoster.position === 'GK' : false;
  }

  function getPlayerRecord(map, canonical, teamName, registered) {
    if (!map.has(canonical)) {
      map.set(canonical, {
        canonical,
        displayName: canonical,
        team: teamName || null,
        registered: Boolean(registered),
        matchesPlayed: 0,
        matchRatings: [],
        stats: {
          goals: 0,
          assists: 0,
          shots: 0,
          passes: 0,
          kicks: 0,
          cleanSheets: 0,
          ownGoals: 0,
          mvpMatches: 0
        },
        teamsSeen: new Set()
      });
    }

    const record = map.get(canonical);
    if (teamName) record.teamsSeen.add(teamName);
    if (registered) record.registered = true;
    if (teamName && !record.team) record.team = teamName;
    return record;
  }

  function mergeMatchStats(event, teamScoreA, teamScoreB, playerMap, teamMap, ensureTeamRecord) {
    const players = Array.isArray(event.players) ? event.players : [];
    const goals = Array.isArray(event.goals) ? event.goals : [];
    const teamA = event.teamA;
    const teamB = event.teamB;
    const scoreA = safeNumber(event.scoreA);
    const scoreB = safeNumber(event.scoreB);
    const teamAActual = actualResultForScore(scoreA, scoreB);
    const teamBActual = actualResultForScore(scoreB, scoreA);

    const perTeamPlayers = {
      A: [],
      B: []
    };

    players.forEach(playerEntry => {
      const side = normalizeName(playerEntry.team) === normalizeName(teamA) ? 'A' : (normalizeName(playerEntry.team) === normalizeName(teamB) ? 'B' : null);
      if (!side) return;
      perTeamPlayers[side].push(playerEntry);
    });

    const hasCleanSheetA = scoreB === 0;
    const hasCleanSheetB = scoreA === 0;

    const assignedGoalData = new Map();
    goals.forEach(goal => {
      const normalizedGoal = canonicalizeGoalEvent(goal, event);
      const scorer = normalizedGoal.scorer;
      if (!scorer) return;
      if (!assignedGoalData.has(scorer)) {
        assignedGoalData.set(scorer, { goals: 0, assists: 0, ownGoals: 0 });
      }

      if (normalizedGoal.ownGoal) {
        assignedGoalData.get(scorer).ownGoals += 1;
      } else {
        assignedGoalData.get(scorer).goals += 1;
        if (normalizedGoal.assist) {
          const assist = normalizedGoal.assist;
          if (!assignedGoalData.has(assist)) {
            assignedGoalData.set(assist, { goals: 0, assists: 0, ownGoals: 0 });
          }
          assignedGoalData.get(assist).assists += 1;
        }
      }
    });

    const allPlayerNames = new Set();
    players.forEach(playerEntry => {
      allPlayerNames.add(playerEntry.name);
    });
    goals.forEach(goal => {
      if (goal.scorer) allPlayerNames.add(goal.scorer);
      if (goal.assist) allPlayerNames.add(goal.assist);
    });

    allPlayerNames.forEach(rawName => {
      const side = players.find(p => normalizeName(p.name) === normalizeName(rawName))?.team;
      const resolved = canonicalizeName(rawName, side);
      const playerRecord = getPlayerRecord(playerMap, resolved.canonical, resolved.team || side || null, resolved.registered);
      const playerStats = players.find(p => normalizeName(p.name) === normalizeName(rawName)) || {};
      const goalEntry = assignedGoalData.get(resolved.canonical) || { goals: 0, assists: 0, ownGoals: 0 };

      playerRecord.matchesPlayed += 1;
      playerRecord.stats.goals += safeNumber(playerStats.goals) + goalEntry.goals;
      playerRecord.stats.assists += safeNumber(playerStats.assists) + goalEntry.assists;
      playerRecord.stats.shots += safeNumber(playerStats.shots);
      playerRecord.stats.passes += safeNumber(playerStats.passes);
      playerRecord.stats.kicks += safeNumber(playerStats.kicks);
      playerRecord.stats.ownGoals += safeNumber(playerStats.ownGoals) + goalEntry.ownGoals;

      const playerTeam = side || playerRecord.team || null;
      const isGK = isGoalkeeper(resolved.canonical, playerTeam);
      const cleanSheetsThisMatch = (playerTeam === teamA && hasCleanSheetA) || (playerTeam === teamB && hasCleanSheetB) ? 1 : 0;
      playerRecord.stats.cleanSheets += cleanSheetsThisMatch;

      const averageTeamScore = playerTeam === teamA ? teamScoreA : (playerTeam === teamB ? teamScoreB : (teamScoreA + teamScoreB) / 2);
      const mvpCount = 0;
      const mvpBonus = mvpCount > 0 ? (CONSTANTS.WEIGHTS.player.mvpBase + ((averageTeamScore - 50) * CONSTANTS.WEIGHTS.player.mvpTeamScoreFactor)) : 0;

      let rating = averageTeamScore
        + (CONSTANTS.WEIGHTS.player.goals * (safeNumber(playerStats.goals) + goalEntry.goals))
        + (CONSTANTS.WEIGHTS.player.assists * (safeNumber(playerStats.assists) + goalEntry.assists))
        + (CONSTANTS.WEIGHTS.player.shots * safeNumber(playerStats.shots))
        + (CONSTANTS.WEIGHTS.player.passes * safeNumber(playerStats.passes))
        + (CONSTANTS.WEIGHTS.player.kicks * safeNumber(playerStats.kicks))
        + (CONSTANTS.WEIGHTS.player.cleanSheets * cleanSheetsThisMatch)
        + mvpBonus
        - (CONSTANTS.WEIGHTS.player.ownGoals * (safeNumber(playerStats.ownGoals) + goalEntry.ownGoals));

      if (isGK) {
        rating += CONSTANTS.WEIGHTS.player.goalkeeperCleanSheets * cleanSheetsThisMatch;
      }

      playerRecord.matchRatings.push(clamp(rating, 0, 100));
    });

    const teamRecordA = ensureTeamRecord(teamA);
    const teamRecordB = ensureTeamRecord(teamB);

    teamRecordA.teamScores.push(teamScoreA);
    teamRecordB.teamScores.push(teamScoreB);

    teamRecordA.matchesPlayed += 1;
    teamRecordB.matchesPlayed += 1;

    if (scoreA > scoreB) {
      teamRecordA.wins += 1;
      teamRecordB.losses += 1;
      teamRecordA.points += 3;
    } else if (scoreA < scoreB) {
      teamRecordB.wins += 1;
      teamRecordA.losses += 1;
      teamRecordB.points += 3;
    } else {
      teamRecordA.draws += 1;
      teamRecordB.draws += 1;
      teamRecordA.points += 1;
      teamRecordB.points += 1;
    }

    teamRecordA.goalsFor += scoreA;
    teamRecordA.goalsAgainst += scoreB;
    teamRecordB.goalsFor += scoreB;
    teamRecordB.goalsAgainst += scoreA;

    const stats = event.stats || {};
    teamRecordA.passes += safeNumber(stats.passesA);
    teamRecordA.possession += safeNumber(stats.possessionA);
    teamRecordA.shots += safeNumber(stats.shotsA);
    teamRecordA.halvesRecorded += 1;

    teamRecordB.passes += safeNumber(stats.passesB);
    teamRecordB.possession += safeNumber(stats.possessionB);
    teamRecordB.shots += safeNumber(stats.shotsB);
    teamRecordB.halvesRecorded += 1;
  }

  function computeTournament(seed) {
    state.reviewItems = [];
    const playerMap = new Map();
    const teamMap = new Map();

    const allTeams = new Set();
    (seed.currentState?.groupTables ? Object.values(seed.currentState.groupTables).flat() : []).forEach(row => allTeams.add(row.team));
    (Array.isArray(seed.matches) ? seed.matches : []).forEach(match => {
      allTeams.add(match.teamA);
      allTeams.add(match.teamB);
    });

    allTeams.forEach(teamName => {
      teamMap.set(teamName, {
        team: teamName,
        halvesRecorded: 0,
        passes: 0,
        possession: 0,
        shots: 0,
        points: 0,
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        teamScores: []
      });
    });

    const ensureTeamRecord = (teamName) => {
      if (!teamMap.has(teamName)) {
        teamMap.set(teamName, {
          team: teamName,
          halvesRecorded: 0,
          passes: 0,
          possession: 0,
          shots: 0,
          points: 0,
          matchesPlayed: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          teamScores: []
        });
      }
      return teamMap.get(teamName);
    };

    const eventByKey = new Map();
    const orderedEvents = [];

    (Array.isArray(seed.matches) ? seed.matches : []).forEach(match => {
      const event = JSON.parse(JSON.stringify(match));
      event.goals = Array.isArray(event.goals) ? event.goals : [];
      const key = seedEventKey(event);
      eventByKey.set(key, event);
    });

    state.events.forEach(event => {
      const key = seedEventKey(event);
      eventByKey.set(key, event);
    });

    eventByKey.forEach(event => orderedEvents.push(event));
    orderedEvents.sort((a, b) => {
      const aMatch = safeNumber(a.matchNumber);
      const bMatch = safeNumber(b.matchNumber);
      if (aMatch !== bMatch) return aMatch - bMatch;
      return safeNumber(a.halfNumber) - safeNumber(b.halfNumber);
    });

    orderedEvents.forEach(event => {
      const teamScoreA = teamScore(event, 'A');
      const teamScoreB = teamScore(event, 'B');
      mergeMatchStats(event, teamScoreA, teamScoreB, playerMap, teamMap, ensureTeamRecord);
    });

    const allTeamRows = [];
    teamMap.forEach(team => {
      const halves = team.halvesRecorded || 1;
      const passesPerHalf = team.passes / halves;
      const possessionPerHalf = team.possession / halves;
      const shotsPerHalf = team.shots / halves;
      const pointsPerGame = team.matchesPlayed ? team.points / team.matchesPlayed : 0;
      const goalDifferencePerGame = team.matchesPlayed ? ((team.goalsFor - team.goalsAgainst) / team.matchesPlayed) : 0;
      const tournamentAverageShots = Array.from(teamMap.values()).reduce((sum, item) => sum + (item.halvesRecorded ? item.shots / item.halvesRecorded : 0), 0) / Math.max(teamMap.size, 1);
      const tournamentAveragePasses = Array.from(teamMap.values()).reduce((sum, item) => sum + (item.halvesRecorded ? item.passes / item.halvesRecorded : 0), 0) / Math.max(teamMap.size, 1);
      let teamRating = CONSTANTS.WEIGHTS.tournament.base
        + (CONSTANTS.WEIGHTS.tournament.pointsPerGame * pointsPerGame)
        + (CONSTANTS.WEIGHTS.tournament.goalDifferencePerGame * goalDifferencePerGame)
        + (CONSTANTS.WEIGHTS.tournament.shotsPerHalfDelta * (shotsPerHalf - tournamentAverageShots))
        + (CONSTANTS.WEIGHTS.tournament.possessionPerHalfDelta * (possessionPerHalf - 50))
        + (CONSTANTS.WEIGHTS.tournament.passesPerHalfDelta * (passesPerHalf - tournamentAveragePasses));

      team.teamRating = clamp(teamRating, 0, 100);
      team.passesPerHalf = passesPerHalf;
      team.possessionPerHalf = possessionPerHalf;
      team.shotsPerHalf = shotsPerHalf;
      team.pointsPerGame = pointsPerGame;
      team.goalDifferencePerGame = goalDifferencePerGame;
      team.goalDifference = team.goalsFor - team.goalsAgainst;
      allTeamRows.push(team);
    });

    const allPlayerRows = [];
    playerMap.forEach(player => {
      const matchesPlayed = Math.max(player.matchesPlayed, 1);
      const averageTeamScore = player.matchRatings.length ? player.matchRatings.reduce((sum, value) => sum + value, 0) / player.matchRatings.length : 0;
      const mvpBonusSeedCount = seed.currentState?.mvpLeaderboard?.find(item => normalizeName(item.player) === normalizeName(player.canonical))?.mvps || 0;
      const mvpBonusEstimate = mvpBonusSeedCount > 0 ? ((CONSTANTS.WEIGHTS.player.mvpBase + ((averageTeamScore - 50) * CONSTANTS.WEIGHTS.player.mvpTeamScoreFactor)) * mvpBonusSeedCount) / matchesPlayed : 0;
      const tournamentRating = clamp(
        (player.matchRatings.length ? player.matchRatings.reduce((sum, value) => sum + value, 0) / player.matchRatings.length : 0) + mvpBonusEstimate,
        0,
        100
      );

      allPlayerRows.push({
        ...player,
        matchesPlayed,
        tournamentRating,
        teamRatingContext: averageTeamScore
      });
    });

    const leaderboardCounts = {
      goals: new Map(),
      assists: new Map(),
      cleanSheets: new Map(),
      mvps: new Map(),
      ownGoals: new Map()
    };

    (seed.currentState?.goalsLeaderboard || []).forEach(item => leaderboardCounts.goals.set(item.player, safeNumber(item.goals)));
    (seed.currentState?.assistsLeaderboard || []).forEach(item => leaderboardCounts.assists.set(item.player, safeNumber(item.assists)));
    (seed.currentState?.cleanSheetsLeaderboard || []).forEach(item => leaderboardCounts.cleanSheets.set(item.player, safeNumber(item.cleanSheets)));
    (seed.currentState?.mvpLeaderboard || []).forEach(item => leaderboardCounts.mvps.set(item.player, safeNumber(item.mvps)));
    (seed.currentState?.ownGoalsLeaderboard || []).forEach(item => leaderboardCounts.ownGoals.set(item.player, safeNumber(item.ownGoals)));

    return {
      players: allPlayerRows.filter(player => player.matchesPlayed > 0),
      teams: allTeamRows,
      leaderboards: leaderboardCounts,
      groupTables: seed.currentState?.groupTables || {},
      teamRawStats: teamMap,
      reviewItems: state.reviewItems.slice()
    };
  }

  function mergeSeedToLive(seed) {
    state.seed = seed;
    state.roster.clear();
    state.rosterTeams.clear();
    state.aliases = buildAliasMap();

    const rosterInfo = currentUserRosters();
    rosterInfo.roster.forEach((entry, key) => state.roster.set(key, entry));
    rosterInfo.rosterTeams.forEach((team, canonical) => state.rosterTeams.set(canonical, team));
  }

  function loadLiveEvents() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  }

  function saveLiveEvents() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.events));
    } catch {
      // ignore persistence failures
    }
  }

  function upsertMatches(matches) {
    const byKey = new Map(state.events.map(event => [seedEventKey(event), event]));
    matches.forEach(match => {
      if (!match || typeof match !== 'object') return;
      const copy = JSON.parse(JSON.stringify(match));
      copy.goals = Array.isArray(copy.goals) ? copy.goals : [];
      const key = seedEventKey(copy);
      byKey.set(key, copy);
    });
    state.events = Array.from(byKey.values());
    saveLiveEvents();
    recomputeAndRender();
  }

  function renderStatTable(title, rows, metricLabel, keyField) {
    return `
      <div class="tr-card">
        <div class="tr-card-header">
          <h3>${title}</h3>
        </div>
        <div class="tr-table-wrap">
          <table class="tr-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>${metricLabel}</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => `<tr><td>${row.player}</td><td>${row[keyField]}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderPlayerLeaderBoard(players) {
    const sorted = [...players]
      .sort((a, b) => b.tournamentRating - a.tournamentRating)
      .slice(0, 10);

    return `
      <div class="tr-card tr-span-2">
        <div class="tr-card-header">
          <h3>Top 10 Players</h3>
          <span class="tr-meta">Ranked by tournamentRating</span>
        </div>
        <div class="tr-table-wrap">
          <table class="tr-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Rating</th>
                <th>Matches</th>
              </tr>
            </thead>
            <tbody>
              ${sorted.map((player, index) => `
                <tr title="${buildPlayerAuditTooltip(player)}">
                  <td>${index + 1}</td>
                  <td>${player.canonical}${player.registered ? '' : ' <span class="tr-tag-new">NEW</span>'}</td>
                  <td>${round1(player.tournamentRating).toFixed(1)}</td>
                  <td>${player.matchesPlayed}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderTeamLeaderBoard(teams) {
    const sorted = [...teams]
      .sort((a, b) => b.teamRating - a.teamRating)
      .slice(0, 10);

    return `
      <div class="tr-card">
        <div class="tr-card-header">
          <h3>Top 10 Teams</h3>
          <span class="tr-meta">Ranked by teamRating</span>
        </div>
        <div class="tr-table-wrap">
          <table class="tr-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Team</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              ${sorted.map((team, index) => `
                <tr title="${buildTeamAuditTooltip(team)}">
                  <td>${index + 1}</td>
                  <td>${team.team}</td>
                  <td>${round1(team.teamRating).toFixed(1)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function buildPlayerAuditTooltip(player) {
    const breakdown = [
      `Team rating context: ${round1(player.teamRatingContext || 0).toFixed(1)}`,
      `Matches: ${player.matchesPlayed}`,
      `Goals: ${player.stats.goals}`,
      `Assists: ${player.stats.assists}`,
      `Shots: ${player.stats.shots}`,
      `Passes: ${player.stats.passes}`,
      `Kicks: ${player.stats.kicks}`,
      `Clean sheets: ${player.stats.cleanSheets}`,
      `Own goals: ${player.stats.ownGoals}`
    ];
    return breakdown.join(' | ');
  }

  function buildTeamAuditTooltip(team) {
    return [
      `Points/game: ${round1(team.pointsPerGame).toFixed(1)}`,
      `GD/game: ${round1(team.goalDifferencePerGame).toFixed(1)}`,
      `Shots/half: ${round1(team.shotsPerHalf).toFixed(1)}`,
      `Possession/half: ${round1(team.possessionPerHalf).toFixed(1)}`,
      `Passes/half: ${round1(team.passesPerHalf).toFixed(1)}`
    ].join(' | ');
  }

  function renderPlayersByTeam(players, teams) {
    const rosterByTeam = new Map();
    players.forEach(player => {
      const teamName = player.team || (player.teamsSeen.values().next().value || 'Unassigned');
      if (!rosterByTeam.has(teamName)) rosterByTeam.set(teamName, []);
      rosterByTeam.get(teamName).push(player);
    });

    const canonicalTeams = Array.isArray(window.teams) ? window.teams.map(team => team.name) : [];
    const extraTeams = Array.from(rosterByTeam.keys()).filter(team => !canonicalTeams.includes(team));
    const orderedTeams = [...canonicalTeams, ...extraTeams];

    return `
      <div class="tr-card tr-span-2">
        <div class="tr-card-header">
          <h3>Players by Team</h3>
          <span class="tr-meta">Canonical names with live ratings</span>
        </div>
        <div class="tr-legend"><span class="tr-tag-new">NEW</span> marks unregistered players</div>
        <div class="tr-team-grid">
          ${orderedTeams.filter(team => rosterByTeam.has(team)).map(teamName => {
            const members = [...rosterByTeam.get(teamName)].sort((a, b) => a.canonical.localeCompare(b.canonical));
            return `
              <div class="tr-team-card">
                <div class="tr-team-title">${teamName}</div>
                <div class="tr-team-list">
                  ${members.map(player => `
                    <div class="tr-player-line" title="${buildPlayerAuditTooltip(player)}">
                      <span>${player.canonical} — ${round1(player.tournamentRating).toFixed(1)}${player.registered ? '' : ' <span class="tr-tag-new">NEW</span>'}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function renderReviewPanel(reviewItems) {
    const distinct = [];
    const seen = new Set();
    reviewItems.forEach(item => {
      const key = `${normalizeName(item.raw)}-${item.suggestion}`;
      if (seen.has(key)) return;
      seen.add(key);
      distinct.push(item);
    });

    if (!distinct.length) return '';

    return `
      <div class="tr-card tr-span-2">
        <div class="tr-card-header">
          <h3>Review Queue</h3>
          <span class="tr-meta">Potential name matches</span>
        </div>
        <div class="tr-review-list">
          ${distinct.map(item => `
            <div class="tr-review-item">
              <strong>${item.raw}</strong>
              <span>suggested: ${item.suggestion}</span>
              <span>similarity: ${item.score}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function buildSummaryRows(list, keyField) {
    return [...list]
      .sort((a, b) => b[keyField] - a[keyField])
      .map(item => ({ player: item.player, [keyField]: item[keyField] }));
  }

  function renderRoot() {
    const host = document.getElementById('tournament-ratings-root');
    if (!host || !state.computed) return;

    const playerRows = state.computed.players;
    const teamRows = state.computed.teams;
    const goalsRows = buildSummaryRows(Array.from(state.currentCurrentState.goalsLeaderboard || []), 'goals');
    const assistsRows = buildSummaryRows(Array.from(state.currentCurrentState.assistsLeaderboard || []), 'assists');
    const mvpRows = buildSummaryRows(Array.from(state.currentCurrentState.mvpLeaderboard || []), 'mvps');
    const cleanRows = buildSummaryRows(Array.from(state.currentCurrentState.cleanSheetsLeaderboard || []), 'cleanSheets');
    const ownGoalRows = buildSummaryRows(Array.from(state.currentCurrentState.ownGoalsLeaderboard || []), 'ownGoals');

    const topPlayerSection = renderPlayerLeaderBoard(playerRows);
    const topTeamSection = renderTeamLeaderBoard(teamRows);
    const playersByTeamSection = renderPlayersByTeam(playerRows, teamRows);
    const reviewSection = renderReviewPanel(state.computed.reviewItems);

    host.innerHTML = `
      <div class="tr-shell">
        <div class="tr-card tr-span-2">
          <div class="tr-card-header">
            <h3>Tournament Rating System</h3>
            <span class="tr-meta">Paste one structured match JSON object or array of match objects</span>
          </div>
          <textarea id="tr-match-input" class="tr-input" rows="10" placeholder='Paste structured match JSON here. Example: {"matchNumber":7,"halfNumber":1,...}'></textarea>
          <div class="tr-actions">
            <button id="tr-process-btn" class="tr-button">Process Match</button>
            <button id="tr-reset-btn" class="tr-button tr-secondary">Reset Live Matches</button>
            <span id="tr-status" class="tr-status">Loaded seed data.</span>
          </div>
        </div>

        ${topPlayerSection}
        <div class="tr-grid-two tr-span-2">
          ${topTeamSection}
          ${renderStatStrip('Clean Sheets', cleanRows, 'cleanSheets')}
        </div>
        ${renderTeamLeaderboardCardAndStats(teamRows)}
        ${playersByTeamSection}
        ${renderStatStrip('Goals', goalsRows, 'goals')}
        ${renderStatStrip('Assists', assistsRows, 'assists')}
        ${renderStatStrip('MVPs', mvpRows, 'mvps')}
        ${renderStatStrip('Own Goals', ownGoalRows, 'ownGoals')}
        ${reviewSection}
      </div>
    `;

    const input = document.getElementById('tr-match-input');
    const processButton = document.getElementById('tr-process-btn');
    const resetButton = document.getElementById('tr-reset-btn');
    const status = document.getElementById('tr-status');

    processButton.onclick = () => {
      const matches = parseStructuredPayload(input.value);
      if (!matches.length) {
        status.textContent = 'No valid structured match JSON found.';
        return;
      }
      upsertMatches(matches);
      input.value = '';
      status.textContent = `Processed ${matches.length} match event(s).`;
    };

    resetButton.onclick = () => {
      state.events = [];
      saveLiveEvents();
      recomputeAndRender();
      status.textContent = 'Cleared live matches; seed data restored.';
    };
  }

  function renderStatStrip(title, rows, keyField) {
    return `
      <div class="tr-card">
        <div class="tr-card-header">
          <h3>${title}</h3>
        </div>
        <div class="tr-table-wrap">
          <table class="tr-table">
            <thead>
              <tr><th>Player</th><th>${title}</th></tr>
            </thead>
            <tbody>
              ${rows.slice(0, 10).map(row => `<tr><td>${row.player}</td><td>${row[keyField]}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderTeamLeaderboardCardAndStats(teamRows) {
    return `
      <div class="tr-card tr-span-2">
        <div class="tr-card-header">
          <h3>Team Tables</h3>
          <span class="tr-meta">Tournament standings and raw stats</span>
        </div>
        <div class="tr-grid-two">
          <div class="tr-table-wrap">
            <table class="tr-table">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>MP</th>
                  <th>W</th>
                  <th>D</th>
                  <th>L</th>
                  <th>GF</th>
                  <th>GA</th>
                  <th>GD</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                ${[...teamRows].sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference).map(team => `
                  <tr title="${buildTeamAuditTooltip(team)}">
                    <td>${team.team}</td>
                    <td>${team.matchesPlayed}</td>
                    <td>${team.wins}</td>
                    <td>${team.draws}</td>
                    <td>${team.losses}</td>
                    <td>${team.goalsFor}</td>
                    <td>${team.goalsAgainst}</td>
                    <td>${team.goalDifference}</td>
                    <td>${team.points}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="tr-table-wrap">
            <table class="tr-table">
              <thead>
                <tr><th>Team</th><th>Halves</th><th>Passes</th><th>Possession %</th><th>Shots</th></tr>
              </thead>
              <tbody>
                ${[...teamRows].sort((a, b) => a.team.localeCompare(b.team)).map(team => `
                  <tr>
                    <td>${team.team}</td>
                    <td>${team.halvesRecorded}</td>
                    <td>${round1(team.passesPerHalf).toFixed(1)}</td>
                    <td>${round1(team.possessionPerHalf).toFixed(1)}%</td>
                    <td>${round1(team.shotsPerHalf).toFixed(1)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #tournament-ratings-root {
        margin-top: 20px;
      }
      .tr-shell {
        max-width: 1400px;
        margin: 0 auto 24px;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }
      .tr-card {
        background: rgba(37, 37, 37, 0.96);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 14px;
        padding: 14px;
        min-width: 0;
      }
      .tr-span-2 {
        grid-column: 1 / -1;
      }
      .tr-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        flex-wrap: wrap;
      }
      .tr-card-header h3 {
        margin: 0;
        color: var(--primary);
        font-size: 18px;
      }
      .tr-meta, .tr-status, .tr-legend {
        font-size: 12px;
        color: #b7c2d0;
      }
      .tr-input {
        width: 100%;
        box-sizing: border-box;
        resize: vertical;
        min-height: 160px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(26, 26, 26, 0.85);
        color: #fff;
        padding: 12px;
        font-size: 13px;
        line-height: 1.5;
        margin-bottom: 12px;
      }
      .tr-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .tr-button {
        border: 1px solid var(--primary);
        background: var(--primary);
        color: #fff;
        padding: 10px 14px;
        border-radius: 10px;
        font-weight: 700;
        cursor: pointer;
      }
      .tr-button.tr-secondary {
        background: transparent;
        color: var(--text);
      }
      .tr-table-wrap {
        overflow-x: auto;
      }
      .tr-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 0;
        font-size: 13px;
      }
      .tr-table th, .tr-table td {
        border-bottom: 1px solid rgba(255,255,255,0.08);
        padding: 8px 10px;
        text-align: left;
        white-space: nowrap;
      }
      .tr-grid-two {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .tr-team-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
      }
      .tr-team-card {
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px;
        background: rgba(255,255,255,0.03);
        padding: 10px;
      }
      .tr-team-title {
        font-weight: 800;
        color: var(--primary);
        margin-bottom: 8px;
      }
      .tr-team-list {
        display: grid;
        gap: 6px;
      }
      .tr-player-line {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        align-items: center;
        padding: 6px 8px;
        border-radius: 8px;
        background: rgba(255,255,255,0.03);
      }
      .tr-tag-new {
        display: inline-block;
        margin-left: 6px;
        padding: 1px 6px;
        border-radius: 999px;
        font-size: 10px;
        font-weight: 800;
        background: rgba(245, 158, 11, 0.18);
        border: 1px solid rgba(245, 158, 11, 0.35);
        color: #fde68a;
      }
      .tr-review-list {
        display: grid;
        gap: 8px;
      }
      .tr-review-item {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        padding: 8px 10px;
        border-radius: 8px;
        background: rgba(255,255,255,0.03);
      }
      .tr-legend {
        margin-bottom: 12px;
      }
      @media (max-width: 1100px) {
        .tr-shell, .tr-grid-two {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  async function loadSeed() {
    const response = await fetch(INITIAL_STATE_URL, { cache: 'no-store' });
    const seed = await response.json();
    return seed;
  }

  function recomputeAndRender() {
    if (!state.seed) return;
    state.computed = computeTournament(state.seed);
    renderRoot();
  }

  async function init() {
    injectStyles();
    const seed = await loadSeed();
    mergeSeedToLive(seed);
    state.currentCurrentState = seed.currentState || {};
    state.events = loadLiveEvents();

    const originalRenderWorldCupTab = window.renderWorldCupTab;
    if (typeof originalRenderWorldCupTab === 'function') {
      window.renderWorldCupTab = function patchedRenderWorldCupTab() {
        originalRenderWorldCupTab();
        if (!document.getElementById('tournament-ratings-root')) {
          const host = document.getElementById('world-cup-container');
          if (host) {
            const root = document.createElement('div');
            root.id = 'tournament-ratings-root';
            host.appendChild(root);
          }
        }
        recomputeAndRender();
      };
    }

    const tab = Array.from(document.querySelectorAll('.tab')).find(item => item.getAttribute('data-tab') === 'world-cup');
    if (tab) {
      tab.addEventListener('click', () => {
        setTimeout(() => {
          if (typeof window.renderWorldCupTab === 'function') {
            window.renderWorldCupTab();
          } else {
            recomputeAndRender();
          }
        }, 0);
      });
    }

    if (typeof window.renderWorldCupTab === 'function') {
      window.renderWorldCupTab();
    } else {
      const host = document.getElementById('world-cup-container');
      if (host) {
        const root = document.createElement('div');
        root.id = 'tournament-ratings-root';
        host.appendChild(root);
      }
      recomputeAndRender();
    }
  }

  init().catch(error => {
    console.error('Tournament rating system failed to initialize', error);
  });
})();
