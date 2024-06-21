import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavContext } from '../../contexts/NavContext'
import Icon from '../Icon/Icon'
import NewOptions from './NewOptions'

const OptionsPage = () => {
    const { updateCurrentNavTab } = useNavContext();

    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');

    return (
        <div className='Options'>
            {!view && <Icon
                id='back-from-options-btn'
                icon={faCircleArrowLeft}
                title='Back'
                onClick={() => updateCurrentNavTab(0)}
            />}
            <NewOptions />
        </div>
    )
}

export default OptionsPage