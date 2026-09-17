import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDirectory, '..', '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const leagueScript = fs.readFileSync(path.join(root, 'ldc-rs-league-season-1.js'), 'utf8');

const context = {
    document: { getElementById: () => null }
};
vm.createContext(context);
vm.runInContext(`${leagueScript}\nthis.season = ldcRsLeagueSeason1; this.modelVersions = { team: LEAGUE_TEAM_POWER_MODEL_VERSION, player: LEAGUE_PLAYER_POWER_MODEL_VERSION }; this.calculate = calculateLdcRsLeagueStandings; this.teamHistory = calculateLeagueTeamPowerHistory; this.teamPower = calculateLeagueTeamPowerRatings; this.playerPower = calculateLeaguePlayerPowerRankings; this.playerMatchPower = calculateLeaguePlayerMatchPower; this.playerConfidence = calculateLeaguePlayerPowerConfidence; this.opponentMultiplier = calculateLeagueOpponentMultiplier; this.matchPlayerTotals = calculateLeagueMatchPlayerTotals; this.seasonPlayerTotals = calculateLeagueSeasonPlayerTotals; this.leaderboardRows = calculateLeagueSeasonLeaderboardRows; this.leaderboardRowsFromTotals = calculateLeagueLeaderboardRowsFromTotals; this.leaderboardMedals = calculateLeagueLeaderboardMedals; this.matchTeamTotals = calculateLeagueMatchTeamTotals; this.participation = deriveLeagueMatchParticipation; this.matchEvents = deriveLeagueMatchEvents; this.statisticsRows = getLeagueStatisticsRows; this.formatClock = formatLeagueClock; this.renderResults = renderLdcRsLeagueResults; this.renderEvents = renderLeagueEventTimeline; this.renderLeaderboard = renderLeagueSeasonLeaderboard; this.renderTeam = renderLdcRsLeagueTeam; this.renderPlayerPower = renderLeaguePlayerPowerRankings; this.expandedMatches = leagueExpandedMatches; this.matchModes = leagueMatchDetailModes; this.statisticsPeriods = leagueStatisticsPeriods; this.setLeaderboardMode = (metric, rate) => { leagueSeasonStatMode = metric; leagueSeasonRateMode = rate; };`, context);

const season = context.season;
assert.equal(season.title, 'LDC RS League Season 1');
assert.deepEqual(JSON.parse(JSON.stringify(season.format)), {
    type: 'double-round-robin',
    teamCount: 6,
    matchesPerTeam: 10,
    totalMatches: 30
});
assert.equal(season.teams.length, 6);
assert.equal(season.matches.length, 1);

const expectedRosters = {
    'Baguette Z Apex': ['Spero', 'V4KS', 'luur', 'zenix', 'oskar', 'Nympex', 'amaanofc', 'evilpedri', 'x', 'myrulez', 'Faya', 'Shield', 'Kaka'],
    'HAX UNITED': ['GK', 'Braga.', 'Misimaro', 'Pedri.', 'GGG', 'A7mdBibo', 'Arshavin', 'Blimpus', 'dierfetje', 'bananajoe', 'ShadiOzz', 'Szcesny'],
    'OG FC': ['𝐌𝐨𝐬𝐭𝐚𝐟𝐚 𝐙𝐢𝐤𝐨', 'Mbappe', 'Nistel', 'Nijad', 'MeeRo', 'Dynaxz', 'Lookman', 'Brutus', 'MaksLuburic', 'Olise', 'saygex', 'Wizop', 'ToughBaby'],
    'X TO WIN 2': ['Drkuu', 'Ibrahim', 'SamueleRicci', 'Berbatov', 'Naeh', 'SVimes', 'maccy', 'atrocity exhibition', 'elex', 'mitrita KING', 'Wakanda', 'tsukuyomi.', 'wee', 'Johnny Sins'],
    HUQQA: ['Menéur', 'Lena', 'Ollhurse', 'Perkz', 'Mattéo Guendouzi', 'unknown-user', 'barn', 'Razor', 'Grmii', 'Himothy', 'Kimmich', 'whân'],
    'ROONEY TUNES': ['KK', 'MRN', 'click', 'Vonmacron', 'Antax', 'Minicostaud', 'Kahn', 'Swajin', 'ilaola', 'fkfk', '1m bad', 'FITOCHI', 'Luqman', 'JV']
};

season.teams.forEach((team) => {
    assert.deepEqual(JSON.parse(JSON.stringify(team.roster)), expectedRosters[team.name]);
    [team.owner, team.captain, team.coCaptain, ...team.roster].forEach((name) => {
        assert.equal(name.includes('@'), false, `${team.name} contains a raw Discord mention`);
    });
    assert.match(team.kit.primary, /^#[0-9a-f]{6}$/i);
    assert.match(team.kit.secondary, /^#[0-9a-f]{6}$/i);
    assert.match(team.image, /^league-assets\/[a-z0-9-]+\.webp$/);
    assert.equal(fs.existsSync(path.join(root, team.image)), true, `${team.name} local image exists`);
});
assert.equal(season.teams.find((team) => team.name === 'X TO WIN 2').roster.length, 14);
const rooneyTunes = season.teams.find((team) => team.id === 'rooney-tunes');
assert.equal(rooneyTunes.roster.length, 14);
assert.equal(new Set(rooneyTunes.roster).size, 14);
assert.equal(rooneyTunes.roster.includes('sergicanos'), false);
['FITOCHI', 'Luqman', 'JV'].forEach((player) => assert.equal(rooneyTunes.roster.includes(player), true));
const rooneyRosterMarkup = context.renderTeam(rooneyTunes);
assert.match(rooneyRosterMarkup, /14 players/);
assert.doesNotMatch(rooneyRosterMarkup, /sergicanos/);
['FITOCHI', 'Luqman', 'JV'].forEach((player) => assert.match(rooneyRosterMarkup, new RegExp(`<li>${player}<\\/li>`)));
assert.equal(leagueScript.includes("'Boat'"), false);
assert.deepEqual(JSON.parse(JSON.stringify(season.teams.find((team) => team.id === 'x-to-win-2').kit)), {
    primary: '#080808', secondary: '#d4af37', accent: '#d4af37', pattern: 'pinstripes', source: 'configured-team-kit'
});
assert.deepEqual(JSON.parse(JSON.stringify(season.powerRatingConfig)), {
    team: {
        modelVersion: 1,
        kFactor: 32,
        expectationDivisor: 400,
        marginStep: 0.2,
        marginCap: 4,
        startingRatings: {
            'x-to-win-2': 1581,
            'baguette-z-apex': 1545,
            huqqa: 1519,
            'og-fc': 1480,
            'hax-united': 1471,
            'rooney-tunes': 1446
        }
    },
    player: {
        modelVersion: 1,
        goal: 5,
        assist: 3,
        mvp: 4,
        cleanSheetHalf: 1.5,
        ownGoal: -2,
        shotOnGoal: 0.25,
        pass: 0.02,
        kick: 0.005,
        teamWinAppearance: 1,
        opponentAdjustment: { baseline: 1500, divisor: 1000, minimum: 0.85, maximum: 1.15 },
        confidence: { lowAppearances: 1, mediumAppearances: 3 }
    }
});
assert.deepEqual(JSON.parse(JSON.stringify(context.modelVersions)), { team: 1, player: 1 });
assert.doesNotMatch(leagueScript, /(player|ability|roster)Tier\s*[:=]/i);
assert.doesNotMatch(leagueScript, /tierLabel\s*[:=]/i);

const match = season.matches[0];
assert.equal(match.id, 'match-1-x-to-win-2-v-rooney-tunes');
assert.equal(match.homeTeamId, 'x-to-win-2');
assert.equal(match.awayTeamId, 'rooney-tunes');
assert.equal(match.homeGoals, 5);
assert.equal(match.awayGoals, 0);
assert.equal(match.mvp, 'Drkuu');
assert.deepEqual(JSON.parse(JSON.stringify(match.recording)), {
    provider: 'youtube',
    url: 'https://www.youtube.com/watch?v=92OWXudDb7Q',
    videoId: '92OWXudDb7Q',
    thumbnail: 'league-assets/xtw2-rooney-match-1-thumbnail.jpg'
});
assert.equal(fs.existsSync(path.join(root, match.recording.thumbnail)), true);
assert.deepEqual(JSON.parse(JSON.stringify(match.cleanSheetHalves)), [
    { player: 'atrocity exhibition', value: 1 },
    { player: 'Naeh', value: 1 }
]);
assert.deepEqual(JSON.parse(JSON.stringify(match.scoringEvents.map(({ score, type, player, assist }) => ({ score, type, player, assist })))), [
    { score: '1–0', type: 'own-goal', player: 'ilaola', assist: null },
    { score: '2–0', type: 'goal', player: 'Berbatov', assist: 'atrocity exhibition' },
    { score: '3–0', type: 'goal', player: 'Berbatov', assist: 'elex' },
    { score: '4–0', type: 'goal', player: 'Drkuu', assist: 'Berbatov' },
    { score: '5–0', type: 'goal', player: 'Naeh', assist: 'Drkuu' }
]);
const firstWindowTiming = { type: 'observed-interval', observedStart: 210.6, observedEnd: 256.367, display: '03:30.600–04:16.367 (1H)', timelineDisplay: '3:31–4:16 1H', estimated: true };
const thirdGoalWindowTiming = { type: 'observed-interval', observedStart: 372.533, observedEnd: 409.45, display: '06:12.533–06:49.450 (1H)', timelineDisplay: '6:13–6:49 1H', estimated: true };
assert.deepEqual(JSON.parse(JSON.stringify(match.scoringEvents.map((event) => event.timing))), [
    { type: 'exact', seconds: 211, display: '03:31 (1H)', timelineDisplay: '3:31 1H' },
    { type: 'exact', seconds: 225, display: '03:45 (1H)', timelineDisplay: '3:45 1H' },
    { type: 'exact', seconds: 392, display: '06:32 (1H)', timelineDisplay: '6:32 1H' },
    { type: 'exact', seconds: 87, display: '01:27 (2H)', timelineDisplay: '1:27 2H' },
    { type: 'exact', seconds: 117, display: '01:57 (2H)', timelineDisplay: '1:57 2H' }
]);
assert.equal(match.scoringEvents[0].player, 'ilaola');
assert.equal(match.scoringEvents[0].type, 'own-goal');
assert.equal(match.scoringEvents[0].assist, null);
assert.equal(match.scoringEvents.some((event) => event.player === 'maccy' && event.type === 'goal'), false);
assert.equal(match.scoringEvents.some((event) => event.score === '1–0' && event.assist === 'Drkuu'), false);
assert.equal(match.scoringEvents[0].attribution, 'manual-adjudication-overrides-automatic-source');
const checkpoint = (display) => match.timingEvidence.firstHalfCheckpoints.find((entry) => entry.display === display);
assert.deepEqual(JSON.parse(JSON.stringify(checkpoint('03:30.600'))), { observedAt: 210.6, display: '03:30.600', homeGoals: 0, awayGoals: 0 });
assert.deepEqual(JSON.parse(JSON.stringify(checkpoint('04:16.367'))), { observedAt: 256.367, display: '04:16.367', homeGoals: 2, awayGoals: 0 });
assert.deepEqual(JSON.parse(JSON.stringify(checkpoint('06:12.533'))), { observedAt: 372.533, display: '06:12.533', homeGoals: 2, awayGoals: 0 });
assert.deepEqual(JSON.parse(JSON.stringify(checkpoint('06:49.450'))), { observedAt: 409.45, display: '06:49.450', homeGoals: 3, awayGoals: 0 });
assert.deepEqual(JSON.parse(JSON.stringify(checkpoint('07:46.467'))), { observedAt: 466.467, display: '07:46.467', homeGoals: 3, awayGoals: 0 });
assert.equal(checkpoint('~01:30').scoreVisible, false);
const secondHalfCheckpoint = (display) => match.timingEvidence.secondHalfCheckpoints.find((entry) => entry.display === display);
assert.equal(secondHalfCheckpoint('00:35.267').homeGoals, 0);
assert.equal(secondHalfCheckpoint('00:35.267').awayGoals, 0);
assert.equal(secondHalfCheckpoint('00:35.267').visible['x-to-win-2'].includes('maccy'), true);
assert.equal(secondHalfCheckpoint('00:35.267').visible['x-to-win-2'].includes('Naeh'), false);
assert.equal(secondHalfCheckpoint('01:56.450').homeGoals, 1);
assert.equal(secondHalfCheckpoint('01:56.450').awayGoals, 0);
assert.deepEqual(JSON.parse(JSON.stringify(match.duration)), {
    totalSeconds: 588,
    endTimeKnown: true,
    halves: [
        { half: 1, seconds: 471, display: '7:51', endTimeKnown: true },
        { half: 2, seconds: 117, display: '1:57', endTimeKnown: true }
    ]
});
assert.deepEqual(JSON.parse(JSON.stringify(match.conclusion)), {
    type: 'mercy-rule', half: 2, atSeconds: 117, display: '1:57 2H', score: '5–0', triggeringPlayer: 'Naeh'
});
assert.equal(match.scoringEvents[4].timing.seconds, match.conclusion.atSeconds);
assert.equal(match.duration.halves[1].seconds, match.conclusion.atSeconds);
assert.deepEqual(JSON.parse(JSON.stringify(match.lineups.firstHalf)), {
    'x-to-win-2': ['Naeh', 'atrocity exhibition', 'elex', 'Drkuu', 'maccy', 'Berbatov'],
    'rooney-tunes': ['KK', 'Vonmacron', 'MRN', '1m bad', 'fkfk', 'ilaola']
});
assert.deepEqual(JSON.parse(JSON.stringify(match.lineups.secondHalf)), {
    'x-to-win-2': ['atrocity exhibition', 'elex', 'maccy', 'Drkuu', 'Wakanda', 'Berbatov'],
    'rooney-tunes': ['KK', 'Vonmacron', 'click', 'ilaola', 'MRN', '1m bad']
});
assert.equal(match.substitutions.length, 5);
assert.equal(match.substitutions.filter((substitution) => substitution.timing.type === 'observed-interval').length, 3);
assert.equal(match.substitutions.filter((substitution) => substitution.timing.type === 'halftime').length, 2);
assert.deepEqual(JSON.parse(JSON.stringify(match.substitutions.find((substitution) => substitution.playerIn === 'click').timing)), firstWindowTiming);
assert.deepEqual(JSON.parse(JSON.stringify(match.substitutions.find((substitution) => substitution.playerIn === 'Wakanda').timing)), thirdGoalWindowTiming);
assert.deepEqual(JSON.parse(JSON.stringify(match.goalkeepers)), {
    firstHalf: { 'x-to-win-2': 'Naeh', 'rooney-tunes': 'KK' },
    secondHalf: { 'x-to-win-2': 'atrocity exhibition', 'rooney-tunes': 'KK' }
});
assert.deepEqual(JSON.parse(JSON.stringify(match.goalkeeperAssignments)), [
    { player: 'Naeh', teamId: 'x-to-win-2', half: 1, status: 'goalkeeper', cleanSheetEligible: true },
    { player: 'atrocity exhibition', teamId: 'x-to-win-2', half: 2, status: 'goalkeeper', cleanSheetEligible: true },
    { player: 'KK', teamId: 'rooney-tunes', half: 1, status: 'goalkeeper', cleanSheetEligible: true },
    { player: 'KK', teamId: 'rooney-tunes', half: 2, status: 'goalkeeper', cleanSheetEligible: true }
]);

const events = context.matchEvents(match);
assert.equal(events.length, match.scoringEvents.length + match.substitutions.length);
assert.equal(JSON.stringify(context.matchEvents(match)), JSON.stringify(events));
assert.equal(events.every((event, index) => index === 0 || events[index - 1].sortValue >= event.sortValue), true);
assert.equal(events.filter((event) => ['goal', 'own-goal'].includes(event.eventType)).length, 5);
assert.equal(events.filter((event) => ['substitution', 'halftime-substitution'].includes(event.eventType)).length, 5);
assert.equal(events.find((event) => event.eventType === 'own-goal').player, 'ilaola');
assert.match(events.find((event) => event.eventType === 'substitution' && event.playerIn === 'Naeh').displayTime, /^1:05–1:36 2H$/);
assert.match(events.find((event) => event.eventType === 'substitution' && event.playerIn === 'Naeh').detailTime, /^Observed 01:05–01:36 2H$/);
const exactGoalEvents = events.filter((event) => ['goal', 'own-goal'].includes(event.eventType));
assert.equal(exactGoalEvents.every((event) => event.sortBasis === 'exact-match-clock' && event.timingUncertain === false), true);
assert.deepEqual(JSON.parse(JSON.stringify(Object.fromEntries(exactGoalEvents.map((event) => [event.score, event.displayTime])))), {
    '5–0': '1:57 2H', '4–0': '1:27 2H', '3–0': '6:32 1H', '2–0': '3:45 1H', '1–0': '3:31 1H'
});
const lateNaehGoal = exactGoalEvents.find((event) => event.player === 'Naeh');
assert.equal(lateNaehGoal.mercyRuleMatchEnd, true);
assert.equal(lateNaehGoal.sortValue, match.duration.totalSeconds);
const firstWindowEvents = events.filter((event) => event.groupKey === '1:210.6:256.367');
assert.deepEqual(JSON.parse(JSON.stringify(firstWindowEvents.map((event) => event.eventType))), ['substitution']);
assert.deepEqual(JSON.parse(JSON.stringify([...new Set(firstWindowEvents.map((event) => event.sortValue))])), [(210.6 + 256.367) / 2]);
assert.equal(firstWindowEvents.every((event) => event.timingUncertain && event.sortBasis === 'shared-observed-range'), true);
assert.equal(firstWindowEvents.find((event) => event.eventType === 'substitution').playerIn, 'click');
const laterWindowEvents = events.filter((event) => event.groupKey === '1:372.533:409.45');
assert.deepEqual(JSON.parse(JSON.stringify(laterWindowEvents.map((event) => event.eventType))), ['substitution']);
assert.deepEqual(JSON.parse(JSON.stringify([...new Set(laterWindowEvents.map((event) => event.sortValue))])), [(372.533 + 409.45) / 2]);
assert.equal(laterWindowEvents.every((event) => event.timingUncertain && event.sortBasis === 'shared-observed-range'), true);
assert.equal(laterWindowEvents.find((event) => event.eventType === 'substitution').playerIn, 'Wakanda');
const halftimeIndexes = events.map((event, index) => event.eventType === 'halftime-substitution' ? index : -1).filter((index) => index >= 0);
const lastSecondHalfIndex = Math.max(...events.map((event, index) => event.half === 2 ? index : -1));
const firstFirstHalfIndex = events.findIndex((event) => event.half === 1);
assert.equal(halftimeIndexes.every((index) => index > lastSecondHalfIndex && index < firstFirstHalfIndex), true);
assert.equal(events.findIndex((event) => event.playerIn === 'Wakanda') < events.findIndex((event) => event.eventType === 'own-goal'), true);
assert.equal(events.findIndex((event) => event.eventType === 'goal' && event.player === 'Naeh') < events.findIndex((event) => event.playerIn === 'Naeh'), true);

const standings = context.calculate(season);
assert.equal(standings.length, 6);
assert.equal(standings[0].team, 'X TO WIN 2');
assert.deepEqual(
    JSON.parse(JSON.stringify(Object.fromEntries(['P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts'].map((key) => [key, standings[0][key]])))),
    { P: 1, W: 1, D: 0, L: 0, GF: 5, GA: 0, GD: 5, Pts: 3 }
);
const rooneyStanding = standings.find((row) => row.team === 'ROONEY TUNES');
assert.deepEqual(
    JSON.parse(JSON.stringify(Object.fromEntries(['P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts'].map((key) => [key, rooneyStanding[key]])))),
    { P: 1, W: 0, D: 0, L: 1, GF: 0, GA: 5, GD: -5, Pts: 0 }
);
standings.filter((row) => !['X TO WIN 2', 'ROONEY TUNES'].includes(row.team)).forEach((row) => {
    ['P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts'].forEach((key) => assert.equal(row[key], 0));
});

assert.deepEqual(JSON.parse(JSON.stringify(context.matchTeamTotals(match, 'x-to-win-2'))), { kicks: 187, passes: 101, shotsOnGoal: 13 });
assert.deepEqual(JSON.parse(JSON.stringify(context.matchTeamTotals(match, 'rooney-tunes'))), { kicks: 119, passes: 36, shotsOnGoal: 0 });

const playerTotals = context.matchPlayerTotals(season, match);
const stat = (player) => playerTotals.find((row) => row.player === player);
['FITOCHI', 'Luqman', 'JV'].forEach((player) => {
    assert.equal(stat(player), undefined, `${player} has no fabricated Match 1 statistics`);
    assert.equal(context.participation(match).some((row) => row.player === player), false, `${player} has no Match 1 appearance`);
    assert.equal(match.positionStints['rooney-tunes'].some((row) => row.player === player), false, `${player} has no Match 1 position`);
    assert.equal(match.scoringEvents.some((event) => event.player === player || event.assist === player), false, `${player} has no Match 1 event`);
});
const playerKeys = ['kicks', 'passes', 'shotsOnGoal', 'goals', 'assists', 'ownGoals', 'mvps', 'cleanSheetHalves'];
const expectedPlayerTotals = {
    maccy: [26, 17, 5, 0, 0, 0, 0, 0],
    Berbatov: [20, 8, 3, 2, 1, 0, 0, 0],
    'atrocity exhibition': [37, 16, 2, 0, 1, 0, 0, 1],
    Drkuu: [39, 22, 1, 1, 1, 0, 1, 0],
    elex: [39, 22, 0, 0, 1, 0, 0, 0],
    Naeh: [16, 9, 2, 1, 0, 0, 0, 1],
    Wakanda: [10, 7, 0, 0, 0, 0, 0, 0],
    KK: [20, 5, 0, 0, 0, 0, 0, 0],
    click: [11, 6, 0, 0, 0, 0, 0, 0],
    fkfk: [14, 6, 0, 0, 0, 0, 0, 0],
    '1m bad': [17, 7, 0, 0, 0, 0, 0, 0],
    ilaola: [10, 4, 0, 0, 0, 1, 0, 0],
    MRN: [24, 2, 0, 0, 0, 0, 0, 0],
    Vonmacron: [23, 6, 0, 0, 0, 0, 0, 0]
};
Object.entries(expectedPlayerTotals).forEach(([player, values]) => {
    const expected = Object.fromEntries(playerKeys.map((key, index) => [key, values[index]]));
    const actual = Object.fromEntries(playerKeys.map((key) => [key, stat(player)[key]]));
    assert.deepEqual(JSON.parse(JSON.stringify(actual)), expected, `${player} totals`);
});
assert.deepEqual(JSON.parse(JSON.stringify({ clean: stat('Naeh').cleanSheetHalves, gk: stat('Naeh').goalkeeperHalvesPlayed })), { clean: 1, gk: 1 });
assert.deepEqual(JSON.parse(JSON.stringify({ clean: stat('atrocity exhibition').cleanSheetHalves, gk: stat('atrocity exhibition').goalkeeperHalvesPlayed })), { clean: 1, gk: 1 });
assert.deepEqual(JSON.parse(JSON.stringify({ clean: stat('KK').cleanSheetHalves, gk: stat('KK').goalkeeperHalvesPlayed })), { clean: 0, gk: 2 });

const teamPower = context.teamPower(season);
assert.deepEqual(JSON.parse(JSON.stringify(teamPower.map((row) => row.team))), ['X TO WIN 2', 'Baguette Z Apex', 'HUQQA', 'OG FC', 'HAX UNITED', 'ROONEY TUNES']);
const teamPowerById = new Map(teamPower.map((row) => [row.teamId, row]));
const startingRatings = season.powerRatingConfig.team.startingRatings;
const expectedXtw = 1 / (1 + (10 ** ((startingRatings['rooney-tunes'] - startingRatings['x-to-win-2']) / season.powerRatingConfig.team.expectationDivisor)));
const expectedChange = 32 * 1.8 * (1 - expectedXtw);
assert.equal(Math.abs(teamPowerById.get('x-to-win-2').rating - (startingRatings['x-to-win-2'] + expectedChange)) < 1e-9, true);
assert.equal(Math.abs(teamPowerById.get('rooney-tunes').rating - (startingRatings['rooney-tunes'] - expectedChange)) < 1e-9, true);
assert.equal(teamPowerById.get('x-to-win-2').movement > 0, true);
assert.equal(teamPowerById.get('rooney-tunes').movement < 0, true);
['baguette-z-apex', 'huqqa', 'og-fc', 'hax-united'].forEach((teamId) => {
    const row = teamPowerById.get(teamId);
    assert.equal(row.rating, startingRatings[teamId]);
    assert.equal(row.movement, 0);
    assert.equal(row.played, 0);
});

const teamHistory = context.teamHistory(season);
const firstSnapshot = teamHistory.preMatchRatings.get(match.id);
assert.deepEqual(JSON.parse(JSON.stringify(firstSnapshot)), {
    matchId: match.id,
    chronologicalIndex: 0,
    homePreMatchRating: 1581,
    awayPreMatchRating: 1446,
    homeCompletedMatches: 0,
    awayCompletedMatches: 0
});
const seasonWithLaterResult = {
    ...season,
    matches: [...season.matches, {
        id: 'later-rating-only-result',
        homeTeamId: 'rooney-tunes',
        awayTeamId: 'x-to-win-2',
        homeGoals: 9,
        awayGoals: 0
    }]
};
const reconstructedFirstSnapshot = context.teamHistory(seasonWithLaterResult).preMatchRatings.get(match.id);
assert.deepEqual(JSON.parse(JSON.stringify(reconstructedFirstSnapshot)), JSON.parse(JSON.stringify(firstSnapshot)));
const originalHistoricalPlayerPower = context.playerMatchPower(season, match, firstSnapshot);
const reconstructedHistoricalPlayerPower = context.playerMatchPower(season, match, reconstructedFirstSnapshot);
assert.deepEqual(
    JSON.parse(JSON.stringify(reconstructedHistoricalPlayerPower.map(({ player, score }) => ({ player, score })))),
    JSON.parse(JSON.stringify(originalHistoricalPlayerPower.map(({ player, score }) => ({ player, score }))))
);

assert.doesNotMatch(leagueScript, /prediction/i);
assert.doesNotMatch(html, /league-prediction|league-predictions/i);
assert.doesNotMatch(html, /Predictions/i);
assert.match(leagueScript, /Team Power Ratings/);
assert.equal(context.seasonPlayerTotals(season).find((row) => row.player === 'Berbatov').goalContributions, 3);

const playerPower = context.playerPower(season);
assert.equal(playerPower.length, 14);
assert.deepEqual(JSON.parse(JSON.stringify(playerPower.slice(0, 5).map((row) => row.player))), ['Berbatov', 'Drkuu', 'Naeh', 'atrocity exhibition', 'elex']);
const firstMatchPower = context.playerMatchPower(season, match, firstSnapshot);
const firstMatchPowerByPlayer = new Map(firstMatchPower.map((row) => [row.player, row]));
const rooneyMultiplier = context.opponentMultiplier(1446, season.powerRatingConfig.player.opponentAdjustment);
const expectedBerbatovPower = (2 * 5 + 1 * 3 + 1) * rooneyMultiplier + 3 * 0.25 + 8 * 0.02 + 20 * 0.005;
assert.equal(Math.abs(playerPower[0].score - expectedBerbatovPower) < 1e-9, true);
assert.equal(playerPower[0].teamWinAppearances, 1);
assert.deepEqual(JSON.parse(JSON.stringify(playerPower[0].confidence)), { level: 'Low confidence', label: 'Provisional' });
assert.deepEqual(JSON.parse(JSON.stringify(context.playerConfidence(2, season.powerRatingConfig.player.confidence))), { level: 'Medium confidence', label: 'Medium' });
assert.deepEqual(JSON.parse(JSON.stringify(context.playerConfidence(4, season.powerRatingConfig.player.confidence))), { level: 'Higher confidence', label: 'Higher' });
assert.equal(firstMatchPowerByPlayer.get('Berbatov').teamWinAppearance, 1);
assert.equal(firstMatchPowerByPlayer.has('Ibrahim'), false);
const invalidUnusedCreditMatch = { ...match, cleanSheetHalves: [...match.cleanSheetHalves, { player: 'Ibrahim', value: 1 }] };
assert.equal(context.matchPlayerTotals(season, invalidUnusedCreditMatch).some((row) => row.player === 'Ibrahim'), false);
assert.equal(firstMatchPowerByPlayer.get('KK').score, 5 * 0.02 + 20 * 0.005);
assert.equal(Math.abs(playerPower.find((row) => row.player === 'ilaola').score - -1.87) < 1e-9, true);
assert.equal(firstMatchPowerByPlayer.get('ilaola').opponentMultiplier, context.opponentMultiplier(1581, season.powerRatingConfig.player.opponentAdjustment));
const higherMvpSeason = JSON.parse(JSON.stringify(season));
higherMvpSeason.powerRatingConfig.player.mvp = 10;
const higherMvpPower = context.playerMatchPower(higherMvpSeason, higherMvpSeason.matches[0], firstSnapshot);
const drkuuBase = firstMatchPowerByPlayer.get('Drkuu').score;
const drkuuHigherMvp = higherMvpPower.find((row) => row.player === 'Drkuu').score;
assert.equal(Math.abs(drkuuHigherMvp - drkuuBase - (6 * rooneyMultiplier)) < 1e-9, true);
assert.equal(JSON.stringify(context.playerPower(season)), JSON.stringify(context.playerPower(season)));
const playerPowerMarkup = context.renderPlayerPower(season);
assert.match(playerPowerMarkup, /cumulative match score/);
assert.match(playerPowerMarkup, /Confidence/);
assert.match(playerPowerMarkup, /Provisional/);
assert.doesNotMatch(playerPowerMarkup, /per.minute/i);

const participation = context.participation(match);
const time = (player) => participation.find((row) => row.player === player);
['atrocity exhibition', 'Berbatov', 'elex', 'KK', 'Vonmacron', 'MRN', '1m bad'].forEach((player) => {
    assert.deepEqual(JSON.parse(JSON.stringify(time(player))), { player, appearances: 1, seconds: 588, estimated: false, incomplete: false });
});
assert.deepEqual(JSON.parse(JSON.stringify(time('Drkuu'))), { player: 'Drkuu', appearances: 1, seconds: 507.9915, estimated: true, incomplete: false });
assert.deepEqual(JSON.parse(JSON.stringify(time('Wakanda'))), { player: 'Wakanda', appearances: 1, seconds: 197.00850000000003, estimated: true, incomplete: false });
assert.deepEqual(JSON.parse(JSON.stringify(time('Naeh'))), { player: 'Naeh', appearances: 1, seconds: 507.5, estimated: true, incomplete: false });
assert.deepEqual(JSON.parse(JSON.stringify(time('maccy'))), { player: 'maccy', appearances: 1, seconds: 551.5, estimated: true, incomplete: false });
assert.deepEqual(JSON.parse(JSON.stringify(time('click'))), { player: 'click', appearances: 1, seconds: 354.5165, estimated: true, incomplete: false });
assert.deepEqual(JSON.parse(JSON.stringify(time('ilaola'))), { player: 'ilaola', appearances: 1, seconds: 350.4835, estimated: true, incomplete: false });
assert.deepEqual(JSON.parse(JSON.stringify(time('fkfk'))), { player: 'fkfk', appearances: 1, seconds: 471, estimated: false, incomplete: false });
assert.equal(context.formatClock(504.5, true), '~8:25');
assert.equal(context.formatClock(588, false, false), '9:48');
assert.equal(playerTotals.every((row) => row.appearances === 1), true);

const historicalPlayers = new Set(match.halves.flatMap((half) => Object.values(half.playerStats).flat().map((row) => row.player)));
match.halves.flatMap((half) => Object.values(half.playerStats).flat()).forEach((row) => assert.equal(historicalPlayers.has(row.player), true, `Missing historical player ${row.player}`));
Object.values(match.lineups).flatMap((half) => Object.values(half).flat()).forEach((player) => assert.equal(historicalPlayers.has(player), true, `Missing historical lineup player ${player}`));
match.substitutions.forEach((substitution) => {
    assert.equal(historicalPlayers.has(substitution.playerIn), true, `Missing historical substitute ${substitution.playerIn}`);
    assert.equal(historicalPlayers.has(substitution.playerOut), true, `Missing historical substituted player ${substitution.playerOut}`);
});
Object.values(match.goalkeepers).flatMap((half) => Object.values(half)).forEach((player) => assert.equal(historicalPlayers.has(player), true, `Missing historical goalkeeper ${player}`));
Object.values(match.startingLineups).flat().forEach((entry) => assert.equal(historicalPlayers.has(entry.player), true, `Missing historical starting-lineup player ${entry.player}`));
const appearingPlayersByTeam = Object.fromEntries(['x-to-win-2', 'rooney-tunes'].map((teamId) => [teamId, new Set(
    match.halves.flatMap((half) => half.playerStats[teamId].map((row) => row.player))
)]));
Object.entries(match.positionStints).forEach(([teamId, entries]) => {
    assert.deepEqual(new Set(entries.map(({ player }) => player)), appearingPlayersByTeam[teamId], `Every ${teamId} appearance has position stints`);
});
match.scoringEvents.forEach((event) => {
    assert.equal(historicalPlayers.has(event.player), true, `Missing historical scoring player ${event.player}`);
    if (event.assist) assert.equal(historicalPlayers.has(event.assist), true, `Missing historical assisting player ${event.assist}`);
});
const changedCurrentRosterSeason = {
    ...season,
    teams: season.teams.map((team) => team.id === 'rooney-tunes'
        ? { ...team, roster: team.roster.filter((player) => player !== 'click') }
        : team)
};
assert.equal(context.matchPlayerTotals(changedCurrentRosterSeason, match).find((row) => row.player === 'click').teamId, 'rooney-tunes');

assert.match(html, /data-tab="ldc-rs-league-season-1">LDC RS League Season 1</);
assert.match(html, /class="tab active" data-tab="ldc-rs-league-season-1"/);
assert.match(html, /class="tab-content active" id="ldc-rs-league-season-1-tab"/);
assert.doesNotMatch(html, /class="tab-content active" id="players-tab"/);
assert.match(html, /src="ldc-rs-league-season-1\.js"/);
assert.match(html, /\.league-power-grid/);
assert.match(html, /\.league-teams-grid/);
assert.match(html, /\.league-match-section/);
assert.match(html, /\.league-season-stats/);
assert.match(html, /\.league-match-disclosure/);
assert.match(html, /\.league-match-recording-card/);
assert.match(html, /\.league-latest-preview/);
assert.match(html, /grid-template-columns:\s*minmax\(0, 3fr\) minmax\(340px, 2fr\);\s*gap:\s*10px/);
assert.match(html, /\.league-latest-summary\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\);[\s\S]*?max-width:\s*440px/);
assert.match(html, /aspect-ratio:\s*16\s*\/\s*9/);
assert.match(html, /\.league-starting-vi-grid/);
assert.match(html, /\.league-standings-table th:not\(:first-child\)/);
assert.doesNotMatch(leagueScript, /Six teams play a double round robin/);
assert.doesNotMatch(leagueScript, /league-format-facts/);

const resultsMarkup = context.renderResults(season);
assert.match(resultsMarkup, /<details class="league-match-disclosure league-match-latest" data-match-id=/);
assert.match(resultsMarkup, /<div class="league-latest-preview">[\s\S]*?<\/details>\s*<a class="league-match-recording-card"/);
assert.doesNotMatch(resultsMarkup, /data-match-id="match-1-x-to-win-2-v-rooney-tunes" open/);
assert.match(resultsMarkup, /View full details →/);
assert.match(resultsMarkup, /<small>MVP<\/small><strong>Drkuu<\/strong>/);
assert.match(resultsMarkup, /Berbatov ×2 · Drkuu · Naeh · ilaola OG/);
assert.match(resultsMarkup, /class="league-match-recording-card" href="https:\/\/www\.youtube\.com\/watch\?v=92OWXudDb7Q" target="_blank" rel="noopener noreferrer"/);
assert.match(resultsMarkup, /src="league-assets\/xtw2-rooney-match-1-thumbnail\.jpg"[^>]*loading="lazy"/);
assert.match(resultsMarkup, /league-match-recording-play/);
assert.match(resultsMarkup, /Watch full match/);
assert.match(resultsMarkup, /Watch match recording/);
assert.doesNotMatch(resultsMarkup, /<iframe|autoplay/i);
assert.match(resultsMarkup, /<h2 class="league-starting-vi-title">Starting VI<\/h2>/);
assert.equal((resultsMarkup.match(/league-starting-vi-team/g) || []).length, 2);
assert.doesNotMatch(resultsMarkup, /league-mini-pitch|league-pitch|ATTACKING →/);
[
    ['GK', 'Naeh'],
    ['CDM', 'atrocity exhibition'],
    ['CM', 'maccy'],
    ['CM', 'Drkuu'],
    ['LW', 'elex'],
    ['ST', 'Berbatov']
].forEach(([position, player]) => {
    assert.match(resultsMarkup, new RegExp(`<li><b>${position}<\\/b><span>${player}<\\/span><\\/li>`));
});
[
    ['GK', 'KK'],
    ['CB', '1m bad'],
    ['CDM', 'MRN'],
    ['CM', 'Vonmacron'],
    ['CAM', 'fkfk'],
    ['ST', 'ilaola']
].forEach(([position, player]) => {
    assert.match(resultsMarkup, new RegExp(`<li><b>${position}<\\/b><span>${player}<\\/span><\\/li>`));
});
const supportedPositions = new Set(['GK', 'CB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST']);
Object.values(match.startingLineups).flat().forEach(({ position }) => assert.equal(supportedPositions.has(position), true));
Object.values(match.positionStints).flat().forEach(({ stints }) => stints.forEach(({ position }) => assert.equal(supportedPositions.has(position), true)));
assert.doesNotMatch(resultsMarkup, /league-latest-stats|league-latest-events/);
assert.match(resultsMarkup, /league-latest-team"><img src="league-assets\/x-to-win-2\.webp"/);
[...resultsMarkup.matchAll(/<summary>([\s\S]*?)<\/summary>/g)].forEach(([, summaryMarkup]) => {
    assert.doesNotMatch(summaryMarkup, /<(button|a)\b/i);
});
assert.match(resultsMarkup, /data-league-match-tab="statistics"/);
assert.match(resultsMarkup, /data-league-match-tab="events"/);
assert.match(resultsMarkup, /data-league-match-tab="players"/);
assert.match(resultsMarkup, /data-league-period="total"/);
assert.match(resultsMarkup, /data-league-period="first"/);
assert.match(resultsMarkup, /data-league-period="second"/);
assert.doesNotMatch(resultsMarkup, /Possession<\/span>/);

const twoMatchResultsMarkup = context.renderResults({
    ...season,
    matches: [{ ...match, id: 'older-completed-match' }, match]
});
assert.equal((twoMatchResultsMarkup.match(/league-match-latest/g) || []).length, 1);
assert.match(twoMatchResultsMarkup, /class="league-match-disclosure" data-match-id="older-completed-match"/);
assert.match(twoMatchResultsMarkup, /data-match-id="older-completed-match"[\s\S]*?Match details →/);
const noRecordingMarkup = context.renderResults({
    ...season,
    matches: [{ ...match, recording: undefined }]
});
assert.doesNotMatch(noRecordingMarkup, /league-match-recording-(card|link|play)/);

const totalStats = context.statisticsRows(season, match, 'total');
assert.deepEqual(JSON.parse(JSON.stringify(totalStats.rows.map((row) => row.label))), ['Kicks', 'Passes', 'Shots on Goal']);
const firstHalfStats = context.statisticsRows(season, match, 'first');
assert.deepEqual(JSON.parse(JSON.stringify(firstHalfStats.rows.map((row) => row.label))), ['Possession', 'Kicks', 'Passes', 'Shots on Goal']);
assert.equal(firstHalfStats.rows[0].homeDisplay, '58.9%');
assert.equal(firstHalfStats.rows[0].awayDisplay, '41.1%');

const timelineMarkup = context.renderEvents(season, match);
assert.match(timelineMarkup, /league-event-team-headings/);
assert.match(timelineMarkup, /league-event-row/);
assert.match(timelineMarkup, /league-event-side-home/);
assert.match(timelineMarkup, /league-event-side-away/);
assert.match(timelineMarkup, /1:57 2H/);
assert.match(timelineMarkup, /1:27 2H/);
assert.match(timelineMarkup, /6:32 1H/);
assert.match(timelineMarkup, /3:45 1H/);
assert.match(timelineMarkup, /3:31 1H/);
assert.match(timelineMarkup, /Mercy-rule match end/);
assert.doesNotMatch(timelineMarkup, /After 1:56 2H|0:35–1:56 2H/);
assert.match(timelineMarkup, /3:31–4:16 1H/);
assert.match(timelineMarkup, /6:13–6:49 1H/);
assert.match(timelineMarkup, /1:05–1:36 2H/);
assert.equal((timelineMarkup.match(/Order within window uncertain/g) || []).length, 0);
assert.match(timelineMarkup, /Naeh scores!/);
assert.match(timelineMarkup, /Assist by Drkuu/);
assert.match(timelineMarkup, /ilaola own goal/);
assert.match(timelineMarkup, /Substitution/);
assert.match(timelineMarkup, /Naeh in, maccy out/);
assert.equal(timelineMarkup.indexOf('Naeh scores!') < timelineMarkup.indexOf('Drkuu scores!'), true);

context.expandedMatches.add(match.id);
context.matchModes.set(match.id, 'events');
let expandedMarkup = context.renderResults(season);
assert.match(expandedMarkup, /data-match-id="match-1-x-to-win-2-v-rooney-tunes" open/);
assert.match(expandedMarkup, /Match timeline/);
assert.match(expandedMarkup, /Naeh in, maccy out/);
assert.match(expandedMarkup, /ilaola own goal/);
context.matchModes.set(match.id, 'players');
expandedMarkup = context.renderResults(season);
assert.match(expandedMarkup, /data-match-id="match-1-x-to-win-2-v-rooney-tunes" open/);
assert.match(expandedMarkup, /Starting VI/);
assert.match(expandedMarkup, /Substitutes &amp; role changes/);
assert.match(expandedMarkup, /Player match statistics/);
assert.equal(expandedMarkup.indexOf('Starting VI') < expandedMarkup.indexOf('Substitutes &amp; role changes'), true);
assert.equal(expandedMarkup.indexOf('Substitutes &amp; role changes') < expandedMarkup.indexOf('Player match statistics'), true);
[
    ['Wakanda', 'CDM', 'on for Drkuu'],
    ['Naeh', 'GK → ST', 'returned in 2H for maccy'],
    ['Drkuu', 'CM → CAM'],
    ['atrocity exhibition', 'CDM → GK'],
    ['click', 'CDM', 'on for ilaola'],
    ['ilaola', 'ST', 'off in 1H, returned at HT'],
    ['fkfk', 'CAM', 'off at HT']
].forEach(([player, position, note]) => {
    assert.match(expandedMarkup, new RegExp(`${player}[\\s\\S]*?${position}`));
    if (note) assert.match(expandedMarkup, new RegExp(note));
});
assert.match(expandedMarkup, /<th>Player<\/th><th>Pos<\/th><th>Time<\/th>/);
[
    ['atrocity exhibition', 'CDM → GK'],
    ['Naeh', 'GK → ST'],
    ['Drkuu', 'CM → CAM'],
    ['Wakanda', 'CDM'],
    ['Berbatov', 'ST'],
    ['click', 'CDM']
].forEach(([player, position]) => assert.match(expandedMarkup, new RegExp(`<td>${player}<\\/td>\\s*<td>${position}<\\/td>`)));
assert.doesNotMatch(expandedMarkup, /CM → CM|CDM → CDM|ST → ST/);
assert.match(expandedMarkup, />9:48</);
assert.doesNotMatch(expandedMarkup, /≥9:47/);
assert.doesNotMatch(expandedMarkup, /Lineups &amp; positional view|Average positions|ATTACKING →|Kit: black with gold details|Kit: team-image colours/);
assert.match(expandedMarkup, /<td>39<\/td><td>22<\/td><td>1<\/td>/);
assert.doesNotMatch(expandedMarkup, /<td class="league-positive">39<\/td>/);
[
    'Credited clean-sheet halves:',
    'Possession is recorded per half',
    'Orientation: each team attacks',
    'First-half starting six with broad',
    'Broad locations reconstructed',
    'Playing-time method',
    'no conventional 90-minute conversion'
].forEach((copy) => assert.equal(expandedMarkup.includes(copy), false, `Removed visible copy: ${copy}`));

const clearMedals = context.leaderboardMedals([
    { player: 'one', leaderboardValue: 4 },
    { player: 'two', leaderboardValue: 3 },
    { player: 'three', leaderboardValue: 2 },
    { player: 'four', leaderboardValue: 1 }
], 'goals');
assert.equal(clearMedals.get('one'), 'gold');
assert.equal(clearMedals.get('two'), 'silver');
assert.equal(clearMedals.get('three'), 'bronze');
const tiedMedals = context.leaderboardMedals([
    { player: 'one', leaderboardValue: 3 },
    { player: 'two', leaderboardValue: 1 },
    { player: 'three', leaderboardValue: 1 },
    { player: 'four', leaderboardValue: 1 }
], 'goals');
assert.equal(tiedMedals.get('one'), 'gold');
assert.equal(tiedMedals.size, 1);
const tiedFirst = context.leaderboardMedals([
    { player: 'one', leaderboardValue: 3 },
    { player: 'two', leaderboardValue: 3 },
    { player: 'three', leaderboardValue: 2 }
], 'goals');
assert.equal(tiedFirst.has('one') || tiedFirst.has('two'), false);
const tiedThird = context.leaderboardMedals([
    { player: 'one', leaderboardValue: 40 },
    { player: 'two', leaderboardValue: 39 },
    { player: 'three', leaderboardValue: 38 },
    { player: 'four', leaderboardValue: 38 }
], 'kicks');
assert.deepEqual(JSON.parse(JSON.stringify([...tiedThird.entries()])), [['one', 'gold'], ['two', 'silver']]);
const tiedSecond = context.leaderboardMedals([
    { player: 'one', leaderboardValue: 40 },
    { player: 'two', leaderboardValue: 39 },
    { player: 'three', leaderboardValue: 39 }
], 'passes');
assert.deepEqual(JSON.parse(JSON.stringify([...tiedSecond.entries()])), [['one', 'gold']]);
const tiedFirstNoPodium = context.leaderboardMedals([
    { player: 'one', leaderboardValue: 39 },
    { player: 'two', leaderboardValue: 39 },
    { player: 'three', leaderboardValue: 37 },
    { player: 'four', leaderboardValue: 26 }
], 'kicks');
assert.equal(tiedFirstNoPodium.size, 0);
const passesTiedFirstNoPodium = context.leaderboardMedals([
    { player: 'one', leaderboardValue: 22 },
    { player: 'two', leaderboardValue: 22 },
    { player: 'three', leaderboardValue: 17 },
    { player: 'four', leaderboardValue: 16 }
], 'passes');
assert.equal(passesTiedFirstNoPodium.size, 0);
assert.equal(context.leaderboardMedals([{ player: 'one', leaderboardValue: 1 }], 'ownGoals').size, 0);

context.setLeaderboardMode('goalContributions', 'totals');
let leaderboardMarkup = context.renderLeaderboard(season);
assert.match(leaderboardMarkup, /<th>Goals<\/th><th>Assists<\/th><th>G\+A<\/th>/);
assert.match(leaderboardMarkup, /data-league-rate="totals" class="active"/);
assert.match(leaderboardMarkup, /league-positive/);
assert.match(leaderboardMarkup, /league-assist/);
context.setLeaderboardMode('goalContributions', 'per-minute');
leaderboardMarkup = context.renderLeaderboard(season);
assert.match(leaderboardMarkup, /<th>Goals\/min<\/th><th>Assists\/min<\/th><th>G\+A\/min<\/th>/);
assert.match(leaderboardMarkup, /data-league-rate="per-minute" class="active"/);
const perMinuteRows = context.leaderboardRows(season, 'goals', 'per-minute');
assert.equal(perMinuteRows.length > 0, true);
assert.equal(perMinuteRows.every((row) => row.minutes > 0 && Number.isFinite(row.leaderboardValue)), true);
const missingMinuteRows = context.leaderboardRowsFromTotals([
    { player: 'known', teamId: 'x', goals: 1, assists: 0, goalContributions: 1, mvps: 0, minutes: 60, minutesEstimated: false },
    { player: 'unknown', teamId: 'x', goals: 2, assists: 0, goalContributions: 2, mvps: 0, minutes: 0, minutesEstimated: false }
], 'goals', 'per-minute');
assert.deepEqual(JSON.parse(JSON.stringify(missingMinuteRows.map((row) => row.player))), ['known']);
const normalAppearances = context.leaderboardRows(season, 'appearances', 'per-minute');
assert.equal(normalAppearances.every((row) => row.leaderboardValue === row.appearances), true);
context.setLeaderboardMode('ownGoals', 'per-minute');
leaderboardMarkup = context.renderLeaderboard(season);
assert.doesNotMatch(leaderboardMarkup, /Per minute/);
assert.doesNotMatch(leaderboardMarkup, /league-medal-(gold|silver|bronze)/);

const cleanRateFixtures = [
    { player: 'half', teamId: 'x', cleanSheetHalves: 1, goalkeeperHalvesPlayed: 2, goalContributions: 0 },
    { player: 'perfect-two', teamId: 'x', cleanSheetHalves: 2, goalkeeperHalvesPlayed: 2, goalContributions: 0 },
    { player: 'perfect-one', teamId: 'x', cleanSheetHalves: 1, goalkeeperHalvesPlayed: 1, goalContributions: 0 },
    { player: 'no-gk-halves', teamId: 'x', cleanSheetHalves: 1, goalkeeperHalvesPlayed: 0, goalContributions: 0 }
];
const cleanRateFixtureRows = context.leaderboardRowsFromTotals(cleanRateFixtures, 'cleanSheetHalves', 'clean-sheet-rate');
assert.equal(cleanRateFixtureRows.find((row) => row.player === 'half').leaderboardValue, 0.5);
assert.equal(cleanRateFixtureRows.find((row) => row.player === 'perfect-two').leaderboardValue, 1);
assert.equal(cleanRateFixtureRows.find((row) => row.player === 'perfect-one').leaderboardValue, 1);
assert.equal(cleanRateFixtureRows.find((row) => row.player === 'no-gk-halves').leaderboardValue, null);
assert.equal(context.leaderboardMedals(cleanRateFixtureRows, 'cleanSheetHalves').has('no-gk-halves'), false);

const cleanRateRows = context.leaderboardRows(season, 'cleanSheetHalves', 'clean-sheet-rate');
assert.deepEqual(JSON.parse(JSON.stringify(cleanRateRows.map(({ player, cleanSheetHalves, goalkeeperHalvesPlayed, leaderboardValue }) => ({ player, cleanSheetHalves, goalkeeperHalvesPlayed, leaderboardValue })))), [
    { player: 'atrocity exhibition', cleanSheetHalves: 1, goalkeeperHalvesPlayed: 1, leaderboardValue: 1 },
    { player: 'Naeh', cleanSheetHalves: 1, goalkeeperHalvesPlayed: 1, leaderboardValue: 1 },
    { player: 'KK', cleanSheetHalves: 0, goalkeeperHalvesPlayed: 2, leaderboardValue: 0 }
]);
assert.equal(context.leaderboardMedals(cleanRateRows, 'cleanSheetHalves').size, 0);
context.setLeaderboardMode('cleanSheetHalves', 'clean-sheet-rate');
leaderboardMarkup = context.renderLeaderboard(season);
assert.match(leaderboardMarkup, /Clean-sheet rate/);
assert.match(leaderboardMarkup, /<th>CS halves<\/th><th>GK halves<\/th><th>CS rate<\/th>/);
assert.match(leaderboardMarkup, /atrocity exhibition[\s\S]*?<td>1<\/td><td>1<\/td><td>100%<\/td>/);
assert.match(leaderboardMarkup, /Naeh[\s\S]*?<td>1<\/td><td>1<\/td><td>100%<\/td>/);
assert.match(leaderboardMarkup, /KK[\s\S]*?<td>0<\/td><td>2<\/td><td>0%<\/td>/);
assert.doesNotMatch(leaderboardMarkup, /Per minute|Per appearance/);
const zeroGkSeason = JSON.parse(JSON.stringify(season));
zeroGkSeason.matches[0].goalkeeperAssignments = zeroGkSeason.matches[0].goalkeeperAssignments.filter((assignment) => assignment.player !== 'Naeh');
leaderboardMarkup = context.renderLeaderboard(zeroGkSeason);
assert.match(leaderboardMarkup, /Naeh[\s\S]*?<td>1<\/td><td>—<\/td><td>—<\/td>/);
assert.doesNotMatch(leaderboardMarkup, /league-medal-(gold|silver|bronze)[^>]*><td>Naeh/);

const mvpRateRows = context.leaderboardRows(season, 'mvps', 'per-appearance');
assert.deepEqual(JSON.parse(JSON.stringify(mvpRateRows.map(({ player, appearances, leaderboardValue }) => ({ player, appearances, leaderboardValue })))), [
    { player: 'Drkuu', appearances: 1, leaderboardValue: 1 }
]);
assert.equal(mvpRateRows.some((row) => row.player === 'Ibrahim'), false);
context.setLeaderboardMode('mvps', 'per-appearance');
leaderboardMarkup = context.renderLeaderboard(season);
assert.match(leaderboardMarkup, /Per appearance/);
assert.match(leaderboardMarkup, /<th>MVP\/App<\/th><th>Apps<\/th>/);
assert.match(leaderboardMarkup, /Drkuu[\s\S]*?<td>1\.00<\/td><td>1<\/td>/);
assert.doesNotMatch(leaderboardMarkup, /Per minute|Clean-sheet rate/);
assert.match(html, /\.league-intrinsic-table/);
assert.match(html, /width: max-content/);
assert.match(html, /\.league-table-leader/);
assert.match(html, /\.league-timeline-event-own-goal/);
assert.match(html, /\.league-medal-gold/);
assert.doesNotMatch(html, /\.league-pitch|\.league-shirt-icon|\.league-kit-source/);

console.log('LDC RS League Season 1 validation passed.');
