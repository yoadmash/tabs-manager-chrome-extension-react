import { faGear } from '@fortawesome/free-solid-svg-icons'
import { useStorage } from '../../contexts/AppContext'
import { useEffect, useState } from 'react';
import Icon from '../Icon/Icon';
import { useNavContext } from '../../contexts/NavContext';

const OptionsBtn = () => {

    const storage = useStorage();
    const { updateCurrentNavTab } = useNavContext();
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        setExpanded(storage?.popup !== null);
    }, [storage, expanded, setExpanded]);

    const action = () => {
        updateCurrentNavTab(3);
    }

    return (
        <>
            <Icon
                id='options-btn'
                icon={faGear}
                title='Options'
                onClick={() => action()}
            />
        </>
    )
}

export default OptionsBtn