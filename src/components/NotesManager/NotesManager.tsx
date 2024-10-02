import { Note } from '../../contexts/AppContext';
import { useState } from 'react';
import Icon from '../Icon/Icon';
import { faEdit, faEye, faFileCirclePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import SingleNote from './SingleNote';

interface Props {
    notesFromStorage: Note[]
}

const NotesManager = ({ notesFromStorage }: Props) => {

    const [notes] = useState(notesFromStorage);

    const [targetNote, setTargetNote] = useState<Note | null>(null);
    const [createNew, setCreateNew] = useState(false);
    const [edit, setEdit] = useState(false);

    return (
        <>
            {
                (!targetNote && !createNew)
                    ? <div className='notes-list'>
                        <div className='w-100 d-flex justify-content-end mb-3 sticky-top bg-white'>
                            <Icon
                                id='create-new-note'
                                icon={faFileCirclePlus}
                                title='New Note'
                                onClick={() => setCreateNew(true)}
                            />
                        </div>
                        {
                            notes?.map(note =>
                                <div key={note.id} className='note-row d-flex justify-content-between align-items-center mb-2'>
                                    <span>{note.title}</span>
                                    <div className="d-flex align-items-center gap-1">
                                        <Icon
                                            id={`note-${note.id}-view`}
                                            title='View'
                                            icon={faEye}
                                            onClick={() => setTargetNote(note)}
                                        />
                                        <Icon
                                            id={`note-${note.id}-edit`}
                                            title='Edit'
                                            icon={faEdit}
                                            onClick={() => {
                                                setEdit(true);
                                                setTargetNote(note);
                                            }}
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
                    : <SingleNote
                        newNote={createNew}
                        note={targetNote || null}
                        edit={edit}
                        goBack={() => {
                            setTargetNote(null);
                            setCreateNew(false);
                            setEdit(false);
                        }}
                    />
            }
        </>
    )
}

export default NotesManager