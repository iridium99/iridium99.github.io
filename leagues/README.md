# leagues


### Backend (Bot)
1. **Export League Data Function** - `export_league_data_to_json()`
   - Exports all league fixtures, standings, and participants to `leagues.json`
   - Includes complete fixture data with scores and dates
   - Includes current standings with all statistics

2. **Auto-Update Task** - Updated `auto_update_leaderboards_task()`
   - Now runs every 30 minutes
   - Exports league data automatically to the website
   - No manual intervention needed

3. **Automatic Match Simulation** - `auto_league_simulate_task()`
   - Runs every 30 minutes
   - Simulates all matches scheduled for the current day or earlier
   - Automatically updates standings when matches complete

### Frontend (Website)
1. **Leagues Index Page** (`/leagues/index.html`)
   - Shows all active and pending leagues
   - Displays league stats (participants, fixtures, completed matches)
   - Links to individual league pages
   - Beautiful card layout with hover effects

2. **League Detail Page** (`/leagues/league.html`)
   - **Standings Tab**: Full league table with rankings
   - **Fixtures Tab**: All matches with filters (upcoming/completed)
   - **Participants Tab**: List of all teams in the league
   - Shows match scores, dates, times, and status

## Data Flow

```
Bot Database
    ↓
export_league_data_to_json() (Every 30 mins)
    ↓
leaderboards/leagues.json
    ↓
Website (HTML/JavaScript)
    ↓
Display to Users
```

## data being exported

The `leagues.json` file contains:
```json
[
  {
    "league_id": 1,
    "league_name": "Premier League",
    "tier": 1,
    "status": "active",
    "start_date": "2026-01-10T00:00:00",
    "end_date": "2026-03-31T23:59:59",
    "participants": [
      {
        "user_id": "123456789",
        "team_name": "Team Name"
      }
    ],
    "fixtures": [
      {
        "fixture_id": 1,
        "match_week": 1,
        "home_user_id": "123456789",
        "away_user_id": "987654321",
        "scheduled_date": "2026-01-15T14:30:00",
        "status": "scheduled",
        "home_score": null,
        "away_score": null
      }
    ],
    "standings": [
      {
        "rank": 1,
        "user_id": "123456789",
        "team_name": "Team Name",
        "played": 10,
        "wins": 8,
        "draws": 1,
        "losses": 1,
        "goals_for": 25,
        "goals_against": 5,
        "goal_difference": 20,
        "points": 25
      }
    ]
  }
]
```

## usage

### For Users
1. Navigate to `/leagues/` on the website
2. See all available leagues at a glance
3. Click "View Details →" to see:
   - Full standings table
   - All fixtures with scores and times
   - Participant list

### for me
1. Create leagues with `/league create`
2. Add participants with `/league join`
3. Generate fixtures with `/league generate`
4. Watch as matches auto-simulate daily!
5. Everything updates automatically every 30 minutes

## features

-  Auto-updates every 30 minutes
-  Shows upcoming and completed matches
-  Displays match times (not just dates)
-  Full standings with all statistics
-  Filter fixtures by status
-  Responsive design (mobile-friendly)
-  Real-time league statistics
- ✅ Professional styling with gradients

## how to access

- **Leagues List**: `/leagues/index.html`
- **Individual League**: `/leagues/league.html?id=1` (replace 1 with league ID)
- **Data Source**: `/leaderboards/leagues.json`

## stuff

- Matches are simulated automatically based on scheduled dates
- Scores are calculated based on team average ratings
- Standings update automatically after each simulated match
- The website refreshes data from the API every 30 minutes
- All times are shown in the user's local timezone (browser setting)
