(() => {
  const SEED_URL = 'tournament_structured_data.json';
  const LIVE_EVENTS_KEY = 'ldc-rs-legends-tournament-live-events';
  const SOFT_CAP_RATING = 90;
  const MAX_DISPLAY_RATING = 95;
  const ELITE_CURVE_RATE = 0.12;
  const TEAM_COMPETITIVE_SPREAD = 0.95;
  const PLAYER_COMPETITIVE_SPREAD = 0.62;
  const ACTIVE_TEAM_RATING_FLOOR = 75;
  const TEAM_BASELINE_RATING = 75;
  const TEAM_MATCHES_FOR_FULL_CONFIDENCE = 4;
  const TEAM_CONFIDENCE_FLOOR = 0.6;
  const TEAM_CONFIDENCE_SPAN = 0.4;

  const TEAM_STRENGTHS = {
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
      goalDifferencePerGame: 2,
      outcomeVsExpectationPerGame: 12,
      averageTeamScoreDelta: 1.2,
      shotsPerHalfDelta: 0.7,
      possessionPerHalfDelta: 0.45,
      passesPerHalfDelta: 0.35
    }
  };

  const state = {
    seed: null,
    roster: new Map(),
    aliases: new Map(),
    goalkeepers: new Set(),
    results: null
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

  function weightedAverage(items) {
    const totals = items.reduce((accumulator, item) => {
      accumulator.weight += item.weight;
      accumulator.value += item.value * item.weight;
      return accumulator;
    }, { weight: 0, value: 0 });

    return totals.weight > 0 ? (totals.value / totals.weight) : 0;
  }

  function buildAliasMap() {
    const map = new Map();
    const aliases = {
      luisdiaz: 'LuisDiaz',
      iiMbappeii: 'Mbappe',
      mbappe: 'Mbappe',
      slimani: 'Slimani',
      limani: 'Slimani',
      drku: 'Drkuu',
      drkuu: 'Drkuu',
      triplag: 'Triple G',
      sergioramoss: 'Sergio Ramos',
      sergioramos: 'Sergio Ramos',
      v4ks: 'V4ks',
      vaks: 'V4ks',
      wpi: 'Wakanda',
      w: 'Wakanda',
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
      kak: 'Kaka',
      praetor: 'Praetor',
      'praetor.': 'Praetor',
      vonmacron: 'Von',
      sandiego: 'Nosso',
      bern: 'Berniee',
      col268: 'Col',
      maksredondo: 'MaksLuburic',
      jesus: 'Jesus',
      shush: 'Shush',
      nxen: 'Nxen',
      arshahaxballradarcom: 'Arshavin',
      kiyoharusaeyama: 'Blazing',
      mohamedsalah: 'ZaQu',
      burakt09: 'Burak',
      perkzbutdiffpcandlag: 'Perkz',
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

  function matchKey(match) {
    return `${toNumber(match.matchNumber)}-${toNumber(match.halfNumber)}`;
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

    const teamName = side === 'A' ? match.teamA : match.teamB;
    const opponent = side === 'A' ? match.teamB : match.teamA;
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
    const mvpMap = new Map();
    (state.seed?.currentState?.mvpLeaderboard || []).forEach(item => {
      mvpMap.set(normalizeName(item.player), toNumber(item.mvps));
    });

    matches.forEach(match => {
      applyKnownCorrection(match);

      const teamA = match.teamA;
      const teamB = match.teamB;
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
        const playerTeam = playerEntry.team || null;
        const player = ensurePlayerRecord(playerMap, canonical, playerTeam);
        const norm = normalizeName(canonical);
        if (seen.has(`${norm}-${playerTeam}`)) {
          return;
        }
        seen.add(`${norm}-${playerTeam}`);

        const goals = toNumber(playerEntry.goals) + (goalByPlayer.get(canonical) || 0);
        const assists = toNumber(playerEntry.assists) + (assistByPlayer.get(canonical) || 0);
        const shots = toNumber(playerEntry.shots);
        const passes = toNumber(playerEntry.passes);
        const kicks = toNumber(playerEntry.kicks);
        const ownGoals = toNumber(playerEntry.ownGoals) + (ownGoalByPlayer.get(canonical) || 0);
        const cleanSheet = (normalizeName(playerTeam) === normalizeName(teamA) && scoreB === 0)
          || (normalizeName(playerTeam) === normalizeName(teamB) && scoreA === 0) ? 1 : 0;

        const teamScoreContext = normalizeName(playerTeam) === normalizeName(teamA) ? scoreTeamA : scoreTeamB;
        const mvpCount = mvpMap.get(norm) || 0;
        const mvpBonus = mvpCount > 0 ? (WEIGHTS.player.mvpBase + ((teamScoreContext - 50) * WEIGHTS.player.mvpTeamScoreFactor)) : 0;

        let rating = teamScoreContext
          + (WEIGHTS.player.goals * goals)
          + (WEIGHTS.player.assists * assists)
          + (WEIGHTS.player.shots * shots)
          + (WEIGHTS.player.passes * passes)
          + (WEIGHTS.player.kicks * kicks)
          + (WEIGHTS.player.cleanSheets * cleanSheet)
          + mvpBonus
          - (WEIGHTS.player.ownGoals * ownGoals);

        if (state.goalkeepers.has(norm)) {
          rating += WEIGHTS.player.goalkeeperCleanSheetBonus * cleanSheet;
        }

        player.matchesPlayed += 1;
        player.matchRatings.push(clamp(rating, 0, MAX_DISPLAY_RATING));
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

      const resultScore = clamp(35 + (pointsPerGame * 22), 0, 100);
      const expectationScore = clamp(50 + (outcomeVsExpectationPerGame * 30), 0, 100);
      const scheduleScore = clamp(35 + ((avgOpponentStrength / Math.max(maxObservedStrength, 0.001)) * 65), 0, 100);
      const goalDifferenceScore = clamp(50 + (gdPerGame * 14), 0, 100);
      const statsScore = clamp(
        50
          + ((shotsPerHalf - avgShots) * 6)
          + ((possessionPerHalf - 50) * 0.6)
          + ((passesPerHalf - avgPasses) * 0.35),
        0,
        100
      );

      const weightedComposite = weightedAverage([
        { value: resultScore, weight: 0.40 },
        { value: expectationScore, weight: 0.28 },
        { value: scheduleScore, weight: 0.16 },
        { value: goalDifferenceScore, weight: 0.10 },
        { value: statsScore, weight: 0.06 }
      ]);

      const confidence = getConfidenceFromMatches(team.matchesPlayed);
      const blendedRating = TEAM_BASELINE_RATING + ((weightedComposite - TEAM_BASELINE_RATING) * confidence);

      team.rawTeamRating = blendedRating;
    });

    const meanRawTeamRating = teamRows.length
      ? (teamRows.reduce((sum, team) => sum + team.rawTeamRating, 0) / teamRows.length)
      : WEIGHTS.tournament.base;

    teamRows.forEach(team => {
      const spreadAdjustedTeamRating = compressTowardMean(team.rawTeamRating, meanRawTeamRating, TEAM_COMPETITIVE_SPREAD);
      const curvedTeamRating = applySoftCapCurve(spreadAdjustedTeamRating);
      const floorAdjustedTeamRating = team.matchesPlayed > 0
        ? Math.max(ACTIVE_TEAM_RATING_FLOOR, curvedTeamRating)
        : curvedTeamRating;
      team.teamRating = toRating1(floorAdjustedTeamRating);
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
      player.tournamentRating = toRating1(applySoftCapCurve(spreadAdjustedPlayerRating));
    });

    state.results = {
      playersTop10: playerRows.sort((a, b) => b.tournamentRating - a.tournamentRating).slice(0, 10),
      teamsTop10: teamRows.sort((a, b) => b.teamRating - a.teamRating).slice(0, 10)
    };
  }

  function renderInlineCards() {
    const statsRow = document.querySelector('#world-cup-container .world-cup-stats-row');
    if (!statsRow || !state.results) return;

    const players = state.results.playersTop10;
    const teams = state.results.teamsTop10;

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
      <h2 class="world-cup-title">Top 10 Players</h2>
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

    teamsCard.innerHTML = `
      <h2 class="world-cup-title">Top 10 Teams</h2>
      <div class="world-cup-table-wrap">
        <table class="world-cup-stat-table">
          <thead>
            <tr><th>Team</th><th>Rating</th></tr>
          </thead>
          <tbody>
            ${teams.map((team) => `<tr><td>${team.team}</td><td>${round1(team.teamRating).toFixed(1)}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Keep these two cards at the end of the stats row:
    // Goals, Assists, MVPs, Clean Sheets, Own Goals, Top 10 Players, Top 10 Teams
    statsRow.appendChild(playersCard);
    statsRow.appendChild(teamsCard);
  }

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #world-cup-top10-players-card,
      #world-cup-top10-teams-card {
        min-width: 0;
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


