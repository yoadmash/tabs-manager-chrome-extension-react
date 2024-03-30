import { Input } from 'reactstrap'

interface Props {
    savedWindows: any
}

const SavedWindowSelect = ({ savedWindows }: Props) => {

    const scroll = (id: string) => {
        document.querySelector(`#window-id-${id}`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    return (
        <Input type='select' className='m-1' defaultValue={'Scroll to saved window'} onChange={(e) => scroll(e.target.value)}>
            <option disabled>Scroll to saved window</option>
            {savedWindows?.map((window: any, index: number) => <option key={index} value={window.id}>{`[Window ID: ${window.id} | Tabs: ${window.tabs.length} | incognito: ${window.incognito}]`}</option>)}
        </Input>
    )
}

export default SavedWindowSelect