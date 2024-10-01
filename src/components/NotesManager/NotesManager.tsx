import { Button, Input } from 'reactstrap';
import { Note } from '../../contexts/AppContext';
import { useState } from 'react';
import Icon from '../Icon/Icon';
import { faCircleArrowLeft, faEdit, faEye, faFileCirclePlus, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Props {
    notesFromStorage: Note[]
}

const NotesManager = ({ notesFromStorage }: Props) => {

    const [notes] = useState(notesFromStorage);

    const [targetNote, setTargetNote] = useState({
        view: false,
        edit: false,
        content: ''
    });

    return (
        <>
            {
                (!targetNote.view)
                    ? <div className='notes-list'>
                        <div className='w-100 d-flex justify-content-end mb-3'>
                            <Icon
                                id='create-new-note'
                                icon={faFileCirclePlus}
                                title='New Note'
                            />
                        </div>
                        {
                            notes?.map(note =>
                                <div key={note.id} className='note d-flex justify-content-between align-items-center mb-2'>
                                    <span>{note.title}</span>
                                    <div className="d-flex align-items-center gap-1">
                                        <Icon
                                            id={`note-${note.id}-view`}
                                            title='View'
                                            icon={faEye}
                                            onClick={() => setTargetNote({ view: true, edit: false, content: note.content })}
                                        />
                                        <Icon
                                            id={`note-${note.id}-edit`}
                                            title='Edit'
                                            icon={faEdit}
                                            onClick={() => setTargetNote({ view: true, edit: true, content: note.content })}
                                        />
                                        <Icon
                                            id={`note-${note.id}-delete`}
                                            title='Delete'
                                            icon={faTrash}
                                            onClick={() => console.log('delete note')}
                                        />
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    : <div className='d-flex flex-column gap-3'>
                        <div>
                            <Icon
                                id='back-from-note'
                                icon={faCircleArrowLeft}
                                title='Back'
                                onClick={() => setTargetNote({ view: false, edit: false, content: '' })}
                            />
                        </div>
                        <Input
                            disabled={targetNote.edit === false}
                            type='textarea'
                            style={{ resize: "none" }}
                            rows={10}
                            defaultValue={targetNote.content}
                        />
                        {targetNote.edit &&
                            <div className='w-100'>
                                <Button color='primary' className='w-100'>Save</Button>
                            </div>
                        }
                    </div>
            }
        </>
    )
}

export default NotesManager