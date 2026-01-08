export default async function handler(req, res) {
    try {
        const { league_id, type } = req.query;
        
        let data = [];

        if (type === 'all') {
            try {
                const fs = await import('fs').then(m => m.promises);
                const files = await fs.readdir('./leaderboards');
                const leagues = [];
                for (const file of files) {
                    if (!file.startsWith('league_') || !file.endsWith('.json')) continue;
                    const leagueId = file.replace('league_', '').replace('.json', '');
                    try {
                        const raw = await fs.readFile(`./leaderboards/${file}`, 'utf-8');
                        const entries = JSON.parse(raw);
                        leagues.push({ leagueId, entries });
                    } catch (e) {
                        // skip unreadable league file
                    }
                }
                return res.status(200).json(leagues);
            } catch (e) {
                return res.status(200).json([]);
            }
        } else if (type === 'global') {
            data = [
                { team_name: "Player's Team", played: 0, wins: 0, draws: 0, losses: 0, points: 0, user: "Player" }
            ];
        } else if (league_id) {
            try {
                const fs = await import('fs').then(m => m.promises);
                const leaderboardData = await fs.readFile(
                    `./leaderboards/league_${league_id}.json`,
                    'utf-8'
                );
                data = JSON.parse(leaderboardData);
            } catch (e) {
                return res.status(404).json({ error: 'League not found' });
            }
        }
        
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
