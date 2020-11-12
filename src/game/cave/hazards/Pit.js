import {ActorsEnum, GameStatusEnum} from '../../enums.js';
import resources from '../../resources.js';

class Pit {
    constructor() {
    }

    Init = () => {
        return resources.getResources('Pit-Warning', 'Pit-Hazard')
            .then(result => {
                const [warning, hazard] = result;
                this.WarningText = warning;
                this.HazardText = hazard;
            });
    }

    get Type() {
        return ActorsEnum.Pit;
    }

    HazardAction = () => {
        return { Status: GameStatusEnum.Lose };
    }
}

export default Pit;