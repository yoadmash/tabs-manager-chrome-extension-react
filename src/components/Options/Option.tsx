import { Input, Label } from "reactstrap"

interface Props {
    title: string;
    onChange?: () => void;
    checked?: boolean;
    hide?: boolean;
}

const Option = ({ title, onChange, checked, hide }: Props) => {

    return (
        <>
            {!hide && <Label className="d-flex align-items-center gap-1">
                <Input type="checkbox" checked={checked || false} onChange={onChange} />
                {title}
            </Label >}
        </>
    )
}

export default Option