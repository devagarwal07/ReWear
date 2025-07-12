import React, { useState, useEffect } from 'react';
import { getUserDashboard } from '../api';
import { useUser } from '@clerk/clerk-react';

export default function DashboardWrapper(props) {
    const { user, isLoaded } = useUser();
    const [clerkId, setClerkId] = useState(null);

    useEffect(() => {
        if (isLoaded && user) {
            setClerkId(user.id);
        }
    }, [user, isLoaded]);

    if (!isLoaded) return <div>Loading user...</div>;
    if (!user) return <div>Please sign in.</div>;

    return <props.Component clerkId={clerkId} {...props} />;
}
