import { Avatar, CircularProgress, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material"
import type { League } from "@services/sleeper"

interface displayLeaguesListProps {
    /**
     * leagues:
     *   array of type leagues, used to map over in function
     * onLeaugeClick:
     *   function/action to be done when the user clicks on a leauge
     *   function exists in the parent component with the parent component handling the logic
     * displayAvatar:
     *   optional parameter for styling, enables and disables displaying of avatar
     *   leave empty if avatar should not be displayed
     */
    leagues: League[]
    displayAvatar?: boolean
    onLeagueClick: (league_id: string) => void
    saveLeague: (league_id: string) => Promise<boolean>
    loggedIn?: boolean
    userLeagues?: string[]
}
export function DisplayLeaguesList({ leagues, onLeagueClick, displayAvatar, saveLeague, loggedIn = false, userLeagues = [] }: displayLeaguesListProps) {
    /**
     * @returns List component that displays all leagues it was passed
     */
    if (loggedIn && !userLeagues) return <CircularProgress></CircularProgress>
    return (
        <List sx={{ p: 0 }}>
            {leagues.map((league) => (
                <ListItem key={league.league_id} sx={{ p: 0, mb: 1 }} secondaryAction={
                    <IconButton
                        edge="end"
                        aria-label="add"
                        sx={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)'
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            saveLeague(league.league_id)
                        }}
                    >
                        {userLeagues.includes(league.league_id) ? "✓" : "+"}
                    </IconButton>
                }>
                    <ListItemButton
                        sx={{
                            borderRadius: 2,
                            p: 2,
                            backgroundColor: 'background.default',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                                backgroundColor: 'primary.main',
                                backdropFilter: 'blur(15px)',
                                color: 'primary.contrastText',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px primary.light',
                                borderColor: 'divider',
                                '& .MuiListItemText-primary': {
                                    color: 'primary.contrastText'
                                },
                            },
                            transition: 'all 0.3s ease'
                        }}
                        onClick={() => onLeagueClick(league.league_id)}
                    >
                        <ListItemAvatar>
                            {displayAvatar && (
                                <Avatar
                                    src={league.avatar}
                                    sx={{
                                        width: 48,
                                        height: 48,
                                    }}
                                />
                            )}
                        </ListItemAvatar>
                        <ListItemText
                            primary={league.name}
                            sx={{
                                '& .MuiListItemText-primary': {
                                    fontWeight: 500,
                                    fontSize: '1.1rem',
                                    transition: 'color 0.3s ease',
                                    color: 'text.primary',
                                }
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}