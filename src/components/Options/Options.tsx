import Option from "./AutoScroll/Option"

const Options = () => {

    const options = [
        {id: 'auto_scroll', title: 'Auto scroll'},
        {id: 'show_incognito', title: 'Show incognito windows'},
    ]

    const setSetting = (setting_key?: string, setting?: boolean) => {
        console.log("Still WIP")
    }

    return (
        <div className="d-flex gap-3">
            {options.map(option => <Option key={option.id} title={option.title} onChange={() => setSetting()}/>)}
        </div>
    )
}

export default Options