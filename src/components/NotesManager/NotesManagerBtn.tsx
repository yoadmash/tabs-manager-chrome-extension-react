import { faNoteSticky } from '@fortawesome/free-solid-svg-icons'
import Icon from '../Icon/Icon';
import { useModal } from '../../contexts/ModalContext';

const NotesManagerBtn = () => {

    const modal = useModal();

    const action = () => {
        modal.updateModal({
            open: true,
            type: 'notes-manager',
            data: {}
        })
    }

    return (
        <>
            <Icon
                id='notes-manager-btn'
                icon={faNoteSticky}
                title={'Notes Manager'}
                onClick={() => action()}
            />
        </>
    )
}

export default NotesManagerBtn