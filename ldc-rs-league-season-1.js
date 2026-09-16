const ldcRsLeagueSeason1 = {
    id: 'ldc-rs-league-season-1',
    title: 'LDC RS League Season 1',
    format: {
        type: 'double-round-robin',
        teamCount: 6,
        matchesPerTeam: 10,
        totalMatches: 30
    },
    teams: [
        {
            id: 'baguette-z-apex',
            name: 'Baguette Z Apex',
            shortName: 'BZA',
            image: null,
            owner: 'Spero',
            captain: 'Spero',
            coCaptain: 'evilpedri',
            roster: ['Spero', 'V4KS', 'luur', 'zenix', 'oskar', 'Nympex', 'amaanofc', 'evilpedri', 'x', 'myrulez', 'Faya', 'Shield', 'Kaka']
        },
        {
            id: 'hax-united',
            name: 'HAX UNITED',
            shortName: 'HAX',
            image: null,
            owner: 'GK',
            captain: 'GK',
            coCaptain: 'Misimaro',
            roster: ['GK', 'Braga.', 'Misimaro', 'Pedri.', 'GGG', 'A7mdBibo', 'Arshavin', 'Blimpus', 'dierfetje', 'bananajoe', 'ShadiOzz', 'Szcesny']
        },
        {
            id: 'og-fc',
            name: 'OG FC',
            shortName: 'OG',
            image: null,
            owner: '𝐌𝐨𝐬𝐭𝐚𝐟𝐚 𝐙𝐢𝐤𝐨',
            captain: 'Mbappe',
            coCaptain: '𝐌𝐨𝐬𝐭𝐚𝐟𝐚 𝐙𝐢𝐤𝐨',
            roster: ['𝐌𝐨𝐬𝐭𝐚𝐟𝐚 𝐙𝐢𝐤𝐨', 'Mbappe', 'Nistel', 'Nijad', 'MeeRo', 'Dynaxz', 'Lookman', 'Brutus', 'MaksLuburic', 'Olise', 'saygex', 'Wizop', 'ToughBaby']
        },
        {
            id: 'x-to-win-2',
            name: 'X TO WIN 2',
            shortName: 'XTW',
            image: null,
            owner: 'Cytro',
            captain: 'Cytro',
            coCaptain: 'SVimes',
            roster: ['Drkuu', 'Ibrahim', 'SamueleRicci', 'Berbatov', 'Naeh', 'SVimes', 'maccy', 'atrocity exhibition', 'elex', 'mitrita KING', 'Wakanda', 'tsukuyomi.', 'wee', 'Johnny Sins', 'Boat']
        },
        {
            id: 'huqqa',
            name: 'HUQQA',
            shortName: 'HUQ',
            image: null,
            owner: 'Ollhurse',
            captain: 'Lena',
            coCaptain: 'Ollhurse',
            roster: ['Menéur', 'Lena', 'Ollhurse', 'Perkz', 'Mattéo Guendouzi', 'unknown-user', 'barn', 'Razor', 'Grmii', 'Himothy', 'Kimmich', 'whân']
        },
        {
            id: 'rooney-tunes',
            name: 'ROONEY TUNES',
            shortName: 'RT',
            image: 'league-assets/rooney-tunes.webp',
            owner: 'Vonmacron',
            captain: 'Vonmacron',
            coCaptain: 'MRN',
            roster: ['KK', 'MRN', 'click', 'Vonmacron', 'Antax', 'sergicanos', 'Minicostaud', 'Kahn', 'Swajin', 'ilaola', 'fkfk', '1m bad']
        }
    ],
    // Standings, match totals, and season leaderboards are calculated from this source.
    matches: [
        {
            id: 'match-1-x-to-win-2-v-rooney-tunes',
            homeTeamId: 'x-to-win-2',
            awayTeamId: 'rooney-tunes',
            homeGoals: 5,
            awayGoals: 0,
            mvp: 'Drkuu',
            cleanSheetHalves: [
                { player: 'atrocity exhibition', value: 1 },
                { player: 'Naeh', value: 1 }
            ],
            scoringEvents: [
                { score: '1–0', type: 'own-goal', player: 'ilaola', assist: null },
                { score: '2–0', type: 'goal', player: 'Berbatov', assist: 'atrocity exhibition' },
                { score: '3–0', type: 'goal', player: 'Berbatov', assist: 'elex' },
                { score: '4–0', type: 'goal', player: 'Drkuu', assist: 'Berbatov' },
                { score: '5–0', type: 'goal', player: 'Naeh', assist: 'Drkuu' }
            ],
            halves: [
                {
                    label: 'First half',
                    sourceGameTime: '7:51',
                    homeGoals: 3,
                    awayGoals: 0,
                    teamStats: {
                        'x-to-win-2': { possession: 58.9, kicks: 149, passes: 76, shotsOnGoal: 12 },
                        'rooney-tunes': { possession: 41.1, kicks: 97, passes: 28, shotsOnGoal: 0 }
                    },
                    playerStats: {
                        'x-to-win-2': [
                            { player: 'maccy', kicks: 22, passes: 14, shotsOnGoal: 5 },
                            { player: 'Berbatov', kicks: 17, passes: 6, shotsOnGoal: 3 },
                            { player: 'atrocity exhibition', kicks: 30, passes: 12, shotsOnGoal: 2 },
                            { player: 'Drkuu', kicks: 29, passes: 13, shotsOnGoal: 1 },
                            { player: 'elex', kicks: 32, passes: 17, shotsOnGoal: 0 },
                            { player: 'Naeh', kicks: 13, passes: 9, shotsOnGoal: 1 },
                            { player: 'Wakanda', kicks: 6, passes: 5, shotsOnGoal: 0 }
                        ],
                        'rooney-tunes': [
                            { player: 'KK', kicks: 16, passes: 3, shotsOnGoal: 0 },
                            { player: 'click', kicks: 7, passes: 3, shotsOnGoal: 0 },
                            { player: 'fkfk', kicks: 14, passes: 6, shotsOnGoal: 0 },
                            { player: '1m bad', kicks: 13, passes: 7, shotsOnGoal: 0 },
                            { player: 'ilaola', kicks: 8, passes: 3, shotsOnGoal: 0 },
                            { player: 'MRN', kicks: 21, passes: 2, shotsOnGoal: 0 },
                            { player: 'Vonmacron', kicks: 18, passes: 4, shotsOnGoal: 0 }
                        ]
                    }
                },
                {
                    label: 'Second half',
                    sourceGameTime: '1:54',
                    homeGoals: 2,
                    awayGoals: 0,
                    teamStats: {
                        'x-to-win-2': { possession: 60.2, kicks: 38, passes: 25, shotsOnGoal: 1 },
                        'rooney-tunes': { possession: 39.8, kicks: 22, passes: 8, shotsOnGoal: 0 }
                    },
                    playerStats: {
                        'x-to-win-2': [
                            { player: 'Berbatov', kicks: 3, passes: 2, shotsOnGoal: 0 },
                            { player: 'atrocity exhibition', kicks: 7, passes: 4, shotsOnGoal: 0 },
                            { player: 'Drkuu', kicks: 10, passes: 9, shotsOnGoal: 0 },
                            { player: 'Wakanda', kicks: 4, passes: 2, shotsOnGoal: 0 },
                            { player: 'elex', kicks: 7, passes: 5, shotsOnGoal: 0 },
                            { player: 'maccy', kicks: 4, passes: 3, shotsOnGoal: 0 },
                            { player: 'Naeh', kicks: 3, passes: 0, shotsOnGoal: 1 }
                        ],
                        'rooney-tunes': [
                            { player: 'Vonmacron', kicks: 5, passes: 2, shotsOnGoal: 0 },
                            { player: 'MRN', kicks: 3, passes: 0, shotsOnGoal: 0 },
                            { player: 'KK', kicks: 4, passes: 2, shotsOnGoal: 0 },
                            { player: '1m bad', kicks: 4, passes: 0, shotsOnGoal: 0 },
                            { player: 'ilaola', kicks: 2, passes: 1, shotsOnGoal: 0 },
                            { player: 'click', kicks: 4, passes: 3, shotsOnGoal: 0 }
                        ]
                    }
                }
            ],
            // Awaiting authoritative data; do not derive these from half participation.
            startingLineups: null,
            substitutes: null,
            substitutions: null,
            minutesPlayed: null
        }
    ]
};

function calculateLdcRsLeagueStandings(season) {
    const table = new Map(season.teams.map((team, order) => [team.id, {
        teamId: team.id,
        team: team.name,
        order,
        P: 0,
        W: 0,
        D: 0,
        L: 0,
        GF: 0,
        GA: 0,
        GD: 0,
        Pts: 0
    }]));

    season.matches.forEach((match) => {
        const home = table.get(match.homeTeamId);
        const away = table.get(match.awayTeamId);
        if (!home || !away || !Number.isInteger(match.homeGoals) || !Number.isInteger(match.awayGoals)) {
            return;
        }

        home.P += 1;
        away.P += 1;
        home.GF += match.homeGoals;
        home.GA += match.awayGoals;
        away.GF += match.awayGoals;
        away.GA += match.homeGoals;

        if (match.homeGoals > match.awayGoals) {
            home.W += 1;
            away.L += 1;
            home.Pts += 3;
        } else if (match.homeGoals < match.awayGoals) {
            away.W += 1;
            home.L += 1;
            away.Pts += 3;
        } else {
            home.D += 1;
            away.D += 1;
            home.Pts += 1;
            away.Pts += 1;
        }
    });

    return [...table.values()]
        .map((row) => ({ ...row, GD: row.GF - row.GA }))
        .sort((a, b) => b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF || a.order - b.order);
}

function getLeagueTeamsById(season) {
    return new Map(season.teams.map((team) => [team.id, team]));
}

function getLeaguePlayerTeams(season) {
    const playerTeams = new Map();
    season.teams.forEach((team) => {
        team.roster.forEach((player) => playerTeams.set(player, team.id));
    });
    return playerTeams;
}

function calculateLeagueMatchPlayerTotals(season, match) {
    const totals = new Map();
    const playerTeams = getLeaguePlayerTeams(season);
    const ensurePlayer = (player) => {
        if (!totals.has(player)) {
            totals.set(player, {
                player,
                teamId: playerTeams.get(player),
                kicks: 0,
                passes: 0,
                shotsOnGoal: 0,
                goals: 0,
                assists: 0,
                ownGoals: 0,
                mvps: 0,
                cleanSheetHalves: 0,
                appearances: null,
                minutes: null
            });
        }
        return totals.get(player);
    };

    match.halves.forEach((half) => {
        Object.values(half.playerStats).flat().forEach((statLine) => {
            const total = ensurePlayer(statLine.player);
            total.kicks += statLine.kicks;
            total.passes += statLine.passes;
            total.shotsOnGoal += statLine.shotsOnGoal;
        });
    });

    match.scoringEvents.forEach((event) => {
        if (event.type === 'own-goal') {
            ensurePlayer(event.player).ownGoals += 1;
        } else {
            ensurePlayer(event.player).goals += 1;
        }
        if (event.assist) {
            ensurePlayer(event.assist).assists += 1;
        }
    });

    ensurePlayer(match.mvp).mvps += 1;
    match.cleanSheetHalves.forEach((credit) => {
        ensurePlayer(credit.player).cleanSheetHalves += credit.value;
    });

    return [...totals.values()];
}

function calculateLeagueSeasonPlayerTotals(season) {
    const totals = new Map();

    season.matches.forEach((match) => {
        calculateLeagueMatchPlayerTotals(season, match).forEach((matchRow) => {
            if (!totals.has(matchRow.player)) {
                totals.set(matchRow.player, { ...matchRow });
                return;
            }
            const seasonRow = totals.get(matchRow.player);
            ['kicks', 'passes', 'shotsOnGoal', 'goals', 'assists', 'ownGoals', 'mvps', 'cleanSheetHalves']
                .forEach((key) => { seasonRow[key] += matchRow[key]; });
        });
    });

    return [...totals.values()].map((row) => ({ ...row, goalContributions: row.goals + row.assists }));
}

function calculateLeagueMatchTeamTotals(match, teamId) {
    return match.halves.reduce((totals, half) => {
        const halfStats = half.teamStats[teamId];
        totals.kicks += halfStats.kicks;
        totals.passes += halfStats.passes;
        totals.shotsOnGoal += halfStats.shotsOnGoal;
        return totals;
    }, { kicks: 0, passes: 0, shotsOnGoal: 0 });
}

function escapeLeagueText(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderLdcRsLeagueStandings(season) {
    const standings = calculateLdcRsLeagueStandings(season);
    const headers = ['Team', 'P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts'];

    return `
        <div class="world-cup-card league-standings-card">
            <div class="world-cup-header">
                <h2 class="world-cup-title">Standings</h2>
                <span class="league-update-note">${season.matches.length} of ${season.format.totalMatches} results recorded</span>
            </div>
            <div class="world-cup-table-wrap">
                <table class="world-cup-table league-standings-table">
                    <thead><tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr></thead>
                    <tbody>
                        ${standings.map((row) => `
                            <tr>
                                <td>${escapeLeagueText(row.team)}</td>
                                <td>${row.P}</td><td>${row.W}</td><td>${row.D}</td><td>${row.L}</td>
                                <td>${row.GF}</td><td>${row.GA}</td><td>${row.GD}</td><td>${row.Pts}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderLdcRsLeagueResults(season) {
    if (season.matches.length === 0) {
        return `
            <div class="world-cup-card league-results-card">
                <div class="world-cup-header"><h2 class="world-cup-title">Results</h2></div>
                <p class="league-empty-state">No results have been recorded yet.</p>
            </div>
        `;
    }

    const teamsById = new Map(season.teams.map((team) => [team.id, team]));
    return `
        <div class="world-cup-card league-results-card">
            <div class="world-cup-header"><h2 class="world-cup-title">Results</h2></div>
            <div class="league-results-list">
                ${season.matches.map((match) => `
                    <div class="world-cup-match league-result">
                        <span>${escapeLeagueText(teamsById.get(match.homeTeamId).name)}</span>
                        <strong>${match.homeGoals} – ${match.awayGoals}</strong>
                        <span>${escapeLeagueText(teamsById.get(match.awayTeamId).name)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderLeagueHalfTeamStats(season, match, half) {
    const teamsById = getLeagueTeamsById(season);
    const teamIds = [match.homeTeamId, match.awayTeamId];
    return `
        <div class="world-cup-card league-half-card">
            <div class="world-cup-header">
                <h3 class="world-cup-title">${escapeLeagueText(half.label)}</h3>
                <span class="league-update-note">${half.homeGoals}–${half.awayGoals} · source time ${escapeLeagueText(half.sourceGameTime)}</span>
            </div>
            <div class="world-cup-table-wrap">
                <table class="world-cup-table league-half-table">
                    <thead><tr><th>Team</th><th>Poss.</th><th>Kicks</th><th>Passes</th><th>SoG</th></tr></thead>
                    <tbody>
                        ${teamIds.map((teamId) => {
                            const stats = half.teamStats[teamId];
                            return `<tr><td>${escapeLeagueText(teamsById.get(teamId).name)}</td><td>${stats.possession.toFixed(1)}%</td><td>${stats.kicks}</td><td>${stats.passes}</td><td>${stats.shotsOnGoal}</td></tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderLeagueMatchPlayerTable(season, match, teamId, playerTotals) {
    const team = getLeagueTeamsById(season).get(teamId);
    const rows = playerTotals.filter((row) => row.teamId === teamId);
    return `
        <div class="world-cup-card league-player-stats-card">
            <div class="world-cup-header"><h3 class="world-cup-title">${escapeLeagueText(team.name)}</h3></div>
            <div class="world-cup-table-wrap">
                <table class="world-cup-table league-player-stats-table">
                    <thead><tr><th>Player</th><th>K</th><th>Pass</th><th>SoG</th><th>G</th><th>A</th><th>OG</th><th>MVP</th><th>CSH</th></tr></thead>
                    <tbody>
                        ${rows.map((row) => `
                            <tr>
                                <td>${escapeLeagueText(row.player)}</td>
                                <td>${row.kicks}</td><td>${row.passes}</td><td>${row.shotsOnGoal}</td>
                                <td>${row.goals}</td><td>${row.assists}</td><td>${row.ownGoals}</td>
                                <td>${row.mvps ? '✓' : '–'}</td><td>${row.cleanSheetHalves}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderLeagueMatchView(season, match) {
    const teamsById = getLeagueTeamsById(season);
    const homeTeam = teamsById.get(match.homeTeamId);
    const awayTeam = teamsById.get(match.awayTeamId);
    const playerTotals = calculateLeagueMatchPlayerTotals(season, match);
    const homeTotals = calculateLeagueMatchTeamTotals(match, match.homeTeamId);
    const awayTotals = calculateLeagueMatchTeamTotals(match, match.awayTeamId);

    return `
        <section class="league-match-section" aria-labelledby="league-match-1-heading">
            <div class="world-cup-card league-match-hero">
                <p class="league-season-kicker">Official league match · Match 1</p>
                <div class="league-scoreline" id="league-match-1-heading">
                    <span>${escapeLeagueText(homeTeam.name)}</span>
                    <strong>${match.homeGoals}<i>–</i>${match.awayGoals}</strong>
                    <span>${escapeLeagueText(awayTeam.name)}</span>
                </div>
                <p class="league-match-mvp"><span>MVP</span> ${escapeLeagueText(match.mvp)}</p>
            </div>

            <div class="league-match-summary-grid">
                <div class="world-cup-card">
                    <div class="world-cup-header"><h2 class="world-cup-title">Scoring events</h2></div>
                    <ol class="league-scoring-events">
                        ${match.scoringEvents.map((event) => `
                            <li>
                                <strong>${escapeLeagueText(event.score)}</strong>
                                <span>${escapeLeagueText(event.player)}${event.type === 'own-goal' ? ' <em>(own goal)</em>' : ''}</span>
                                <small>${event.assist ? `Assist: ${escapeLeagueText(event.assist)}` : 'No assist'}</small>
                            </li>
                        `).join('')}
                    </ol>
                </div>
                <div class="world-cup-card">
                    <div class="world-cup-header"><h2 class="world-cup-title">Full-match team totals</h2></div>
                    <div class="world-cup-table-wrap">
                        <table class="world-cup-table league-full-team-table">
                            <thead><tr><th>Team</th><th>Kicks</th><th>Passes</th><th>SoG</th><th>Goals</th></tr></thead>
                            <tbody>
                                <tr><td>${escapeLeagueText(homeTeam.name)}</td><td>${homeTotals.kicks}</td><td>${homeTotals.passes}</td><td>${homeTotals.shotsOnGoal}</td><td>${match.homeGoals}</td></tr>
                                <tr><td>${escapeLeagueText(awayTeam.name)}</td><td>${awayTotals.kicks}</td><td>${awayTotals.passes}</td><td>${awayTotals.shotsOnGoal}</td><td>${match.awayGoals}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="league-update-note league-possession-note">Possession is shown per half below; percentages are not added together.</p>
                </div>
            </div>

            <div class="league-halves-grid">
                ${match.halves.map((half) => renderLeagueHalfTeamStats(season, match, half)).join('')}
            </div>

            <div class="world-cup-header league-section-header">
                <h2 class="world-cup-title">Player match stats</h2>
                <span class="league-update-note">CSH = clean-sheet halves</span>
            </div>
            <div class="league-match-player-grid">
                ${renderLeagueMatchPlayerTable(season, match, match.homeTeamId, playerTotals)}
                ${renderLeagueMatchPlayerTable(season, match, match.awayTeamId, playerTotals)}
            </div>

            <div class="world-cup-card league-pending-data">
                <strong>Lineups, substitutions, appearances and minutes</strong>
                <span>Awaiting authoritative match data; no values have been inferred from half-stat participation.</span>
            </div>
        </section>
    `;
}

const leagueSeasonMetricDefinitions = {
    appearances: { label: 'Appearances', empty: true },
    minutes: { label: 'Minutes', empty: true },
    goals: { label: 'Goals' },
    assists: { label: 'Assists' },
    goalContributions: { label: 'Goals + Assists' },
    ownGoals: { label: 'Own Goals' },
    mvps: { label: 'MVP awards' },
    kicks: { label: 'Kicks' },
    passes: { label: 'Passes' },
    shotsOnGoal: { label: 'Shots on Goal' },
    cleanSheetHalves: { label: 'Clean-sheet halves' }
};

let leagueSeasonStatMode = 'goalContributions';

function renderLeagueSeasonLeaderboard(season) {
    const definition = leagueSeasonMetricDefinitions[leagueSeasonStatMode];
    const teamsById = getLeagueTeamsById(season);
    const rows = calculateLeagueSeasonPlayerTotals(season)
        .filter((row) => !definition.empty && row[leagueSeasonStatMode] > 0)
        .sort((a, b) => b[leagueSeasonStatMode] - a[leagueSeasonStatMode] || a.player.localeCompare(b.player));

    return `
        <section class="world-cup-card league-season-stats" aria-labelledby="league-season-stats-heading">
            <div class="world-cup-header">
                <h2 class="world-cup-title" id="league-season-stats-heading">Season player leaders</h2>
                <span class="league-update-note">Calculated from official match records</span>
            </div>
            <div class="world-cup-toggle league-stat-toggle">
                ${Object.entries(leagueSeasonMetricDefinitions).map(([key, metric]) => `
                    <button type="button" data-league-stat="${key}" class="${key === leagueSeasonStatMode ? 'active' : ''}">${metric.label}</button>
                `).join('')}
            </div>
            ${definition.empty ? `
                <p class="league-empty-state league-stat-empty">${definition.label} will be shown once authoritative lineup/minutes data is supplied.</p>
            ` : `
                <div class="world-cup-table-wrap">
                    <table class="world-cup-table league-leaderboard-table">
                        <thead><tr><th>Player</th><th>Team</th><th>${definition.label}</th></tr></thead>
                        <tbody>
                            ${rows.map((row) => `<tr><td>${escapeLeagueText(row.player)}</td><td>${escapeLeagueText(teamsById.get(row.teamId).name)}</td><td>${row[leagueSeasonStatMode]}</td></tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        </section>
    `;
}

function renderLdcRsLeagueTeam(team) {
    const visual = team.image
        ? `<img src="${escapeLeagueText(team.image)}" alt="${escapeLeagueText(team.name)} team image" class="league-team-image">`
        : `<div class="league-team-image league-team-monogram" role="img" aria-label="${escapeLeagueText(team.name)} team identifier">${escapeLeagueText(team.shortName)}</div>`;

    return `
        <details class="world-cup-card league-team-card">
            <summary class="league-team-summary">
                ${visual}
                <span class="league-team-heading">
                    <strong>${escapeLeagueText(team.name)}</strong>
                    <small>${team.roster.length} players</small>
                </span>
                <span class="league-team-expand" aria-hidden="true">+</span>
            </summary>
            <div class="league-team-body">
                <dl class="league-team-leadership">
                    <div><dt>Owner</dt><dd>${escapeLeagueText(team.owner)}</dd></div>
                    <div><dt>Captain</dt><dd>${escapeLeagueText(team.captain)}</dd></div>
                    <div><dt>Co-Captain</dt><dd>${escapeLeagueText(team.coCaptain)}</dd></div>
                </dl>
                <div>
                    <h3 class="league-roster-title">Roster</h3>
                    <ul class="league-roster-list">
                        ${team.roster.map((player) => `<li>${escapeLeagueText(player)}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </details>
    `;
}

function renderLdcRsLeagueSeason() {
    const container = document.getElementById('ldc-rs-league-season-1-container');
    if (!container) {
        return;
    }

    const season = ldcRsLeagueSeason1;
    container.innerHTML = `
        <div class="world-cup-layout league-season-layout">
            <div class="world-cup-card league-season-hero">
                <p class="league-season-kicker">League archive</p>
                <h1>${escapeLeagueText(season.title)}</h1>
                <p>Six teams play a double round robin: every team faces every other team twice.</p>
                <div class="league-format-facts" aria-label="Competition format">
                    <span><strong>${season.format.teamCount}</strong> teams</span>
                    <span><strong>${season.format.matchesPerTeam}</strong> matches per team</span>
                    <span><strong>${season.format.totalMatches}</strong> matches total</span>
                </div>
            </div>

            <div class="league-competition-grid">
                ${renderLdcRsLeagueStandings(season)}
                ${renderLdcRsLeagueResults(season)}
            </div>

            ${renderLeagueMatchView(season, season.matches[0])}

            ${renderLeagueSeasonLeaderboard(season)}

            <section aria-labelledby="league-teams-heading">
                <div class="world-cup-header league-section-header">
                    <h2 class="world-cup-title" id="league-teams-heading">Teams &amp; rosters</h2>
                    <span class="league-update-note">Select a team to view its leadership and squad</span>
                </div>
                <div class="league-teams-grid">
                    ${season.teams.map(renderLdcRsLeagueTeam).join('')}
                </div>
            </section>
        </div>
    `;

    container.querySelectorAll('[data-league-stat]').forEach((button) => {
        button.addEventListener('click', () => {
            leagueSeasonStatMode = button.getAttribute('data-league-stat');
            renderLdcRsLeagueSeason();
        });
    });
}

renderLdcRsLeagueSeason();

if (typeof window !== 'undefined') {
    const leagueHash = '#ldc-rs-league-season-1';
    const navigationTabs = document.querySelectorAll('.tab[data-tab]');

    navigationTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const selectedTab = tab.getAttribute('data-tab');
            const nextHash = selectedTab === ldcRsLeagueSeason1.id ? leagueHash : '';
            window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`);
        });
    });

    if (window.location.hash === leagueHash) {
        document.querySelector(`.tab[data-tab="${ldcRsLeagueSeason1.id}"]`)?.click();
    }
}
