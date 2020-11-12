const resources = {
    // ToDo: get data from a webservice or something?
    getResource: (resourceName) => {
        const result = replaceVariables(_resources[resourceName]);

        return new Promise((resolve) => {
            resolve(result);
        });
    },
    getResources: (...resourceNames) => {
        const promises = resourceNames.map(resourceName => {
            return resources.getResource(resourceName);
        });
    
        return Promise.all(promises);
    }
}

const replaceVariables = value => {
    let replaced = value;

    for(let resource in _resources){
        replaced = replaced.replace(`{${resource}}`, _resources[resource]);
    }

    return replaced;
};

const _resources = {
    'ActionMove': 'M',
    'ActionShoot': 'S',
    'BadMove': 'NOT POSSIBLE -',
    'Bat-Hazard': 'ZAP--SUPER BAT SNATCH! ELSEWHEREVILLE FOR YOU!',
    'Bat-Warning': 'BATS NEARBY!',
    'Exits': 'TUNNELS LEAD TO  ',
    'GameStart': ` 
HUNT THE WUMPUS`,
    'Header': `WUMPUS
CREATIVE COMPUTING  MORRISTOWN, NEW JERSEY

    `,
    'Instructions': `WELCOME TO 'HUNT THE WUMPUS'
    THE WUMPUS LIVES IN A CAVE OF 20 ROOMS.  EACH ROOM
HAS 3 TUNNELS LEADING TO OTHER ROOMS. (LOOK AT A
DODECAHEDRON TO SEE HOW THIS WORKS-IF YOU DON'T KNOW
WHAT A DODECAHEDRON IS, ASK SOMEONE)

        HAZARDS:
BOTTOMLESS PITS - TWO ROOMS HAVE BOTTOMLESS PITS IN THEM
        IF YOU GO THERE, YOU FALL INTO THE PIT (& LOSE!_
SUPERBATS - TWO OTHER ROOMS HAVE SUPER BATS.  IF YOU
        GO THERE, A BAT GRABS YOU AND TAKES YOU TO SOME OTHER
        ROOM AT RANDOM. (WHICH MIGHT BE TROUBLESOME)

        WUMPUS:
THE WUMPUS IS NOT BOTHERED BY THE HAZARDS (HE HAS SUCKER
FEET AND IS TOO BIG FOR A BAT TO LIFT). USUALLY
HE IS ASLEEP. TWO THINGS THAT WAKE HIM UP: YOUR ENTERING
HIS ROOM OR YOUR SHOOTING AN ARROW.
        IF THE WUMPUSE WAKES, HE MOVES (P=.75) ONE ROOM
OR STAYS STILL (P=.25). AFTER THAT, IF HE IS WHERE YOU
ARE, HE EATS YOU UP (& YOU LOSE!))

        YOU:
EACH TURN YOU MAY MOVE OR SHOOT A CROOKED ARROW
        MOVING: YOU CAN GO ONE ROOM (THRU ONE TUNNEL)
        ARROWS: YOU HAVE 5 ARROWS. YOU LOSE WHEN YOU RUN OUT.
        EACH ARROW CAN GO FROM 1 TO 5 ROOMS. YOU AIM BY TELLING
        THE COMPUTER TTHE ROOM#S YOU WANT THE ARROW TO GO TO.
        IF THE ARROW CAN'T GO THAT WAY (IE NO TUNNEL) IT MOVES
        AT RANDOM TO THE NEXT ROOM.
        IF THE ARROW HITS THE WUMPUS, YOU WIN.
        IF THE ARROW HITS YOU, YOU LOSE.

        WARNINGS:
        WHEN YOU ARE ONE ROOM AWAY FROM WUMPUS OR HAZARD,
        THE COMPUTER SAYS:
WUMPUS-   '{Wumpus-Warning}'
BAT   -   '{Bat-Warning}'
PIT   -   '{Pit-Warning}'`,
    'Instructions-Input': 'INSTRUCTIONS (Y-N)?',
    'Location': 'YOU ARE IN ROOM  {0}',
    'Lose': 'HA HA HA  - YOU LOSE!',
    'Pit-Hazard': 'YYYIIIIEEEE . . . FELL IN PIT',
    'Pit-Warning': 'I FEEL A DRAFT!',
    'Shoot-Count': 'NO. OF ROOMS(1-5)',
    'Shoot-Room': 'ROOM #',
    'Shot-Missed': 'MISSED',
    'Shot-Wumpus': 'AHA! YOU GOT THE WUMPUS!',
    'Shot-Yourself': 'OUCH! ARROW GOT YOU!',
    'Tcorrked-Arrows': `ARROWS AREN'T THA TCORRKED - TRY ANOTHER ROOM`,
    'TurnActions': 'SHOOT OR MOVE (S-M)?',
    'WhereTo': 'WHERE TO?',
    'Win': `HEE HEE HEE - THE WUMPUS'LL GETCHA NEXT TIME!!`,
    'Wumpus-GotYou': 'TSK TSK TSK - WUMPUS GOT YOU!',
    'Wumpus-Hazard': '... OOPS! BUMPED A WUMPUS!',
    'Wumpus-Warning': 'I SMELL A WUMPUS!',
};

export default resources;