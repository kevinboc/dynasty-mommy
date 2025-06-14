import { type League, sleeper_getLeagues, sleeper_getAvatarThumbnail } from "@services/sleeper"
import { useState, useEffect } from "react"

export default function useGetSleeperLeagues(searchType: string, year: string, searchText: string) {
    const [leagues, setLeagues] = useState<League[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        async function fetchLeagues() {
            setLoading(true)
            setError(null)
            setLeagues([])
            try {
                let leagues: League[] = []
                if (searchType === 'Username') {
                    leagues = await sleeper_getLeagues(searchText, year)
                } else if (searchType === 'League ID') {
                    setError('Search by League ID not implemented yet')
                    setLoading(false)
                    return
                }
                for (const league of leagues) {
                    if (league.avatar) {
                        const blob = await sleeper_getAvatarThumbnail(league.avatar)
                        const url = URL.createObjectURL(blob)
                        league.avatar = url
                    }
                }
                /**TODO: STORE IN LOCAL STORAGE SO USER DOESN'T HAVE TO CALL API EVERY TIME */
                setLeagues(leagues)

            } catch (err) {
                setError('Error fetching leagues')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchLeagues()
        return () => {
            leagues.forEach((league) => URL.revokeObjectURL(league.avatar))
        }
    }, [searchType, searchText, year])

    return { leagues, loading, error }
}