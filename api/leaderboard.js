export default async function handler(req, res) {
    try {
        const { league_id, type } = req.query;
        
        let data = [];
        
        if (type === 'global') {
            // For global stats, you can hardcode or fetch from a JSON file
            data = [
                { team_name: "Player's Team", played: 0, wins: 0, draws: 0, losses: 0, points: 0, user: "Player" }
            ];
        } else if (league_id) {
            // Try to read from a JSON file in the repo
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
