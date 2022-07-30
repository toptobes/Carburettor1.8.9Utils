import request from "../requestV2";
import { colorCodes, prestiges } from "./prestiges";

export function showStatsFor(players) {
    players.filter(unique).forEach((name) => {
        callMojangApi(name);
    });
}

const defaultRequest = {
    headers: {
        "User-Agent": "Mozilla/5.0 (ChatTriggers)"
    },
    json: true,
    connectionTimeout: 1000,
    readTimeout: 1000
};

function callMojangApi(name) {
    request({ ...{ url: mojangUrl(name) }, ...defaultRequest })
        .then(function(response) {
            callBwpApi(name, response.id);
        })
        .catch(function(response) {
            ChatLib.chat(`Error for ${name}: ${JSON.stringify(response)}`);
        });
}

function callBwpApi(name, uuid) {
    request({ ...{ url: bwpUrl(uuid) }, ...defaultRequest })
        .then(function(response) {
            showStats(name, response);
        })
        .catch(function(response) {
            ChatLib.chat(`Error for ${name}: ${JSON.stringify(response)}`);
        });
}

function showStats(name, response) {
    const colorCode = "&" + colorCodes[prestiges[~~(response.level / 100)].color];

    if (name.localeCompare(Player.getName()) === 0) {
        ChatLib.chat(`${colorCode}<<< [✫${response.level}] ${name} >>>`);
    } else {
        ChatLib.chat(`${colorCode}<-- [✫${response.level}] ${name} -->`);
    }
}

function mojangUrl(name) {
    return `https://api.mojang.com/users/profiles/minecraft/${name}`;
}

//TODO: Settings file & command that allows API key to be inputted
function bwpUrl(uuid) {
    return `https://api.voxyl.net/player/stats/overall/${untrimUuid(uuid)}?api=HhtTKOr5nIvl8adDZMtaLAjsBhClrmvp`;
}

function unique(value, index, self) {
    return self.indexOf(value) === index;
}

function untrimUuid(uuid) {
    return uuid.slice(0, 8) + "-" + uuid.slice(8, 12) + "-" + uuid.slice(12, 16) + "-" + uuid.slice(16, 20) + "-" + uuid.slice(20);
}


















