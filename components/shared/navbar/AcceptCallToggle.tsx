'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

import { getUserById, updateUserById } from '@/lib/actions/user.action';
import { MongoUser } from '@/lib/actions/shared.types';
import Toggle from '../Toggle';

const AcceptCallToggle = () => {
    const { userId, isLoaded } = useAuth();
    const [mongoUser, setMongoUser] = useState<MongoUser | null>(null);

    useEffect(() => {
        if (!isLoaded || !userId) return;

        const fetchData = async () => {
            try {
                const user = await getUserById({ userId });
                if (user) {
                    setMongoUser(user);
                }
            } catch (error) {
                console.error('Error getting user data:', error);
            }
        };

        fetchData();
    }, [userId, isLoaded]);

    const handleToggleChange = useCallback(
        async (isAcceptCalls: boolean) => {
            if (userId) {
                try {
                    // Delay to ensure this doesn't happen during render
                    await new Promise(resolve => setTimeout(resolve, 0));

                    await updateUserById({
                        clerkId: userId,
                        updateData: {
                            isAcceptCalls,
                        },
                        path: '',
                    });

                    setMongoUser(prev => prev && { ...prev, isAcceptCalls });
                } catch (error) {
                    console.error('Error updating user:', error);
                }
            }
        },
        [userId],
    );

    return (
        mongoUser && (
            <Toggle
                id="accept_call"
                initialState={mongoUser.isAcceptCalls}
                onToggle={handleToggleChange}
            />
        )
    );
};

export default AcceptCallToggle;
