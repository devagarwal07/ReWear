import React, { useState, useEffect } from 'react';
import { getUserDashboard, updateUserProfile } from '../api';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const styles = {
    container: {
        width: '100vw',
        height: '100vh',
        margin: '0',
        padding: '2rem',
        backgroundColor: '#FFFFFF',
        color: '#2C3E50',
        fontFamily: 'Inter, "Segoe UI", Roboto, Arial, sans-serif',
        overflow: 'auto',
        boxSizing: 'border-box'
    },
    header: {
        height: '70px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E9ECEF',
        borderRadius: '8px',
        marginBottom: '24px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
    },
    headerLabel: {
        position: 'absolute',
        top: '-12px',
        left: '20px',
        backgroundColor: '#FFFFFF',
        padding: '0 12px',
        color: '#2C3E50',
        fontSize: '14px',
        fontWeight: '600',
        letterSpacing: '-0.02em'
    },
    breadcrumb: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: '#6C757D'
    },
    searchContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    searchBar: {
        background: '#F8F9FA',
        border: '1px solid #DEE2E6',
        borderRadius: '8px',
        padding: '10px 16px',
        color: '#2C3E50',
        fontSize: '14px',
        width: '300px',
        transition: 'all 0.3s ease'
    },
    searchBarFocused: {
        borderColor: '#007BFF',
        boxShadow: '0 0 0 3px rgba(0,123,255,0.1)'
    },
    quickActions: {
        display: 'flex',
        gap: '8px'
    },
    actionBtn: {
        background: '#007BFF',
        border: 'none',
        borderRadius: '6px',
        padding: '8px 12px',
        color: '#FFFFFF',
        fontSize: '12px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    notificationBtn: {
        background: '#F8F9FA',
        border: '1px solid #DEE2E6',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        color: '#6C757D',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        position: 'relative'
    },
    notificationBadge: {
        position: 'absolute',
        top: '-2px',
        right: '-2px',
        background: '#FF6B6B',
        color: '#FFFFFF',
        borderRadius: '50%',
        width: '16px',
        height: '16px',
        fontSize: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    userMenu: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: '6px',
        transition: 'background-color 0.3s ease'
    },
    profileSection: {
        display: 'flex',
        gap: '32px',
        alignItems: 'flex-start',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E9ECEF',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    },
    avatarContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
    },
    avatar: {
        width: '120px',
        height: '120px',
        border: '3px solid #E9ECEF',
        borderRadius: '50%',
        flexShrink: 0,
        background: 'linear-gradient(135deg, #F8F9FA, #E9ECEF)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s ease',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px'
    },
    avatarUpload: {
        position: 'absolute',
        bottom: '0',
        right: '0',
        background: '#007BFF',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    verificationBadge: {
        background: '#28A745',
        color: '#FFFFFF',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500'
    },
    profileInfo: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
    },
    infoField: {
        padding: '12px 16px',
        backgroundColor: '#F8F9FA',
        border: '1px solid #E9ECEF',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    infoLabel: {
        fontSize: '12px',
        color: '#6C757D',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    infoValue: {
        fontSize: '14px',
        color: '#2C3E50',
        fontWeight: '500'
    },
    profileCompletion: {
        gridColumn: '1 / -1',
        padding: '16px',
        background: 'linear-gradient(90deg, #F8F9FA, #E9ECEF)',
        borderRadius: '8px',
        border: '1px solid #E9ECEF'
    },
    progressBar: {
        width: '100%',
        height: '8px',
        backgroundColor: '#E9ECEF',
        borderRadius: '4px',
        overflow: 'hidden',
        marginTop: '8px'
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#28A745',
        borderRadius: '4px',
        transition: 'width 0.3s ease'
    },
    statsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginTop: '16px'
    },
    statCard: {
        padding: '16px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E9ECEF',
        borderRadius: '8px',
        textAlign: 'center',
        transition: 'all 0.3s ease'
    },
    statValue: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: '4px'
    },
    statLabel: {
        fontSize: '12px',
        color: '#6C757D',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    section: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E9ECEF',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    sectionTitle: {
        margin: 0,
        color: '#2C3E50',
        fontSize: '18px',
        fontWeight: '600',
        letterSpacing: '-0.02em'
    },
    sectionActions: {
        display: 'flex',
        gap: '8px'
    },
    filterBtn: {
        background: '#F8F9FA',
        border: '1px solid #DEE2E6',
        borderRadius: '6px',
        padding: '6px 12px',
        fontSize: '12px',
        color: '#6C757D',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
    },
    card: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E9ECEF',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    cardImage: {
        width: '100%',
        height: '160px',
        backgroundColor: '#F8F9FA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        borderBottom: '1px solid #E9ECEF'
    },
    cardContent: {
        padding: '16px'
    },
    cardTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: '8px'
    },
    cardDescription: {
        fontSize: '14px',
        color: '#6C757D',
        marginBottom: '12px'
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cardPrice: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#007BFF'
    },
    cardActions: {
        display: 'flex',
        gap: '8px'
    },
    cardActionBtn: {
        background: 'transparent',
        border: 'none',
        color: '#6C757D',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '4px',
        transition: 'all 0.3s ease'
    },
    wishlistBtn: {
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: 'rgba(255,255,255,0.9)',
        border: 'none',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
    },
    conditionBadge: {
        position: 'absolute',
        top: '12px',
        left: '12px',
        background: '#28A745',
        color: '#FFFFFF',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '10px',
        fontWeight: '500'
    },
    emptyState: {
        textAlign: 'center',
        padding: '48px 24px',
        color: '#6C757D'
    },
    emptyStateIcon: {
        fontSize: '48px',
        marginBottom: '16px'
    },
    emptyStateTitle: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#2C3E50'
    },
    emptyStateDescription: {
        fontSize: '14px',
        marginBottom: '24px'
    },
    emptyStateAction: {
        background: '#007BFF',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 24px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    }
};

export default function Dashboard() {
    const { user, isLoaded } = useUser();
    const [searchFocused, setSearchFocused] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [notifications, setNotifications] = useState(3);

    // Backend integration states
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [myListings, setMyListings] = useState([]);
    const [myPurchases, setMyPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Profile editing states
    const [editProfile, setEditProfile] = useState(false);
    const [editFields, setEditFields] = useState({});
    const [saving, setSaving] = useState(false);
    const [editingAvatar, setEditingAvatar] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoaded || !user) return;
        setLoading(true);
        getUserDashboard(user.id)
            .then((data) => {
                setProfile(data.profile);
                setStats(data.stats);
                setMyListings(data.myListings);
                setMyPurchases(data.myPurchases);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || 'Failed to load dashboard');
                setLoading(false);
            });
    }, [user, isLoaded]);

    const handleCardHover = (e, isEntering) => {
        if (isEntering) {
            e.target.style.transform = 'translateY(-4px)';
            e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
        } else {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
        }
    };

    const toggleWishlist = (id) => {
        // Wishlist functionality would be implemented here
        console.log('Toggle wishlist for item:', id);
    };

    // Helper to calculate profile completion
    const getProfileCompletion = () => {
        if (!profile) return 0;
        const fields = [profile.name, profile.email, profile.phone, profile.address, profile.avatar];
        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
    };
    const completion = getProfileCompletion();
    const isProfileComplete = completion === 100;

    // Handle edit field changes
    const handleEditChange = (e) => {
        setEditFields({ ...editFields, [e.target.name]: e.target.value });
    };
    // Start editing, prefill with current profile
    const startEditProfile = () => {
        setEditFields({
            name: profile?.name || '',
            email: profile?.email || '',
            phone: profile?.phone || '',
            address: profile?.address || '',
            avatar: profile?.avatar || '',
            clerkId: user.id
        });
        setEditProfile(true);
    };
    // Only allow avatar edit via avatar button
    const handleAvatarEdit = () => {
        setEditFields({ ...editFields, avatar: profile?.avatar || '' });
        setEditProfile(true);
        setEditingAvatar(true);
    };
    // Save profile changes
    const saveProfile = async () => {
        setSaving(true);
        try {
            await updateUserProfile(editFields);
            setProfile({ ...profile, ...editFields });
            setEditProfile(false);
        } catch (err) {
            alert('Failed to save profile: ' + (err?.response?.data?.error || err.message));
        }
        setSaving(false);
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>;
    }
    if (error) {
        return <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>{error}</div>;
    }

    return (
        <div style={styles.container}>
            {/* Enhanced Header */}

            {/* Enhanced Profile Section */}
            <div style={styles.profileSection}>
                <div style={styles.avatarContainer}>
                    <div style={styles.avatar}>
                        {editProfile ? (
                            <>
                                {editFields.avatar ? (
                                    <img src={editFields.avatar} alt="avatar preview" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                                ) : (
                                    '👤'
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ marginTop: 8 }}
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setEditFields({ ...editFields, avatar: reader.result });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </>
                        ) : profile?.avatar ? (
                            <img src={profile.avatar} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                        ) : (
                            '👤'
                        )}
                    </div>
                    <div style={styles.verificationBadge}>✓ Verified</div>
                </div>

                <div style={styles.profileInfo}>
                    {/* Always show Edit Profile button when not editing */}
                    {!editProfile && (
                        <button
                            style={{ ...styles.actionBtn, alignSelf: 'flex-end', marginBottom: 8, background: '#007BFF', color: '#fff' }}
                            onClick={startEditProfile}
                        >
                            Edit Profile
                        </button>
                    )}
                    <div style={styles.infoGrid}>
                        <div style={styles.infoField}>
                            <span style={styles.infoLabel}>Full Name</span>
                            {editProfile ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={editFields.name}
                                    onChange={handleEditChange}
                                    style={{ padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
                                />
                            ) : (
                                <span style={styles.infoValue}>{profile?.name}</span>
                            )}
                        </div>
                        <div style={styles.infoField}>
                            <span style={styles.infoLabel}>Email</span>
                            {editProfile ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={editFields.email}
                                    onChange={handleEditChange}
                                    style={{ padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
                                />
                            ) : (
                                <span style={styles.infoValue}>{profile?.email}</span>
                            )}
                        </div>
                        <div style={styles.infoField}>
                            <span style={styles.infoLabel}>Phone</span>
                            {editProfile ? (
                                <input
                                    type="text"
                                    name="phone"
                                    value={editFields.phone}
                                    onChange={handleEditChange}
                                    style={{ padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
                                />
                            ) : (
                                <span style={styles.infoValue}>{profile?.phone || '-'}</span>
                            )}
                        </div>
                        <div style={styles.infoField}>
                            <span style={styles.infoLabel}>Address</span>
                            {editProfile ? (
                                <input
                                    type="text"
                                    name="address"
                                    value={editFields.address}
                                    onChange={handleEditChange}
                                    style={{ padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
                                />
                            ) : (
                                <span style={styles.infoValue}>{profile?.address || '-'}</span>
                            )}
                        </div>
                        <div style={styles.infoField}>
                            <span style={styles.infoLabel}>Account Type</span>
                            <span style={styles.infoValue}>{profile?.isAdmin ? 'Admin' : 'Member'}</span>
                        </div>
                        {/* Show profile completion bar and button only if profile is NOT complete */}
                        {!isProfileComplete && (
                            <div style={styles.profileCompletion}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#2C3E50' }}>
                                        Profile Completion
                                    </span>
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: completion === 100 ? '#28A745' : '#FFC107' }}>
                                        {completion}%
                                    </span>
                                </div>
                                <div style={styles.progressBar}>
                                    <div
                                        style={{
                                            ...styles.progressFill,
                                            width: `${completion}%`,
                                            backgroundColor: completion === 100 ? '#28A745' : '#FFC107'
                                        }}
                                    />
                                </div>
                                {!editProfile && (
                                    <button style={{ ...styles.actionBtn, marginTop: 12, background: '#FFC107', color: '#2C3E50' }} onClick={startEditProfile}>
                                        Complete Your Profile
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    {/* Always show Save button in edit mode */}
                    {editProfile && (
                        <button style={{ ...styles.actionBtn, alignSelf: 'flex-end', marginTop: 16, background: '#28A745', color: '#fff' }} onClick={saveProfile} disabled={saving}>
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    )}
                </div>
            </div>

            {/* Enhanced My Listings Section */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>My Listings</h3>
                    <div style={styles.sectionActions}>
                        <button style={styles.filterBtn}>All Items</button>
                        <button style={styles.filterBtn}>Active</button>
                        <button style={styles.filterBtn}>Sold</button>
                        <button style={{ ...styles.filterBtn, background: '#007BFF', color: '#FFFFFF' }} onClick={() => navigate('/add-item')}>
                            + Add New
                        </button>
                    </div>
                </div>

                <div style={styles.grid}>
                    {myListings.length === 0 ? (
                        <div style={styles.emptyState}>
                            <div style={styles.emptyStateIcon}>📦</div>
                            <div style={styles.emptyStateTitle}>No Listings Yet</div>
                            <div style={styles.emptyStateDescription}>
                                You have not listed any items yet. Add your first item to get started!
                            </div>
                            <button style={styles.emptyStateAction} onClick={() => window.location.href = '/add-item'}>+ Add Item</button>
                        </div>
                    ) : (
                        myListings.map((item) => (
                            <div
                                key={item._id}
                                style={styles.card}
                                onMouseEnter={(e) => handleCardHover(e, true)}
                                onMouseLeave={(e) => handleCardHover(e, false)}
                            >
                                <div style={styles.conditionBadge}>{item.condition || 'N/A'}</div>
                                <button
                                    style={styles.wishlistBtn}
                                    onClick={() => toggleWishlist(item._id)}
                                >
                                    {'🤍'}
                                </button>
                                <div style={styles.cardImage}>{item.image ? <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👕'}</div>
                                <div style={styles.cardContent}>
                                    <div style={styles.cardTitle}>{item.title}</div>
                                    <div style={styles.cardDescription}>{item.description}</div>
                                    <div style={styles.cardFooter}>
                                        <div style={styles.cardPrice}>{item.price ? `${item.price} pts` : ''}</div>
                                        <div style={styles.cardActions}>
                                            <button style={styles.cardActionBtn}>👁️</button>
                                            <button style={styles.cardActionBtn}>✏️</button>
                                            <button style={styles.cardActionBtn}>📤</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Enhanced My Purchases Section */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>My Purchases</h3>
                    <div style={styles.sectionActions}>
                        <button style={styles.filterBtn}>Recent</button>
                        <button style={styles.filterBtn}>All Time</button>
                        <button style={styles.filterBtn}>Favorites</button>
                    </div>
                </div>

                <div style={styles.grid}>
                    {myPurchases.length === 0 ? (
                        <div style={styles.emptyState}>
                            <div style={styles.emptyStateIcon}>🛍️</div>
                            <div style={styles.emptyStateTitle}>No Purchases Yet</div>
                            <div style={styles.emptyStateDescription}>
                                You have not purchased any items yet. Browse the marketplace to find something you like!
                            </div>
                            <button style={styles.emptyStateAction}>Browse Marketplace</button>
                        </div>
                    ) : (
                        myPurchases.map((item) => (
                            <div
                                key={item._id}
                                style={styles.card}
                                onMouseEnter={(e) => handleCardHover(e, true)}
                                onMouseLeave={(e) => handleCardHover(e, false)}
                            >
                                <div style={styles.cardImage}>{item.image ? <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👚'}</div>
                                <div style={styles.cardContent}>
                                    <div style={styles.cardTitle}>{item.title}</div>
                                    <div style={styles.cardDescription}>{item.description}</div>
                                    <div style={styles.cardFooter}>
                                        <div style={styles.cardPrice}>{item.price ? `${item.price} pts` : ''}</div>
                                        <div style={styles.cardActions}>
                                            <button style={styles.cardActionBtn}>⭐</button>
                                            <button style={styles.cardActionBtn}>💬</button>
                                            <button style={styles.cardActionBtn}>🔄</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
