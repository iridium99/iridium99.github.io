const LEAGUE_TEAM_POWER_MODEL_VERSION = 1;
const LEAGUE_PLAYER_POWER_MODEL_VERSION = 1;

const ldcRsLeagueSeason1 = {
    id: 'ldc-rs-league-season-1',
    title: 'LDC RS League Season 1',
    format: {
        type: 'double-round-robin',
        teamCount: 6,
        matchesPerTeam: 10,
        totalMatches: 30
    },
    powerRatingConfig: {
        team: {
            modelVersion: LEAGUE_TEAM_POWER_MODEL_VERSION,
            kFactor: 32,
            expectationDivisor: 400,
            marginStep: 0.20,
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
            modelVersion: LEAGUE_PLAYER_POWER_MODEL_VERSION,
            goal: 5,
            assist: 3,
            mvp: 4,
            cleanSheetHalf: 1.5,
            ownGoal: -2,
            shotOnGoal: 0.25,
            pass: 0.02,
            kick: 0.005,
            teamWinAppearance: 1,
            opponentAdjustment: {
                baseline: 1500,
                divisor: 1000,
                minimum: 0.85,
                maximum: 1.15
            },
            confidence: {
                lowAppearances: 1,
                mediumAppearances: 3
            }
        }
    },
    teams: [
        {
            id: 'baguette-z-apex',
            name: 'Baguette Z Apex',
            shortName: 'BZA',
            image: 'league-assets/baguette-z-apex.webp',
            kit: { primary: '#4a90d9', secondary: '#f8fafc', source: 'configurable-fallback' },
            owner: 'Spero',
            captain: 'Spero',
            coCaptain: 'evilpedri',
            roster: ['Spero', 'V4KS', 'luur', 'zenix', 'oskar', 'Nympex', 'amaanofc', 'evilpedri', 'x', 'myrulez', 'Faya', 'Shield', 'Kaka']
        },
        {
            id: 'hax-united',
            name: 'HAX UNITED',
            shortName: 'HAX',
            image: 'league-assets/hax-united.webp',
            kit: { primary: '#4a90d9', secondary: '#f8fafc', source: 'configurable-fallback' },
            owner: 'GK',
            captain: 'GK',
            coCaptain: 'Misimaro',
            roster: ['GK', 'Braga.', 'Misimaro', 'Pedri.', 'GGG', 'A7mdBibo', 'Arshavin', 'Blimpus', 'dierfetje', 'bananajoe', 'ShadiOzz', 'Szcesny', '$limani']
        },
        {
            id: 'og-fc',
            name: 'OG FC',
            shortName: 'OG',
            image: 'league-assets/og-fc.webp',
            kit: { primary: '#4a90d9', secondary: '#f8fafc', source: 'configurable-fallback' },
            owner: '𝐌𝐨𝐬𝐭𝐚𝐟𝐚 𝐙𝐢𝐤𝐨',
            captain: 'Mbappe',
            coCaptain: '𝐌𝐨𝐬𝐭𝐚𝐟𝐚 𝐙𝐢𝐤𝐨',
            roster: ['𝐌𝐨𝐬𝐭𝐚𝐟𝐚 𝐙𝐢𝐤𝐨', 'Mbappe', 'Nistel', 'Nijad', 'MeeRo', 'Dynaxz', 'Lookman', 'Brutus', 'MaksLuburic', 'Olise', 'saygex', 'Wizop', 'ToughBaby']
        },
        {
            id: 'x-to-win-2',
            name: 'X TO WIN 2',
            shortName: 'XTW',
            image: 'league-assets/x-to-win-2.webp',
            kit: { primary: '#080808', secondary: '#d4af37', accent: '#d4af37', pattern: 'pinstripes', source: 'configured-team-kit' },
            owner: 'Cytro',
            captain: 'Cytro',
            coCaptain: 'SVimes',
            roster: ['Drkuu', 'Ibrahim', 'SamueleRicci', 'Berbatov', 'Naeh', 'SVimes', 'maccy', 'atrocity exhibition', 'elex', 'mitrita KING', 'Wakanda', 'tsukuyomi.', 'wee', 'Johnny Sins']
        },
        {
            id: 'huqqa',
            name: 'HUQQA',
            shortName: 'HUQ',
            image: 'league-assets/huqqa.webp',
            kit: { primary: '#4a90d9', secondary: '#f8fafc', source: 'configurable-fallback' },
            owner: 'Ollhurse',
            captain: 'Lena',
            coCaptain: 'Ollhurse',
            roster: ['Menéur', 'Lena', 'Ollhurse', 'Perkz', 'Saviolo', 'unknown-user', 'barn', 'Razor', 'Grmii', 'Himothy', 'Kimmich', 'whân']
        },
        {
            id: 'rooney-tunes',
            name: 'ROONEY TUNES',
            shortName: 'RT',
            image: 'league-assets/rooney-tunes.webp',
            kit: { primary: '#e53923', secondary: '#ffe94a', source: 'team-image' },
            owner: 'Vonmacron',
            captain: 'Vonmacron',
            coCaptain: 'MRN',
            roster: ['KK', 'MRN', 'click', 'Vonmacron', 'Antax', 'Minicostaud', 'Kahn', 'Swajin', 'ilaola', 'fkfk', '1m bad', 'FITOCHI', 'Luqman', 'JV']
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
            duration: {
                totalSeconds: 588,
                endTimeKnown: true,
                halves: [
                    { half: 1, seconds: 471, display: '7:51', endTimeKnown: true },
                    { half: 2, seconds: 117, display: '1:57', endTimeKnown: true }
                ]
            },
            conclusion: {
                type: 'mercy-rule',
                half: 2,
                atSeconds: 117,
                display: '1:57 2H',
                score: '5–0',
                triggeringPlayer: 'Naeh'
            },
            recording: {
                provider: 'youtube',
                url: 'https://www.youtube.com/watch?v=92OWXudDb7Q',
                videoId: '92OWXudDb7Q',
                thumbnail: 'league-assets/xtw2-rooney-match-1-thumbnail.jpg'
            },
            mvp: 'Drkuu',
            cleanSheetHalves: [
                { player: 'atrocity exhibition', value: 1 },
                { player: 'Naeh', value: 1 }
            ],
            timelineOrdering: {
                firstHalfGoals: 'before-observed-changes',
                secondHalfGoals: 'after-observed-changes'
            },
            timingEvidence: {
                firstHalfCheckpoints: [
                    { observedAt: 28.383, display: '00:28.383', homeGoals: 0, awayGoals: 0 },
                    { observedAt: 90, display: '~01:30', scoreVisible: false, note: 'Clock and score cropped; ilaola and Drkuu visible' },
                    { observedAt: 150.133, display: '02:30.133', homeGoals: 0, awayGoals: 0 },
                    { observedAt: 210.600, display: '03:30.600', homeGoals: 0, awayGoals: 0 },
                    { observedAt: 256.367, display: '04:16.367', homeGoals: 2, awayGoals: 0 },
                    { observedAt: 312.600, display: '05:12.600', homeGoals: 2, awayGoals: 0 },
                    { observedAt: 372.533, display: '06:12.533', homeGoals: 2, awayGoals: 0 },
                    { observedAt: 409.450, display: '06:49.450', homeGoals: 3, awayGoals: 0 },
                    { observedAt: 466.467, display: '07:46.467', homeGoals: 3, awayGoals: 0 }
                ],
                secondHalfCheckpoints: [
                    {
                        observedAt: 35.267, display: '00:35.267', homeGoals: 0, awayGoals: 0,
                        visible: {
                            'x-to-win-2': ['Berbatov', 'elex', 'Drkuu', 'Wakanda', 'atrocity exhibition', 'maccy'],
                            'rooney-tunes': ['KK', 'Vonmacron', 'MRN', '1m bad', 'click', 'ilaola']
                        }
                    },
                    {
                        observedAt: 116.450, display: '01:56.450', homeGoals: 1, awayGoals: 0,
                        visible: {
                            'x-to-win-2': ['Naeh'],
                            'rooney-tunes': []
                        }
                    }
                ]
            },
            scoringEvents: [
                {
                    score: '1–0', type: 'own-goal', player: 'ilaola', assist: null,
                    attribution: 'manual-adjudication-overrides-automatic-source',
                    timing: { type: 'exact', seconds: 211, display: '03:31 (1H)', timelineDisplay: '3:31 1H' }
                },
                {
                    score: '2–0', type: 'goal', player: 'Berbatov', assist: 'atrocity exhibition',
                    timing: { type: 'exact', seconds: 225, display: '03:45 (1H)', timelineDisplay: '3:45 1H' }
                },
                {
                    score: '3–0', type: 'goal', player: 'Berbatov', assist: 'elex',
                    timing: { type: 'exact', seconds: 392, display: '06:32 (1H)', timelineDisplay: '6:32 1H' }
                },
                {
                    score: '4–0', type: 'goal', player: 'Drkuu', assist: 'Berbatov',
                    timing: { type: 'exact', seconds: 87, display: '01:27 (2H)', timelineDisplay: '1:27 2H' }
                },
                {
                    score: '5–0', type: 'goal', player: 'Naeh', assist: 'Drkuu',
                    mercyRuleMatchEnd: true,
                    timing: { type: 'exact', seconds: 117, display: '01:57 (2H)', timelineDisplay: '1:57 2H' }
                }
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
                    sourceGameTime: '1:57 · mercy-rule finish',
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
            lineups: {
                firstHalf: {
                    'x-to-win-2': ['Naeh', 'atrocity exhibition', 'elex', 'Drkuu', 'maccy', 'Berbatov'],
                    'rooney-tunes': ['KK', 'Vonmacron', 'MRN', '1m bad', 'fkfk', 'ilaola']
                },
                secondHalf: {
                    'x-to-win-2': ['atrocity exhibition', 'elex', 'maccy', 'Drkuu', 'Wakanda', 'Berbatov'],
                    'rooney-tunes': ['KK', 'Vonmacron', 'click', 'ilaola', 'MRN', '1m bad']
                }
            },
            // Public, adjudicated broad positions. Future matches use this same
            // simple { player, position } shape for each team's Starting VI.
            startingLineups: {
                'x-to-win-2': [
                    { player: 'Naeh', position: 'GK' },
                    { player: 'atrocity exhibition', position: 'CDM' },
                    { player: 'maccy', position: 'CM' },
                    { player: 'Drkuu', position: 'CM' },
                    { player: 'elex', position: 'LW' },
                    { player: 'Berbatov', position: 'ST' }
                ],
                'rooney-tunes': [
                    { player: 'KK', position: 'GK' },
                    { player: '1m bad', position: 'CB' },
                    { player: 'MRN', position: 'CDM' },
                    { player: 'Vonmacron', position: 'CM' },
                    { player: 'fkfk', position: 'CAM' },
                    { player: 'ilaola', position: 'ST' }
                ]
            },
            // Every player who appeared has one or more chronological position
            // stints. Repeated stints are kept as data but collapsed in display.
            positionStints: {
                'x-to-win-2': [
                    { player: 'Naeh', stints: [{ half: 1, position: 'GK' }, { half: 2, position: 'ST' }], note: 'returned in 2H for maccy', highlight: true },
                    { player: 'atrocity exhibition', stints: [{ half: 1, position: 'CDM' }, { half: 2, position: 'GK' }], highlight: true },
                    { player: 'maccy', stints: [{ half: 1, position: 'CM' }, { half: 2, position: 'CM', until: 'substituted' }] },
                    { player: 'Drkuu', stints: [{ half: 1, position: 'CM', until: 'substituted' }, { half: 2, position: 'CAM' }], highlight: true },
                    { player: 'elex', stints: [{ half: 1, position: 'LW' }, { half: 2, position: 'LW' }] },
                    { player: 'Berbatov', stints: [{ half: 1, position: 'ST' }, { half: 2, position: 'ST' }] },
                    { player: 'Wakanda', stints: [{ half: 1, position: 'CDM' }, { half: 2, position: 'CDM' }], note: 'on for Drkuu', highlight: true }
                ],
                'rooney-tunes': [
                    { player: 'KK', stints: [{ half: 1, position: 'GK' }, { half: 2, position: 'GK' }] },
                    { player: '1m bad', stints: [{ half: 1, position: 'CB' }, { half: 2, position: 'CB' }] },
                    { player: 'MRN', stints: [{ half: 1, position: 'CDM' }, { half: 2, position: 'CDM' }] },
                    { player: 'Vonmacron', stints: [{ half: 1, position: 'CM' }, { half: 2, position: 'CM' }] },
                    { player: 'fkfk', stints: [{ half: 1, position: 'CAM' }], note: 'off at HT', highlight: true },
                    { player: 'ilaola', stints: [{ half: 1, position: 'ST' }, { half: 2, position: 'ST' }], note: 'off in 1H, returned at HT', highlight: true },
                    { player: 'click', stints: [{ half: 1, position: 'CDM' }, { half: 2, position: 'CDM' }], note: 'on for ilaola', highlight: true }
                ]
            },
            substitutions: [
                {
                    teamId: 'x-to-win-2', half: 1, playerIn: 'Wakanda', playerOut: 'Drkuu',
                    timing: { type: 'observed-interval', observedStart: 372.533, observedEnd: 409.450, display: '06:12.533–06:49.450 (1H)', timelineDisplay: '6:13–6:49 1H', estimated: true }
                },
                {
                    teamId: 'rooney-tunes', half: 1, playerIn: 'click', playerOut: 'ilaola',
                    timing: { type: 'observed-interval', observedStart: 210.600, observedEnd: 256.367, display: '03:30.600–04:16.367 (1H)', timelineDisplay: '3:31–4:16 1H', estimated: true }
                },
                {
                    teamId: 'x-to-win-2', half: 'halftime', playerIn: 'Drkuu', playerOut: 'Naeh',
                    timing: { type: 'halftime', display: 'Halftime' }
                },
                {
                    teamId: 'rooney-tunes', half: 'halftime', playerIn: 'ilaola', playerOut: 'fkfk',
                    timing: { type: 'halftime', display: 'Halftime' }
                },
                {
                    teamId: 'x-to-win-2', half: 2, playerIn: 'Naeh', playerOut: 'maccy',
                    timing: {
                        type: 'observed-interval', observedStart: 65, observedEnd: 96,
                        display: '01:05–01:36 (2H)', timelineDisplay: '1:05–1:36 2H', estimated: true
                    }
                }
            ],
            goalkeepers: {
                firstHalf: { 'x-to-win-2': 'Naeh', 'rooney-tunes': 'KK' },
                secondHalf: { 'x-to-win-2': 'atrocity exhibition', 'rooney-tunes': 'KK' }
            },
            // Whole-half assignments for the current evidence. Future partial-half
            // records can add stintStart, stintEnd, and goalsConceded without
            // changing the clean-sheet-rate denominator.
            goalkeeperAssignments: [
                { player: 'Naeh', teamId: 'x-to-win-2', half: 1, status: 'goalkeeper', cleanSheetEligible: true },
                { player: 'atrocity exhibition', teamId: 'x-to-win-2', half: 2, status: 'goalkeeper', cleanSheetEligible: true },
                { player: 'KK', teamId: 'rooney-tunes', half: 1, status: 'goalkeeper', cleanSheetEligible: true },
                { player: 'KK', teamId: 'rooney-tunes', half: 2, status: 'goalkeeper', cleanSheetEligible: true }
            ]
        },
        {
            id: 'match-2-og-fc-v-hax-united',
            homeTeamId: 'og-fc',
            awayTeamId: 'hax-united',
            homeGoals: 3,
            awayGoals: 2,
            duration: {
                totalSeconds: 986,
                endTimeKnown: true,
                halves: [
                    { half: 1, seconds: 482, display: '8:02', endTimeKnown: true },
                    { half: 2, seconds: 504, display: '8:24', endTimeKnown: true }
                ]
            },
            conclusion: { type: 'full-time', score: '3–2' },
            mvp: 'Mbappe',
            cleanSheetHalves: [],
            scoringEvents: [
                {
                    score: '1–0', type: 'goal', player: '𝐌𝐨𝐬𝐭𝐚𝐟𝐚 𝐙𝐢𝐤𝐨', assist: 'saygex',
                    attribution: 'manual-adjudication-overrides-automatic-source',
                    timing: { type: 'exact', seconds: 185, halfSeconds: 185, cumulativeSeconds: 185, display: '03:05 (1H)', halfDisplay: '3:05', cumulativeDisplay: '3:05', timelineDisplay: '3:05 1H' }
                },
                {
                    score: '1–1', type: 'own-goal', player: 'Nistel', assist: null, benefitsTeamId: 'hax-united',
                    attribution: 'manual-adjudication-overrides-automatic-source',
                    timing: { type: 'exact', seconds: 320, halfSeconds: 320, cumulativeSeconds: 320, display: '05:20 (1H)', halfDisplay: '5:20', cumulativeDisplay: '5:20', timelineDisplay: '5:20 1H' }
                },
                {
                    score: '1–2', type: 'goal', player: 'bananajoe', assist: 'Arshavin',
                    attribution: 'manual-adjudication-overrides-automatic-source',
                    timing: { type: 'exact', seconds: 128, halfSeconds: 128, cumulativeSeconds: 610, display: '02:08 (2H)', halfDisplay: '2:08', cumulativeDisplay: '10:10', timelineDisplay: '2:08 2H · 10:10 total' }
                },
                {
                    score: '2–2', type: 'goal', player: 'Mbappe', assist: 'MaksLuburic',
                    attribution: 'manual-adjudication-overrides-automatic-source',
                    timing: { type: 'exact', seconds: 139, halfSeconds: 139, cumulativeSeconds: 621, display: '02:19 (2H)', halfDisplay: '2:19', cumulativeDisplay: '10:21', timelineDisplay: '2:19 2H · 10:21 total' }
                },
                {
                    score: '3–2', type: 'own-goal', player: 'Misimaro', assist: null, benefitsTeamId: 'og-fc',
                    attribution: 'manual-adjudication-overrides-automatic-source',
                    timing: { type: 'exact', seconds: 393, halfSeconds: 393, cumulativeSeconds: 875, display: '06:33 (2H)', halfDisplay: '6:33', cumulativeDisplay: '14:35', timelineDisplay: '6:33 2H · 14:35 total' }
                }
            ],
            halves: [
                {
                    label: 'First half', sourceGameTime: '8:02', homeGoals: 1, awayGoals: 1,
                    teamStats: {
                        'og-fc': { possession: 46.3, kicks: 116, passes: 48, shotsOnGoal: 4 },
                        'hax-united': { possession: 53.7, kicks: 124, passes: 56, shotsOnGoal: 5 }
                    },
                    playerStats: { 'og-fc': [], 'hax-united': [] }
                },
                {
                    label: 'Second half', sourceGameTime: '8:24', homeGoals: 2, awayGoals: 1,
                    teamStats: {
                        'og-fc': { possession: 46.5, kicks: 124, passes: 44, shotsOnGoal: 2 },
                        'hax-united': { possession: 53.5, kicks: 150, passes: 67, shotsOnGoal: 7 }
                    },
                    playerStats: { 'og-fc': [], 'hax-united': [] }
                }
            ],
            fullMatchPlayerStats: {
                'og-fc': [
                    { player: 'ToughBaby', kicks: 47, passes: 23, shotsOnGoal: 0 },
                    { player: 'saygex', kicks: 33, passes: 15, shotsOnGoal: 0 },
                    { player: '𝐌𝐨𝐬𝐭𝐚𝐟𝐚 𝐙𝐢𝐤𝐨', kicks: 25, passes: 4, shotsOnGoal: 1 },
                    { player: 'Nijad', kicks: 12, passes: 5, shotsOnGoal: 0 },
                    { player: 'MaksLuburic', kicks: 27, passes: 5, shotsOnGoal: 2 },
                    { player: 'Nistel', kicks: 35, passes: 15, shotsOnGoal: 2 },
                    { player: 'Mbappe', kicks: 47, passes: 21, shotsOnGoal: 1 },
                    { player: 'Dynaxz', kicks: 14, passes: 4, shotsOnGoal: 0 }
                ],
                'hax-united': [
                    { player: 'GK', kicks: 44, passes: 20, shotsOnGoal: 0 },
                    { player: 'Pedri', kicks: 39, passes: 19, shotsOnGoal: 2 },
                    { player: 'Misimaro', kicks: 26, passes: 9, shotsOnGoal: 0 },
                    { player: 'bananajoe', kicks: 51, passes: 22, shotsOnGoal: 5 },
                    { player: '$limani', kicks: 56, passes: 28, shotsOnGoal: 0 },
                    { player: 'Arshavin', kicks: 43, passes: 19, shotsOnGoal: 5 },
                    { player: 'GGG', kicks: 15, passes: 6, shotsOnGoal: 0 }
                ]
            },
            lineups: {
                firstHalf: {
                    'og-fc': ['Nistel', 'Nijad', 'MaksLuburic', 'Mbappe', 'saygex', '𝐌𝐨𝐬𝐭𝐚𝐟𝐚 𝐙𝐢𝐤𝐨'],
                    'hax-united': ['GK', 'Pedri', '$limani', 'Misimaro', 'Arshavin', 'bananajoe']
                },
                secondHalf: {
                    'og-fc': ['Nistel', 'ToughBaby', 'MaksLuburic', 'Mbappe', 'saygex', '𝐌𝐨𝐬𝐭𝐚𝐟𝐚 𝐙𝐢𝐤𝐨'],
                    'hax-united': ['GK', 'Pedri', '$limani', 'GGG', 'Arshavin', 'bananajoe']
                }
            },
            startingLineups: {
                'og-fc': [
                    { player: 'Nistel', position: 'GK' }, { player: 'Nijad', position: 'CB' },
                    { player: 'MaksLuburic', position: 'CM' }, { player: 'Mbappe', position: 'CAM' },
                    { player: 'saygex', position: 'LW' }, { player: '𝐌𝐨𝐬𝐭𝐚𝐟𝐚 𝐙𝐢𝐤𝐨', position: 'ST' }
                ],
                'hax-united': [
                    { player: 'GK', position: 'GK' }, { player: 'Pedri', position: 'CDM' },
                    { player: '$limani', position: 'CM' }, { player: 'Misimaro', position: 'CAM' },
                    { player: 'Arshavin', position: 'LW' }, { player: 'bananajoe', position: 'ST' }
                ]
            },
            positionStints: {
                'og-fc': [
                    { player: 'Nistel', stints: [{ half: 1, position: 'GK' }, { half: 2, position: 'GK' }] },
                    { player: 'Nijad', stints: [{ half: 1, position: 'CB', until: 'substituted' }] },
                    { player: 'ToughBaby', stints: [{ half: 1, position: 'CB' }, { half: 2, position: 'CB' }], note: 'on for Nijad', highlight: true },
                    { player: 'MaksLuburic', stints: [{ half: 1, position: 'CM' }, { half: 2, position: 'CM', until: 'substituted' }] },
                    { player: 'Dynaxz', stints: [{ half: 2, position: 'CM' }], note: 'on for MaksLuburic', highlight: true },
                    { player: 'Mbappe', stints: [{ half: 1, position: 'CAM' }, { half: 2, position: 'CAM' }] },
                    { player: 'saygex', stints: [{ half: 1, position: 'LW' }, { half: 2, position: 'LW' }] },
                    { player: '𝐌𝐨𝐬𝐭𝐚𝐟𝐚 𝐙𝐢𝐤𝐨', stints: [{ half: 1, position: 'ST' }, { half: 2, position: 'ST' }] }
                ],
                'hax-united': [
                    { player: 'GK', stints: [{ half: 1, position: 'GK' }, { half: 2, position: 'GK' }] },
                    { player: 'Pedri', stints: [{ half: 1, position: 'CDM' }, { half: 2, position: 'CDM' }] },
                    { player: '$limani', stints: [{ half: 1, position: 'CM' }, { half: 2, position: 'CM' }] },
                    { player: 'Misimaro', stints: [{ half: 1, position: 'CAM' }, { half: 2, position: 'ST' }], note: 'off at HT, returned in 2H for bananajoe', highlight: true },
                    { player: 'GGG', stints: [{ half: 2, position: 'CAM' }], note: 'on for Misimaro at HT', highlight: true },
                    { player: 'Arshavin', stints: [{ half: 1, position: 'LW' }, { half: 2, position: 'LW' }] },
                    { player: 'bananajoe', stints: [{ half: 1, position: 'ST' }, { half: 2, position: 'ST', until: 'substituted' }] }
                ]
            },
            substitutions: [
                {
                    teamId: 'og-fc', half: 1, playerIn: 'ToughBaby', playerOut: 'Nijad',
                    timing: { type: 'observed-interval', observedStart: 313.933, observedEnd: 320.333, display: '05:13.933–05:20.333 (1H)', timelineDisplay: '5:14–5:20 1H', approximateDisplay: '5:17 1H', estimated: true }
                },
                {
                    teamId: 'hax-united', half: 'halftime', playerIn: 'GGG', playerOut: 'Misimaro',
                    timing: { type: 'halftime', display: 'Halftime' }
                },
                {
                    teamId: 'og-fc', half: 2, playerIn: 'Dynaxz', playerOut: 'MaksLuburic',
                    timing: { type: 'observed-interval', observedStart: 214.4, observedEnd: 239.733, display: '03:34.400–03:59.733 (2H)', timelineDisplay: '3:34–4:00 2H', approximateDisplay: '3:47 2H', estimated: true }
                },
                {
                    teamId: 'hax-united', half: 2, playerIn: 'Misimaro', playerOut: 'bananajoe',
                    timing: { type: 'observed-interval', observedStart: 271.5, observedEnd: 297.033, display: '04:31.500–04:57.033 (2H)', timelineDisplay: '4:32–4:57 2H', approximateDisplay: '4:44 2H', estimated: true }
                }
            ],
            goalkeepers: {
                firstHalf: { 'og-fc': 'Nistel', 'hax-united': 'GK' },
                secondHalf: { 'og-fc': 'Nistel', 'hax-united': 'GK' }
            },
            goalkeeperAssignments: [
                { player: 'Nistel', teamId: 'og-fc', half: 1, status: 'goalkeeper', cleanSheetEligible: true },
                { player: 'Nistel', teamId: 'og-fc', half: 2, status: 'goalkeeper', cleanSheetEligible: true },
                { player: 'GK', teamId: 'hax-united', half: 1, status: 'goalkeeper', cleanSheetEligible: true },
                { player: 'GK', teamId: 'hax-united', half: 2, status: 'goalkeeper', cleanSheetEligible: true }
            ]
        },
        {
            id: 'match-3-huqqa-v-baguette-z-apex',
            homeTeamId: 'huqqa',
            awayTeamId: 'baguette-z-apex',
            homeGoals: 1,
            awayGoals: 0,
            duration: {
                totalSeconds: 989,
                endTimeKnown: true,
                halves: [
                    { half: 1, seconds: 477, display: '7:57', endTimeKnown: true },
                    { half: 2, seconds: 512, display: '8:32', endTimeKnown: true }
                ]
            },
            conclusion: { type: 'full-time', score: '1–0' },
            mvp: 'Grmii',
            cleanSheetHalves: [
                { player: 'Lena', value: 2 },
                { player: 'luur', value: 1 }
            ],
            scoringEvents: [
                {
                    score: '1–0', type: 'goal', player: 'Grmii', assist: null,
                    attribution: 'manual-adjudication-overrides-automatic-source',
                    timing: { type: 'exact', seconds: 47, halfSeconds: 47, cumulativeSeconds: 47, display: '00:47 (1H)', halfDisplay: '0:47', cumulativeDisplay: '0:47', timelineDisplay: '0:47 1H' }
                }
            ],
            halves: [
                {
                    label: 'First half', sourceGameTime: '7:57', homeGoals: 1, awayGoals: 0,
                    teamStats: {
                        huqqa: { possession: 51.7, kicks: 124, passes: 58, shotsOnGoal: 3 },
                        'baguette-z-apex': { possession: 48.3, kicks: 121, passes: 56, shotsOnGoal: 3 }
                    },
                    playerStats: { huqqa: [], 'baguette-z-apex': [] }
                },
                {
                    label: 'Second half', sourceGameTime: '8:32', homeGoals: 0, awayGoals: 0,
                    teamStats: {
                        huqqa: { possession: 45.4, kicks: 121, passes: 54, shotsOnGoal: 6 },
                        'baguette-z-apex': { possession: 54.6, kicks: 132, passes: 60, shotsOnGoal: 2 }
                    },
                    playerStats: { huqqa: [], 'baguette-z-apex': [] }
                }
            ],
            fullMatchPlayerStats: {
                huqqa: [
                    { player: 'Grmii', kicks: 37, passes: 19, shotsOnGoal: 2 },
                    { player: 'Saviolo', kicks: 31, passes: 9, shotsOnGoal: 3 },
                    { player: 'Ollhurse', kicks: 34, passes: 16, shotsOnGoal: 2 },
                    { player: 'Perkz', kicks: 59, passes: 31, shotsOnGoal: 2 },
                    { player: 'Lena', kicks: 46, passes: 24, shotsOnGoal: 0 },
                    { player: 'Kimmich', kicks: 38, passes: 13, shotsOnGoal: 0 }
                ],
                'baguette-z-apex': [
                    { player: 'zenix', kicks: 31, passes: 13, shotsOnGoal: 2 },
                    { player: 'V4KS', kicks: 48, passes: 20, shotsOnGoal: 1 },
                    { player: 'Spero', kicks: 22, passes: 7, shotsOnGoal: 0 },
                    { player: 'evilpedri', kicks: 35, passes: 15, shotsOnGoal: 0 },
                    { player: 'luur', kicks: 54, passes: 29, shotsOnGoal: 0 },
                    { player: 'oskar', kicks: 22, passes: 9, shotsOnGoal: 1 },
                    { player: 'Shield', kicks: 10, passes: 5, shotsOnGoal: 0 },
                    { player: 'Nympex', kicks: 31, passes: 18, shotsOnGoal: 1 }
                ]
            },
            lineups: {
                firstHalf: {
                    huqqa: ['Lena', 'Kimmich', 'Ollhurse', 'Perkz', 'Grmii', 'Saviolo'],
                    'baguette-z-apex': ['luur', 'V4KS', 'evilpedri', 'oskar', 'zenix', 'Spero']
                },
                secondHalf: {
                    huqqa: ['Lena', 'Kimmich', 'Ollhurse', 'Perkz', 'Grmii', 'Saviolo'],
                    'baguette-z-apex': ['luur', 'V4KS', 'evilpedri', 'Nympex', 'zenix', 'Shield']
                }
            },
            startingLineups: {
                huqqa: [
                    { player: 'Lena', position: 'GK' }, { player: 'Kimmich', position: 'CDM' },
                    { player: 'Ollhurse', position: 'CM' }, { player: 'Perkz', position: 'LW' },
                    { player: 'Grmii', position: 'RW' }, { player: 'Saviolo', position: 'ST' }
                ],
                'baguette-z-apex': [
                    { player: 'luur', position: 'GK' }, { player: 'V4KS', position: 'CDM' },
                    { player: 'evilpedri', position: 'CM' }, { player: 'oskar', position: 'CAM' },
                    { player: 'zenix', position: 'LW' }, { player: 'Spero', position: 'ST' }
                ]
            },
            positionStints: {
                huqqa: [
                    { player: 'Lena', stints: [{ half: 1, position: 'GK' }, { half: 2, position: 'GK' }] },
                    { player: 'Kimmich', stints: [{ half: 1, position: 'CDM' }, { half: 2, position: 'CDM' }] },
                    { player: 'Ollhurse', stints: [{ half: 1, position: 'CM' }, { half: 2, position: 'CM' }] },
                    { player: 'Perkz', stints: [{ half: 1, position: 'LW' }, { half: 2, position: 'LW' }] },
                    { player: 'Grmii', stints: [{ half: 1, position: 'RW' }, { half: 2, position: 'RW' }] },
                    { player: 'Saviolo', stints: [{ half: 1, position: 'ST' }, { half: 2, position: 'ST' }] }
                ],
                'baguette-z-apex': [
                    { player: 'luur', stints: [{ half: 1, position: 'GK' }, { half: 2, position: 'GK' }] },
                    { player: 'V4KS', stints: [{ half: 1, position: 'CDM' }, { half: 2, position: 'CDM' }] },
                    { player: 'evilpedri', stints: [{ half: 1, position: 'CM' }, { half: 2, position: 'CM' }] },
                    { player: 'zenix', stints: [{ half: 1, position: 'LW' }, { half: 2, position: 'LW' }] },
                    { player: 'oskar', stints: [{ half: 1, position: 'CAM' }], note: 'off at HT', highlight: true },
                    { player: 'Nympex', stints: [{ half: 2, position: 'CAM' }], note: 'on for oskar at HT', highlight: true },
                    { player: 'Spero', stints: [{ half: 1, position: 'ST' }, { half: 2, position: 'ST' }], note: 'off at HT, returned in 2H for Shield', highlight: true },
                    { player: 'Shield', stints: [{ half: 2, position: 'ST', until: 'substituted' }], note: 'on for Spero at HT', highlight: true }
                ]
            },
            substitutions: [
                {
                    teamId: 'baguette-z-apex', half: 'halftime', playerIn: 'Nympex', playerOut: 'oskar',
                    timing: { type: 'halftime', display: 'Halftime' }
                },
                {
                    teamId: 'baguette-z-apex', half: 'halftime', playerIn: 'Shield', playerOut: 'Spero',
                    timing: { type: 'halftime', display: 'Halftime' }
                },
                {
                    teamId: 'baguette-z-apex', half: 2, playerIn: 'Spero', playerOut: 'Shield',
                    timing: { type: 'observed-interval', observedStart: 318.150, observedEnd: 340.500, display: '05:18.150–05:40.500 (2H)', timelineDisplay: '5:18–5:40 2H', approximateDisplay: '5:29 2H', estimated: true }
                }
            ],
            goalkeepers: {
                firstHalf: { huqqa: 'Lena', 'baguette-z-apex': 'luur' },
                secondHalf: { huqqa: 'Lena', 'baguette-z-apex': 'luur' }
            },
            goalkeeperAssignments: [
                { player: 'Lena', teamId: 'huqqa', half: 1, status: 'goalkeeper', cleanSheetEligible: true },
                { player: 'Lena', teamId: 'huqqa', half: 2, status: 'goalkeeper', cleanSheetEligible: true },
                { player: 'luur', teamId: 'baguette-z-apex', half: 1, status: 'goalkeeper', cleanSheetEligible: true },
                { player: 'luur', teamId: 'baguette-z-apex', half: 2, status: 'goalkeeper', cleanSheetEligible: true }
            ]
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
        Pts: 0,
        form: []
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

        const homeResult = match.homeGoals === match.awayGoals ? 'D' : match.homeGoals > match.awayGoals ? 'W' : 'L';
        const awayResult = homeResult === 'D' ? 'D' : homeResult === 'W' ? 'L' : 'W';
        home.form.push({ result: homeResult, opponentTeamId: match.awayTeamId, goalsFor: match.homeGoals, goalsAgainst: match.awayGoals, matchId: match.id });
        away.form.push({ result: awayResult, opponentTeamId: match.homeTeamId, goalsFor: match.awayGoals, goalsAgainst: match.homeGoals, matchId: match.id });
    });

    return [...table.values()]
        .map((row) => ({ ...row, GD: row.GF - row.GA }))
        .sort((a, b) => b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF || a.order - b.order);
}

function calculateLeagueTeamPowerHistory(season) {
    const config = season.powerRatingConfig.team;
    const ratings = new Map(season.teams.map((team) => [team.id, config.startingRatings[team.id]]));
    const preMatchRatings = new Map();

    season.matches.forEach((match, chronologicalIndex) => {
        const homeRating = ratings.get(match.homeTeamId);
        const awayRating = ratings.get(match.awayTeamId);
        preMatchRatings.set(match.id, {
            matchId: match.id,
            chronologicalIndex,
            homePreMatchRating: homeRating,
            awayPreMatchRating: awayRating
        });
        const expectedHome = 1 / (1 + (10 ** ((awayRating - homeRating) / config.expectationDivisor)));
        const homeResult = match.homeGoals === match.awayGoals ? 0.5 : match.homeGoals > match.awayGoals ? 1 : 0;
        const goalDifference = Math.abs(match.homeGoals - match.awayGoals);
        const marginMultiplier = 1 + config.marginStep * Math.min(Math.max(goalDifference - 1, 0), config.marginCap);
        const change = config.kFactor * marginMultiplier * (homeResult - expectedHome);

        ratings.set(match.homeTeamId, homeRating + change);
        ratings.set(match.awayTeamId, awayRating - change);
    });

    return { ratings, preMatchRatings };
}

function getLeagueTeamsById(season) {
    return new Map(season.teams.map((team) => [team.id, team]));
}

function getLeagueMatchPlayerTeams(season, match) {
    const playerTeams = new Map();
    season.teams.forEach((team) => {
        team.roster.forEach((player) => playerTeams.set(player, team.id));
    });
    // Match records are authoritative for historical participation. This keeps a
    // player's old match affiliation intact after their current roster changes.
    match.halves.forEach((half) => {
        Object.entries(half.playerStats).forEach(([teamId, rows]) => {
            rows.forEach(({ player }) => playerTeams.set(player, teamId));
        });
    });
    Object.entries(match.fullMatchPlayerStats || {}).forEach(([teamId, rows]) => {
        rows.forEach(({ player }) => playerTeams.set(player, teamId));
    });
    return playerTeams;
}

function deriveLeagueMatchParticipation(match) {
    const participation = new Map();
    const active = new Map();
    const firstHalfSeconds = match.duration.halves[0].seconds;
    const participationBoundary = match.duration.totalSeconds ?? match.duration.observedThroughSeconds;
    const durationIncomplete = !match.duration.endTimeKnown;
    const ensure = (player) => {
        if (!participation.has(player)) {
            participation.set(player, { player, appearances: 1, seconds: 0, estimated: false, incomplete: false });
        }
        return participation.get(player);
    };
    const enter = (player, second) => {
        ensure(player);
        active.set(player, second);
    };
    const leave = (player, second, estimated, incomplete = false) => {
        const startedAt = active.get(player);
        if (startedAt === undefined) return;
        const row = ensure(player);
        row.seconds += second - startedAt;
        row.estimated = row.estimated || estimated;
        row.incomplete = row.incomplete || incomplete;
        active.delete(player);
    };

    Object.values(match.lineups.firstHalf).flat().forEach((player) => enter(player, 0));

    match.substitutions
        .filter((substitution) => substitution.half === 1)
        .sort((a, b) => a.timing.observedStart - b.timing.observedStart)
        .forEach((substitution) => {
            const estimatedSecond = (substitution.timing.observedStart + substitution.timing.observedEnd) / 2;
            leave(substitution.playerOut, estimatedSecond, true);
            enter(substitution.playerIn, estimatedSecond);
            ensure(substitution.playerIn).estimated = true;
        });

    const secondHalfPlayers = new Set(Object.values(match.lineups.secondHalf).flat());
    [...active.keys()].filter((player) => !secondHalfPlayers.has(player)).forEach((player) => leave(player, firstHalfSeconds, false));
    secondHalfPlayers.forEach((player) => {
        if (!active.has(player)) enter(player, firstHalfSeconds);
    });

    match.substitutions
        .filter((substitution) => substitution.half === 2)
        .sort((a, b) => a.timing.observedStart - b.timing.observedStart)
        .forEach((substitution) => {
            const estimatedSecond = firstHalfSeconds + (substitution.timing.observedStart + substitution.timing.observedEnd) / 2;
            leave(substitution.playerOut, estimatedSecond, true);
            enter(substitution.playerIn, estimatedSecond);
            ensure(substitution.playerIn).estimated = true;
        });

    [...active.keys()].forEach((player) => leave(player, participationBoundary, durationIncomplete, durationIncomplete));
    return [...participation.values()];
}

function calculateLeagueMatchPlayerTotals(season, match) {
    const totals = new Map();
    const playerTeams = getLeagueMatchPlayerTeams(season, match);
    const participationRows = deriveLeagueMatchParticipation(match);
    const participantNames = new Set(participationRows.map(({ player }) => player));
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
                goalkeeperHalvesPlayed: 0,
                appearances: 0,
                minutes: 0,
                minutesEstimated: false,
                minutesIncomplete: false
            });
        }
        return totals.get(player);
    };

    const authoritativePlayerStats = match.fullMatchPlayerStats
        ? Object.values(match.fullMatchPlayerStats).flat()
        : match.halves.flatMap((half) => Object.values(half.playerStats).flat());
    authoritativePlayerStats.forEach((statLine) => {
            const total = ensurePlayer(statLine.player);
            total.kicks += statLine.kicks;
            total.passes += statLine.passes;
            total.shotsOnGoal += statLine.shotsOnGoal;
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

    if (participantNames.has(match.mvp)) ensurePlayer(match.mvp).mvps += 1;
    match.cleanSheetHalves.forEach((credit) => {
        if (participantNames.has(credit.player)) ensurePlayer(credit.player).cleanSheetHalves += credit.value;
    });
    match.goalkeeperAssignments.forEach((assignment) => {
        if (assignment.status === 'goalkeeper' && assignment.cleanSheetEligible && participantNames.has(assignment.player)) {
            ensurePlayer(assignment.player).goalkeeperHalvesPlayed += 1;
        }
    });

    participationRows.forEach((participation) => {
        const total = ensurePlayer(participation.player);
        total.appearances = participation.appearances;
        total.minutes = participation.seconds;
        total.minutesEstimated = participation.estimated;
        total.minutesIncomplete = participation.incomplete;
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
            ['kicks', 'passes', 'shotsOnGoal', 'goals', 'assists', 'ownGoals', 'mvps', 'cleanSheetHalves', 'goalkeeperHalvesPlayed', 'appearances', 'minutes']
                .forEach((key) => { seasonRow[key] += matchRow[key]; });
            seasonRow.minutesEstimated = seasonRow.minutesEstimated || matchRow.minutesEstimated;
            seasonRow.minutesIncomplete = seasonRow.minutesIncomplete || matchRow.minutesIncomplete;
        });
    });

    return [...totals.values()].map((row) => ({ ...row, goalContributions: row.goals + row.assists }));
}

function calculateLeagueOpponentMultiplier(opponentPreMatchRating, config) {
    const rawMultiplier = 1 + (opponentPreMatchRating - config.baseline) / config.divisor;
    return Math.min(config.maximum, Math.max(config.minimum, rawMultiplier));
}

function calculateLeaguePlayerPowerConfidence(appearances, config) {
    if (appearances <= config.lowAppearances) return { level: 'Low confidence', label: 'Provisional' };
    if (appearances <= config.mediumAppearances) return { level: 'Medium confidence', label: 'Medium' };
    return { level: 'Higher confidence', label: 'Higher' };
}

function calculateLeaguePlayerMatchPower(season, match, preMatchRating) {
    const config = season.powerRatingConfig.player;
    const winningTeamId = match.homeGoals === match.awayGoals
        ? null
        : match.homeGoals > match.awayGoals ? match.homeTeamId : match.awayTeamId;

    return calculateLeagueMatchPlayerTotals(season, match).map((row) => {
        const opponentPreMatchRating = row.teamId === match.homeTeamId
            ? preMatchRating.awayPreMatchRating
            : preMatchRating.homePreMatchRating;
        const opponentMultiplier = calculateLeagueOpponentMultiplier(opponentPreMatchRating, config.opponentAdjustment);
        const teamWinAppearance = row.appearances > 0 && row.teamId === winningTeamId ? 1 : 0;
        const adjustedImpact = (row.goals * config.goal
            + row.assists * config.assist
            + row.mvps * config.mvp
            + row.cleanSheetHalves * config.cleanSheetHalf
            + teamWinAppearance * config.teamWinAppearance) * opponentMultiplier;
        const fixedAndVolumeImpact = row.ownGoals * config.ownGoal
            + row.shotsOnGoal * config.shotOnGoal
            + row.passes * config.pass
            + row.kicks * config.kick;
        return {
            ...row,
            teamWinAppearance,
            opponentPreMatchRating,
            opponentMultiplier,
            score: adjustedImpact + fixedAndVolumeImpact
        };
    });
}

function calculateLeaguePlayerPowerRankings(season) {
    const config = season.powerRatingConfig.player;
    const history = calculateLeagueTeamPowerHistory(season);
    const powerByPlayer = new Map();

    season.matches.forEach((match) => {
        calculateLeaguePlayerMatchPower(season, match, history.preMatchRatings.get(match.id)).forEach((matchRow) => {
            const existing = powerByPlayer.get(matchRow.player) || { score: 0, teamWinAppearances: 0 };
            existing.score += matchRow.score;
            existing.teamWinAppearances += matchRow.teamWinAppearance;
            powerByPlayer.set(matchRow.player, existing);
        });
    });

    return calculateLeagueSeasonPlayerTotals(season).map((row) => {
        const power = powerByPlayer.get(row.player) || { score: 0, teamWinAppearances: 0 };
        return {
            ...row,
            ...power,
            confidence: calculateLeaguePlayerPowerConfidence(row.appearances, config.confidence)
        };
    }).sort((a, b) => b.score - a.score
        || b.goalContributions - a.goalContributions
        || b.mvps - a.mvps
        || b.goals - a.goals
        || b.assists - a.assists
        || a.player.localeCompare(b.player));
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

function deriveLeagueMatchEvents(match) {
    const firstHalfGoalCount = match.halves[0].homeGoals + match.halves[0].awayGoals;
    const firstHalfSeconds = match.duration.halves[0].seconds;
    const observedMatchBoundary = match.duration.totalSeconds ?? match.duration.observedThroughSeconds ?? firstHalfSeconds;
    const goalHalfSequence = { 1: 0, 2: 0 };
    const goalEvents = match.scoringEvents.map((event, index) => {
        const half = index < firstHalfGoalCount ? 1 : 2;
        goalHalfSequence[half] += 1;
        if (event.timing?.type === 'exact') {
            const halfOffset = half === 2 ? firstHalfSeconds : 0;
            return {
                ...event,
                half,
                eventType: event.type === 'own-goal' ? 'own-goal' : 'goal',
                displayTime: event.timing.timelineDisplay,
                detailTime: event.timing.display.replace(/ \((1H|2H)\)$/, ' $1'),
                sortValue: event.timing.cumulativeSeconds ?? halfOffset + event.timing.seconds,
                sortBasis: 'exact-match-clock',
                exactSecond: event.timing.seconds,
                halfLocalSecond: event.timing.halfSeconds ?? event.timing.seconds,
                cumulativeSecond: event.timing.cumulativeSeconds ?? halfOffset + event.timing.seconds,
                timingUncertain: false,
                groupKey: `${half}:exact:${event.timing.seconds}:${index}`,
                sourceOrder: index,
                stableOrder: index
            };
        }
        if (event.timing?.type === 'after-observed') {
            return {
                ...event,
                half,
                eventType: event.type === 'own-goal' ? 'own-goal' : 'goal',
                displayTime: event.timing.timelineDisplay,
                detailTime: event.timing.display.replace(/ \((1H|2H)\)$/, ' $1'),
                sortValue: firstHalfSeconds + event.timing.observedStart + 1,
                sortBasis: 'known-after-observed-boundary',
                observedStart: event.timing.observedStart,
                observedEnd: null,
                timingUncertain: true,
                groupKey: `${half}:after:${event.timing.observedStart}`,
                sourceOrder: index,
                stableOrder: index
            };
        }
        if (event.timing?.type === 'observed-interval') {
            const groupStart = event.timing.groupObservedStart ?? event.timing.observedStart;
            const groupEnd = event.timing.groupObservedEnd ?? event.timing.observedEnd;
            const midpoint = (groupStart + groupEnd) / 2;
            const halfOffset = half === 2 ? firstHalfSeconds : 0;
            return {
                ...event,
                half,
                eventType: event.type === 'own-goal' ? 'own-goal' : 'goal',
                displayTime: event.timing.groupTimelineDisplay || event.timing.timelineDisplay,
                detailTime: `Observed ${event.timing.display.replace(/ \((1H|2H)\)$/, ' $1')}`,
                sortValue: halfOffset + midpoint,
                sortBasis: 'shared-observed-range',
                observedStart: event.timing.observedStart,
                observedEnd: event.timing.observedEnd,
                timingUncertain: true,
                groupKey: event.timing.uncertaintyGroup || `${half}:${event.timing.observedStart}:${event.timing.observedEnd}`,
                sourceOrder: index,
                stableOrder: index
            };
        }
        // Goal clocks were not supplied. Sequence-only values preserve adjudicated
        // scoring order and configured event grouping without presenting invented times.
        const goalOrdering = half === 1 ? match.timelineOrdering?.firstHalfGoals : match.timelineOrdering?.secondHalfGoals;
        const sequenceSortValue = goalOrdering === 'after-observed-changes'
            ? (half === 1 ? firstHalfSeconds : observedMatchBoundary) - 1 + goalHalfSequence[half] / 1000
            : (half === 1 ? 0 : firstHalfSeconds) + goalHalfSequence[half] / 1000;
        return {
            ...event,
            half,
            eventType: event.type === 'own-goal' ? 'own-goal' : 'goal',
            displayTime: `${half}H · time not recorded`,
            sortValue: sequenceSortValue,
            sortBasis: 'recorded-scoring-sequence',
            sourceOrder: index,
            stableOrder: index
        };
    });
    const substitutionEvents = match.substitutions.map((substitution, index) => {
        if (substitution.timing.type === 'halftime') {
            return {
                ...substitution,
                eventType: 'halftime-substitution',
                displayTime: 'HT',
                detailTime: 'Halftime change',
                sortValue: firstHalfSeconds,
                sortBasis: 'halftime',
                sourceOrder: index,
                stableOrder: match.scoringEvents.length + index
            };
        }
        const groupStart = substitution.timing.groupObservedStart ?? substitution.timing.observedStart;
        const groupEnd = substitution.timing.groupObservedEnd ?? substitution.timing.observedEnd;
        const midpoint = (groupStart + groupEnd) / 2;
        const halfOffset = substitution.half === 2 ? firstHalfSeconds : 0;
        return {
            ...substitution,
            eventType: 'substitution',
            displayTime: substitution.timing.groupTimelineDisplay || substitution.timing.timelineDisplay,
            detailTime: `Observed ${substitution.timing.display.replace(/ \((1H|2H)\)$/, ' $1')}`,
            sortValue: halfOffset + midpoint,
            sortBasis: 'shared-observed-range',
            observedStart: substitution.timing.observedStart,
            observedEnd: substitution.timing.observedEnd,
            timingUncertain: true,
            groupKey: substitution.timing.uncertaintyGroup || `${substitution.half}:${substitution.timing.observedStart}:${substitution.timing.observedEnd}`,
            sourceOrder: index,
            stableOrder: match.scoringEvents.length + index
        };
    });

    return [...goalEvents, ...substitutionEvents]
        .sort((a, b) => b.sortValue - a.sortValue || a.stableOrder - b.stableOrder || a.eventType.localeCompare(b.eventType));
}

function getLeagueStatisticsRows(season, match, period) {
    const teamsById = getLeagueTeamsById(season);
    const homeTeam = teamsById.get(match.homeTeamId);
    const awayTeam = teamsById.get(match.awayTeamId);
    const metric = (label, home, away, format = (value) => String(value)) => ({ label, home, away, homeDisplay: format(home), awayDisplay: format(away) });
    let rows;
    let periodLabel;

    if (period === 'first' || period === 'second') {
        const half = match.halves[period === 'first' ? 0 : 1];
        const home = half.teamStats[match.homeTeamId];
        const away = half.teamStats[match.awayTeamId];
        periodLabel = half.label;
        rows = [
            metric('Possession', home.possession, away.possession, (value) => `${value.toFixed(1)}%`),
            metric('Kicks', home.kicks, away.kicks),
            metric('Passes', home.passes, away.passes),
            metric('Shots on Goal', home.shotsOnGoal, away.shotsOnGoal)
        ];
    } else {
        const home = calculateLeagueMatchTeamTotals(match, match.homeTeamId);
        const away = calculateLeagueMatchTeamTotals(match, match.awayTeamId);
        periodLabel = 'Full match';
        rows = [
            metric('Kicks', home.kicks, away.kicks),
            metric('Passes', home.passes, away.passes),
            metric('Shots on Goal', home.shotsOnGoal, away.shotsOnGoal)
        ];
    }

    return { homeTeam, awayTeam, periodLabel, rows };
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
    const teamsById = getLeagueTeamsById(season);
    const headers = ['Team', 'P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'FORM', 'Pts'];

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
                        ${standings.map((row, index) => `
                            <tr class="${index === 0 ? 'league-table-leader' : ''}">
                                <td><span class="league-rank">${index + 1}</span>${escapeLeagueText(row.team)}</td>
                                <td>${row.P}</td><td class="${row.W ? 'league-positive' : ''}">${row.W}</td><td>${row.D}</td><td class="${row.L ? 'league-negative' : ''}">${row.L}</td>
                                <td>${row.GF}</td><td>${row.GA}</td><td class="${row.GD > 0 ? 'league-positive' : row.GD < 0 ? 'league-negative' : 'league-neutral'}">${row.GD > 0 ? '+' : ''}${row.GD}</td>
                                <td><span class="league-form" aria-label="Last ${Math.min(row.form.length, 5)} league results">${row.form.slice(-5).map((entry) => `<span class="league-form-result league-form-${entry.result.toLowerCase()}" title="vs ${escapeLeagueText(teamsById.get(entry.opponentTeamId).name)}, ${entry.goalsFor}–${entry.goalsAgainst}">${entry.result}</span>`).join('') || '<span class="league-form-empty">—</span>'}</span></td>
                                <td class="league-points">${row.Pts}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderLeaguePlayerPowerRankings(season) {
    const rows = calculateLeaguePlayerPowerRankings(season).slice(0, 10);
    const teamsById = getLeagueTeamsById(season);
    return `
        <section class="world-cup-card league-player-power-card" aria-labelledby="league-player-power-heading">
            <div class="world-cup-header">
                <h2 class="world-cup-title" id="league-player-power-heading">Top 10 Players</h2>
                <span class="league-update-note" title="Ranking uses recorded tournament contributions and may favour roles represented by the available statistics.">Provisional · cumulative match score</span>
            </div>
            <div class="world-cup-table-wrap league-compact-table-wrap">
                <table class="world-cup-table league-compact-table league-player-power-table">
                    <thead><tr><th>#</th><th>Player</th><th>Team</th><th>Score</th><th>Confidence</th><th>G</th><th>A</th><th>MVP</th></tr></thead>
                    <tbody>${rows.map((row, index) => `
                        <tr><td>${index + 1}</td><td>${escapeLeagueText(row.player)}</td><td>${escapeLeagueText(teamsById.get(row.teamId).shortName)}</td><td>${row.score.toFixed(2)}</td><td title="${escapeLeagueText(row.confidence.level)}">${escapeLeagueText(row.confidence.label)}</td><td class="${row.goals ? 'league-positive' : ''}">${row.goals}</td><td class="${row.assists ? 'league-assist' : ''}">${row.assists}</td><td class="${row.mvps ? 'league-mvp' : ''}">${row.mvps}</td></tr>
                    `).join('')}</tbody>
                </table>
            </div>
        </section>
    `;
}

function renderLeagueStartingVi(season, match, className = 'league-starting-vi') {
    const teamsById = getLeagueTeamsById(season);
    const teamIds = [match.homeTeamId, match.awayTeamId];
    if (!teamIds.every((teamId) => match.startingLineups?.[teamId]?.length)) return '';
    return `
        <section class="${className}" aria-label="Starting VI">
            <h2 class="league-starting-vi-title">Starting VI</h2>
            <div class="league-starting-vi-grid">
                ${teamIds.map((teamId) => {
                    const team = teamsById.get(teamId);
                    return `
                        <section class="league-starting-vi-team" aria-label="${escapeLeagueText(team.name)} Starting VI">
                            <h3><img src="${escapeLeagueText(team.image)}" alt=""><span>${escapeLeagueText(team.name)}</span></h3>
                            <ul>
                                ${match.startingLineups[teamId].map(({ player, position }) => `<li><b>${escapeLeagueText(position)}</b><span>${escapeLeagueText(player)}</span></li>`).join('')}
                            </ul>
                        </section>
                    `;
                }).join('')}
            </div>
        </section>
    `;
}

function renderLeagueLatestLineupPreview(season, match) {
    return renderLeagueStartingVi(season, match, 'league-latest-lineup-preview');
}

function renderLeagueMatchRecording(match, variant = 'preview') {
    if (!match.recording?.url || !match.recording.thumbnail) return '';
    const label = variant === 'preview' ? 'Watch full match' : 'Watch match recording';
    if (variant === 'link') {
        return `<a class="league-match-recording-link" href="${escapeLeagueText(match.recording.url)}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">▶</span>${label}</a>`;
    }
    return `
        <a class="league-match-recording-card" href="${escapeLeagueText(match.recording.url)}" target="_blank" rel="noopener noreferrer" aria-label="${label} on YouTube">
            <img src="${escapeLeagueText(match.recording.thumbnail)}" alt="Match recording thumbnail" loading="lazy">
            <span class="league-match-recording-play" aria-hidden="true">▶</span>
            <span class="league-match-recording-label">${label}</span>
        </a>
    `;
}

function renderLdcRsLeagueResults(season) {
    if (season.matches.length === 0) {
        return `
            <div class="world-cup-card league-results-card">
                <div class="world-cup-header"><h2 class="world-cup-title">Recent matches</h2></div>
                <p class="league-empty-state">No results have been recorded yet.</p>
            </div>
        `;
    }

    const teamsById = new Map(season.teams.map((team) => [team.id, team]));
    const mostRecentMatchId = season.matches.at(-1).id;
    return `
        <section class="world-cup-card league-results-card" aria-labelledby="league-results-heading">
            <div class="world-cup-header"><h2 class="world-cup-title" id="league-results-heading">Recent matches</h2><span class="league-update-note">Select a result for the full record</span></div>
            <div class="league-results-list">
                ${[...season.matches].reverse().map((match) => {
                    const isMostRecent = match.id === mostRecentMatchId;
                    const homeTeam = teamsById.get(match.homeTeamId);
                    const awayTeam = teamsById.get(match.awayTeamId);
                    const scorerCounts = match.scoringEvents.filter((event) => event.type === 'goal').reduce((counts, event) => {
                        counts.set(event.player, (counts.get(event.player) || 0) + 1);
                        return counts;
                    }, new Map());
                    const goalScorers = [...scorerCounts].map(([player, goals]) => `${player}${goals > 1 ? ` ×${goals}` : ''}`);
                    const ownGoalScorers = match.scoringEvents
                        .filter((event) => event.type === 'own-goal')
                        .map((event) => `${event.player} OG`);
                    const scorers = [...goalScorers, ...ownGoalScorers].join(isMostRecent ? ' · ' : ', ');
                    const summary = isMostRecent ? `
                                <span class="league-latest-scoreline">
                                    <span class="league-latest-team"><img src="${escapeLeagueText(homeTeam.image)}" alt=""><strong>${escapeLeagueText(homeTeam.name)}</strong></span>
                                    <strong class="league-latest-score">${match.homeGoals}–${match.awayGoals}</strong>
                                    <span class="league-latest-team"><strong>${escapeLeagueText(awayTeam.name)}</strong><img src="${escapeLeagueText(awayTeam.image)}" alt=""></span>
                                </span>
                                <span class="league-latest-summary">
                                    <span><small>Scorers</small><strong>${escapeLeagueText(scorers)}</strong></span>
                                    <span><small>MVP</small><strong>${escapeLeagueText(match.mvp)}</strong></span>
                                </span>
                                ${renderLeagueLatestLineupPreview(season, match)}
                                <span class="league-result-action"><span class="league-action-open">View full details →</span><span class="league-action-close">Close match details</span></span>
                            ` : `
                                <span class="league-result-score"><span>${escapeLeagueText(homeTeam.name)}</span><strong>${match.homeGoals} – ${match.awayGoals}</strong><span>${escapeLeagueText(awayTeam.name)}</span></span>
                                <span class="league-result-meta">MVP: ${escapeLeagueText(match.mvp)} · Scorers ${escapeLeagueText(scorers)}</span>
                                <span class="league-result-action"><span class="league-action-open">Match details →</span><span class="league-action-close">Close details</span></span>
                            `;
                    const disclosure = `
                        <details class="league-match-disclosure${isMostRecent ? ' league-match-latest' : ''}" data-match-id="${match.id}" ${leagueExpandedMatches.has(match.id) ? 'open' : ''}>
                            <summary>
                                ${summary}
                            </summary>
                            <div class="league-match-details">${renderLeagueMatchView(season, match)}</div>
                        </details>
                    `;
                    return isMostRecent
                        ? `<div class="league-latest-preview">${disclosure}${renderLeagueMatchRecording(match)}</div>`
                        : disclosure;
                }).join('')}
            </div>
        </section>
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

function getLeaguePlayerPositionRecord(match, teamId, player) {
    return (match.positionStints?.[teamId] || []).find((record) => record.player === player);
}

function formatLeaguePositionSequence(record) {
    return [...new Set((record?.stints || []).map((stint) => stint.position))].join(' → ') || '—';
}

function renderLeagueSubstitutesAndRoleChanges(season, match) {
    const teamsById = getLeagueTeamsById(season);
    return `
        <section class="league-role-changes" aria-labelledby="league-role-changes-heading">
            <h2 class="league-starting-vi-title" id="league-role-changes-heading">Substitutes &amp; role changes</h2>
            <div class="league-role-changes-grid">
                ${[match.homeTeamId, match.awayTeamId].map((teamId) => {
                    const team = teamsById.get(teamId);
                    const entries = (match.positionStints?.[teamId] || []).filter((entry) => entry.highlight);
                    return `
                        <section class="league-role-changes-team" aria-label="${escapeLeagueText(team.name)} substitutes and role changes">
                            <h3><img src="${escapeLeagueText(team.image)}" alt=""><span>${escapeLeagueText(team.name)}</span></h3>
                            <ul>${entries.map((entry) => `
                                <li><strong>${escapeLeagueText(entry.player)}</strong><b>${escapeLeagueText(formatLeaguePositionSequence(entry))}</b>${entry.note ? `<small>↳ ${escapeLeagueText(entry.note)}</small>` : ''}</li>
                            `).join('')}</ul>
                        </section>
                    `;
                }).join('')}
            </div>
        </section>
    `;
}

function renderLeagueMatchPlayerTable(season, match, teamId, playerTotals) {
    const team = getLeagueTeamsById(season).get(teamId);
    const rows = playerTotals.filter((row) => row.teamId === teamId);
    return `
        <div class="world-cup-card league-player-stats-card">
            <div class="world-cup-header"><h3 class="world-cup-title">${escapeLeagueText(team.name)}</h3></div>
            <div class="world-cup-table-wrap league-match-table-wrap">
                <table class="world-cup-table league-player-stats-table league-intrinsic-table">
                    <thead><tr><th>Player</th><th>Pos</th><th>Time</th><th>K</th><th>Pass</th><th>SoG</th><th>G</th><th>A</th><th>OG</th><th>MVP</th><th>CSH</th></tr></thead>
                    <tbody>
                        ${rows.map((row) => `
                            <tr>
                                <td>${escapeLeagueText(row.player)}</td>
                                <td>${escapeLeagueText(formatLeaguePositionSequence(getLeaguePlayerPositionRecord(match, teamId, row.player)))}</td>
                                <td>${formatLeagueClock(row.minutes, row.minutesEstimated, row.minutesIncomplete)}</td>
                                <td>${row.kicks}</td><td>${row.passes}</td><td>${row.shotsOnGoal}</td>
                                <td class="${row.goals ? 'league-positive' : ''}">${row.goals}</td><td class="${row.assists ? 'league-assist' : ''}">${row.assists}</td><td class="${row.ownGoals ? 'league-negative' : ''}">${row.ownGoals}</td>
                                <td class="${row.mvps ? 'league-mvp' : ''}">${row.mvps ? '✓' : '–'}</td><td class="${row.cleanSheetHalves ? 'league-positive' : ''}">${row.cleanSheetHalves}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

const leagueExpandedMatches = new Set();
const leagueMatchDetailModes = new Map();
const leagueStatisticsPeriods = new Map();

function renderLeagueSubstitutions(season, match) {
    const teamsById = getLeagueTeamsById(season);
    return `
        <div class="world-cup-card league-substitutions-card">
            <div class="world-cup-header"><h2 class="world-cup-title">Substitutions</h2><span class="league-update-note">Intervals are observations, not exact event times</span></div>
            <div class="league-substitution-list">
                ${match.substitutions.map((substitution) => `
                    <div class="league-substitution">
                        <span class="league-sub-time">${escapeLeagueText(substitution.timing.display)}</span>
                        <span><strong>${escapeLeagueText(substitution.playerIn)} ↑</strong> for ${escapeLeagueText(substitution.playerOut)} ↓</span>
                        <small>${escapeLeagueText(teamsById.get(substitution.teamId).name)}${substitution.timing.type === 'observed-interval' ? ` · midpoint ${escapeLeagueText(substitution.timing.approximateDisplay)} used only for estimated playing time` : ' · halftime change'}</small>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderLeagueGoalkeeperContext(season, match) {
    const teamsById = getLeagueTeamsById(season);
    return `
        <div class="world-cup-card league-goalkeeper-card">
            <div class="world-cup-header"><h2 class="world-cup-title">Goalkeepers &amp; clean-sheet halves</h2></div>
            <div class="league-goalkeeper-grid">
                ${[match.homeTeamId, match.awayTeamId].map((teamId) => `
                    <div>
                        <strong>${escapeLeagueText(teamsById.get(teamId).name)}</strong>
                        <span>1H: ${escapeLeagueText(match.goalkeepers.firstHalf[teamId])}</span>
                        <span>2H: ${escapeLeagueText(match.goalkeepers.secondHalf[teamId])}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderLeagueStatisticsComparison(season, match) {
    const period = leagueStatisticsPeriods.get(match.id) || 'total';
    const { homeTeam, awayTeam, periodLabel, rows } = getLeagueStatisticsRows(season, match, period);
    return `
        <div class="league-statistics-panel">
            <div class="world-cup-toggle league-period-toggle" role="group" aria-label="Statistics period">
                ${[['total', 'Full Match'], ['first', '1st Half'], ['second', '2nd Half']].map(([key, label]) => `<button type="button" data-league-period="${key}" data-match-id="${match.id}" class="${period === key ? 'active' : ''}">${label}</button>`).join('')}
            </div>
            <div class="world-cup-card league-comparison-card" style="--home-accent:${homeTeam.kit.accent || homeTeam.kit.primary};--away-accent:${awayTeam.kit.accent || awayTeam.kit.primary};">
                <div class="league-comparison-heading"><strong>${escapeLeagueText(homeTeam.shortName)}</strong><span>${escapeLeagueText(periodLabel)}</span><strong>${escapeLeagueText(awayTeam.shortName)}</strong></div>
                <div class="league-comparison-list">
                    ${rows.map((row) => {
                        const total = row.home + row.away;
                        const homeWidth = total ? row.home / total * 100 : 0;
                        const awayWidth = total ? row.away / total * 100 : 0;
                        return `<div class="league-comparison-row">
                            <div class="league-comparison-values"><strong>${row.homeDisplay}</strong><span>${escapeLeagueText(row.label)}</span><strong>${row.awayDisplay}</strong></div>
                            <div class="league-comparison-bars" aria-hidden="true"><span><i style="width:${homeWidth}%"></i></span><span><i style="width:${awayWidth}%"></i></span></div>
                        </div>`;
                    }).join('')}
                </div>
            </div>
            ${renderLeagueGoalkeeperContext(season, match)}
        </div>
    `;
}

function renderLeagueEventTimeline(season, match) {
    const teamsById = getLeagueTeamsById(season);
    const events = deriveLeagueMatchEvents(match);
    const homeTeam = teamsById.get(match.homeTeamId);
    const awayTeam = teamsById.get(match.awayTeamId);
    const playerTeams = getLeagueMatchPlayerTeams(season, match);
    const resolveEventTeamId = (event) => event.teamId || playerTeams.get(event.player);
    const eventGroups = events.reduce((groups, event) => {
        const currentGroup = groups.at(-1);
        const groupKey = event.groupKey || `${event.displayTime}:${event.sortValue}`;
        if (!currentGroup || currentGroup.key !== groupKey) {
            groups.push({ key: groupKey, time: event.displayTime, timingUncertain: event.timingUncertain, home: [], away: [] });
        }
        const side = resolveEventTeamId(event) === match.homeTeamId ? 'home' : 'away';
        groups.at(-1)[side].push(event);
        return groups;
    }, []);
    const renderEvent = (event, team) => {
        const isGoal = event.eventType === 'goal';
        const isOwnGoal = event.eventType === 'own-goal';
        const type = isGoal ? 'Goal' : isOwnGoal ? 'Own goal' : 'Substitution';
        const headline = isGoal
            ? `${event.player} scores!`
            : isOwnGoal
                ? `${event.player} own goal`
                : `${event.playerIn} in, ${event.playerOut} out`;
        const detail = isGoal || isOwnGoal
            ? `${event.assist ? `Assist by ${event.assist} · ` : ''}${isOwnGoal && event.benefitsTeamId ? `Benefits ${teamsById.get(event.benefitsTeamId).name} · ` : ''}${event.score}${event.mercyRuleMatchEnd ? ' · Mercy-rule match end' : ''}`
            : event.detailTime;
        return `<article class="league-timeline-event league-timeline-event-${event.eventType}">
            <span class="league-timeline-event-meta"><span class="league-timeline-team">${escapeLeagueText(team.shortName)}</span><span>${type}</span></span>
            <strong>${escapeLeagueText(headline)}</strong>
            <small>${escapeLeagueText(detail)}</small>
        </article>`;
    };
    return `
        <div class="world-cup-card league-events-card" style="--home-accent:${homeTeam.kit.accent || homeTeam.kit.primary};--away-accent:${awayTeam.kit.accent || awayTeam.kit.primary};">
            <div class="world-cup-header"><h2 class="world-cup-title">Match timeline</h2><span class="league-update-note">Latest event first · observed ranges shown where available</span></div>
            <div class="league-event-team-headings" aria-hidden="true"><span>${escapeLeagueText(homeTeam.name)}</span><small>Time</small><span>${escapeLeagueText(awayTeam.name)}</span></div>
            <div class="league-event-timeline" role="list">
                ${eventGroups.map((group) => `
                    <div class="league-event-row" role="listitem">
                        <div class="league-event-side league-event-side-home">${group.home.map((event) => renderEvent(event, homeTeam)).join('')}</div>
                        <time class="league-event-time"><span>${escapeLeagueText(group.time)}</span>${group.timingUncertain && group.home.length + group.away.length > 1 ? '<small>Order within window uncertain</small>' : ''}</time>
                        <div class="league-event-side league-event-side-away">${group.away.map((event) => renderEvent(event, awayTeam)).join('')}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderLeaguePlayersPanel(season, match) {
    const playerTotals = calculateLeagueMatchPlayerTotals(season, match);
    return `
        <div class="league-players-panel">
            ${renderLeagueStartingVi(season, match)}
            ${renderLeagueSubstitutesAndRoleChanges(season, match)}
            <div class="world-cup-header league-section-header">
                <h2 class="world-cup-title">Player match statistics</h2>
                <span class="league-update-note">K = kicks · SoG = shots on goal · CSH = clean-sheet halves</span>
            </div>
            <div class="league-match-player-grid">
                ${renderLeagueMatchPlayerTable(season, match, match.homeTeamId, playerTotals)}
                ${renderLeagueMatchPlayerTable(season, match, match.awayTeamId, playerTotals)}
            </div>
        </div>
    `;
}

function renderLeagueMatchView(season, match) {
    const teamsById = getLeagueTeamsById(season);
    const homeTeam = teamsById.get(match.homeTeamId);
    const awayTeam = teamsById.get(match.awayTeamId);
    const activeTab = leagueMatchDetailModes.get(match.id) || 'statistics';
    const panel = activeTab === 'events'
        ? renderLeagueEventTimeline(season, match)
        : activeTab === 'players'
            ? renderLeaguePlayersPanel(season, match)
            : renderLeagueStatisticsComparison(season, match);

    return `
        <section class="league-match-section" aria-labelledby="${match.id}-heading">
            <div class="league-match-hero">
                <p class="league-season-kicker">Official league match · Match ${season.matches.findIndex((candidate) => candidate.id === match.id) + 1}</p>
                <div class="league-scoreline" id="${match.id}-heading">
                    <span>${escapeLeagueText(homeTeam.name)}</span><strong>${match.homeGoals}<i>–</i>${match.awayGoals}</strong><span>${escapeLeagueText(awayTeam.name)}</span>
                </div>
                <p class="league-match-mvp"><span>MVP</span> ${escapeLeagueText(match.mvp)}</p>
                ${renderLeagueMatchRecording(match, 'link')}
            </div>
            <div class="league-match-tabs" role="tablist" aria-label="Match details">
                ${[['statistics', 'Statistics'], ['events', 'Events'], ['players', 'Players']].map(([key, label]) => `<button type="button" role="tab" aria-selected="${activeTab === key}" aria-controls="${match.id}-${key}-panel" data-league-match-tab="${key}" data-match-id="${match.id}" class="${activeTab === key ? 'active' : ''}">${label}</button>`).join('')}
            </div>
            <div id="${match.id}-${activeTab}-panel" class="league-match-tab-panel" role="tabpanel">${panel}</div>
        </section>
    `;
}

const leagueSeasonMetricDefinitions = {
    appearances: { label: 'Appearances' },
    minutes: { label: 'Playing time' },
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
let leagueSeasonRateMode = 'totals';
const leaguePerMinuteMetrics = new Set(['goals', 'assists', 'goalContributions', 'kicks', 'passes', 'shotsOnGoal']);
const leagueMedalMetrics = new Set(['appearances', 'minutes', 'goals', 'assists', 'goalContributions', 'mvps', 'kicks', 'passes', 'shotsOnGoal', 'cleanSheetHalves']);

function getLeagueLeaderboardRateMode(metric, requestedRateMode) {
    if (requestedRateMode === 'per-minute' && leaguePerMinuteMetrics.has(metric)) return requestedRateMode;
    if (requestedRateMode === 'frequency' && leaguePerMinuteMetrics.has(metric)) return requestedRateMode;
    if (requestedRateMode === 'per-appearance' && metric === 'mvps') return requestedRateMode;
    if (requestedRateMode === 'clean-sheet-rate' && metric === 'cleanSheetHalves') return requestedRateMode;
    return 'totals';
}

function formatLeagueClock(totalSeconds, estimated = false, incomplete = false) {
    const roundedSeconds = Math.round(totalSeconds);
    const minutes = Math.floor(roundedSeconds / 60);
    const seconds = String(roundedSeconds % 60).padStart(2, '0');
    return `${incomplete ? '≥' : estimated ? '~' : ''}${minutes}:${seconds}`;
}

function formatLeaguePerMinute(value, estimated = false, incomplete = false) {
    const formatted = value >= 1 ? value.toFixed(2) : value.toFixed(3);
    return `${incomplete ? '≤' : estimated ? '~' : ''}${formatted}`;
}

function formatLeagueFrequency(value, estimated = false, incomplete = false) {
    if (!Number.isFinite(value)) return '—';
    const roundedSeconds = Math.round(value);
    const minutes = Math.floor(roundedSeconds / 60);
    const seconds = roundedSeconds % 60;
    const elapsed = minutes === 0
        ? `${seconds}s`
        : seconds === 0
            ? `${minutes}m`
            : `${minutes}m ${String(seconds).padStart(2, '0')}s`;
    return `${incomplete ? '≥' : estimated ? '~' : ''}1 every ${elapsed}`;
}

function calculateLeagueLeaderboardRowsFromTotals(totals, metric, requestedRateMode = 'totals') {
    const rateMode = getLeagueLeaderboardRateMode(metric, requestedRateMode);
    const perMinute = rateMode === 'per-minute';
    const frequency = rateMode === 'frequency';
    const perAppearance = rateMode === 'per-appearance';
    const cleanSheetRate = rateMode === 'clean-sheet-rate';
    return totals
        .filter((row) => {
            if (cleanSheetRate) return row.cleanSheetHalves > 0 || row.goalkeeperHalvesPlayed > 0;
            if (frequency) return row.minutes > 0;
            if (perAppearance) return row[metric] > 0 && row.appearances > 0;
            return row[metric] > 0 && (!perMinute || row.minutes > 0);
        })
        .map((row) => {
            const actualMinutes = row.minutes / 60;
            const leaderboardValue = frequency
                ? row[metric] > 0 ? row.minutes / row[metric] : null
                : cleanSheetRate
                ? row.goalkeeperHalvesPlayed > 0 ? row.cleanSheetHalves / row.goalkeeperHalvesPlayed : null
                : perAppearance
                    ? row[metric] / row.appearances
                    : perMinute ? row[metric] / actualMinutes : row[metric];
            return {
                ...row,
                leaderboardValue,
                rateMode,
                cleanSheetRate: row.goalkeeperHalvesPlayed > 0 ? row.cleanSheetHalves / row.goalkeeperHalvesPlayed : null,
                mvpsPerAppearance: row.appearances > 0 ? row.mvps / row.appearances : null,
                goalsPerMinute: actualMinutes > 0 ? row.goals / actualMinutes : null,
                assistsPerMinute: actualMinutes > 0 ? row.assists / actualMinutes : null,
                goalContributionsPerMinute: actualMinutes > 0 ? row.goalContributions / actualMinutes : null
            };
        })
        .sort((a, b) => Number.isFinite(b.leaderboardValue) - Number.isFinite(a.leaderboardValue)
            || (Number.isFinite(a.leaderboardValue) && Number.isFinite(b.leaderboardValue) ? (frequency ? a.leaderboardValue - b.leaderboardValue : b.leaderboardValue - a.leaderboardValue) : 0)
            || (metric === 'goalContributions' ? b.goals - a.goals || b.assists - a.assists : 0)
            || b.goalContributions - a.goalContributions
            || a.player.localeCompare(b.player));
}

function calculateLeagueSeasonLeaderboardRows(season, metric, requestedRateMode = 'totals') {
    return calculateLeagueLeaderboardRowsFromTotals(calculateLeagueSeasonPlayerTotals(season), metric, requestedRateMode);
}

function calculateLeagueLeaderboardMedals(rows, metric) {
    if (!leagueMedalMetrics.has(metric)) return new Map();
    const medalByTier = ['gold', 'silver', 'bronze'];
    const equals = (a, b) => Math.abs(a - b) < 1e-9;
    const medals = new Map();

    const frequency = rows.some((row) => row.rateMode === 'frequency');
    const valueTiers = rows.filter((row) => Number.isFinite(row.leaderboardValue)).sort((a, b) => frequency ? a.leaderboardValue - b.leaderboardValue : b.leaderboardValue - a.leaderboardValue).reduce((tiers, row) => {
        const tier = tiers.find((candidate) => equals(candidate.value, row.leaderboardValue));
        if (tier) tier.rows.push(row);
        else tiers.push({ value: row.leaderboardValue, rows: [row] });
        return tiers;
    }, []);

    for (let tierIndex = 0; tierIndex < medalByTier.length; tierIndex += 1) {
        const tier = valueTiers[tierIndex];
        // A tied tier blocks it and every lower podium tier. This prevents an
        // isolated bronze after competition ranks such as 1, 1, 3.
        if (!tier || tier.rows.length !== 1) break;
        medals.set(tier.rows[0].player, medalByTier[tierIndex]);
    }
    return medals;
}

function renderLeagueSeasonLeaderboard(season) {
    const definition = leagueSeasonMetricDefinitions[leagueSeasonStatMode];
    const teamsById = getLeagueTeamsById(season);
    const rateMode = getLeagueLeaderboardRateMode(leagueSeasonStatMode, leagueSeasonRateMode);
    const rows = calculateLeagueSeasonLeaderboardRows(season, leagueSeasonStatMode, rateMode);
    const medals = calculateLeagueLeaderboardMedals(rows, leagueSeasonStatMode);
    const displayMetric = (row) => rateMode === 'per-minute'
        ? formatLeaguePerMinute(row.leaderboardValue, row.minutesEstimated, row.minutesIncomplete)
        : leagueSeasonStatMode === 'minutes'
            ? formatLeagueClock(row.minutes, row.minutesEstimated, row.minutesIncomplete)
            : row[leagueSeasonStatMode];
    const rateOptions = leaguePerMinuteMetrics.has(leagueSeasonStatMode)
        ? [['totals', 'Totals'], ['per-minute', 'Per minute'], ['frequency', 'Frequency']]
        : leagueSeasonStatMode === 'mvps'
            ? [['totals', 'Totals'], ['per-appearance', 'Per appearance']]
            : leagueSeasonStatMode === 'cleanSheetHalves'
                ? [['totals', 'Totals'], ['clean-sheet-rate', 'Clean-sheet rate']]
                : [['totals', 'Totals']];
    const headerCells = rateMode === 'frequency'
        ? leagueSeasonStatMode === 'goalContributions'
            ? '<th>Goals</th><th>Assists</th><th>G+A</th><th>Minutes</th><th>Frequency</th>'
            : `<th>${definition.label}</th><th>Minutes</th><th>Frequency</th>`
        : leagueSeasonStatMode === 'goalContributions'
        ? rateMode === 'per-minute' ? '<th>Goals/min</th><th>Assists/min</th><th>G+A/min</th>' : '<th>Goals</th><th>Assists</th><th>G+A</th>'
        : rateMode === 'clean-sheet-rate'
            ? '<th>CS halves</th><th>GK halves</th><th>CS rate</th>'
            : rateMode === 'per-appearance'
                ? '<th>MVP/App</th><th>Apps</th>'
                : `<th>${rateMode === 'per-minute' ? `${definition.label}/min` : definition.label}</th>`;

    return `
        <section class="world-cup-card league-season-stats" aria-labelledby="league-season-stats-heading">
            <div class="world-cup-header">
                <h2 class="world-cup-title" id="league-season-stats-heading">Season player leaders</h2>
                <div class="world-cup-toggle league-rate-toggle" role="group" aria-label="Leaderboard rate mode">
                    ${rateOptions.map(([key, label]) => `<button type="button" data-league-rate="${key}" class="${rateMode === key ? 'active' : ''}">${label}</button>`).join('')}
                </div>
            </div>
            <div class="world-cup-toggle league-stat-toggle">
                ${Object.entries(leagueSeasonMetricDefinitions).map(([key, metric]) => `
                    <button type="button" data-league-stat="${key}" class="${key === leagueSeasonStatMode ? 'active' : ''}">${metric.label}</button>
                `).join('')}
            </div>
            <div class="world-cup-table-wrap league-compact-table-wrap">
                <table class="world-cup-table league-compact-table league-leaderboard-table">
                    <thead><tr><th>Player</th><th>Team</th>${headerCells}</tr></thead>
                    <tbody>
                        ${rows.map((row) => {
                            const medal = medals.get(row.player);
                            const ratePrefix = row.minutesIncomplete ? '≤' : row.minutesEstimated ? '~' : '';
                            const goalContributionCells = rateMode === 'per-minute'
                                ? `<td class="${row.goals ? 'league-positive' : ''}">${ratePrefix}${row.goals ? formatLeaguePerMinute(row.goalsPerMinute) : '0.000'}</td><td class="${row.assists ? 'league-assist' : ''}">${ratePrefix}${row.assists ? formatLeaguePerMinute(row.assistsPerMinute) : '0.000'}</td><td class="league-mvp">${formatLeaguePerMinute(row.goalContributionsPerMinute, row.minutesEstimated, row.minutesIncomplete)}</td>`
                                : `<td class="${row.goals ? 'league-positive' : ''}">${row.goals}</td><td class="${row.assists ? 'league-assist' : ''}">${row.assists}</td><td class="league-mvp">${row.goalContributions}</td>`;
                            const frequencyCells = leagueSeasonStatMode === 'goalContributions'
                                ? `<td class="${row.goals ? 'league-positive' : ''}">${row.goals}</td><td class="${row.assists ? 'league-assist' : ''}">${row.assists}</td><td class="${row.goalContributions ? 'league-mvp' : ''}">${row.goalContributions}</td><td>${formatLeagueClock(row.minutes, row.minutesEstimated, row.minutesIncomplete)}</td><td>${formatLeagueFrequency(row.leaderboardValue, row.minutesEstimated, row.minutesIncomplete)}</td>`
                                : `<td>${row[leagueSeasonStatMode]}</td><td>${formatLeagueClock(row.minutes, row.minutesEstimated, row.minutesIncomplete)}</td><td>${formatLeagueFrequency(row.leaderboardValue, row.minutesEstimated, row.minutesIncomplete)}</td>`;
                            const metricCells = rateMode === 'frequency'
                                ? frequencyCells
                                : leagueSeasonStatMode === 'goalContributions'
                                ? goalContributionCells
                                : rateMode === 'clean-sheet-rate'
                                    ? `<td>${row.cleanSheetHalves}</td><td>${row.goalkeeperHalvesPlayed || '—'}</td><td>${row.cleanSheetRate === null ? '—' : `${Math.round(row.cleanSheetRate * 100)}%`}</td>`
                                    : rateMode === 'per-appearance'
                                        ? `<td>${row.mvpsPerAppearance.toFixed(2)}</td><td>${row.appearances}</td>`
                                        : `<td>${displayMetric(row)}</td>`;
                            return `<tr class="${medal ? `league-medal-${medal}` : ''}"><td>${escapeLeagueText(row.player)}</td><td>${escapeLeagueText(teamsById.get(row.teamId).shortName)}</td>${metricCells}</tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
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

function renderLdcRsLeagueSeason(focusSelector = null) {
    const container = document.getElementById('ldc-rs-league-season-1-container');
    if (!container) {
        return;
    }

    const season = ldcRsLeagueSeason1;
    container.innerHTML = `
        <div class="world-cup-layout league-season-layout">
            <header class="league-season-hero">
                <h1>${escapeLeagueText(season.title)}</h1>
            </header>

            ${renderLdcRsLeagueStandings(season)}

            ${renderLeaguePlayerPowerRankings(season)}

            ${renderLdcRsLeagueResults(season)}

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
            leagueSeasonRateMode = getLeagueLeaderboardRateMode(leagueSeasonStatMode, leagueSeasonRateMode);
            renderLdcRsLeagueSeason(`[data-league-stat="${leagueSeasonStatMode}"]`);
        });
    });

    container.querySelectorAll('[data-league-rate]').forEach((button) => {
        button.addEventListener('click', () => {
            if (button.disabled) return;
            leagueSeasonRateMode = button.getAttribute('data-league-rate');
            renderLdcRsLeagueSeason(`[data-league-rate="${leagueSeasonRateMode}"]`);
        });
    });

    container.querySelectorAll('.league-match-disclosure').forEach((details) => {
        details.addEventListener('toggle', () => {
            const matchId = details.getAttribute('data-match-id');
            if (details.open) leagueExpandedMatches.add(matchId);
            else leagueExpandedMatches.delete(matchId);
        });
    });

    container.querySelectorAll('[data-league-match-tab]').forEach((button) => {
        button.addEventListener('click', () => {
            const matchId = button.getAttribute('data-match-id');
            const tab = button.getAttribute('data-league-match-tab');
            leagueExpandedMatches.add(matchId);
            leagueMatchDetailModes.set(matchId, tab);
            renderLdcRsLeagueSeason(`[data-match-id="${matchId}"][data-league-match-tab="${tab}"]`);
        });
    });

    container.querySelectorAll('[data-league-period]').forEach((button) => {
        button.addEventListener('click', () => {
            const matchId = button.getAttribute('data-match-id');
            const period = button.getAttribute('data-league-period');
            leagueExpandedMatches.add(matchId);
            leagueStatisticsPeriods.set(matchId, period);
            renderLdcRsLeagueSeason(`[data-match-id="${matchId}"][data-league-period="${period}"]`);
        });
    });

    if (focusSelector) {
        container.querySelector(focusSelector)?.focus({ preventScroll: true });
    }
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
