import {ActorsEnum, GameStatusEnum} from '../../enums.js';
import resources from '../../resources.js';

class Bat {
    constructor() {
    }

    Init = () => {
        return resources.getResources('Bat-Warning', 'Bat-Hazard')
            .then(result => {
                const [warning, hazard] = result;
                this.WarningText = warning;
                this.HazardText = hazard;
            });
    };

    get Type() {
        return ActorsEnum.Bat;
    }

    HazardAction = (cave) => {
        cave.MovePlayer(0, false);
        return { Status: GameStatusEnum.Continue };
    }
}

export default Bat;