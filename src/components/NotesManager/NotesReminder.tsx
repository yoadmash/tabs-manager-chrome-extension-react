import { useStorage } from '../../contexts/AppContext';
import { useEffect, useState } from 'react';
import Icon from '../Icon/Icon';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Button, Input } from 'reactstrap';

interface Props {
    note: {
        id: number | undefined;
        title: string | undefined;
        reminder?: {
            name: string;
            scheduledTime: number;
        }
    };
    goBack: () => void;
}

const NotesReminder = ({ note, goBack }: Props) => {

    const storage = useStorage();

    const [datetime, setDateTime] = useState('')
    const [noteUpdated, setNoteUpdated] = useState(false);

    useEffect(() => {
        if (noteUpdated) {
            setTimeout(() => {
                setNoteUpdated(false);
            }, 1500);
        }
    }, [noteUpdated])

    const setReminder = () => {
        const randomAlarmId = Math.floor(Math.random() * 90000000) + 10000000;
        const datetimeToMilliseconds = new Date(datetime).getTime();

        chrome.alarms?.create(`${randomAlarmId}`, {
            when: datetimeToMilliseconds
        })
            .then(() => {
                const notes = storage?.notes;
                const currentNoteIdx = notes.findIndex(n => n.id === note.id);
                const currentNote = notes[currentNoteIdx];

                const reminder = {
                    name: `${randomAlarmId}`,
                    scheduledTime: datetimeToMilliseconds
                }

                if (currentNote) {
                    currentNote.reminder = reminder;
                    notes[currentNoteIdx] = currentNote;
                    storage.update('notes', notes);
                }
            })
            .catch((err) => console.log(err));
    }

    const updateReminder = async () => {
        try {
            const alarms = await chrome.alarms?.getAll();
            const alarm = alarms.find(alarm => alarm.name === note.reminder?.name);

            if (!alarm) throw new Error(`Reminder not found`);

            await chrome.alarms.clear(alarm.name);
            setReminder();
            setNoteUpdated(true);

        } catch (err: any) {
            console.log(err.message);
        }
    }

    const clearReminder = () => {
        const notes = storage?.notes;
        const currentNoteIdx = notes.findIndex(n => n.id === note.id);
        const currentNote = notes[currentNoteIdx];

        chrome.alarms?.clear(currentNote.reminder?.name)
            .then(() => {
                delete currentNote?.reminder;
                storage.update('notes', notes);
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        const hourInMilliseconds = 60 * 60 * 1000;
        const defaultDateTime = note?.reminder?.scheduledTime || Date.now() + 3 * hourInMilliseconds;
        const currentDateTime: string[] = [
            new Date(defaultDateTime).toLocaleDateString('en-IL').split('/').reverse().join('-'),
            new Date(defaultDateTime).toLocaleTimeString('en-IL', {
                hour: '2-digit',
                minute: '2-digit'
            })
        ];

        setDateTime(currentDateTime.join('T'));
    }, []);

    return (
        <>
            <p>{!note.reminder ? 'Set a' : 'Update the'} reminder for '{note?.title}'</p>
            <div className='d-flex align-items-center gap-2'>
                <div className='d-flex align-items-center h-100'>
                    <Icon
                        id='back-from-note'
                        icon={faCircleArrowLeft}
                        title='Back'
                        onClick={() => goBack()}
                    />
                </div>
                <Input
                    className={noteUpdated ? 'reminder-updated' : ''}
                    type='datetime-local'
                    defaultValue={datetime}
                    onChange={(e) => setDateTime(e.target.value)}
                />
                <Button
                    color='primary'
                    onClick={() => (!note.reminder ? setReminder() : updateReminder())}
                >
                    {!note.reminder ? 'Set' : 'Update'}
                </Button>
                {note.reminder &&
                    <Button
                        color='danger'
                        onClick={() => clearReminder()}
                    >
                        Clear
                    </Button>
                }
            </div>
        </>
    )
}

export default NotesReminder