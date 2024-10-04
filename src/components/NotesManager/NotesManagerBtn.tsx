import { faNoteSticky } from '@fortawesome/free-solid-svg-icons'
import Icon from '../Icon/Icon';
import { useModal } from '../../contexts/ModalContext';
import { useEffect } from 'react';

const NotesManagerBtn = () => {

    const modal = useModal();

    const action = () => {
        modal.updateModal({
            open: true,
            type: 'notes-manager',
            data: {}
        })
    }

    const handleKeyboardShortcut = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'Q') {
            action();
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyboardShortcut);

        return () => {
            document.removeEventListener('keydown', handleKeyboardShortcut);
        }
    }, []);

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