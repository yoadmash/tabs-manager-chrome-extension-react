import { Badge, Button, Col, Input, Row } from 'reactstrap';
import Icon from '../Icon/Icon';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Note } from '../../contexts/AppContext';

interface Props {
    newNote: boolean;
    note: Note | null;
    edit: boolean | undefined;
    error: {
        type: 'title' | 'content' | 'both' | 'general' | null;
        description: string;
    } | null;
    clearError: () => void;
    goBack: () => void;
    saveNote: (title: string, content: string) => void;
}

const SingleNote = ({ newNote, note, edit, error, clearError, goBack, saveNote }: Props) => {
    const [noteTitle, setNoteTitle] = useState(note?.title || '');
    const [noteContent, setNoteContent] = useState(note?.content || '');

    const openTabRef = () => {
        if (note?.tabReference?.url) {
            const { tabReference: tab } = note;
            chrome.windows?.create({
                state: 'normal',
                focused: true,
                incognito: tab.incognito,
                url: tab.url,
            });
        }
    }

    return (
        <Row>
            <Col sm={1}>
                <div className='d-flex align-items-center h-100'>
                    <Icon
                        id='back-from-note'
                        icon={faCircleArrowLeft}
                        title='Back'
                        onClick={() => { goBack(); clearError(); }}
                    />
                </div>
            </Col>
            <Col sm={11}>
                <div className='note d-flex flex-column gap-3'>
                    {(note?.tabReference) &&
                        <div className='tabInfo'>
                            <Badge
                                pill
                                tag={'div'}
                                color={note?.tabReference?.incognito ? 'secondary' : 'info'}
                                onClick={() => openTabRef()}
                            >
                                <img
                                    alt="tab"
                                    src={note.tabReference?.favIconUrl || '/generic_tab.svg'}
                                    onError={({ currentTarget }) => {
                                        currentTarget.src = '/generic_tab.svg';
                                    }} />
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
                            invalid={error?.type === 'title' || error?.type === 'both'}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            onFocus={() => clearError()}
                        />
                    }
                    <Input
                        rows={10}
                        type='textarea'
                        style={{ resize: "none" }}
                        placeholder={'Content'}
                        disabled={!newNote && !edit}
                        defaultValue={note?.content || ""}
                        invalid={error?.type === 'content' || error?.type === 'both'}
                        onChange={(e) => (newNote || edit) && setNoteContent(e.target.value)}
                        onFocus={() => clearError()}
                    />
                    {(newNote || edit) &&
                        <div className='w-100'>
                            <Button color='primary' className='w-100' onClick={() => saveNote(noteTitle, noteContent)}>Save</Button>
                        </div>
                    }
                </div>
                {(error && error?.type !== null) && <div className='text-danger mt-2'>ERROR: {error?.description}</div>}
            </Col>
        </Row>
    )
}

export default SingleNote