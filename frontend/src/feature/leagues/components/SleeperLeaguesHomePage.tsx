import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, CircularProgress, Grid, Icon, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useState, type SyntheticEvent } from "react";
import useGetLeagueTeamsSleeper from "@feature/leagues/hooks/useGetLeagueTeamsSleeper";
import DisplayRosterByPosition from "@components/DisplayRosterByPosition";
import useGetPlayersOnRosterSleeper from "@feature/leagues/hooks/useGetPlayersOnRosterSleeper";
import useGetLeagueInfo from "@feature/leagues/hooks/useGetLeagueInfo";
interface SleeperLeaguesHomePage {
    league_id: string,
    // onTeamClick: (team_id: string) => void,
    // displayAvatar?: boolean,
    // displayRecord?: boolean
}

export default function SleeperLeaguesHomePage({ league_id }: SleeperLeaguesHomePage) {
    const { teams, error: team_error, loading: team_loading } = useGetLeagueTeamsSleeper(league_id)
    const { players: roster, error: roster_error, loading: roster_loading, setOwnerId } = useGetPlayersOnRosterSleeper(league_id)
    const { leagueInfo, loading, error } = useGetLeagueInfo(league_id)

    const [expanded, setExpanded] = useState<number | false>()

    const handleAccordionChange = (panel: number) => (event: SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false)
    }

    if (!teams || !leagueInfo) return <CircularProgress />

    return (
        <div>
            <Box display='flex' alignItems={'center'} gap={2}>
                <Avatar src={leagueInfo.avatar} sx={{ width: 60, height: 60 }} />
                <Typography variant="h2">{leagueInfo?.name}</Typography>
            </Box>
            {teams!.map((team) =>
                <Accordion key={team.user_id} expanded={expanded == team.roster_id}
                    onChange={handleAccordionChange(team.roster_id)}
                    square={false}
                    sx={{
                        borderRadius: '5px',
                        minHeight: '60px'
                    }}
                >
                    <AccordionSummary sx={{ minHeight: '30px' }}
                        onClick={() => setOwnerId(team.user_id!)}>
                        {team.avatar ? <Avatar src={team.avatar} /> : <Avatar />}
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {team.team_name ? team.team_name : team.display_name}
                            </Typography>

                            <Typography variant="body2" color="textSecondary">
                                ({team.record.wins} - {team.record.ties} - {team.record.losses})
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        {roster && <Box
                            display="grid"
                            gridTemplateColumns="repeat(5, 1fr)"
                            gap={2}
                        >
                            {["PG", "SG", "SF", "PF", "C"].map((position) => (
                                <DisplayRosterByPosition
                                    key={position}
                                    roster={roster}
                                    position={position}
                                />
                            ))}
                        </Box>}
                        {roster_loading && <CircularProgress />}
                        {roster_error && <Typography>An error has occurred</Typography>}
                    </AccordionDetails>
                </Accordion>
            )}
        </div>

    )
}