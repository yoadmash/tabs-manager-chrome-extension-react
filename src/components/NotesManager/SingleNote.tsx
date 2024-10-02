import { Badge, Button, Input } from 'reactstrap';
import Icon from '../Icon/Icon';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { Note, useStorage } from '../../contexts/AppContext';

interface Props {
    newNote: boolean;
    note: Note | null;
    edit: boolean | undefined;
    goBack: () => void;
}

const SingleNote = ({ newNote, note, edit, goBack }: Props) => {
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');

    const saveNote = () => {
        console.log(note?.tabReference);
        if (noteTitle.length && noteContent.length) {
            if (newNote) {
                //push new note
            } else if (edit) {
                //edit note
            }
        }
    }

    return (
        <div className='note d-flex flex-column gap-3'>
            <div>
                <Icon
                    id='back-from-note'
                    icon={faCircleArrowLeft}
                    title='Back'
                    onClick={() => goBack()}
                />
            </div>
            {(note?.tabReference) &&
                <div className='tabInfo'>
                    <Badge color={note?.tabReference?.incognito ? 'secondary' : 'info'} pill tag={'div'}>
                        <img src={note.tabReference.favIconUrl} alt="tab" />
                        <span title={note?.tabReference?.title}>{note?.tabReference?.title}</span>
                    </Badge>
                </div>
            }
            {
                (newNote || edit) &&
                <Input
                    type='text'
                    placeholder={'Title'}
                    disabled={!newNote && !edit}
                    defaultValue={note?.title || ""}
                    onChange={(e) => setNoteTitle(e.target.value)}
                />
            }
            <Input
                rows={10}
                type='textarea'
                style={{ resize: "none" }}
                placeholder={'Content'}
                disabled={!newNote && !edit}
                defaultValue={note?.content || ""}
                onChange={(e) => (newNote || edit) && setNoteContent(e.target.value)}
            />
            {(newNote || edit) &&
                <div className='w-100'>
                    <Button color='primary' className='w-100' onClick={() => saveNote()}>Save</Button>
                </div>
            }
        </div>
    )
}

export default SingleNote