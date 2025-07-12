import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Landing.module.css';

export default function Landing() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = [
    { 
      name: 'Tops & Shirts', 
      description: 'Blouses, T-shirts, Tank tops, Sweaters', 
      count: 245, 
      icon: '👕'
    },
    { 
      name: 'Bottoms', 
      description: 'Jeans, Trousers, Shorts, Skirts', 
      count: 189, 
      icon: '👖'
    },
    { 
      name: 'Dresses', 
      description: 'Casual, Formal, Party, Maxi', 
      count: 156, 
      icon: '👗'
    },
    { 
      name: 'Outerwear', 
      description: 'Jackets, Coats, Blazers, Cardigans', 
      count: 98, 
      icon: '🧥'
    },
    { 
      name: 'Footwear', 
      description: 'Sneakers, Heels, Boots, Sandals', 
      count: 167, 
      icon: '👟'
    },
    { 
      name: 'Accessories', 
      description: 'Bags, Jewelry, Scarves, Belts', 
      count: 134, 
      icon: '👜'
    }
  ];

  const featuredItems = [
    { 
      name: 'Vintage Denim Jacket', 
      points: 150, 
      condition: 'Excellent', 
      size: 'M',
      brand: 'Levi\'s',
      originalPrice: '$89',
      image: '👕'
    },
    { 
      name: 'Floral Summer Dress', 
      points: 120, 
      condition: 'Good', 
      size: 'S',
      brand: 'Zara',
      originalPrice: '$65',
      image: '👗'
    },
    { 
      name: 'Designer Handbag', 
      points: 300, 
      condition: 'Like New', 
      size: 'One Size',
      brand: 'Coach',
      originalPrice: '$250',
      image: '👜'
    },
    { 
      name: 'Leather Boots', 
      points: 200, 
      condition: 'Very Good', 
      size: '8',
      brand: 'Dr. Martens',
      originalPrice: '$180',
      image: '👢'
    },
    { 
      name: 'Silk Scarf', 
      points: 80, 
      condition: 'Excellent', 
      size: 'One Size',
      brand: 'Hermès',
      originalPrice: '$120',
      image: '🧣'
    },
    { 
      name: 'Wool Sweater', 
      points: 180, 
      condition: 'Good', 
      size: 'L',
      brand: 'Ralph Lauren',
      originalPrice: '$95',
      image: '🧥'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      text: 'ReWear has completely transformed how I shop for clothes. I\'ve saved hundreds while building my dream wardrobe sustainably!',
      rating: 5,
      avatar: 'SJ',
      role: 'Fashion Enthusiast'
    },
    {
      name: 'Michael Chen',
      text: 'The quality of items is amazing. I\'ve found designer pieces at a fraction of the cost while helping the environment.',
      rating: 5,
      avatar: 'MC',
      role: 'Sustainable Living Advocate'
    },
    {
      name: 'Emma Davis',
      text: 'Love the community aspect! It feels good to give clothes a second life and connect with like-minded people.',
      rating: 5,
      avatar: 'ED',
      role: 'Eco-Conscious Shopper'
    }
  ];

  const stats = [
    { number: '15,000+', label: 'Items Swapped', icon: '🔄' },
    { number: '1,200+', label: 'Active Members', icon: '👥' },
    { number: '5 Tons', label: 'Waste Prevented', icon: '🌱' },
    { number: '98%', label: 'Satisfaction Rate', icon: '⭐' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleCategoryClick = (index) => {
    setActiveCategory(index);
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection} id="hero">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.heroTag}>
              <span className={styles.tagIcon}>🌱</span>
              <span>Sustainable Fashion Revolution</span>
            </div>
            <h1 className={styles.heroTitle}>
              Swap, Share, <span className={styles.highlight}>Sustain</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Transform your wardrobe while helping the planet. Exchange unused clothing 
              through our innovative swap and points system. Join thousands of fashion 
              enthusiasts making a positive environmental impact.
            </p>
            
            <div className={styles.ctaButtons}>
              <Link to="/register" className={`${styles.ctaBtn} ${styles.ctaPrimary}`}>
                <span className={styles.btnIcon}>✨</span>
                <span>Start Swapping</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={styles.btnArrow}>
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Link>
              <Link to="/item-listing" className={`${styles.ctaBtn} ${styles.ctaSecondary}`}>
                <span className={styles.btnIcon}>🔍</span>
                <span>Browse Items</span>
              </Link>
            </div>

            <div className={styles.trustIndicators}>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🔒</span>
                <span>Secure & Safe</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>✅</span>
                <span>Quality Verified</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🚚</span>
                <span>Free Shipping</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>💚</span>
                <span>Eco-Friendly</span>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <div className={styles.cardHeader}>
                <h3>Featured Today</h3>
                <span className={styles.badge}>New</span>
              </div>
              <div className={styles.cardImage}>
                <span className={styles.cardEmoji}>👕</span>
              </div>
              <div className={styles.cardInfo}>
                <div className={styles.cardDetails}>
                  <span className={styles.brand}>Levi's</span>
                  <span className={styles.itemName}>Vintage Denim Jacket</span>
                  <span className={styles.condition}>Excellent Condition</span>
                </div>
                <div className={styles.cardPrice}>
                  <span className={styles.points}>150</span>
                  <span className={styles.pointsLabel}>Points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection} id="stats">
        <div className={styles.statsContainer}>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statIcon}>{stat.icon}</div>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorksSection} id="how-it-works">
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>How It Works</span>
            <h2 className={styles.sectionTitle}>Simple Steps to Sustainable Fashion</h2>
            <p className={styles.sectionSubtitle}>
              Start your sustainable fashion journey in just four easy steps
            </p>
          </div>
          
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepIcon}>📱</div>
              <h3>Create Account</h3>
              <p>Sign up and set up your style preferences to get personalized recommendations</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepIcon}>📸</div>
              <h3>List Your Items</h3>
              <p>Upload photos of clothes you want to swap and earn points for each listing</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepIcon}>🔍</div>
              <h3>Browse & Discover</h3>
              <p>Find amazing pieces from our community and use your points to get them</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepIcon}>🎉</div>
              <h3>Enjoy & Repeat</h3>
              <p>Receive your new-to-you items and continue the sustainable fashion cycle</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categoriesSection} id="categories">
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Categories</span>
            <h2 className={styles.sectionTitle}>Shop by Category</h2>
            <p className={styles.sectionSubtitle}>
              Discover amazing pieces in every category of sustainable fashion
            </p>
          </div>
          
          <div className={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <div 
                key={index} 
                className={`${styles.categoryCard} ${activeCategory === index ? styles.activeCategory : ''}`}
                onClick={() => handleCategoryClick(index)}
              >
                <div className={styles.categoryIcon}>{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <div className={styles.categoryStats}>
                  <span className={styles.itemCount}>{category.count} items</span>
                  <span className={styles.viewAll}>View All →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className={styles.featuredSection} id="featured">
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Featured Items</span>
            <h2 className={styles.sectionTitle}>Trending in Our Community</h2>
            <p className={styles.sectionSubtitle}>
              Handpicked pieces that our community loves most
            </p>
            <Link to="/item-listing" className={styles.viewAllBtn}>
              View All Items →
            </Link>
          </div>
          
          <div className={styles.featuredGrid}>
            {featuredItems.map((item, index) => (
              <Link to="/product-detail" key={index} className={styles.featuredCard}>
                <div className={styles.featuredImage}>
                  <span className={styles.featuredCondition}>{item.condition}</span>
                  <span className={styles.featuredSize}>Size: {item.size}</span>
                  <div className={styles.featuredEmoji}>{item.image}</div>
                  <div className={styles.featuredOverlay}>
                    <span className={styles.quickView}>Quick View</span>
                  </div>
                </div>
                <div className={styles.featuredInfo}>
                  <div className={styles.featuredBrand}>{item.brand}</div>
                  <div className={styles.featuredTitle}>{item.name}</div>
                  <div className={styles.featuredDetails}>
                    <span className={styles.featuredPoints}>{item.points} Points</span>
                    <span className={styles.originalPrice}>Was {item.originalPrice}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection} id="testimonials">
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Testimonials</span>
            <h2 className={styles.sectionTitle}>What Our Community Says</h2>
            <p className={styles.sectionSubtitle}>
              Real stories from real members of our sustainable fashion community
            </p>
          </div>
          
          <div className={styles.testimonialSlider}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <div className={styles.stars}>
                  {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <p className={styles.testimonialText}>
                  "{testimonials[currentSlide].text}"
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>
                    {testimonials[currentSlide].avatar}
                  </div>
                  <div className={styles.authorInfo}>
                    <div className={styles.authorName}>
                      {testimonials[currentSlide].name}
                    </div>
                    <div className={styles.authorRole}>
                      {testimonials[currentSlide].role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.testimonialDots}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className={styles.impactSection} id="impact">
        <div className={styles.sectionContainer}>
          <div className={styles.impactContent}>
            <div className={styles.impactText}>
              <span className={styles.sectionTag}>Environmental Impact</span>
              <h2 className={styles.impactTitle}>Join the Sustainable Fashion Movement</h2>
              <p className={styles.impactSubtitle}>
                Every swap makes a difference. Together, we're creating a more sustainable future for fashion and our planet.
              </p>
            </div>
            
            <div className={styles.impactCards}>
              <div className={styles.impactCard}>
                <div className={styles.impactIcon}>🌱</div>
                <h3>Eco-Friendly</h3>
                <p>Reduce textile waste and environmental impact. Every swap prevents clothing from ending up in landfills and reduces carbon footprint.</p>
              </div>
              <div className={styles.impactCard}>
                <div className={styles.impactIcon}>💰</div>
                <h3>Save Money</h3>
                <p>Get new-to-you clothes without spending money. Build your dream wardrobe sustainably while saving hundreds of dollars.</p>
              </div>
              <div className={styles.impactCard}>
                <div className={styles.impactIcon}>👥</div>
                <h3>Community</h3>
                <p>Connect with like-minded fashion lovers. Share style tips, discover unique pieces, and be part of a growing sustainable community.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection} id="cta">
        <div className={styles.sectionContainer}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Transform Your Wardrobe?</h2>
            <p className={styles.ctaSubtitle}>
              Join thousands of fashion enthusiasts who are already making a positive impact on the environment
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/register" className={`${styles.ctaBtn} ${styles.ctaPrimary}`}>
                <span className={styles.btnIcon}>🚀</span>
                <span>Get Started Free</span>
              </Link>
              <Link to="/item-listing" className={`${styles.ctaBtn} ${styles.ctaSecondary}`}>
                <span className={styles.btnIcon}>👀</span>
                <span>Browse Items</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
  