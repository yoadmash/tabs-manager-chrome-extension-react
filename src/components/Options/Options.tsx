import { Button } from "reactstrap";
import { useStorage } from "../../contexts/AppContext"
import Option from "./Option"

const Options = () => {

    const storage = useStorage();

    const settings: any = {
        dark_theme: storage?.options?.dark_theme,
        show_favicons: storage?.options?.show_favicons,
        auto_scroll: storage?.options?.auto_scroll,
        hide_saved: storage?.options?.hide_saved,
        bypass_cache: storage?.options?.bypass_cache,
        show_incognito: storage?.currentWindow?.incognito ? true : storage?.options?.show_incognito
    }

    const options = [
        { id: 'dark_theme', title: 'Dark theme' },
        { id: 'show_favicons', title: 'Show favicons' },
        { id: 'auto_scroll', title: 'Auto scroll to active tab' },
        { id: 'hide_saved', title: 'Hide saved windows' },
        { id: 'bypass_cache', title: 'Bypass cache on refresh' },
        { id: 'show_incognito', title: 'Always show incognito windows' },
    ]

    const setSetting = (setting_key: string, setting: boolean) => {
        settings[setting_key] = setting;
        storage.update('options', settings);
    }

    const resetStorage = async () => {
        await chrome.storage?.local.set({ savedWindows: [] })
        storage.update('savedWindows', []);
        window.close();
    }

    return (
        <>
            <div className="d-flex flex-column">
                {options.map(option => <Option
                    key={option.id}
                    title={option.title}
                    onChange={() => !storage?.currentWindow?.incognito && setSetting(option.id, !settings[option.id])}
                    checked={settings[option.id]} />
                )}
            </div>
            <Button color="danger" className="w-100" onClick={() => resetStorage()}>Delete saved windows</Button>
        </>
    )
}

export default Options