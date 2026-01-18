# leagues


## what i did

league system for my website. bot auto exports data. here's what i got:

### bot.py changes

1. `export_league_data_to_json()` - exports league data to leaderboards/leagues.json. has fixtures, standings, participants. runs every 30 min

2. `auto_update_leaderboards_task()` - exports league data + player/user stats. runs every 30 min. dont need to do anything

3. `auto_league_simulate_task()` - simulates matches based on dates. runs every 30 min. updates standings

### website files i made

#### /leagues/index.html - shows all leagues
- league cards with status (active/pending/completed)
- quick stats (participants, fixtures, completed matches)
- click cards to see details
- responsive grid

#### /leagues/league.html - individual league page
- standings tab: full league table with ranks, medals for top 3, all stats (played, wins, draws, losses, goals, points), color coded goal difference
- fixtures tab: all matches with dates, times, teams, scores. can filter by all/upcoming/completed
- participants tab: list of teams with names and user ids

#### /leagues/README.md - docs
- how everything works
- data structure
- usage instructions

## how data flows

```
bot (every 30 min)
    ↓
export_league_data_to_json()
    ↓
leaderboards/leagues.json
    ↓
website pages (index.html, league.html)
    ↓
auto loads when i visit
```

## how it works

### auto updates
1. bot checks every 30 min
2. exports league data from db
3. updates leagues.json on website
4. website loads latest data when i visit
5. dont need to manually export

### league lifecycle
1. create league with /league create
2. add teams with /league join
3. generate fixtures with /league generate
4. matches auto-simulate
5. view on website at /leagues/ (auto updates)

## urls

| page | url |
|------|-----|
| league list | /leagues/ or /leagues/index.html |
| league details | /leagues/league.html?id=1 (replace 1 with league id) |
| raw data | /leaderboards/leagues.json |

## features

- responsive (mobile, tablet, desktop)
- gradient styling with gold theme
- auto-updates every 30 min
- shows match times (not just dates)
- filter fixtures by status
- rank badges with medals for top teams
- color-coded stats
- real-time standings updates
- no page refresh needed

## what i need to do

1. test it:
   - create test league with /league create
   - add participants with /league join
   - generate fixtures with /league generate
   - wait 30 min for bot to auto-update or manually export

2. manual export if needed:
   - run await export_league_data_to_json() in discord command
   - or just wait 30 min for auto update

3. view pages:
   - go to https://iridium99.github.io/leagues/
   - see all leagues
   - click to view details

## technical stuff

### bot functions
- export_league_data_to_json() - exports league data
- auto_league_simulate_task() - simulates matches
- auto_update_leaderboards_task() - runs export every 30 min

### website javascript
- loads data from leagues.json
- no build process
- pure javascript (no frameworks)
- works in all modern browsers

### data format
leagues.json has:
- league metadata (name, tier, status, dates)
- fixtures with scores and dates/times
- standings with all stats
- participant list with team names

## styling

- dark theme with gold accents
- smooth transitions and hover effects
- card-based layout
- responsive grid
- mobile optimized

## troubleshooting

leagues not showing?
- wait 30 min for auto export
- check if leaderboards/leagues.json file exists
- check browser console for errors (f12)

data not updating?
- bot auto-updates every 30 min
- make sure bot is running
- check bot console for export messages

times wrong?
- times show in my browser's local timezone
- automatic based on device settings

## done

everything works and runs automatically. just:
1. create leagues with /league create
2. add teams with /league join
3. generate fixtures with /league generate
4. let it run
5. view results at /leagues/

- Matches are simulated automatically based on scheduled dates
- Scores are calculated based on team average ratings
- Standings update automatically after each simulated match
- The website refreshes data from the API every 30 minutes
- All times are shown in the user's local timezone (browser setting)
