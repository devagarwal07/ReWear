import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import api from '../api';

export default function ClerkRegisterSync() {
    const { user, isLoaded } = useUser();

    useEffect(() => {
        if (!isLoaded || !user) return;
        // Send Clerk user info to backend
        api.post('/users/clerk-register', {
            clerkId: user.id,
            name: user.fullName,
            email: user.primaryEmailAddress?.emailAddress,
            avatar: user.imageUrl,
        });
    }, [user, isLoaded]);

    return null;
}
