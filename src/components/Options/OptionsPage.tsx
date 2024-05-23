import { useStorage } from '../../contexts/AppContext';
import Options from './Options'

const OptionsPage = () => {
    const storage = useStorage();

    return (
        <div className='Options'>
            <h5><u>Storage information</u></h5>
            <p className='mt-1'>Usage: {storage.size()}</p>
            <Options />
        </div>
    )
}

export default OptionsPage