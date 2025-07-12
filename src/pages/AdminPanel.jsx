import React, { useState, useEffect } from "react";
import styles from "../styles/AdminPanel.module.css";
import api from "../api";

export default function AdminPanel() {
    const [activeMainTab, setActiveMainTab] = useState('users');
    const [activeSubTab, setActiveSubTab] = useState('pending');
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Real backend data
    const [data, setData] = useState({
        users: { pending: [], approved: [], rejected: [] },
        listings: { pending: [], approved: [], rejected: [] },
        orders: { pending: [], approved: [], rejected: [] },
    });

    // Helper to normalize backend _id to id for all entities
    function normalizeId(obj) {
        if (!obj) return obj;
        if (Array.isArray(obj)) return obj.map(normalizeId);
        const copy = { ...obj };
        if (copy._id) copy.id = copy._id;
        // For listings, uploader may be an object
        if (copy.uploader && typeof copy.uploader === 'object') {
            copy.uploaderName = copy.uploader.name || '';
            copy.uploader = copy.uploader.email || copy.uploader._id || '';
        }
        // For orders/swaps, buyer/seller fields
        if (copy.from && typeof copy.from === 'object') {
            copy.seller = copy.from.name || '';
        }
        if (copy.to && typeof copy.to === 'object') {
            copy.buyer = copy.to.name || '';
        }
        if (copy.item && typeof copy.item === 'object') {
            copy.item = copy.item.title || '';
            copy.amount = copy.item.price || '';
        }
        // Fallbacks for missing fields
        if (!copy.status && copy.isApproved !== undefined) {
            copy.status = copy.isRemoved || copy.isSpam ? 'rejected' : (copy.isApproved ? 'approved' : 'pending');
        }
        return copy;
    }

    // Fetch admin dashboard data from backend
    const fetchAdminData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/dashboard/admin');
            // Split users/listings/orders by status
            const users = { pending: [], approved: [], rejected: [] };
            res.data.users.map(normalizeId).forEach(u => {
                if (u.status === 'pending') users.pending.push(u);
                else if (u.status === 'rejected') users.rejected.push(u);
                else users.approved.push(u);
            });
            const listings = { pending: [], approved: [], rejected: [] };
            res.data.listings.map(normalizeId).forEach(l => {
                if (l.status === 'rejected') listings.rejected.push(l);
                else if (l.status === 'approved') listings.approved.push(l);
                else listings.pending.push(l);
            });
            const orders = { pending: [], approved: [], rejected: [] };
            res.data.swaps.map(normalizeId).forEach(o => {
                if (o.status === 'pending') orders.pending.push(o);
                else if (o.status === 'rejected') orders.rejected.push(o);
                else orders.approved.push(o);
            });
            setData({ users, listings, orders });
        } catch (err) {
            setError('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    // Approve/reject handlers for users, listings, orders
    const handleApprove = async (itemId) => {
        setLoading(true);
        setError(null);
        try {
            if (activeMainTab === 'users') {
                await api.patch(`/users/${itemId}/approve`);
            } else if (activeMainTab === 'listings') {
                await api.patch(`/items/${itemId}/approve`);
            } else if (activeMainTab === 'orders') {
                await api.patch(`/swaps/${itemId}/complete`);
            }
            await fetchAdminData();
            setSelectedItems(prev => prev.filter(id => id !== itemId));
        } catch (err) {
            setError('Failed to approve');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (itemId, reason = '') => {
        setLoading(true);
        setError(null);
        try {
            if (activeMainTab === 'users') {
                // Some backends may not have a /users/:id/reject endpoint. If not, implement in backend.
                await api.patch(`/users/${itemId}/reject`, { reason });
            } else if (activeMainTab === 'listings') {
                await api.patch(`/items/${itemId}/reject`, { reason });
            } else if (activeMainTab === 'orders') {
                await api.patch(`/swaps/${itemId}/reject`, { reason });
            }
            await fetchAdminData();
            setSelectedItems(prev => prev.filter(id => id !== itemId));
        } catch (err) {
            // Show backend error if available
            setError(err?.response?.data?.error || 'Failed to reject');
        } finally {
            setLoading(false);
        }
    };

    const handleBulkAction = async (action) => {
        if (selectedItems.length === 0) return;
        setLoading(true);
        setError(null);
        try {
            for (const itemId of selectedItems) {
                if (action === 'approve') {
                    await handleApprove(itemId);
                } else if (action === 'reject') {
                    await handleReject(itemId, 'Bulk rejection');
                }
            }
            setSelectedItems([]);
        } catch (err) {
            setError(err?.response?.data?.error || 'Bulk action failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectItem = (itemId) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handleSelectAll = () => {
        const currentItems = getFilteredItems();
        if (selectedItems.length === currentItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(currentItems.map(item => item.id));
        }
    };

    const getFilteredItems = () => {
        const currentData = data[activeMainTab];
        let currentItems = currentData[activeSubTab] || [];

        if (searchTerm) {
            currentItems = currentItems.filter(item => {
                const searchFields = activeMainTab === 'users'
                    ? [item.name, item.email]
                    : activeMainTab === 'listings'
                        ? [item.title, item.uploader, item.description]
                        : [item.orderNumber, item.buyer, item.seller, item.item];

                return searchFields.some(field =>
                    field?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
        }

        if (filterCategory !== 'all' && activeMainTab === 'listings') {
            currentItems = currentItems.filter(item => item.category === filterCategory);
        }

        return currentItems;
    };

    const openItemModal = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    // User Card Component
    const UserCard = ({ user }) => (
        <div className={styles.itemCard}>
            <div className={styles.itemHeader}>
                <div className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        checked={selectedItems.includes(user.id)}
                        onChange={() => handleSelectItem(user.id)}
                        className={styles.checkbox}
                    />
                </div>

                <div className={styles.userSection}>
                    <div className={styles.userAvatar}>
                        <img src={user.avatar} alt={`${user.name} avatar`} />
                    </div>
                    <div className={styles.userInfo}>
                        <h4 className={styles.userName}>{user.name}</h4>
                        <p className={styles.userEmail}>{user.email}</p>
                        <span className={styles.joinDate}>Joined: {user.joinDate}</span>
                    </div>
                </div>

                <div className={styles.userDetails}>
                    <div className={styles.itemTitleRow}>
                        <h3 className={styles.itemTitle}>{user.name}</h3>
                        <div className={styles.statusBadge}>
                            <span className={`${styles.status} ${styles[user.status]}`}>
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </span>
                        </div>
                    </div>
                    <div className={styles.itemMeta}>
                        <span className={styles.metaItem}>
                            <strong>Location:</strong> {user.location}
                        </span>
                        <span className={styles.metaItem}>
                            <strong>Items Listed:</strong> {user.itemsListed}
                        </span>
                        <span className={styles.metaItem}>
                            <strong>Verification:</strong> {user.verificationStatus}
                        </span>
                        <span className={styles.metaItem}>
                            <strong>Join Date:</strong> {user.joinDate}
                        </span>
                    </div>
                    {user.rejectionReason && (
                        <div className={styles.rejectionReason}>
                            <strong>Rejection Reason:</strong> {user.rejectionReason}
                        </div>
                    )}
                </div>
            </div>

            {activeSubTab === 'pending' && (
                <div className={styles.itemActions}>
                    <button
                        className={styles.approveBtn}
                        onClick={() => handleApprove(user.id)}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                        Approve User
                    </button>
                    <button
                        className={styles.rejectBtn}
                        onClick={() => {
                            const reason = prompt('Reason for rejection (optional):');
                            handleReject(user.id, reason || 'No reason provided');
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Reject User
                    </button>
                    <button
                        className={styles.viewBtn}
                        onClick={() => openItemModal(user)}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        View Details
                    </button>
                </div>
            )}
        </div>
    );

    // Listing Card Component (existing ItemCard)
    const ListingCard = ({ item }) => (
        <div className={styles.itemCard}>
            <div className={styles.itemHeader}>
                <div className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className={styles.checkbox}
                    />
                </div>

                <div className={styles.userSection}>
                    <div className={styles.userInfo}>
                        <h4 className={styles.userName}>{item.uploaderName}</h4>
                        <p className={styles.userEmail}>{item.uploader}</p>
                        <span className={styles.joinDate}>Listed: {item.uploadDate}</span>
                    </div>
                </div>

                <div className={styles.itemImage} onClick={() => openItemModal(item)}>
                    <img src={item.images[0]} alt={item.title} />
                    <div className={styles.imageOverlay}>
                        <svg className={styles.viewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <span>View Details</span>
                    </div>
                </div>

                <div className={styles.itemInfo}>
                    <div className={styles.itemTitleRow}>
                        <h3 className={styles.itemTitle}>{item.title}</h3>
                        <div className={styles.statusBadge}>
                            <span className={`${styles.status} ${styles[item.status]}`}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                        </div>
                    </div>
                    <p className={styles.itemDescription}>{item.description}</p>
                    <div className={styles.itemMeta}>
                        <span className={styles.metaItem}>
                            <strong>Category:</strong> {item.category}
                        </span>
                        <span className={styles.metaItem}>
                            <strong>Size:</strong> {item.size}
                        </span>
                        <span className={styles.metaItem}>
                            <strong>Condition:</strong> {item.condition}
                        </span>
                        <span className={styles.metaItem}>
                            <strong>Price:</strong> {item.price}
                        </span>
                    </div>
                    <div className={styles.itemTags}>
                        {item.tags?.map((tag, index) => (
                            <span key={index} className={styles.tag}>#{tag}</span>
                        ))}
                    </div>
                </div>
            </div>

            {activeSubTab === 'pending' && (
                <div className={styles.itemActions}>
                    <button
                        className={styles.approveBtn}
                        onClick={() => handleApprove(item.id)}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                        Approve Listing
                    </button>
                    <button
                        className={styles.rejectBtn}
                        onClick={() => {
                            const reason = prompt('Reason for rejection (optional):');
                            handleReject(item.id, reason || 'No reason provided');
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Reject Listing
                    </button>
                    <button
                        className={styles.viewBtn}
                        onClick={() => openItemModal(item)}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        View Details
                    </button>
                </div>
            )}
        </div>
    );

    // Order Card Component
    const OrderCard = ({ order }) => (
        <div className={styles.itemCard}>
            <div className={styles.itemHeader}>
                <div className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        checked={selectedItems.includes(order.id)}
                        onChange={() => handleSelectItem(order.id)}
                        className={styles.checkbox}
                    />
                </div>

                <div className={styles.userSection}>
                    <div className={styles.userInfo}>
                        <h4 className={styles.userName}>{order.orderNumber}</h4>
                        <p className={styles.userEmail}>Buyer: {order.buyer}</p>
                        <span className={styles.joinDate}>Ordered: {order.orderDate}</span>
                    </div>
                </div>

                <div className={styles.orderDetails}>
                    <div className={styles.itemTitleRow}>
                        <h3 className={styles.itemTitle}>{order.item}</h3>
                        <div className={styles.statusBadge}>
                            <span className={`${styles.status} ${styles[order.status]}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                        </div>
                    </div>
                    <div className={styles.itemMeta}>
                        <span className={styles.metaItem}>
                            <strong>Seller:</strong> {order.seller}
                        </span>
                        <span className={styles.metaItem}>
                            <strong>Amount:</strong> {order.amount}
                        </span>
                        <span className={styles.metaItem}>
                            <strong>Payment:</strong> {order.paymentStatus}
                        </span>
                        <span className={styles.metaItem}>
                            <strong>Shipping:</strong> {order.shippingStatus}
                        </span>
                    </div>
                    {order.rejectionReason && (
                        <div className={styles.rejectionReason}>
                            <strong>Rejection Reason:</strong> {order.rejectionReason}
                        </div>
                    )}
                </div>
            </div>

            {activeSubTab === 'pending' && (
                <div className={styles.itemActions}>
                    <button
                        className={styles.approveBtn}
                        onClick={() => handleApprove(order.id)}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                        Approve Order
                    </button>
                    <button
                        className={styles.rejectBtn}
                        onClick={() => {
                            const reason = prompt('Reason for rejection (optional):');
                            handleReject(order.id, reason || 'No reason provided');
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Reject Order
                    </button>
                    <button
                        className={styles.viewBtn}
                        onClick={() => openItemModal(order)}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        View Details
                    </button>
                </div>
            )}
        </div>
    );

    const renderCurrentItems = () => {
        const currentItems = getFilteredItems();

        if (currentItems.length === 0) {
            return (
                <div className={styles.emptyState}>
                    <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                    <h3>No {activeMainTab} found</h3>
                    <p>No {activeMainTab} match your current filters or search criteria.</p>
                </div>
            );
        }

        return currentItems.map(item => {
            switch (activeMainTab) {
                case 'users':
                    return <UserCard key={item.id} user={item} />;
                case 'listings':
                    return <ListingCard key={item.id} item={item} />;
                case 'orders':
                    return <OrderCard key={item.id} order={item} />;
                default:
                    return null;
            }
        });
    };

    const getCurrentStats = () => {
        const currentData = data[activeMainTab];
        return {
            pending: currentData.pending.length,
            approved: currentData.approved.length,
            rejected: currentData.rejected.length,
            total: currentData.pending.length + currentData.approved.length + currentData.rejected.length
        };
    };

    const stats = getCurrentStats();

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.logo}>
                        <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                        ReWear Admin
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <div className={styles.searchContainer}>
                        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="M21 21l-4.35-4.35"></path>
                        </svg>
                        <input
                            type="search"
                            placeholder={`Search ${activeMainTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.headerSearch}
                        />
                    </div>
                    <div className={styles.adminInfo}>
                        <div className={styles.notificationBell}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            <span className={styles.notificationBadge}>3</span>
                        </div>
                        <div className={styles.adminProfile}>
                            <img src="https://via.placeholder.com/40x40/4285F4/FFFFFF?text=AD" alt="Admin avatar" className={styles.adminAvatar} />
                            <span className={styles.adminName}>Admin User</span>
                            <svg className={styles.dropdownIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="6,9 12,15 18,9"></polyline>
                            </svg>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Admin Management Panel</h1>
                    <p className={styles.pageSubtitle}>Manage users, listings, and orders for your ReWear platform</p>
                </div>

                {/* Main Navigation Tabs */}
                <div className={styles.mainTabs}>
                    <button
                        className={`${styles.mainTab} ${activeMainTab === 'users' ? styles.activeMainTab : ''}`}
                        onClick={() => {
                            setActiveMainTab('users');
                            setActiveSubTab('pending');
                            setSelectedItems([]);
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        Manage Users
                    </button>
                    <button
                        className={`${styles.mainTab} ${activeMainTab === 'listings' ? styles.activeMainTab : ''}`}
                        onClick={() => {
                            setActiveMainTab('listings');
                            setActiveSubTab('pending');
                            setSelectedItems([]);
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14,2 14,8 20,8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                        </svg>
                        Manage Listings
                    </button>
                    <button
                        className={`${styles.mainTab} ${activeMainTab === 'orders' ? styles.activeMainTab : ''}`}
                        onClick={() => {
                            setActiveMainTab('orders');
                            setActiveSubTab('pending');
                            setSelectedItems([]);
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        Manage Orders
                    </button>
                </div>

                {/* Statistics Cards */}
                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: '#FBBC04' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12,6 12,12 16,14"></polyline>
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <h3>Pending {activeMainTab}</h3>
                            <span className={styles.statNumber}>{stats.pending}</span>
                            <span className={styles.statChange}>Awaiting review</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: '#34A853' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="20,6 9,17 4,12"></polyline>
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <h3>Approved {activeMainTab}</h3>
                            <span className={styles.statNumber}>{stats.approved}</span>
                            <span className={styles.statChange}>Active on platform</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: '#EA4335' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <h3>Rejected {activeMainTab}</h3>
                            <span className={styles.statNumber}>{stats.rejected}</span>
                            <span className={styles.statChange}>Declined items</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: '#4285F4' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="18" y1="20" x2="18" y2="10"></line>
                                <line x1="12" y1="20" x2="12" y2="4"></line>
                                <line x1="6" y1="20" x2="6" y2="14"></line>
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <h3>Total {activeMainTab}</h3>
                            <span className={styles.statNumber}>{stats.total}</span>
                            <span className={styles.statChange}>All time total</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className={styles.controlsSection}>
                    <div className={styles.searchAndFilter}>
                        {activeMainTab === 'listings' && (
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="all">All Categories</option>
                                <option value="Jacket">Jacket</option>
                                <option value="Shirt">Shirt</option>
                                <option value="Dress">Dress</option>
                                <option value="Pants">Pants</option>
                                <option value="Shoes">Shoes</option>
                                <option value="Other">Other</option>
                            </select>
                        )}
                    </div>

                    {selectedItems.length > 0 && activeSubTab === 'pending' && (
                        <div className={styles.bulkActions}>
                            <span className={styles.selectedCount}>
                                {selectedItems.length} item(s) selected
                            </span>
                            <button
                                className={styles.bulkApproveBtn}
                                onClick={() => handleBulkAction('approve')}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <polyline points="20,6 9,17 4,12"></polyline>
                                </svg>
                                Bulk Approve
                            </button>
                            <button
                                className={styles.bulkRejectBtn}
                                onClick={() => handleBulkAction('reject')}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                                Bulk Reject
                            </button>
                        </div>
                    )}
                </div>

                {/* Sub Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeSubTab === 'pending' ? styles.activeTab : ''}`}
                        onClick={() => {
                            setActiveSubTab('pending');
                            setSelectedItems([]);
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12,6 12,12 16,14"></polyline>
                        </svg>
                        Pending ({stats.pending})
                    </button>
                    <button
                        className={`${styles.tab} ${activeSubTab === 'approved' ? styles.activeTab : ''}`}
                        onClick={() => {
                            setActiveSubTab('approved');
                            setSelectedItems([]);
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                        Approved ({stats.approved})
                    </button>
                    <button
                        className={`${styles.tab} ${activeSubTab === 'rejected' ? styles.activeTab : ''}`}
                        onClick={() => {
                            setActiveSubTab('rejected');
                            setSelectedItems([]);
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Rejected ({stats.rejected})
                    </button>
                </div>

                {/* Items List */}
                <div className={styles.itemsSection}>
                    {getFilteredItems().length > 0 && activeSubTab === 'pending' && (
                        <div className={styles.selectAllSection}>
                            <label className={styles.selectAllLabel}>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.length === getFilteredItems().length}
                                    onChange={handleSelectAll}
                                    className={styles.checkbox}
                                />
                                Select All {activeMainTab}
                            </label>
                        </div>
                    )}

                    <div className={styles.itemsList}>
                        {renderCurrentItems()}
                    </div>
                </div>
            </main>
        </div>
    );
}