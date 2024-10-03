import { Note, useStorage } from '../../contexts/AppContext';
import { useState } from 'react';
import Icon from '../Icon/Icon';
import { faEdit, faEye, faFileCirclePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import SingleNote from './SingleNote';

interface Props {
    notesFromStorage: Note[]
}

const NotesManager = ({ notesFromStorage }: Props) => {
    const storage = useStorage();

    const [notes, setNotes] = useState(notesFromStorage || []);

    const [targetNote, setTargetNote] = useState<Note | null>(null);
    const [createNew, setCreateNew] = useState(false);
    const [edit, setEdit] = useState(false);
    const [error, setError] = useState<{
        type: 'title' | 'content' | 'both' | 'general' | null;
        description: string;
    } | null>(null);

    const currentWindow = storage?.currentWindow?.id;
    const currentTab = storage?.openedWindows?.find(win => win.id === currentWindow)?.tabs?.find((tab: any) => tab.active);

    const createNewNote = () => {
        if (currentTab) {
            const newNote: Note = {
                id: (notes?.length ? notes[notes.length - 1].id + 1 : 1),
                title: '',
                content: '',
                tabReference: {
                    title: currentTab.title,
                    url: currentTab.url,
                    favIconUrl: currentTab.favIconUrl,
                    incognito: currentTab.incognito,

                }
            }
            setTargetNote(newNote);
        }
        setCreateNew(true);
    }

    const saveNote = (title: string, content: string) => {        if (!title.length && !content.length) {
            setError({
                type: 'both',
                description: 'Missing title and content'
            });
            return;
        }

        if (!title.length) {
            setError({
                type: 'title',
                description: 'Missing title'
            });
            return;
        }

        if (!content.length) {
            setError({
                type: 'content',
                description: 'Missing content'
            });
            return;
        }

        if (targetNote) {
            const updatedNote: Note = {
                id: targetNote.id,
                title: title.length ? title : targetNote.title,
                content: content.length ? content : targetNote.content,
                tabReference: targetNote?.tabReference || undefined,
            };

            if (createNew && notes?.find(note => note.id === targetNote?.id)) {
                setError({
                    type: 'general',
                    description: 'Note already exists'
                })
                return;
            }

            setTargetNote(updatedNote)

            if (createNew) {
                notes.push(updatedNote);
                setNotes(notes);
            }

            if (edit) {
                const noteIndex = notes.findIndex(note => note.id === updatedNote.id);
                notes[noteIndex] = updatedNote;
                setNotes(notes);
            }

            storage.update('notes', notes);
            goBack();
        }
    }

    const deleteNote = (id: number) => {
        setNotes(notes.filter(note => note.id !== id));
        storage.update('notes', notes.filter(note => note.id !== id));
    }

    const goBack = () => {
        setTargetNote(null);
        setCreateNew(false);
        setEdit(false);
    }

    return (
        <>
            {
                (!targetNote && !createNew)
                    ? <div className='notes-list'>
                        <div className='w-100 d-flex justify-content-start mb-3 sticky-top bg-white'>
                            <Icon
                                id='create-new-note'
                                icon={faFileCirclePlus}
                                title='New Note'
                                onClick={() => createNewNote()}
                            />
                            {
                                (notes?.length > 0) &&
                                <Icon
                                    id='delete-all-notes'
                                    icon={faTrash}
                                    title='Delete all notes'
                                    onClick={() => {
                                        setNotes([]);
                                        storage.update('notes', []);
                                    }}
                                />
                            }
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
                                            onClick={() => deleteNote(note.id)}
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
                        goBack={() => goBack()}
                        saveNote={saveNote}
                        error={error}
                        clearError={() => setError(null)}
                    />
            }
        </>
    )
}

export default NotesManager