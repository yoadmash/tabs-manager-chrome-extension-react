import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UncontrolledTooltip } from 'reactstrap';

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
                color='primary'
            >
                <FontAwesomeIcon
                    className={'icon'}
                    icon={icon}
                    onClick={onClick}
                />
            </i>
            {<UncontrolledTooltip target={id} placement='bottom'>{title}</UncontrolledTooltip>}
        </>
    )
}

export default Icon