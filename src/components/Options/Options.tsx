import { useStorage } from "../../contexts/AppContext"
import { useNavContext } from "../../contexts/NavContext";
import Option from "./Option"

const Options = () => {

    const { currentNavTab, updateCurrentNavTab } = useNavContext();
    const storage = useStorage();

    const settings: any = {
        auto_scroll: storage?.options?.auto_scroll,
        show_incognito: storage?.options?.show_incognito
    }

    const options = [
        { id: 'auto_scroll', title: 'Auto scroll' },
        { id: 'show_incognito', title: 'Show incognito windows' },
    ]

    const setSetting = (setting_key: string, setting: boolean) => {
        settings[setting_key] = setting;
        storage.update('options', settings);
        if (currentNavTab === 2 && setting_key === 'show_incognito' && !setting) {
            updateCurrentNavTab(0);
        }
    }

    return (
        <div className="d-flex gap-3">
            {options.map(option => <Option key={option.id} title={option.title} onChange={() => setSetting(option.id, !settings[option.id])} checked={settings[option.id]} />)}
        </div>
    )
}

export default Options