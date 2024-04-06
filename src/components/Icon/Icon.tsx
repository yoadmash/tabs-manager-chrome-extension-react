import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'react-tooltip';

interface Props {
    id: string;
    icon: any;
    title: string;
    onClick?: any
}

const Icon = ({ id, icon, title, onClick }: Props) => {

    return (
        <>
            <i
                id={id}
                className='mt-1'
            >
                <FontAwesomeIcon
                    className={'icon'}
                    icon={icon}
                    onClick={onClick}
                />
                <Tooltip anchorSelect={`#${id}`} className='p-1' place='bottom-end'>
                    {title}
                </Tooltip>
            </i>
        </>
    )
}

export default Icon