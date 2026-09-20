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
vm.runInContext(`${leagueScript}\nthis.season = ldcRsLeagueSeason1; this.modelVersions = { team: LEAGUE_TEAM_POWER_MODEL_VERSION, player: LEAGUE_PLAYER_POWER_MODEL_VERSION }; this.calculate = calculateLdcRsLeagueStandings; this.teamHistory = calculateLeagueTeamPowerHistory; this.playerPower = calculateLeaguePlayerPowerRankings; this.playerMatchPower = calculateLeaguePlayerMatchPower; this.playerConfidence = calculateLeaguePlayerPowerConfidence; this.opponentMultiplier = calculateLeagueOpponentMultiplier; this.matchPlayerTotals = calculateLeagueMatchPlayerTotals; this.seasonPlayerTotals = calculateLeagueSeasonPlayerTotals; this.leaderboardRows = calculateLeagueSeasonLeaderboardRows; this.leaderboardRowsFromTotals = calculateLeagueLeaderboardRowsFromTotals; this.leaderboardMedals = calculateLeagueLeaderboardMedals; this.matchTeamTotals = calculateLeagueMatchTeamTotals; this.participation = deriveLeagueMatchParticipation; this.matchEvents = deriveLeagueMatchEvents; this.statisticsRows = getLeagueStatisticsRows; this.formatClock = formatLeagueClock; this.formatFrequency = formatLeagueFrequency; this.renderStandings = renderLdcRsLeagueStandings; this.renderResults = renderLdcRsLeagueResults; this.renderEvents = renderLeagueEventTimeline; this.renderLeaderboard = renderLeagueSeasonLeaderboard; this.renderTeam = renderLdcRsLeagueTeam; this.renderPlayerPower = renderLeaguePlayerPowerRankings; this.expandedMatches = leagueExpandedMatches; this.matchModes = leagueMatchDetailModes; this.statisticsPeriods = leagueStatisticsPeriods; this.setLeaderboardMode = (metric, rate) => { leagueSeasonStatMode = metric; leagueSeasonRateMode = rate; }; this.setLeaderboardExpanded = (metric, rate, expanded) => { const key = metric + ':' + rate; if (expanded) leagueExpandedLeaderboards.add(key); else leagueExpandedLeaderboards.delete(key); };`, context);

const fullSeason = context.season;
const season = { ...fullSeason, matches: [fullSeason.matches[0]] };
assert.equal(season.title, 'LDC RS League Season 1');
assert.deepEqual(JSON.parse(JSON.stringify(season.format)), {
    type: 'double-round-robin',
    teamCount: 6,
    matchesPerTeam: 10,
    totalMatches: 30
});
assert.equal(season.teams.length, 6);
assert.equal(season.matches.length, 1);
assert.equal(fullSeason.matches.length, 3);

const expectedRosters = {
    'Baguette Z Apex': ['Spero', 'V4KS', 'luur', 'zenix', 'oskar', 'Nympex', 'amaanofc', 'evilpedri', 'x', 'myrulez', 'Faya', 'Shield', 'Kaka'],
    'HAX UNITED': ['GK', 'Braga.', 'Misimaro', 'Pedri.', 'GGG', 'A7mdBibo', 'Arshavin', 'Blimpus', 'dierfetje', 'bananajoe', 'ShadiOzz', 'Szcesny', '$limani'],
    'OG FC': ['𝐌𝐨𝐬𝐭𝐚𝐟𝐚 𝐙𝐢𝐤𝐨', 'Mbappe', 'Nistel', 'Nijad', 'MeeRo', 'Dynaxz', 'Lookman', 'Brutus', 'MaksLuburic', 'Olise', 'saygex', 'Wizop', 'ToughBaby'],
    'X TO WIN 2': ['Drkuu', 'Ibrahim', 'SamueleRicci', 'Berbatov', 'Naeh', 'SVimes', 'maccy', 'atrocity exhibition', 'elex', 'mitrita KING', 'Wakanda', 'tsukuyomi.', 'wee', 'Johnny Sins'],
    HUQQA: ['Menéur', 'Lena', 'Ollhurse', 'Perkz', 'Saviolo', 'unknown-user', 'barn', 'Razor', 'Grmii', 'Himothy', 'Kimmich', 'whân'],
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
const huqqa = season.teams.find((team) => team.id === 'huqqa');
assert.equal(huqqa.roster.includes('Saviolo'), true);
assert.equal(huqqa.roster.includes('Mattéo Guendouzi'), false);
assert.equal(new Set(huqqa.roster).size, huqqa.roster.length);
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

const startingRatings = season.powerRatingConfig.team.startingRatings;
const expectedXtw = 1 / (1 + (10 ** ((startingRatings['rooney-tunes'] - startingRatings['x-to-win-2']) / season.powerRatingConfig.team.expectationDivisor)));
const expectedChange = 32 * 1.8 * (1 - expectedXtw);

const teamHistory = context.teamHistory(season);
assert.equal(Math.abs(teamHistory.ratings.get('x-to-win-2') - (startingRatings['x-to-win-2'] + expectedChange)) < 1e-9, true);
assert.equal(Math.abs(teamHistory.ratings.get('rooney-tunes') - (startingRatings['rooney-tunes'] - expectedChange)) < 1e-9, true);
const firstSnapshot = teamHistory.preMatchRatings.get(match.id);
assert.deepEqual(JSON.parse(JSON.stringify(firstSnapshot)), {
    matchId: match.id,
    chronologicalIndex: 0,
    homePreMatchRating: 1581,
    awayPreMatchRating: 1446
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

assert.doesNotMatch(leagueScript, /prediction|drawProbability|drawDecayScale|winProbability|lossProbability|drawPercentage|remainingMeetings|calculateLeagueMatchPrediction/i);
assert.doesNotMatch(html, /league-prediction|league-predictions/i);
assert.doesNotMatch(leagueScript, /Team Power Ratings|Results-only|Equal-start|renderLeagueTeamPowerRatings|data-league-power-model/i);
assert.doesNotMatch(html, /league-team-power|league-power-toggle|league-model-note/i);
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
assert.doesNotMatch(html, /\.league-power-grid/);
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
['two', 'three', 'four'].forEach((player) => assert.equal(tiedMedals.get(player), 'silver'));
assert.equal(tiedMedals.size, 4);
const tiedFirst = context.leaderboardMedals([
    { player: 'one', leaderboardValue: 3 },
    { player: 'two', leaderboardValue: 3 },
    { player: 'three', leaderboardValue: 2 }
], 'goals');
assert.equal(tiedFirst.get('one'), 'gold');
assert.equal(tiedFirst.get('two'), 'gold');
assert.equal(tiedFirst.get('three'), 'silver');
const tiedThird = context.leaderboardMedals([
    { player: 'one', leaderboardValue: 40 },
    { player: 'two', leaderboardValue: 39 },
    { player: 'three', leaderboardValue: 38 },
    { player: 'four', leaderboardValue: 38 }
], 'kicks');
assert.deepEqual(JSON.parse(JSON.stringify([...tiedThird.entries()])), [['one', 'gold'], ['two', 'silver'], ['three', 'bronze'], ['four', 'bronze']]);
const tiedSecond = context.leaderboardMedals([
    { player: 'one', leaderboardValue: 40 },
    { player: 'two', leaderboardValue: 39 },
    { player: 'three', leaderboardValue: 39 }
], 'passes');
assert.deepEqual(JSON.parse(JSON.stringify([...tiedSecond.entries()])), [['one', 'gold'], ['two', 'silver'], ['three', 'silver']]);
const tiedFirstNoPodium = context.leaderboardMedals([
    { player: 'one', leaderboardValue: 39 },
    { player: 'two', leaderboardValue: 39 },
    { player: 'three', leaderboardValue: 37 },
    { player: 'four', leaderboardValue: 26 }
], 'kicks');
assert.deepEqual(JSON.parse(JSON.stringify([...tiedFirstNoPodium.entries()])), [['one', 'gold'], ['two', 'gold'], ['three', 'silver'], ['four', 'bronze']]);
const passesTiedFirstNoPodium = context.leaderboardMedals([
    { player: 'one', leaderboardValue: 22 },
    { player: 'two', leaderboardValue: 22 },
    { player: 'three', leaderboardValue: 17 },
    { player: 'four', leaderboardValue: 16 }
], 'passes');
assert.deepEqual(JSON.parse(JSON.stringify([...passesTiedFirstNoPodium.entries()])), [['one', 'gold'], ['two', 'gold'], ['three', 'silver'], ['four', 'bronze']]);
assert.equal(context.leaderboardMedals([{ player: 'one', leaderboardValue: 1 }], 'ownGoals').size, 0);
assert.deepEqual(JSON.parse(JSON.stringify([...context.leaderboardMedals([
    { player: 'gold-a', leaderboardValue: 2 },
    { player: 'gold-b', leaderboardValue: 2 }
], 'minutes').entries()])), [['gold-a', 'gold'], ['gold-b', 'gold']]);

context.setLeaderboardMode('goalContributions', 'totals');
const tiedGoalContributionRows = context.leaderboardRows(fullSeason, 'goalContributions', 'totals');
const tiedGoalContributionMedals = context.leaderboardMedals(tiedGoalContributionRows, 'goalContributions');
['bananajoe', 'Grmii', 'Mbappe', '𝐌𝐨𝐬𝐭𝐚𝐟𝐚 𝐙𝐢𝐤𝐨', 'Naeh'].forEach((player) => assert.equal(tiedGoalContributionMedals.get(player), 'bronze'));

context.setLeaderboardMode('kicks', 'totals');
context.setLeaderboardExpanded('kicks', 'totals', false);
const collapsedLeaderboardMarkup = context.renderLeaderboard(fullSeason);
assert.match(collapsedLeaderboardMarkup, /data-league-leaderboard-toggle="kicks:totals" aria-expanded="false">Show more<\/button>/);
assert.match(collapsedLeaderboardMarkup, /league-medal-bronze[\s\S]*?league-leaderboard-toggle-row[\s\S]*?league-leaderboard-extra-row" hidden/);
context.setLeaderboardExpanded('kicks', 'totals', true);
const expandedLeaderboardMarkup = context.renderLeaderboard(fullSeason);
assert.match(expandedLeaderboardMarkup, /data-league-leaderboard-toggle="kicks:totals" aria-expanded="true">Show less<\/button>/);
assert.doesNotMatch(expandedLeaderboardMarkup, /league-leaderboard-extra-row" hidden/);
context.setLeaderboardExpanded('kicks', 'totals', false);

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
assert.deepEqual(JSON.parse(JSON.stringify([...context.leaderboardMedals(cleanRateRows, 'cleanSheetHalves').entries()])), [['atrocity exhibition', 'gold'], ['Naeh', 'gold']]);
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

// Match 2 and all surfaces derived from the complete chronological record.
const match2 = fullSeason.matches[1];
assert.equal(match2.id, 'match-2-og-fc-v-hax-united');
assert.deepEqual(JSON.parse(JSON.stringify([match2.homeTeamId, match2.awayTeamId, match2.homeGoals, match2.awayGoals, match2.mvp])), ['og-fc', 'hax-united', 3, 2, 'Mbappe']);
assert.deepEqual(JSON.parse(JSON.stringify(match2.duration)), {
    totalSeconds: 986,
    endTimeKnown: true,
    halves: [
        { half: 1, seconds: 482, display: '8:02', endTimeKnown: true },
        { half: 2, seconds: 504, display: '8:24', endTimeKnown: true }
    ]
});
assert.equal(match2.conclusion.type, 'full-time');
assert.equal(match2.recording, undefined);
assert.deepEqual(JSON.parse(JSON.stringify(match2.scoringEvents.map(({ score, type, player, assist, benefitsTeamId }) => ({ score, type, player, assist, benefitsTeamId })))), [
    { score: '1–0', type: 'goal', player: '𝐌𝐨𝐬𝐭𝐚𝐟𝐚 𝐙𝐢𝐤𝐨', assist: 'saygex' },
    { score: '1–1', type: 'own-goal', player: 'Nistel', assist: null, benefitsTeamId: 'hax-united' },
    { score: '1–2', type: 'goal', player: 'bananajoe', assist: 'Arshavin' },
    { score: '2–2', type: 'goal', player: 'Mbappe', assist: 'MaksLuburic' },
    { score: '3–2', type: 'own-goal', player: 'Misimaro', assist: null, benefitsTeamId: 'og-fc' }
]);
assert.deepEqual(JSON.parse(JSON.stringify(match2.scoringEvents.slice(2).map(({ timing }) => ({ halfSeconds: timing.halfSeconds, cumulativeSeconds: timing.cumulativeSeconds, halfDisplay: timing.halfDisplay, cumulativeDisplay: timing.cumulativeDisplay })))), [
    { halfSeconds: 128, cumulativeSeconds: 610, halfDisplay: '2:08', cumulativeDisplay: '10:10' },
    { halfSeconds: 139, cumulativeSeconds: 621, halfDisplay: '2:19', cumulativeDisplay: '10:21' },
    { halfSeconds: 393, cumulativeSeconds: 875, halfDisplay: '6:33', cumulativeDisplay: '14:35' }
]);
assert.equal(match2.scoringEvents.every((event) => event.attribution === 'manual-adjudication-overrides-automatic-source'), true);

const haxTeam = fullSeason.teams.find((team) => team.id === 'hax-united');
assert.equal(haxTeam.roster.includes('$limani'), true);
assert.equal(haxTeam.roster.filter((player) => player === '$limani').length, 1);
assert.equal(haxTeam.roster.some((player) => player !== '$limani' && player.toLowerCase().includes('limani')), false);
['döner', 'Maks Redondo', 'M.ZIKO', '𝗠.𝗭𝗜𝗞𝗢', 'HAX UNITED GK', 'Alexis Sanchez', '√G⁶'].forEach((alias) => assert.equal(leagueScript.includes(`'${alias}'`), false));

assert.deepEqual(JSON.parse(JSON.stringify(context.matchTeamTotals(match2, 'og-fc'))), { kicks: 240, passes: 92, shotsOnGoal: 6 });
assert.deepEqual(JSON.parse(JSON.stringify(context.matchTeamTotals(match2, 'hax-united'))), { kicks: 274, passes: 123, shotsOnGoal: 12 });
Object.entries(match2.fullMatchPlayerStats).forEach(([teamId, rows]) => {
    const summed = rows.reduce((total, row) => ({ kicks: total.kicks + row.kicks, passes: total.passes + row.passes, shotsOnGoal: total.shotsOnGoal + row.shotsOnGoal }), { kicks: 0, passes: 0, shotsOnGoal: 0 });
    assert.deepEqual(JSON.parse(JSON.stringify(summed)), JSON.parse(JSON.stringify(context.matchTeamTotals(match2, teamId))), `${teamId} player totals reconcile`);
});

const match2PlayerTotals = context.matchPlayerTotals(fullSeason, match2);
const match2Stat = (player) => match2PlayerTotals.find((row) => row.player === player);
assert.deepEqual(JSON.parse(JSON.stringify(Object.fromEntries(playerKeys.map((key) => [key, match2Stat('Mbappe')[key]])))), { kicks: 47, passes: 21, shotsOnGoal: 1, goals: 1, assists: 0, ownGoals: 0, mvps: 1, cleanSheetHalves: 0 });
assert.deepEqual(JSON.parse(JSON.stringify(Object.fromEntries(playerKeys.map((key) => [key, match2Stat('Misimaro')[key]])))), { kicks: 26, passes: 9, shotsOnGoal: 0, goals: 0, assists: 0, ownGoals: 1, mvps: 0, cleanSheetHalves: 0 });
assert.deepEqual(JSON.parse(JSON.stringify({ clean: match2Stat('Nistel').cleanSheetHalves, gk: match2Stat('Nistel').goalkeeperHalvesPlayed })), { clean: 0, gk: 2 });
assert.deepEqual(JSON.parse(JSON.stringify({ clean: match2Stat('GK').cleanSheetHalves, gk: match2Stat('GK').goalkeeperHalvesPlayed })), { clean: 0, gk: 2 });
assert.equal(match2PlayerTotals.length, 15);
assert.equal(match2Stat('$limani').teamId, 'hax-united');

assert.deepEqual(JSON.parse(JSON.stringify(match2.startingLineups['og-fc'])), [
    { player: 'Nistel', position: 'GK' }, { player: 'Nijad', position: 'CB' }, { player: 'MaksLuburic', position: 'CM' },
    { player: 'Mbappe', position: 'CAM' }, { player: 'saygex', position: 'LW' }, { player: '𝐌𝐨𝐬𝐭𝐚𝐟𝐚 𝐙𝐢𝐤𝐨', position: 'ST' }
]);
assert.deepEqual(JSON.parse(JSON.stringify(match2.startingLineups['hax-united'])), [
    { player: 'GK', position: 'GK' }, { player: 'Pedri', position: 'CDM' }, { player: '$limani', position: 'CM' },
    { player: 'Misimaro', position: 'CAM' }, { player: 'Arshavin', position: 'LW' }, { player: 'bananajoe', position: 'ST' }
]);
const match2Position = (teamId, player) => match2.positionStints[teamId].find((entry) => entry.player === player);
assert.equal(match2Position('og-fc', 'ToughBaby').stints[0].position, 'CB');
assert.equal(match2Position('og-fc', 'Dynaxz').stints[0].position, 'CM');
assert.equal(match2Position('hax-united', 'GGG').stints[0].position, 'CAM');
assert.deepEqual(JSON.parse(JSON.stringify(match2Position('hax-united', 'Misimaro').stints.map(({ position }) => position))), ['CAM', 'ST']);
assert.deepEqual(JSON.parse(JSON.stringify(match2.substitutions.map(({ playerIn, playerOut, half, timing }) => ({ playerIn, playerOut, half, type: timing.type, observedStart: timing.observedStart, observedEnd: timing.observedEnd })))), [
    { playerIn: 'ToughBaby', playerOut: 'Nijad', half: 1, type: 'observed-interval', observedStart: 313.933, observedEnd: 320.333 },
    { playerIn: 'GGG', playerOut: 'Misimaro', half: 'halftime', type: 'halftime' },
    { playerIn: 'Dynaxz', playerOut: 'MaksLuburic', half: 2, type: 'observed-interval', observedStart: 214.4, observedEnd: 239.733 },
    { playerIn: 'Misimaro', playerOut: 'bananajoe', half: 2, type: 'observed-interval', observedStart: 271.5, observedEnd: 297.033 }
]);
const match2Participation = context.participation(match2);
const match2Time = (player) => match2Participation.find((row) => row.player === player);
assert.equal(Math.abs(match2Time('Nijad').seconds - 317.133) < 1e-9, true);
assert.equal(Math.abs(match2Time('Dynaxz').seconds - 276.9335) < 1e-9, true);
assert.equal(Math.abs(match2Time('GGG').seconds - 504) < 1e-9, true);
assert.equal(Math.abs(match2Time('Misimaro').seconds - 701.7335) < 1e-9, true);
['Nijad', 'Dynaxz', 'Misimaro'].forEach((player) => assert.deepEqual(JSON.parse(JSON.stringify({ appearances: match2Time(player).appearances, estimated: match2Time(player).estimated, incomplete: match2Time(player).incomplete })), { appearances: 1, estimated: true, incomplete: false }));
assert.deepEqual(JSON.parse(JSON.stringify({ appearances: match2Time('GGG').appearances, estimated: match2Time('GGG').estimated, incomplete: match2Time('GGG').incomplete })), { appearances: 1, estimated: false, incomplete: false });
assert.deepEqual(JSON.parse(JSON.stringify(match2Time('$limani'))), { player: '$limani', appearances: 1, seconds: 986, estimated: false, incomplete: false });

const match2Events = context.matchEvents(match2);
assert.equal(match2Events.length, 9);
assert.deepEqual(JSON.parse(JSON.stringify(match2Events.filter((event) => ['goal', 'own-goal'].includes(event.eventType)).map(({ player, sortValue }) => ({ player, sortValue })))), [
    { player: 'Misimaro', sortValue: 875 }, { player: 'Mbappe', sortValue: 621 }, { player: 'bananajoe', sortValue: 610 },
    { player: 'Nistel', sortValue: 320 }, { player: '𝐌𝐨𝐬𝐭𝐚𝐟𝐚 𝐙𝐢𝐤𝐨', sortValue: 185 }
]);
const match2EventsMarkup = context.renderEvents(fullSeason, match2);
assert.match(match2EventsMarkup, /Misimaro own goal[\s\S]*?Benefits OG FC/);
assert.match(match2EventsMarkup, /Nistel own goal[\s\S]*?Benefits HAX UNITED/);
assert.match(match2EventsMarkup, /2:08 2H · 10:10 total/);
assert.match(match2EventsMarkup, /2:19 2H · 10:21 total/);
assert.match(match2EventsMarkup, /6:33 2H · 14:35 total/);

// Match 3: HUQQA 1–0 Baguette Z Apex.
const match3 = fullSeason.matches[2];
assert.equal(match3.id, 'match-3-huqqa-v-baguette-z-apex');
assert.deepEqual(JSON.parse(JSON.stringify([match3.homeTeamId, match3.awayTeamId, match3.homeGoals, match3.awayGoals, match3.mvp])), ['huqqa', 'baguette-z-apex', 1, 0, 'Grmii']);
assert.deepEqual(JSON.parse(JSON.stringify(match3.duration)), {
    totalSeconds: 989,
    endTimeKnown: true,
    halves: [
        { half: 1, seconds: 477, display: '7:57', endTimeKnown: true },
        { half: 2, seconds: 512, display: '8:32', endTimeKnown: true }
    ]
});
assert.equal(match3.conclusion.type, 'full-time');
assert.equal(match3.recording, undefined);
assert.deepEqual(JSON.parse(JSON.stringify(match3.scoringEvents.map(({ score, type, player, assist, timing }) => ({ score, type, player, assist, seconds: timing.seconds, timelineDisplay: timing.timelineDisplay })))), [
    { score: '1–0', type: 'goal', player: 'Grmii', assist: null, seconds: 47, timelineDisplay: '0:47 1H' }
]);
['888', 'Latisty', 'Perkz shitty pc', "Kimmich'", 'Shidou', 'zen!', '.oskar', 'Nympex.', 'ShIeLd'].forEach((alias) => assert.equal(leagueScript.includes(`'${alias}'`), false));

assert.deepEqual(JSON.parse(JSON.stringify(context.matchTeamTotals(match3, 'huqqa'))), { kicks: 245, passes: 112, shotsOnGoal: 9 });
assert.deepEqual(JSON.parse(JSON.stringify(context.matchTeamTotals(match3, 'baguette-z-apex'))), { kicks: 253, passes: 116, shotsOnGoal: 5 });
Object.entries(match3.fullMatchPlayerStats).forEach(([teamId, rows]) => {
    const summed = rows.reduce((total, row) => ({ kicks: total.kicks + row.kicks, passes: total.passes + row.passes, shotsOnGoal: total.shotsOnGoal + row.shotsOnGoal }), { kicks: 0, passes: 0, shotsOnGoal: 0 });
    assert.deepEqual(JSON.parse(JSON.stringify(summed)), JSON.parse(JSON.stringify(context.matchTeamTotals(match3, teamId))), `${teamId} Match 3 player totals reconcile`);
});

const match3PlayerTotals = context.matchPlayerTotals(fullSeason, match3);
const match3Stat = (player) => match3PlayerTotals.find((row) => row.player === player);
assert.equal(match3PlayerTotals.length, 14);
assert.deepEqual(JSON.parse(JSON.stringify(Object.fromEntries(playerKeys.map((key) => [key, match3Stat('Grmii')[key]])))), { kicks: 37, passes: 19, shotsOnGoal: 2, goals: 1, assists: 0, ownGoals: 0, mvps: 1, cleanSheetHalves: 0 });
assert.deepEqual(JSON.parse(JSON.stringify({ clean: match3Stat('Lena').cleanSheetHalves, gk: match3Stat('Lena').goalkeeperHalvesPlayed })), { clean: 2, gk: 2 });
assert.deepEqual(JSON.parse(JSON.stringify({ clean: match3Stat('luur').cleanSheetHalves, gk: match3Stat('luur').goalkeeperHalvesPlayed })), { clean: 1, gk: 2 });

assert.deepEqual(JSON.parse(JSON.stringify(match3.startingLineups.huqqa)), [
    { player: 'Lena', position: 'GK' }, { player: 'Kimmich', position: 'CDM' }, { player: 'Ollhurse', position: 'CM' },
    { player: 'Perkz', position: 'LW' }, { player: 'Grmii', position: 'RW' }, { player: 'Saviolo', position: 'ST' }
]);
assert.deepEqual(JSON.parse(JSON.stringify(match3.startingLineups['baguette-z-apex'])), [
    { player: 'luur', position: 'GK' }, { player: 'V4KS', position: 'CDM' }, { player: 'evilpedri', position: 'CM' },
    { player: 'oskar', position: 'CAM' }, { player: 'zenix', position: 'LW' }, { player: 'Spero', position: 'ST' }
]);
const match3Position = (teamId, player) => match3.positionStints[teamId].find((entry) => entry.player === player);
assert.equal(match3Position('baguette-z-apex', 'Nympex').stints[0].position, 'CAM');
assert.equal(match3Position('baguette-z-apex', 'Shield').stints[0].position, 'ST');
assert.equal(match3Position('baguette-z-apex', 'Spero').stints.at(-1).position, 'ST');
assert.equal(match3.substitutions.filter((substitution) => substitution.teamId === 'huqqa').length, 0);
assert.deepEqual(JSON.parse(JSON.stringify(match3.substitutions.map(({ playerIn, playerOut, half, timing }) => ({ playerIn, playerOut, half, type: timing.type, observedStart: timing.observedStart, observedEnd: timing.observedEnd })))), [
    { playerIn: 'Nympex', playerOut: 'oskar', half: 'halftime', type: 'halftime' },
    { playerIn: 'Shield', playerOut: 'Spero', half: 'halftime', type: 'halftime' },
    { playerIn: 'Spero', playerOut: 'Shield', half: 2, type: 'observed-interval', observedStart: 318.15, observedEnd: 340.5 }
]);

const match3Participation = context.participation(match3);
const match3Time = (player) => match3Participation.find((row) => row.player === player);
['Lena', 'Kimmich', 'Ollhurse', 'Perkz', 'Grmii', 'Saviolo', 'luur', 'V4KS', 'evilpedri', 'zenix'].forEach((player) => assert.deepEqual(JSON.parse(JSON.stringify(match3Time(player))), { player, appearances: 1, seconds: 989, estimated: false, incomplete: false }));
assert.deepEqual(JSON.parse(JSON.stringify(match3Time('oskar'))), { player: 'oskar', appearances: 1, seconds: 477, estimated: false, incomplete: false });
assert.deepEqual(JSON.parse(JSON.stringify(match3Time('Nympex'))), { player: 'Nympex', appearances: 1, seconds: 512, estimated: false, incomplete: false });
assert.equal(Math.abs(match3Time('Shield').seconds - 329.325) < 1e-9, true);
assert.equal(Math.abs(match3Time('Spero').seconds - 659.675) < 1e-9, true);
['Shield', 'Spero'].forEach((player) => assert.deepEqual(JSON.parse(JSON.stringify({ appearances: match3Time(player).appearances, estimated: match3Time(player).estimated, incomplete: match3Time(player).incomplete })), { appearances: 1, estimated: true, incomplete: false }));

const match3Events = context.matchEvents(match3);
assert.equal(match3Events.length, 4);
assert.deepEqual(JSON.parse(JSON.stringify(match3Events.map(({ eventType, player, playerIn, playerOut, displayTime }) => ({ eventType, player, playerIn, playerOut, displayTime })))), [
    { eventType: 'substitution', playerIn: 'Spero', playerOut: 'Shield', displayTime: '5:18–5:40 2H' },
    { eventType: 'halftime-substitution', playerIn: 'Nympex', playerOut: 'oskar', displayTime: 'HT' },
    { eventType: 'halftime-substitution', playerIn: 'Shield', playerOut: 'Spero', displayTime: 'HT' },
    { eventType: 'goal', player: 'Grmii', displayTime: '0:47 1H' }
]);
const match3EventsMarkup = context.renderEvents(fullSeason, match3);
assert.match(match3EventsMarkup, /Spero in, Shield out/);
assert.match(match3EventsMarkup, /Nympex in, oskar out/);
assert.match(match3EventsMarkup, /Shield in, Spero out/);
assert.match(match3EventsMarkup, /Grmii scores![\s\S]*?1–0/);

const fullStandings = context.calculate(fullSeason);
const standing = (teamId) => fullStandings.find((row) => row.teamId === teamId);
assert.deepEqual(JSON.parse(JSON.stringify(fullStandings.map((row) => row.teamId))), ['x-to-win-2', 'og-fc', 'huqqa', 'hax-united', 'baguette-z-apex', 'rooney-tunes']);
assert.deepEqual(JSON.parse(JSON.stringify(Object.fromEntries(['P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts'].map((key) => [key, standing('og-fc')[key]])))), { P: 1, W: 1, D: 0, L: 0, GF: 3, GA: 2, GD: 1, Pts: 3 });
assert.deepEqual(JSON.parse(JSON.stringify(Object.fromEntries(['P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts'].map((key) => [key, standing('huqqa')[key]])))), { P: 1, W: 1, D: 0, L: 0, GF: 1, GA: 0, GD: 1, Pts: 3 });
assert.deepEqual(JSON.parse(JSON.stringify(Object.fromEntries(['P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts'].map((key) => [key, standing('hax-united')[key]])))), { P: 1, W: 0, D: 0, L: 1, GF: 2, GA: 3, GD: -1, Pts: 0 });
assert.deepEqual(JSON.parse(JSON.stringify(Object.fromEntries(['P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts'].map((key) => [key, standing('baguette-z-apex')[key]])))), { P: 1, W: 0, D: 0, L: 1, GF: 0, GA: 1, GD: -1, Pts: 0 });
assert.deepEqual(JSON.parse(JSON.stringify(standing('x-to-win-2').form.map(({ result }) => result))), ['W']);
assert.deepEqual(JSON.parse(JSON.stringify(standing('og-fc').form.map(({ result }) => result))), ['W']);
assert.deepEqual(JSON.parse(JSON.stringify(standing('huqqa').form.map(({ result }) => result))), ['W']);
assert.deepEqual(JSON.parse(JSON.stringify(standing('hax-united').form.map(({ result }) => result))), ['L']);
assert.deepEqual(JSON.parse(JSON.stringify(standing('baguette-z-apex').form.map(({ result }) => result))), ['L']);
assert.deepEqual(JSON.parse(JSON.stringify(standing('rooney-tunes').form.map(({ result }) => result))), ['L']);
const standingsMarkup = context.renderStandings(fullSeason);
assert.match(standingsMarkup, /3 of 30 results recorded/);
assert.match(standingsMarkup, /<th>FORM<\/th>/);
assert.match(standingsMarkup, /league-form-w/);
assert.match(standingsMarkup, /league-form-l/);

const match2PrePower = context.teamHistory(fullSeason).preMatchRatings.get(match2.id);
assert.equal(match2PrePower.homePreMatchRating, 1480);
assert.equal(match2PrePower.awayPreMatchRating, 1471);
const fullTeamHistory = context.teamHistory(fullSeason);
const match3PrePower = fullTeamHistory.preMatchRatings.get(match3.id);
assert.equal(match3PrePower.homePreMatchRating, 1519);
assert.equal(match3PrePower.awayPreMatchRating, 1545);
assert.equal(Math.abs(fullTeamHistory.ratings.get('huqqa') - 1536.1951141493278) < 1e-9, true);
assert.equal(Math.abs(fullTeamHistory.ratings.get('baguette-z-apex') - 1527.8048858506722) < 1e-9, true);
const fullPlayerPower = context.playerPower(fullSeason);
assert.deepEqual(JSON.parse(JSON.stringify(fullPlayerPower.slice(0, 10).map((row) => row.player))), ['Berbatov', 'Drkuu', 'Grmii', 'Mbappe', 'Naeh', 'bananajoe', '𝐌𝐨𝐬𝐭𝐚𝐟𝐚 𝐙𝐢𝐤𝐨', 'atrocity exhibition', 'Lena', 'Arshavin']);
assert.equal(fullPlayerPower.find((row) => row.player === 'Mbappe').opponentPreMatchRating, undefined);
assert.equal(context.playerMatchPower(fullSeason, match2, match2PrePower).find((row) => row.player === 'Mbappe').opponentPreMatchRating, 1471);
assert.equal(context.playerMatchPower(fullSeason, match3, match3PrePower).find((row) => row.player === 'Grmii').opponentPreMatchRating, 1545);
assert.equal(context.playerMatchPower(fullSeason, match3, match3PrePower).find((row) => row.player === 'luur').opponentPreMatchRating, 1519);
assert.doesNotMatch(context.renderPlayerPower(fullSeason), /opponent|pre-match rating|multiplier|movement/i);
assert.equal(JSON.stringify(context.playerPower(fullSeason)), JSON.stringify(context.playerPower(fullSeason)));

const fullSeasonTotals = context.seasonPlayerTotals(fullSeason);
assert.equal(fullSeasonTotals.length, 43);
assert.equal(fullSeasonTotals.find((row) => row.player === 'Mbappe').mvps, 1);
assert.equal(fullSeasonTotals.find((row) => row.player === 'saygex').assists, 1);
assert.equal(fullSeasonTotals.find((row) => row.player === 'Nistel').ownGoals, 1);
assert.equal(fullSeasonTotals.find((row) => row.player === 'Misimaro').goalkeeperHalvesPlayed, 0);
assert.deepEqual(JSON.parse(JSON.stringify(Object.fromEntries(['goals', 'assists', 'mvps', 'kicks', 'passes', 'shotsOnGoal', 'appearances', 'minutes'].map((key) => [key, fullSeasonTotals.find((row) => row.player === 'Grmii')[key]])))), { goals: 1, assists: 0, mvps: 1, kicks: 37, passes: 19, shotsOnGoal: 2, appearances: 1, minutes: 989 });
assert.deepEqual(JSON.parse(JSON.stringify(Object.fromEntries(['cleanSheetHalves', 'goalkeeperHalvesPlayed', 'appearances', 'minutes'].map((key) => [key, fullSeasonTotals.find((row) => row.player === 'Lena')[key]])))), { cleanSheetHalves: 2, goalkeeperHalvesPlayed: 2, appearances: 1, minutes: 989 });
['appearances', 'minutes', 'goals', 'assists', 'goalContributions', 'ownGoals', 'mvps', 'kicks', 'passes', 'shotsOnGoal', 'cleanSheetHalves'].forEach((metric) => {
    const rows = context.leaderboardRows(fullSeason, metric, 'totals');
    assert.equal(rows.length > 0, true, `${metric} leaderboard derives from the complete season`);
});
const frequencyFixtureRows = context.leaderboardRowsFromTotals([
    { player: 'fast', teamId: 'x', goals: 2, assists: 0, goalContributions: 2, minutes: 600, minutesEstimated: false, minutesIncomplete: false },
    { player: 'slow', teamId: 'x', goals: 1, assists: 0, goalContributions: 1, minutes: 600, minutesEstimated: true, minutesIncomplete: false },
    { player: 'zero', teamId: 'x', goals: 0, assists: 0, goalContributions: 0, minutes: 600, minutesEstimated: false, minutesIncomplete: false }
], 'goals', 'frequency');
assert.deepEqual(JSON.parse(JSON.stringify(frequencyFixtureRows.map(({ player, leaderboardValue }) => ({ player, leaderboardValue })))), [
    { player: 'fast', leaderboardValue: 300 }, { player: 'slow', leaderboardValue: 600 }, { player: 'zero', leaderboardValue: null }
]);
assert.deepEqual(JSON.parse(JSON.stringify([...context.leaderboardMedals(frequencyFixtureRows, 'goals').entries()])), [['fast', 'gold'], ['slow', 'silver']]);
assert.equal(context.formatFrequency(23), '1 every 23s');
assert.equal(context.formatFrequency(72), '1 every 1m 12s');
assert.equal(context.formatFrequency(125), '1 every 2m 05s');
assert.equal(context.formatFrequency(300), '1 every 5m');
assert.equal(context.formatFrequency(366), '1 every 6m 06s');
assert.equal(context.formatFrequency(72, true), '~1 every 1m 12s');
assert.equal(context.formatFrequency(null), '—');
context.setLeaderboardMode('goals', 'frequency');
const frequencyMarkup = context.renderLeaderboard(fullSeason);
assert.match(frequencyMarkup, /data-league-rate="frequency" class="active"/);
assert.match(frequencyMarkup, />Frequency<\/button>/);
assert.match(frequencyMarkup, /<th>Frequency<\/th>/);
assert.match(frequencyMarkup, /1 every 4m 54s/);
assert.match(frequencyMarkup, /~1 every 8m 28s/);
assert.match(frequencyMarkup, /<td>0<\/td><td>[^<]+<\/td><td>—<\/td>/);
['appearances', 'minutes', 'ownGoals', 'mvps', 'cleanSheetHalves'].forEach((metric) => {
    context.setLeaderboardMode(metric, 'frequency');
    assert.doesNotMatch(context.renderLeaderboard(fullSeason), /data-league-rate="frequency"|<th>Frequency<\/th>/);
});
context.setLeaderboardMode('cleanSheetHalves', 'clean-sheet-rate');
const fullCleanRate = context.leaderboardRows(fullSeason, 'cleanSheetHalves', 'clean-sheet-rate');
const cleanRate = (player) => fullCleanRate.find((row) => row.player === player);
assert.deepEqual(JSON.parse(JSON.stringify({ player: cleanRate('Lena').player, gk: cleanRate('Lena').goalkeeperHalvesPlayed, clean: cleanRate('Lena').cleanSheetHalves, rate: cleanRate('Lena').leaderboardValue })), { player: 'Lena', gk: 2, clean: 2, rate: 1 });
assert.deepEqual(JSON.parse(JSON.stringify({ player: cleanRate('luur').player, gk: cleanRate('luur').goalkeeperHalvesPlayed, clean: cleanRate('luur').cleanSheetHalves, rate: cleanRate('luur').leaderboardValue })), { player: 'luur', gk: 2, clean: 1, rate: 0.5 });
assert.equal(fullCleanRate.some((row) => row.goalkeeperHalvesPlayed === 0), false);

const fullResultsMarkup = context.renderResults(fullSeason);
assert.equal((fullResultsMarkup.match(/league-match-disclosure/g) || []).length, 3);
assert.equal((fullResultsMarkup.match(/league-match-recording-card/g) || []).length, 0, 'latest match has no invented recording card');
assert.match(html, /\.league-latest-preview:not\(:has\(\.league-match-recording-card\)\)/);
assert.match(fullResultsMarkup, /HUQQA[\s\S]*?1–0[\s\S]*?Baguette Z Apex/);
assert.match(fullResultsMarkup, /<small>Scorers<\/small><strong>Grmii<\/strong>/);
assert.match(fullResultsMarkup, /<small>MVP<\/small><strong>Grmii<\/strong>/);
assert.match(fullResultsMarkup, /OG FC[\s\S]*?3 – 2[\s\S]*?HAX UNITED/);
assert.match(fullResultsMarkup, /𝐌𝐨𝐬𝐭𝐚𝐟𝐚 𝐙𝐢𝐤𝐨, bananajoe, Mbappe, Nistel OG, Misimaro OG/);
assert.match(fullResultsMarkup, /data-match-id="match-1-x-to-win-2-v-rooney-tunes"/);
assert.equal(fullResultsMarkup.indexOf('match-3-huqqa-v-baguette-z-apex') < fullResultsMarkup.indexOf('match-2-og-fc-v-hax-united'), true);
assert.equal(fullResultsMarkup.indexOf('match-2-og-fc-v-hax-united') < fullResultsMarkup.indexOf('match-1-x-to-win-2-v-rooney-tunes'), true);
assert.doesNotMatch(leagueScript, /(player|ability|roster)Tier\s*[:=]/i);
assert.match(html, /\.league-form-result/);
assert.doesNotMatch(html, /\.league-prediction|\.league-probability-highest/);

console.log('LDC RS League Season 1 validation passed.');
