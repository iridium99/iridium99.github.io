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
vm.runInContext(`${leagueScript}\nthis.season = ldcRsLeagueSeason1; this.calculate = calculateLdcRsLeagueStandings; this.matchPlayerTotals = calculateLeagueMatchPlayerTotals; this.seasonPlayerTotals = calculateLeagueSeasonPlayerTotals; this.matchTeamTotals = calculateLeagueMatchTeamTotals;`, context);

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
    'X TO WIN 2': ['Drkuu', 'Ibrahim', 'SamueleRicci', 'Berbatov', 'Naeh', 'SVimes', 'maccy', 'atrocity exhibition', 'elex', 'mitrita KING', 'Wakanda', 'tsukuyomi.', 'wee', 'Johnny Sins', 'Boat'],
    HUQQA: ['Menéur', 'Lena', 'Ollhurse', 'Perkz', 'Mattéo Guendouzi', 'unknown-user', 'barn', 'Razor', 'Grmii', 'Himothy', 'Kimmich', 'whân'],
    'ROONEY TUNES': ['KK', 'MRN', 'click', 'Vonmacron', 'Antax', 'sergicanos', 'Minicostaud', 'Kahn', 'Swajin', 'ilaola', 'fkfk', '1m bad']
};

season.teams.forEach((team) => {
    assert.deepEqual(JSON.parse(JSON.stringify(team.roster)), expectedRosters[team.name]);
    [team.owner, team.captain, team.coCaptain, ...team.roster].forEach((name) => {
        assert.equal(name.includes('@'), false, `${team.name} contains a raw Discord mention`);
    });
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
assert.equal(match.startingLineups, null);
assert.equal(match.substitutes, null);
assert.equal(match.substitutions, null);
assert.equal(match.minutesPlayed, null);

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
assert.equal(context.seasonPlayerTotals(season).find((row) => row.player === 'Berbatov').goalContributions, 3);

const canonicalPlayers = new Set(season.teams.flatMap((team) => team.roster));
match.halves.flatMap((half) => Object.values(half.playerStats).flat()).forEach((row) => assert.equal(canonicalPlayers.has(row.player), true, `Unknown player ${row.player}`));
match.scoringEvents.forEach((event) => {
    assert.equal(canonicalPlayers.has(event.player), true, `Unknown scoring player ${event.player}`);
    if (event.assist) assert.equal(canonicalPlayers.has(event.assist), true, `Unknown assisting player ${event.assist}`);
});

assert.match(html, /data-tab="ldc-rs-league-season-1">LDC RS League Season 1</);
assert.match(html, /id="ldc-rs-league-season-1-tab"/);
assert.match(html, /src="ldc-rs-league-season-1\.js"/);
assert.match(html, /\.league-competition-grid/);
assert.match(html, /\.league-teams-grid/);
assert.match(html, /\.league-match-section/);
assert.match(html, /\.league-season-stats/);
assert.equal(fs.existsSync(path.join(root, 'league-assets', 'rooney-tunes.webp')), true);

console.log('LDC RS League Season 1 validation passed.');
