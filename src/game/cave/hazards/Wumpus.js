import {ActorsEnum, GameStatusEnum} from '../../enums.js';
import resources from '../../resources.js';
import utilities from '../../utilities.js';

class Wumpus {
    constructor() {
    }

    Init = () =>{
        return resources.getResources('Wumpus-Warning', 'Wumpus-Hazard')
            .then(result => {
                const [warning, hazard] = result;
                this.WarningText = warning;
                this.HazardText = hazard;
            });
    };

    get Type() {
        return ActorsEnum.Wumpus;
    }

    HazardAction = async (cave) => {
        if(utilities.Random(1, cave.CurrentRoom.Exits.length + 1) == 1)
        {
            const wumpusGotYou = await resources.getResources('Wumpus-GotYou');
            return { Status: GameStatusEnum.Lose, Message: wumpusGotYou };
        } else {
            cave.MoveHazard(this, true);
            return { Status: GameStatusEnum.Continue };
        }
    }
}

export default Wumpus;