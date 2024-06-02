import { useEffect, useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { IconX } from "@tabler/icons-react";

interface AutoCloseAlertProps {
    title: string;
    content: string;
    bg: string;
}

const AutoCloseAlert: React.FC<AutoCloseAlertProps> = ({ title, content, bg }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 15000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <Alert className={`fixed text-white z-[99] max-w-[370px] bottom-5 right-5 flex justify-between items-center  p-4  ${bg}`}>
            <div className="flex relative w-full">
                <div>
                    <AlertTitle className="text-white font-semibold">{title}</AlertTitle>
                    <AlertDescription>{content}</AlertDescription>
                </div>
                <IconX className="w-5 h-5 cursor-pointer absolute right-2 top-2" onClick={() => setIsVisible(false)} />
            </div>
        </Alert>
    );
};

export default AutoCloseAlert;