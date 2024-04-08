import { Input } from 'reactstrap'

interface Props {
    savedWindows: any
}

const SavedWindowSelect = ({ savedWindows }: Props) => {

    const scroll = (id: string) => {
        document.querySelector('.windows-lists')?.scrollTo({
            top: document.getElementById(`window-id-${id}`)!.offsetTop - 215,
            behavior: 'smooth'
        });
    }

    return (
        <Input type='select' className='m-1' value={'Scroll to'} onChange={(e) => scroll(e.target.value)}>
            <option hidden disabled>Scroll to</option>
            {savedWindows?.map((window: any, index: number) => <option key={index} value={window.id}>{`[Window ID: ${window.id} | Tabs: ${window.tabs.length} | incognito: ${window.incognito}]`}</option>)}
        </Input>
    )
}

export default SavedWindowSelect