import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Onboarding() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: user?.fullName || '',
        email: user?.primaryEmailAddress?.emailAddress || '',
        phone: '',
        address: '',
        avatar: user?.imageUrl || '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        await api.post('/users', {
            clerkId: user.id,
            ...form,
            avatar: form.avatar || user?.imageUrl,
        });
        setLoading(false);
        navigate('/dashboard');
    };

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto', background: '#222', padding: 24, borderRadius: 12 }}>
            <h2>Complete Your Profile</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required style={{ width: '100%', marginBottom: 12 }} />
                <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required style={{ width: '100%', marginBottom: 12 }} />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" style={{ width: '100%', marginBottom: 12 }} />
                <input name="address" value={form.address} onChange={handleChange} placeholder="Address" style={{ width: '100%', marginBottom: 12 }} />
                <button type="submit" disabled={loading} style={{ width: '100%' }}>
                    {loading ? 'Saving...' : 'Save & Continue'}
                </button>
            </form>
        </div>
    );
}
