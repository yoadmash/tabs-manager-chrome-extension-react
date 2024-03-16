import { Input, Label } from "reactstrap"

interface Props {
    title: string;
    onChange?: () => void;
    checked?: boolean;
}

const Option = ({ title, onChange, checked }: Props) => {
    return (
        <Label className="mt-2 d-flex align-items-start gap-2">
            <Input type="checkbox" defaultChecked={checked} onChange={onChange}/>
            {title}
        </Label>
    )
}

export default Option