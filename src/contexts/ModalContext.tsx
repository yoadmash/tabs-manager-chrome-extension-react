import { ReactNode, createContext, useContext, useState } from "react";

interface ModalState {
    open: boolean;
    type?: 'add-to-opened-window' | 'add-to-saved-window' | 'edit-saved-tab' | 'set-firebase-config';
    data?: any;
    updateModal: (state: any) => void;
}

const ModalContext = createContext<ModalState | undefined>(undefined);

interface Props {
    children: ReactNode
}

export const ModalProvider = ({ children }: Props) => {
    const [modal, setModal] = useState<any>({
        open: false,
        type: 'edit'
    });

    const updateModal = (modal: ModalState) => {
        setModal(modal);
    }

    const contextValue: any = {
        ...modal,
        updateModal
    }

    return (
        <ModalContext.Provider value={contextValue}>
            {children}
        </ModalContext.Provider>
    )
}

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}