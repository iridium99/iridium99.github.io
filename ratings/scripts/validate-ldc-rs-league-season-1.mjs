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
vm.runInContext(`${leagueScript}\nthis.season = ldcRsLeagueSeason1; this.calculate = calculateLdcRsLeagueStandings; this.teamPower = calculateLeagueTeamPowerRatings; this.playerPower = calculateLeaguePlayerPowerRankings; this.matchPlayerTotals = calculateLeagueMatchPlayerTotals; this.seasonPlayerTotals = calculateLeagueSeasonPlayerTotals; this.matchTeamTotals = calculateLeagueMatchTeamTotals; this.participation = deriveLeagueMatchParticipation; this.formatClock = formatLeagueClock; this.renderResults = renderLdcRsLeagueResults; this.renderLeaderboard = renderLeagueSeasonLeaderboard;`, context);

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
    'ROONEY TUNES': ['KK', 'MRN', 'click', 'Vonmacron', 'Antax', 'sergicanos', 'Minicostaud', 'Kahn', 'Swajin', 'ilaola', 'fkfk', '1m bad']
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
assert.equal(leagueScript.includes("'Boat'"), false);
assert.deepEqual(JSON.parse(JSON.stringify(season.powerRatingConfig)), {
    team: { baseline: 1500, kFactor: 32, marginStep: 0.2, marginCap: 4 },
    player: { goal: 5, assist: 3, mvp: 4, cleanSheetHalf: 1.5, ownGoal: -2, shotOnGoal: 0.25, pass: 0.02, kick: 0.005, teamWinAppearance: 1 }
});

const match = season.matches[0];
assert.equal(match.id, 'match-1-x-to-win-2-v-rooney-tunes');
assert.equal(match.homeTeamId, 'x-to-win-2');
assert.equal(match.awayTeamId, 'rooney-tunes');
assert.equal(match.homeGoals, 5);
assert.equal(match.awayGoals, 0);
assert.equal(match.mvp, 'Drkuu');
assert.deepEqual(JSON.parse(JSON.stringify(match.cleanSheetHalves)), [
    { player: 'atrocity exhibition', value: 1 },
    { player: 'Naeh', value: 1 }
]);
assert.deepEqual(JSON.parse(JSON.stringify(match.scoringEvents)), [
    { score: '1–0', type: 'own-goal', player: 'ilaola', assist: null },
    { score: '2–0', type: 'goal', player: 'Berbatov', assist: 'atrocity exhibition' },
    { score: '3–0', type: 'goal', player: 'Berbatov', assist: 'elex' },
    { score: '4–0', type: 'goal', player: 'Drkuu', assist: 'Berbatov' },
    { score: '5–0', type: 'goal', player: 'Naeh', assist: 'Drkuu' }
]);
assert.deepEqual(JSON.parse(JSON.stringify(match.duration)), {
    totalSeconds: 585,
    halves: [{ half: 1, seconds: 471, display: '7:51' }, { half: 2, seconds: 114, display: '1:54' }]
});
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
assert.deepEqual(JSON.parse(JSON.stringify(match.goalkeepers)), {
    firstHalf: { 'x-to-win-2': 'Naeh', 'rooney-tunes': 'KK' },
    secondHalf: { 'x-to-win-2': 'atrocity exhibition', 'rooney-tunes': 'KK' }
});
assert.match(match.pitch.orientation, /x=0 is own goal/);
assert.deepEqual(JSON.parse(JSON.stringify(match.pitch.observations)), []);
Object.values(match.pitch.views).forEach((view) => {
    Object.values(view.teams).flat().forEach((position) => {
        assert.equal(position.confidence, 'estimated');
        assert.equal(position.x >= 0 && position.x <= 100, true);
        assert.equal(position.y >= 0 && position.y <= 100, true);
    });
});

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

const teamPower = context.teamPower(season);
assert.deepEqual(JSON.parse(JSON.stringify(teamPower.map((row) => row.team))), ['X TO WIN 2', 'Baguette Z Apex', 'HAX UNITED', 'OG FC', 'HUQQA', 'ROONEY TUNES']);
assert.equal(Math.abs(teamPower[0].rating - 1528.8) < 1e-9, true);
assert.equal(Math.abs(teamPower[0].movement - 28.8) < 1e-9, true);
assert.equal(teamPower[0].played, 1);
assert.equal(Math.abs(teamPower.at(-1).rating - 1471.2) < 1e-9, true);
teamPower.slice(1, -1).forEach((row) => {
    assert.equal(row.rating, 1500);
    assert.equal(row.movement, 0);
    assert.equal(row.played, 0);
});
assert.equal(context.seasonPlayerTotals(season).find((row) => row.player === 'Berbatov').goalContributions, 3);

const playerPower = context.playerPower(season);
assert.equal(playerPower.length, 14);
assert.deepEqual(JSON.parse(JSON.stringify(playerPower.slice(0, 5).map((row) => row.player))), ['Berbatov', 'Drkuu', 'Naeh', 'atrocity exhibition', 'elex']);
assert.equal(playerPower[0].score, 15.01);
assert.equal(playerPower[0].teamWinAppearances, 1);
assert.equal(Math.abs(playerPower.find((row) => row.player === 'ilaola').score - -1.87) < 1e-9, true);

const participation = context.participation(match);
const time = (player) => participation.find((row) => row.player === player);
['atrocity exhibition', 'Berbatov', 'elex', 'KK', 'Vonmacron', 'MRN', '1m bad'].forEach((player) => {
    assert.deepEqual(JSON.parse(JSON.stringify(time(player))), { player, appearances: 1, seconds: 585, estimated: false });
});
assert.deepEqual(JSON.parse(JSON.stringify(time('Drkuu'))), { player: 'Drkuu', appearances: 1, seconds: 494, estimated: true });
assert.deepEqual(JSON.parse(JSON.stringify(time('Wakanda'))), { player: 'Wakanda', appearances: 1, seconds: 205, estimated: true });
assert.deepEqual(JSON.parse(JSON.stringify(time('Naeh'))), { player: 'Naeh', appearances: 1, seconds: 504.5, estimated: true });
assert.deepEqual(JSON.parse(JSON.stringify(time('maccy'))), { player: 'maccy', appearances: 1, seconds: 551.5, estimated: true });
assert.deepEqual(JSON.parse(JSON.stringify(time('click'))), { player: 'click', appearances: 1, seconds: 332, estimated: true });
assert.deepEqual(JSON.parse(JSON.stringify(time('ilaola'))), { player: 'ilaola', appearances: 1, seconds: 367, estimated: true });
assert.deepEqual(JSON.parse(JSON.stringify(time('fkfk'))), { player: 'fkfk', appearances: 1, seconds: 471, estimated: false });
assert.equal(context.formatClock(504.5, true), '~8:25');
assert.equal(playerTotals.every((row) => row.appearances === 1), true);

const canonicalPlayers = new Set(season.teams.flatMap((team) => team.roster));
match.halves.flatMap((half) => Object.values(half.playerStats).flat()).forEach((row) => assert.equal(canonicalPlayers.has(row.player), true, `Unknown player ${row.player}`));
Object.values(match.lineups).flatMap((half) => Object.values(half).flat()).forEach((player) => assert.equal(canonicalPlayers.has(player), true, `Unknown lineup player ${player}`));
match.substitutions.forEach((substitution) => {
    assert.equal(canonicalPlayers.has(substitution.playerIn), true, `Unknown substitute ${substitution.playerIn}`);
    assert.equal(canonicalPlayers.has(substitution.playerOut), true, `Unknown substituted player ${substitution.playerOut}`);
});
Object.values(match.goalkeepers).flatMap((half) => Object.values(half)).forEach((player) => assert.equal(canonicalPlayers.has(player), true, `Unknown goalkeeper ${player}`));
Object.values(match.pitch.views).flatMap((view) => Object.values(view.teams).flat()).forEach((position) => assert.equal(canonicalPlayers.has(position.player), true, `Unknown positioned player ${position.player}`));
match.scoringEvents.forEach((event) => {
    assert.equal(canonicalPlayers.has(event.player), true, `Unknown scoring player ${event.player}`);
    if (event.assist) assert.equal(canonicalPlayers.has(event.assist), true, `Unknown assisting player ${event.assist}`);
});

assert.match(html, /data-tab="ldc-rs-league-season-1">LDC RS League Season 1</);
assert.match(html, /class="tab active" data-tab="ldc-rs-league-season-1"/);
assert.match(html, /class="tab-content active" id="ldc-rs-league-season-1-tab"/);
assert.doesNotMatch(html, /class="tab-content active" id="players-tab"/);
assert.match(html, /src="ldc-rs-league-season-1\.js"/);
assert.match(html, /\.league-power-grid/);
assert.match(html, /\.league-teams-grid/);
assert.match(html, /\.league-match-section/);
assert.match(html, /\.league-season-stats/);
assert.match(html, /\.league-pitch/);
assert.match(html, /\.league-shirt-icon/);
assert.match(html, /\.league-match-disclosure/);
assert.match(html, /\.league-standings-table th:not\(:first-child\)/);
assert.doesNotMatch(leagueScript, /Six teams play a double round robin/);
assert.doesNotMatch(leagueScript, /league-format-facts/);

const resultsMarkup = context.renderResults(season);
assert.match(resultsMarkup, /<details class="league-match-disclosure">/);
assert.doesNotMatch(resultsMarkup, /<details class="league-match-disclosure" open/);
assert.match(resultsMarkup, /View match details/);
assert.match(resultsMarkup, /MVP Drkuu/);
const leaderboardMarkup = context.renderLeaderboard(season);
assert.match(leaderboardMarkup, /<th>Goals<\/th><th>Assists<\/th><th>G\+A<\/th>/);

console.log('LDC RS League Season 1 validation passed.');
