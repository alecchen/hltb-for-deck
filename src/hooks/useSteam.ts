import { ServerAPI, ServerResponse } from 'decky-frontend-lib';
import { useState, useEffect } from 'react';
import { getCache, updateCache } from './Cache';
import { normalize } from '../utils';

type SteamResult = { body: string; status: number };
type SteamStats = {
    new_game: string;
};

// Hook to get data from Steam
const useSteam = (appId: number, game: string, serverApi: ServerAPI) => {
    const [stats, setStats] = useState<SteamStats>({
        new_game: '',
    });
    useEffect(() => {
        const getData = async () => {
            console.log('run useSteam');
            const cache = await getCache<SteamStats>(`name_${appId}`);
            if (cache) {
                console.log(
                    `get steam name from cache => '${cache['new_game']}'`
                );
                setStats(cache);
            } else if (game.trim() != '') {
                console.log('use original name');
                let newStats = { new_game: game };
                setStats(newStats);
            } else {
                console.log(`get Steam data for ${appId}`);
                const res: ServerResponse<SteamResult> =
                    await serverApi.fetchNoCors<SteamResult>(
                        `https://store.steampowered.com/api/appdetails?appids=${appId}`
                    );
                const result = res.result as SteamResult;
                console.log(`steam status is ${result.status}`);

                if (result.status === 200) {
                    let obj = JSON.parse(result.body);
                    const orig_name: string = obj[appId].data.name;
                    console.log(`orig name is '${orig_name}'`);
                    const new_name: string = normalize(orig_name);
                    console.log(`app name is '${new_name}'`);
                    let newStats = {
                        new_game: new_name,
                    };
                    setStats(newStats);
                    updateCache(`name_${appId}`, newStats);
                    console.log(obj);
                } else {
                    console.error(result);
                }
            }
        };
        if (appId) {
            getData();
        }
    }, [appId]);

    return {
        ...stats,
    };
};

export default useSteam;
