import React, { useState, useCallback } from 'react';
import { Switch } from '../ui/switch';

interface ToggleProps {
    id: string;
    initialState?: boolean;
    onToggle?: (state: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({
    id,
    initialState = false,
    onToggle,
}) => {
    const [isToggled, setIsToggled] = useState<boolean>(initialState);

    const handleToggle = useCallback(() => {
        try {
            setIsToggled(prev => {
                const newState = !prev;
                if (onToggle) {
                    if (typeof onToggle !== 'function') {
                        throw new Error('onToggle should be a function');
                    }
                    onToggle(newState);
                }
                return newState;
            });
        } catch (error) {
            console.error('Error toggling state:', error);
        }
    }, [onToggle]);

    return (
        <div className="flex flex-row gap-1">
            <Switch
                id={`${id}-switcher`}
                checked={isToggled}
                onCheckedChange={handleToggle}
            />
        </div>
    );
};

export default Toggle;
