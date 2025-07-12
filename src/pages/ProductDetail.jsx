import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/ProductDetail.module.css';

export default function ProductDetail() {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [selectedSize, setSelectedSize] = useState('M');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showReviews, setShowReviews] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [chatOpen, setChatOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const imageRef = useRef(null);

    // Sample product data with enhanced structure
    const productData = {
        title: "Vintage Denim Jacket",
        brand: "Levi's",
        condition: "Excellent",
        size: "M",
        originalPrice: "$89",
        swapPoints: 180,
        availability: "Available",
        seller: {
            name: "Sarah Johnson",
            rating: 4.8,
            verified: true,
            swaps: 47
        },
        images: ["🧥", "👕", "🎽", "🧥"],
        description: "Classic vintage Levi's denim jacket in excellent condition. Perfect for layering and adding a timeless touch to any outfit. Features original brass buttons and authentic distressing.",
        details: {
            material: "100% Cotton Denim",
            care: "Machine wash cold, hang dry",
            measurements: "Chest: 42\", Length: 24\"",
            sustainability: "Saves 2.5kg CO2 vs buying new"
        },
        reviews: [
            { user: "Mike Chen", rating: 5, comment: "Perfect condition, exactly as described!" },
            { user: "Emma Davis", rating: 4, comment: "Great quality, fast swap process." }
        ]
    };

    const previousListingsData = [
        { id: 1, image: "👖", title: "Blue Jeans", price: "120 pts" },
        { id: 2, image: "👗", title: "Summer Dress", price: "150 pts" },
        { id: 3, image: "👟", title: "Sneakers", price: "200 pts" },
        { id: 4, image: "🧣", title: "Wool Scarf", price: "80 pts" }
    ];

    const handleImageZoom = (e) => {
        if (!isZoomed || !imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        imageRef.current.style.transformOrigin = `${x}% ${y}%`;
    };

    const handleSwapProposal = async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert('Swap proposal sent successfully!');
        }, 1000);
    };

    return (
        <div className={styles.container}>
            {/* Enhanced Header with better accessibility */}
            <header className={styles.header} role="banner">
                <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                    <button className={styles.breadcrumbLink}>Home</button>
                    <span className={styles.separator} aria-hidden="true">›</span>
                    <button className={styles.breadcrumbLink}>Clothing</button>
                    <span className={styles.separator} aria-hidden="true">›</span>
                    <button className={styles.breadcrumbLink}>Jackets</button>
                    <span className={styles.separator} aria-hidden="true">›</span>
                    <span className={styles.currentPage} aria-current="page">Vintage Denim Jacket</span>
                </nav>
                <div className={styles.headerActions}>
                    <button 
                        className={styles.shareBtn}
                        aria-label="Share this product"
                    >
                        📤 Share
                    </button>
                    <button 
                        className={`${styles.wishlistBtn} ${isWishlisted ? styles.active : ''}`}
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        {isWishlisted ? '❤️' : '🤍'} Wishlist
                    </button>
                </div>
            </header>

            {/* Enhanced Main Content */}
            <main className={styles.main}>
                {/* Enhanced Images Section */}
                <section className={styles.images} aria-label="Product images">
                    <div className={styles.imageGallery}>
                        <div className={styles.mainImageContainer}>
                            <div 
                                ref={imageRef}
                                className={`${styles.mainImage} ${isZoomed ? styles.zoomed : ''}`}
                                onMouseMove={handleImageZoom}
                                onMouseEnter={() => setIsZoomed(true)}
                                onMouseLeave={() => setIsZoomed(false)}
                                role="img"
                                aria-label={`${productData.title} - Main image`}
                            >
                                <span className={styles.productImage}>
                                    {productData.images[selectedImage]}
                                </span>
                                <div className={styles.conditionBadge} aria-label={`Condition: ${productData.condition}`}>
                                    {productData.condition}
                                </div>
                                <div className={styles.sustainabilityBadge} aria-label="Eco-friendly product">
                                    🌱 Eco-Friendly
                                </div>
                            </div>
                            <div className={styles.imageActions}>
                                <button 
                                    className={styles.fullscreenBtn}
                                    aria-label="View image in full screen"
                                >
                                    🔍 View Full Size
                                </button>
                                <button 
                                    className={styles.arBtn}
                                    aria-label="Try on with augmented reality"
                                >
                                    📱 AR Try-On
                                </button>
                            </div>
                        </div>
                        <div className={styles.thumbnails} role="tablist" aria-label="Product image thumbnails">
                            {productData.images.map((image, index) => (
                                <button
                                    key={index}
                                    className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
                                    onClick={() => setSelectedImage(index)}
                                    role="tab"
                                    aria-selected={selectedImage === index}
                                    aria-label={`View image ${index + 1}`}
                                >
                                    {image}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Enhanced Description Section */}
                <section className={styles.description} aria-label="Product details">
                    <div className={styles.productHeader}>
                        <div className={styles.brandBadge}>{productData.brand}</div>
                        <h1 className={styles.productTitle}>{productData.title}</h1>
                        <div className={styles.ratingSection}>
                            <div className={styles.stars} aria-label="5 out of 5 stars">⭐⭐⭐⭐⭐</div>
                            <button className={styles.reviewCount} onClick={() => setShowReviews(true)}>
                                (24 reviews)
                            </button>
                        </div>
                    </div>

                    <div className={styles.priceSection}>
                        <div className={styles.swapPoints}>
                            <span className={styles.pointsValue}>{productData.swapPoints}</span>
                            <span className={styles.pointsLabel}>Swap Points</span>
                        </div>
                        <div className={styles.originalPrice}>
                            <span className={styles.originalLabel}>Original Price:</span>
                            <span className={styles.originalValue}>{productData.originalPrice}</span>
                        </div>
                        <div className={styles.savings}>
                            <span className={styles.savingsText}>💰 Save $45 vs buying new!</span>
                        </div>
                    </div>

                    <div className={styles.availabilitySection}>
                        <div className={styles.statusIndicator}>
                            <span className={styles.statusDot} aria-hidden="true"></span>
                            <span className={styles.statusText}>{productData.availability}</span>
                        </div>
                        <div className={styles.urgency}>⚡ 3 people are interested</div>
                    </div>

                    <div className={styles.sellerInfo}>
                        <div className={styles.sellerCard}>
                            <div className={styles.sellerAvatar} aria-hidden="true">👤</div>
                            <div className={styles.sellerDetails}>
                                <div className={styles.sellerName}>
                                    {productData.seller.name}
                                    {productData.seller.verified && (
                                        <span className={styles.verifiedBadge} aria-label="Verified seller">✓</span>
                                    )}
                                </div>
                                <div className={styles.sellerStats}>
                                    <span>⭐ {productData.seller.rating}</span>
                                    <span>🔄 {productData.seller.swaps} swaps</span>
                                </div>
                            </div>
                            <button 
                                className={styles.chatBtn}
                                onClick={() => setChatOpen(true)}
                                aria-label={`Chat with ${productData.seller.name}`}
                            >
                                💬 Chat
                            </button>
                        </div>
                    </div>

                    <div className={styles.sizeSection}>
                        <h3 className={styles.sectionTitle}>Size & Fit</h3>
                        <div className={styles.sizeSelector} role="radiogroup" aria-label="Select size">
                            {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                                <button
                                    key={size}
                                    className={`${styles.sizeBtn} ${selectedSize === size ? styles.active : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                    role="radio"
                                    aria-checked={selectedSize === size}
                                    aria-label={`Size ${size}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        <button className={styles.sizingGuide}>📏 Size Guide</button>
                    </div>

                    <div className={styles.actionButtons}>
                        <button 
                            className={`${styles.swapBtn} ${isLoading ? styles.loading : ''}`}
                            onClick={handleSwapProposal}
                            disabled={isLoading}
                            aria-label="Propose a swap for this item"
                        >
                            {isLoading ? (
                                <>
                                    <span className={styles.spinner} aria-hidden="true"></span>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    🔄 Propose Swap
                                </>
                            )}
                        </button>
                        <button className={styles.buyBtn} aria-label="Buy with points">
                            ⭐ Buy with Points
                        </button>
                    </div>

                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon} aria-hidden="true">🚚</span>
                            <span>Free shipping on swaps</span>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon} aria-hidden="true">🔒</span>
                            <span>Secure swap guarantee</span>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon} aria-hidden="true">↩️</span>
                            <span>7-day return policy</span>
                        </div>
                    </div>

                    <div className={styles.tabSection}>
                        <div className={styles.tabs} role="tablist">
                            <button 
                                className={`${styles.tab} ${activeTab === 'description' ? styles.active : ''}`}
                                onClick={() => setActiveTab('description')}
                                role="tab"
                                aria-selected={activeTab === 'description'}
                                aria-controls="description-panel"
                            >
                                Description
                            </button>
                            <button 
                                className={`${styles.tab} ${activeTab === 'details' ? styles.active : ''}`}
                                onClick={() => setActiveTab('details')}
                                role="tab"
                                aria-selected={activeTab === 'details'}
                                aria-controls="details-panel"
                            >
                                Details
                            </button>
                            <button 
                                className={`${styles.tab} ${activeTab === 'sustainability' ? styles.active : ''}`}
                                onClick={() => setActiveTab('sustainability')}
                                role="tab"
                                aria-selected={activeTab === 'sustainability'}
                                aria-controls="sustainability-panel"
                            >
                                Sustainability
                            </button>
                        </div>
                        <div className={styles.tabContent}>
                            {activeTab === 'description' && (
                                <div className={styles.descriptionContent} id="description-panel" role="tabpanel">
                                    <p>{productData.description}</p>
                                </div>
                            )}
                            {activeTab === 'details' && (
                                <div className={styles.detailsContent} id="details-panel" role="tabpanel">
                                    <div className={styles.detailItem}>
                                        <strong>Material:</strong> {productData.details.material}
                                    </div>
                                    <div className={styles.detailItem}>
                                        <strong>Care:</strong> {productData.details.care}
                                    </div>
                                    <div className={styles.detailItem}>
                                        <strong>Measurements:</strong> {productData.details.measurements}
                                    </div>
                                </div>
                            )}
                            {activeTab === 'sustainability' && (
                                <div className={styles.sustainabilityContent} id="sustainability-panel" role="tabpanel">
                                    <div className={styles.impactMetric}>
                                        <span className={styles.impactIcon} aria-hidden="true">🌍</span>
                                        <span>{productData.details.sustainability}</span>
                                    </div>
                                    <div className={styles.impactMetric}>
                                        <span className={styles.impactIcon} aria-hidden="true">💧</span>
                                        <span>Saves 2,700L water vs new production</span>
                                    </div>
                                    <div className={styles.impactMetric}>
                                        <span className={styles.impactIcon} aria-hidden="true">♻️</span>
                                        <span>Extends garment lifecycle by 2+ years</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* Enhanced Bottom Row */}
            <section className={styles.bottomRow}>
                <div className={styles.previousListings}>
                    <h3 className={styles.sectionTitle}>Previous Listings</h3>
                    <div className={styles.listingsGrid}>
                        {previousListingsData.map(item => (
                            <article key={item.id} className={styles.listingCard}>
                                <div className={styles.listingImage} aria-hidden="true">{item.image}</div>
                                <div className={styles.listingInfo}>
                                    <h4 className={styles.listingTitle}>{item.title}</h4>
                                    <div className={styles.listingPrice}>{item.price}</div>
                                </div>
                                <button className={styles.quickSwapBtn} aria-label={`Quick swap for ${item.title}`}>
                                    Quick Swap
                                </button>
                            </article>
                        ))}
                    </div>
                </div>

                <aside className={styles.swapSection}>
                    <div className={styles.swapStatus}>
                        <div className={styles.availabilityIndicator}>
                            <span className={styles.statusDot} aria-hidden="true"></span>
                            <span>Available for Swap</span>
                        </div>
                        <div className={styles.swapCounter}>
                            <span className={styles.counterNumber}>12</span>
                            <span className={styles.counterLabel}>interested swappers</span>
                        </div>
                    </div>
                    
                    <button className={styles.swapBtn} aria-label="Available for swap - click to initiate">
                        <span className={styles.swapIcon} aria-hidden="true">🔄</span>
                        <span>Available/Swap</span>
                        <span className={styles.swapBadge} aria-label="Hot item">Hot</span>
                    </button>

                    <div className={styles.swapOptions}>
                        <button className={styles.instantSwapBtn}>⚡ Instant Swap</button>
                        <button className={styles.negotiateBtn}>💬 Negotiate</button>
                    </div>
                </aside>
            </section>

            {/* Reviews Section */}
            {showReviews && (
                <section className={styles.reviewsSection} aria-label="Customer reviews">
                    <div className={styles.reviewsHeader}>
                        <h3>Customer Reviews</h3>
                        <button 
                            className={styles.toggleReviews}
                            onClick={() => setShowReviews(false)}
                            aria-label="Hide reviews"
                        >
                            Hide Reviews
                        </button>
                    </div>
                    <div className={styles.reviewsList}>
                        {productData.reviews.map((review, index) => (
                            <article key={index} className={styles.reviewCard}>
                                <div className={styles.reviewHeader}>
                                    <span className={styles.reviewUser}>{review.user}</span>
                                    <div className={styles.reviewRating} aria-label={`${review.rating} out of 5 stars`}>
                                        {'⭐'.repeat(review.rating)}
                                    </div>
                                </div>
                                <p className={styles.reviewComment}>{review.comment}</p>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {/* Chat Modal */}
            {chatOpen && (
                <div 
                    className={styles.chatModal} 
                    role="dialog" 
                    aria-labelledby="chat-title"
                    aria-modal="true"
                >
                    <div className={styles.chatHeader}>
                        <h4 id="chat-title">Chat with {productData.seller.name}</h4>
                        <button 
                            className={styles.closeChatBtn}
                            onClick={() => setChatOpen(false)}
                            aria-label="Close chat"
                        >
                            ✕
                        </button>
                    </div>
                    <div className={styles.chatContent}>
                        <div className={styles.chatMessage}>
                            <strong>You:</strong> Hi! I'm interested in swapping for this jacket.
                        </div>
                        <div className={styles.chatMessage}>
                            <strong>{productData.seller.name}:</strong> Great! What item are you looking to swap?
                        </div>
                    </div>
                    <div className={styles.chatInput}>
                        <label htmlFor="chat-input" className={styles.srOnly}>Type your message</label>
                        <input 
                            id="chat-input"
                            type="text" 
                            placeholder="Type your message..." 
                            aria-label="Chat message input"
                        />
                        <button aria-label="Send message">Send</button>
                    </div>
                </div>
            )}
        </div>
    );
}
