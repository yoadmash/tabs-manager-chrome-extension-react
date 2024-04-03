import { Input, Label } from "reactstrap"

interface Props {
    title: string;
    onChange?: () => void;
    checked?: boolean;
}

const Option = ({ title, onChange, checked }: Props) => {

    return (
        <Label className="d-flex align-items-start gap-2">
            <Input type="checkbox" checked={checked || false} onChange={onChange} />
            {title}
        </Label>
    )
}

export default Option