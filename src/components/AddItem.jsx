import React, { useState } from "react";
import styles from "../styles/AddItem.module.css";

export default function AddItem() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    size: "",
    condition: "",
    tags: "",
  });
  const [images, setImages] = useState([null, null, null, null, null]);
  const [previews, setPreviews] = useState([null, null, null, null, null]);
  const [errors, setErrors] = useState({});

  // Remove image handler
  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    if (newPreviews[index]) {
      URL.revokeObjectURL(newPreviews[index]);
    }
    newImages[index] = null;
    newPreviews[index] = null;
    setImages(newImages);
    setPreviews(newPreviews);
  };

  // Handle text field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle image input and preview
  const handleImageChange = (index, file) => {
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const newImages = [...images];
    const newPreviews = [...previews];
    
    // Revoke previous URL to prevent memory leaks
    if (newPreviews[index]) {
      URL.revokeObjectURL(newPreviews[index]);
    }
    
    newImages[index] = file;
    newPreviews[index] = URL.createObjectURL(file);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.type.trim()) newErrors.type = "Type is required";
    if (!form.size.trim()) newErrors.size = "Size is required";
    if (!form.condition) newErrors.condition = "Condition is required";
    if (!previews[0]) newErrors.mainImage = "Main image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Here you would typically send data to your backend
      console.log("Form data:", form);
      console.log("Images:", images);
      alert("Item listed successfully!");
      
      // Reset form
      setForm({
        title: "",
        description: "",
        category: "",
        type: "",
        size: "",
        condition: "",
        tags: "",
      });
      setImages([null, null, null, null, null]);
      setPreviews([null, null, null, null, null]);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header} role="banner">
        <div className={styles.logo}>ReWear</div>
        <nav className={styles.nav} aria-label="Primary navigation">
          <a href="/" className={styles.navLink}>Home</a>
          <a href="/browse" className={styles.navLink}>Browse Items</a>
          <a href="/list" className={styles.navLink}>List an Item</a>
          <a href="/dashboard" className={styles.navLink}>Dashboard</a>
        </nav>
        <div className={styles.searchContainer}>
          <input
            className={styles.searchBar}
            type="search"
            placeholder="Search items..."
            aria-label="Search items"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.heading}>List a New Item</h1>
            <p className={styles.subheading}>Share your pre-loved clothing with the ReWear community</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              {/* Main Image Upload */}
              <div className={styles.imageSection}>
                <label className={styles.imageUploadLabel}>
                  {previews[0] ? (
                    <div className={styles.imagePreviewWrapper}>
                      <img src={previews[0]} alt="Main" className={styles.mainImage} />
                      <button
                        className={styles.removeImageBtn}
                        type="button"
                        onClick={() => removeImage(0)}
                        aria-label="Remove main image"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <div className={styles.uploadIcon}>📷</div>
                      <span className={styles.uploadText}>Add Main Image</span>
                      <span className={styles.uploadSubtext}>JPG, PNG up to 5MB</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageChange(0, e.target.files[0])}
                  />
                </label>
                {errors.mainImage && <span className={styles.error}>{errors.mainImage}</span>}
              </div>

              {/* Product Details */}
              <div className={styles.detailsPanel}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Title *
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      maxLength={60}
                      placeholder="e.g. Blue Denim Jacket"
                      className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                    />
                    {errors.title && <span className={styles.error}>{errors.title}</span>}
                  </label>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Description *
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      maxLength={500}
                      placeholder="Describe your item in detail..."
                      rows={4}
                      className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                    />
                    <span className={styles.charCount}>{form.description.length}/500</span>
                    {errors.description && <span className={styles.error}>{errors.description}</span>}
                  </label>
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Category *
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                        className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
                      >
                        <option value="">Select category</option>
                        <option value="Jacket">Jacket</option>
                        <option value="Shirt">Shirt</option>
                        <option value="Dress">Dress</option>
                        <option value="Pants">Pants</option>
                        <option value="Skirt">Skirt</option>
                        <option value="Shoes">Shoes</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.category && <span className={styles.error}>{errors.category}</span>}
                    </label>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Size *
                      <input
                        type="text"
                        name="size"
                        value={form.size}
                        onChange={handleChange}
                        required
                        maxLength={10}
                        placeholder="e.g. M, L, 32"
                        className={`${styles.input} ${errors.size ? styles.inputError : ''}`}
                      />
                      {errors.size && <span className={styles.error}>{errors.size}</span>}
                    </label>
                  </div>
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Type *
                      <input
                        type="text"
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        required
                        maxLength={30}
                        placeholder="e.g. Denim, Cotton, Wool"
                        className={`${styles.input} ${errors.type ? styles.inputError : ''}`}
                      />
                      {errors.type && <span className={styles.error}>{errors.type}</span>}
                    </label>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Condition *
                      <select
                        name="condition"
                        value={form.condition}
                        onChange={handleChange}
                        required
                        className={`${styles.select} ${errors.condition ? styles.inputError : ''}`}
                      >
                        <option value="">Select condition</option>
                        <option value="New">New with tags</option>
                        <option value="Like New">Like new</option>
                        <option value="Gently Used">Gently used</option>
                        <option value="Used">Used</option>
                        <option value="Well Worn">Well worn</option>
                      </select>
                      {errors.condition && <span className={styles.error}>{errors.condition}</span>}
                    </label>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Tags
                    <input
                      type="text"
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="e.g. blue, vintage, summer, casual"
                      maxLength={100}
                      className={styles.input}
                    />
                    <span className={styles.helpText}>Separate tags with commas to help others find your item</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Additional Images Gallery */}
            <div className={styles.gallerySection}>
              <h3 className={styles.galleryTitle}>Additional Images</h3>
              <p className={styles.gallerySubtitle}>Add up to 4 more photos to showcase your item</p>
              <div className={styles.galleryRow}>
                {[1, 2, 3, 4].map((idx) => (
                  <label className={styles.galleryThumb} key={idx}>
                    {previews[idx] ? (
                      <div className={styles.imagePreviewWrapper}>
                        <img src={previews[idx]} alt={`Gallery ${idx}`} />
                        <button
                          className={styles.removeImageBtn}
                          type="button"
                          onClick={() => removeImage(idx)}
                          aria-label={`Remove image ${idx}`}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        <div className={styles.uploadIcon}>+</div>
                        <span className={styles.uploadText}>Add Image</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleImageChange(idx, e.target.files[0])}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className={styles.submitSection}>
              <button className={styles.submitBtn} type="submit">
                List Item
              </button>
              <p className={styles.submitNote}>
                By listing this item, you agree to our <a href="/terms">Terms of Service</a>
              </p>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer} role="contentinfo">
        <div className={styles.footerContent}>
          <a href="/about" className={styles.footerLink}>About</a>
          <a href="/contact" className={styles.footerLink}>Contact</a>
          <a href="/terms" className={styles.footerLink}>Terms</a>
          <a href="/privacy" className={styles.footerLink}>Privacy</a>
        </div>
      </footer>
    </div>
  );
}
