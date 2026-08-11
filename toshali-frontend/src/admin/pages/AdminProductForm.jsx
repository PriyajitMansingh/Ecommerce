// import React, { useState, useEffect, useRef } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import toast from 'react-hot-toast'
// import adminAxios from '../api/adminAxios'
// import axiosInstance from '../../api/axiosInstance'

// const toastStyle = {
//   style: { background: '#3d2a1a', color: '#f8f1e2', fontSize: '13px', fontWeight: 600, borderRadius: '10px' },
// }

// const WEIGHT_OPTIONS = ['100gm', '200gm', '250gm', '500gm', '1kg', '2kg', '5kg']

// const DETAIL_FIELDS = [
//   { key: 'healthBenefits', label: 'Health Benefits', placeholder: 'e.g. Rich in antioxidants, supports heart health' },
//   { key: 'countryOfOrigin', label: 'Country Of Origin', placeholder: 'e.g. India / USA' },
//   { key: 'processingMethod', label: 'Processing Method', placeholder: 'e.g. Sun-dried, hand-sorted' },
//   { key: 'shelfLife', label: 'Shelf Life', placeholder: 'e.g. 6 months from packaging' },
//   { key: 'manufactured', label: 'Manufactured', placeholder: 'e.g. Manufactured by XYZ Foods Pvt. Ltd.' },
//   { key: 'storageInstructions', label: 'Storage Instructions', placeholder: 'e.g. Store in a cool, dry place in an airtight container' },
// ]

// const calculateSellingPrice = (mrp, discountPercent) => {
//   const mrpNum = Number(mrp)
//   const discNum = Number(discountPercent)
//   if (!mrpNum || mrpNum <= 0) return ''
//   if (!discNum || discNum <= 0) return mrpNum.toFixed(2)
//   const discounted = mrpNum - (mrpNum * discNum) / 100
//   return Math.max(0, discounted).toFixed(2)
// }

// const AdminProductForm = () => {
//   const navigate = useNavigate()
//   const { id } = useParams()
//   const isEditMode = Boolean(id)
//   const fileInputRef = useRef(null)

//   const [categories, setCategories] = useState([])
//   const [form, setForm] = useState({
//     name: '', sku: '', slug: '', categoryId: '', subcategoryId: '',
//     weight: WEIGHT_OPTIONS[0],
//     headingDescription: '',
//     mrpPrice: '', discountPercent: '', price: '',
//     stockQty: '',
//     imageUrl: '', isActive: true, isFeatured: false,
//     productDetails: {
//       healthBenefits: '', countryOfOrigin: '', processingMethod: '',
//       shelfLife: '', manufactured: '', storageInstructions: '',
//     },
//   })
//   const [loading, setLoading] = useState(false)
//   const [fetching, setFetching] = useState(isEditMode)

//   // 'upload' = file picker → backend upload endpoint, 'url' = paste a direct link
//   const [imageMode, setImageMode] = useState('upload')
//   const [uploadingImage, setUploadingImage] = useState(false)

//   useEffect(() => {
//     axiosInstance
//       .get('/categories')
//       .then(({ data }) => {
//         setCategories(data)
//         if (!isEditMode && data.length && !form.categoryId) {
//           setForm((prev) => ({ ...prev, categoryId: data[0]._id }))
//         }
//       })
//       .catch(() => {
//         setCategories([])
//       })
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   useEffect(() => {
//     if (!isEditMode) return
//     adminAxios
//       .get(`/products/admin/${id}`)
//       .then(({ data }) => {
//         setForm({
//           name: data.name || '',
//           sku: data.sku || '',
//           slug: data.slug || '',
//           categoryId: data.categoryId?._id || '',
//           subcategoryId: data.subcategoryId?._id || '',
//           weight: data.weight || WEIGHT_OPTIONS[0],
//           headingDescription: data.headingDescription || '',
//           mrpPrice: data.mrpPrice ?? '',
//           discountPercent: data.discountPercent ?? '',
//           price: data.price ?? '',
//           stockQty: data.stockQty ?? '',
//           imageUrl: data.imageUrl || '',
//           isActive: data.isActive,
//           isFeatured: data.isFeatured,
//           productDetails: {
//             healthBenefits: data.productDetails?.healthBenefits || '',
//             countryOfOrigin: data.productDetails?.countryOfOrigin || '',
//             processingMethod: data.productDetails?.processingMethod || '',
//             shelfLife: data.productDetails?.shelfLife || '',
//             manufactured: data.productDetails?.manufactured || '',
//             storageInstructions: data.productDetails?.storageInstructions || '',
//           },
//         })
//       })
//       .catch((error) => {
//         toast.error(error.response?.data?.message || 'Failed to load product.', toastStyle)
//         navigate('/admin/products')
//       })
//       .finally(() => setFetching(false))
//   }, [id, isEditMode, navigate])

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//       ...(name === 'categoryId' ? { subcategoryId: '' } : {}),
//     }))
//   }

//   const handlePricingChange = (e) => {
//     const { name, value } = e.target
//     setForm((prev) => {
//       const next = { ...prev, [name]: value }
//       if (name === 'mrpPrice' || name === 'discountPercent') {
//         next.price = calculateSellingPrice(
//           name === 'mrpPrice' ? value : prev.mrpPrice,
//           name === 'discountPercent' ? value : prev.discountPercent
//         )
//       }
//       return next
//     })
//   }

//   const handleDetailChange = (key) => (e) => {
//     const { value } = e.target
//     setForm((prev) => ({
//       ...prev,
//       productDetails: { ...prev.productDetails, [key]: value },
//     }))
//   }

//   // Uploads the picked file to the backend and stores the returned URL in form.imageUrl.
//   // Assumes an admin endpoint POST /products/upload-image accepting multipart 'image'
//   // and returning { url }. Swap the field name / response key to match your backend.
//   const handleFileSelect = async (e) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     if (!file.type.startsWith('image/')) {
//       toast.error('Please select an image file.', toastStyle)
//       return
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error('Image must be under 5MB.', toastStyle)
//       return
//     }

//     setUploadingImage(true)
//     try {
//       const formData = new FormData()
//       formData.append('image', file)
//       const { data } = await adminAxios.post('/products/upload-image', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       })
//       // data.url is a relative path like /uploads/products/filename.jpg
//       // Prepend the backend origin so the image loads correctly on both
//       // admin and storefront, regardless of which port Vite is running on.
//       const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
//       const backendOrigin = apiBase.replace('/api', '')
//       const fullUrl = data.url.startsWith('http') ? data.url : `${backendOrigin}${data.url}`
//       setForm((prev) => ({ ...prev, imageUrl: fullUrl }))
//       toast.success('Image uploaded!', { icon: '🖼️', ...toastStyle })
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Image upload failed.', toastStyle)
//     } finally {
//       setUploadingImage(false)
//       if (fileInputRef.current) fileInputRef.current.value = ''
//     }
//   }

//   const handleRemoveImage = () => {
//     setForm((prev) => ({ ...prev, imageUrl: '' }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       if (isEditMode) {
//         await adminAxios.put(`/products/${id}`, {
//           name: form.name,
//           categoryId: form.categoryId,
//           subcategoryId: form.subcategoryId || null,
//           weight: form.weight,
//           headingDescription: form.headingDescription,
//           productDetails: form.productDetails,
//           mrpPrice: Number(form.mrpPrice),
//           discountPercent: Number(form.discountPercent) || 0,
//           price: Number(form.price),
//           stockQty: Number(form.stockQty),
//           imageUrl: form.imageUrl,
//           isFeatured: form.isFeatured,
//         })
//         toast.success('Product updated successfully!', { icon: '✅', ...toastStyle })
//       } else {
//         await adminAxios.post('/products', {
//           name: form.name,
//           sku: form.sku,
//           slug: form.slug,
//           categoryId: form.categoryId,
//           subcategoryId: form.subcategoryId || null,
//           weight: form.weight,
//           headingDescription: form.headingDescription,
//           productDetails: form.productDetails,
//           mrpPrice: Number(form.mrpPrice),
//           discountPercent: Number(form.discountPercent) || 0,
//           price: Number(form.price),
//           stockQty: Number(form.stockQty),
//           imageUrl: form.imageUrl,
//           isFeatured: form.isFeatured,
//         })
//         toast.success('Product created successfully!', { icon: '🎉', ...toastStyle })
//       }
//       navigate('/admin/products')
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Something went wrong.', toastStyle)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const inputClass = "w-full border border-[#3d2a1a]/15 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all"
//   const labelClass = "text-xs font-semibold text-[#3d2a1a] mb-1.5 block"
//   const selectedCategory = categories.find((category) => category._id === form.categoryId)
//   const subcategories = selectedCategory?.subcategories || []

//   const savedAmount = form.mrpPrice && form.price
//     ? (Number(form.mrpPrice) - Number(form.price)).toFixed(2)
//     : null

//   if (fetching) {
//     return <p className="text-sm text-[#a89c8a]">Loading product...</p>
//   }

//   return (
//     <div className="max-w-3xl mx-auto">
//       <button
//         onClick={() => navigate('/admin/products')}
//         className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b5940] hover:text-[#B8860B] transition-colors mb-6"
//       >
//         <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
//           <path d="M19 12H5M12 19l-7-7 7-7" />
//         </svg>
//         Back to Products
//       </button>

//       <h1 className="font-serif text-2xl md:text-3xl text-[#3d2a1a] mb-1">
//         {isEditMode ? 'Edit Product' : 'Add New Product'}
//       </h1>
//       <p className="text-sm text-[#6b5940] mb-8">
//         {isEditMode ? `Editing: ${form.name}` : 'Create a new product for the catalogue.'}
//       </p>

//       <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#3d2a1a]/10 shadow-sm p-6 md:p-8 space-y-6">
//         <div>
//           <p className="text-xs font-bold text-[#B8860B] uppercase tracking-wide mb-4">Basic Information</p>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <div>
//               <label className={labelClass}>Product Name *</label>
//               <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="e.g. California Almonds" className={inputClass} />
//             </div>
//             <div>
//               <label className={labelClass}>
//                 SKU * {isEditMode && <span className="text-[#a89c8a] font-normal">(cannot be changed)</span>}
//               </label>
//               <input
//                 type="text" name="sku" required value={form.sku} onChange={handleChange}
//                 placeholder="e.g. HOT-ALM-500" className={inputClass} disabled={isEditMode}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           <div>
//             <label className={labelClass}>
//               Slug (URL) * {isEditMode && <span className="text-[#a89c8a] font-normal">(cannot be changed)</span>}
//             </label>
//             <input
//               type="text" name="slug" required value={form.slug} onChange={handleChange}
//               placeholder="e.g. california-almonds" className={inputClass} disabled={isEditMode}
//             />
//           </div>
//           <div>
//             <label className={labelClass}>Category *</label>
//             <select name="categoryId" required value={form.categoryId} onChange={handleChange} className={`${inputClass} bg-white`}>
//               {categories.length === 0 ? (
//                 <option value="">No categories available yet</option>
//               ) : (
//                 categories.map((c) => (
//                   <option key={c._id} value={c._id}>{c.name}</option>
//                 ))
//               )}
//             </select>
//             {categories.length === 0 && !isEditMode && (
//               <p className="text-[11px] text-[#a89c8a] mt-1.5">Create a category from the dashboard first, then it will appear here automatically.</p>
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           <div>
//             <label className={labelClass}>Subcategory (optional)</label>
//             <select
//               name="subcategoryId"
//               value={form.subcategoryId}
//               onChange={handleChange}
//               className={`${inputClass} bg-white`}
//               disabled={!selectedCategory || subcategories.length === 0}
//             >
//               <option value="">{subcategories.length === 0 ? 'No subcategories available for this category' : 'Select a subcategory (optional)'}</option>
//               {subcategories.map((subcategory) => (
//                 <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
//               ))}
//             </select>
//             <p className="text-[11px] text-[#a89c8a] mt-1.5">Choose a subcategory if this product belongs to a more specific group.</p>
//           </div>

//           <div>
//             <label className={labelClass}>Weight / Pack Size *</label>
//             <select name="weight" required value={form.weight} onChange={handleChange} className={`${inputClass} bg-white`}>
//               {WEIGHT_OPTIONS.map((w) => (
//                 <option key={w} value={w}>{w}</option>
//               ))}
//             </select>
//             <p className="text-[11px] text-[#a89c8a] mt-1.5">Shown on the product card and PDP (e.g. 250gm, 1kg).</p>
//           </div>
//         </div>

//         <div>
//           <label className={labelClass}>Heading Description</label>
//           <input
//             type="text" name="headingDescription" value={form.headingDescription} onChange={handleChange}
//             placeholder="Short line shown as the product heading/tagline" className={inputClass}
//           />
//         </div>

//         <div className="border-t border-[#3d2a1a]/10 pt-6">
//           <p className="text-xs font-bold text-[#B8860B] uppercase tracking-wide mb-4">Product Details</p>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {DETAIL_FIELDS.map(({ key, label, placeholder }) => (
//               <div key={key} className="border border-[#3d2a1a]/10 rounded-xl p-4 bg-[#FBF9F2]">
//                 <label className={labelClass}>{label}</label>
//                 <textarea
//                   rows="2"
//                   value={form.productDetails[key]}
//                   onChange={handleDetailChange(key)}
//                   placeholder={placeholder}
//                   className={`${inputClass} bg-white resize-none`}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="border-t border-[#3d2a1a]/10 pt-6">
//           <p className="text-xs font-bold text-[#B8860B] uppercase tracking-wide mb-4">Pricing & Stock</p>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
//             <div>
//               <label className={labelClass}>MRP (₹) *</label>
//               <input
//                 type="number" name="mrpPrice" required min="0" step="0.01"
//                 value={form.mrpPrice} onChange={handlePricingChange}
//                 placeholder="e.g. 699" className={inputClass}
//               />
//               <p className="text-[11px] text-[#a89c8a] mt-1">Original listed price before discount.</p>
//             </div>
//             <div>
//               <label className={labelClass}>Discount (%)</label>
//               <input
//                 type="number" name="discountPercent" min="0" max="100" step="0.01"
//                 value={form.discountPercent} onChange={handlePricingChange}
//                 placeholder="e.g. 15" className={inputClass}
//               />
//               <p className="text-[11px] text-[#a89c8a] mt-1">Leave blank or 0 for no discount.</p>
//             </div>
//           </div>

//           <div className="rounded-xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#FBF3DD] to-[#F3E4C8] p-5 mb-5">
//             <div className="flex items-center justify-between flex-wrap gap-3">
//               <div>
//                 <label className={labelClass}>Actual Selling Price (₹) *</label>
//                 <input
//                   type="number" name="price" required min="0" step="0.01"
//                   value={form.price} onChange={handleChange}
//                   placeholder="Auto-calculated from MRP & discount"
//                   className={`${inputClass} bg-white font-bold text-[#3d2a1a] text-base max-w-[220px]`}
//                 />
//                 <p className="text-[11px] text-[#a89c8a] mt-1">Auto-filled — you can still override manually.</p>
//               </div>
//               {savedAmount && Number(savedAmount) > 0 && (
//                 <div className="text-right">
//                   <p className="text-[11px] text-[#a89c8a] uppercase tracking-wide font-semibold mb-1">Customer Saves</p>
//                   <p className="font-serif text-2xl font-bold text-[#3a8a5a]">₹{savedAmount}</p>
//                   {form.discountPercent && (
//                     <span className="inline-block mt-1 text-[11px] font-bold text-white bg-[#3a8a5a] px-2.5 py-0.5 rounded-full">
//                       {form.discountPercent}% OFF
//                     </span>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div>
//             <label className={labelClass}>Stock Quantity *</label>
//             <input type="number" name="stockQty" required min="0" value={form.stockQty} onChange={handleChange} placeholder="50" className={inputClass} />
//             <p className="text-[11px] text-[#a89c8a] mt-1">Stock cannot be negative (per system rule).</p>
//           </div>
//         </div>

//         {/* ── Product Image: Upload or URL ── */}
//         <div className="border-t border-[#3d2a1a]/10 pt-6">
//           <p className="text-xs font-bold text-[#B8860B] uppercase tracking-wide mb-4">Product Image</p>

//           <div className="flex gap-2 mb-4 bg-[#FBF9F2] rounded-xl p-1.5 w-fit border border-[#3d2a1a]/8">
//             <button
//               type="button"
//               onClick={() => setImageMode('upload')}
//               className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${
//                 imageMode === 'upload' ? 'bg-[#3d2a1a] text-white' : 'text-[#6b5940] hover:bg-white'
//               }`}
//             >
//               Upload Image
//             </button>
//             <button
//               type="button"
//               onClick={() => setImageMode('url')}
//               className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${
//                 imageMode === 'url' ? 'bg-[#3d2a1a] text-white' : 'text-[#6b5940] hover:bg-white'
//               }`}
//             >
//               Paste Image URL
//             </button>
//           </div>

//           {imageMode === 'upload' ? (
//             <div>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileSelect}
//                 className="hidden"
//                 id="product-image-upload"
//               />
//               <label
//                 htmlFor="product-image-upload"
//                 className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl px-6 py-8 cursor-pointer transition-colors ${
//                   uploadingImage
//                     ? 'border-[#D4AF37]/40 bg-[#FBF3DD] cursor-wait'
//                     : 'border-[#3d2a1a]/20 hover:border-[#D4AF37] hover:bg-[#FBF9F2]'
//                 }`}
//               >
//                 {uploadingImage ? (
//                   <>
//                     <div className="w-6 h-6 border-[3px] border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
//                     <p className="text-xs font-semibold text-[#B8860B]">Uploading...</p>
//                   </>
//                 ) : (
//                   <>
//                     <svg className="w-7 h-7 text-[#a89c8a]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
//                       <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><path d="M17 8l-5-5-5 5" /><path d="M12 3v12" />
//                     </svg>
//                     <p className="text-xs font-semibold text-[#3d2a1a]">Click to upload an image</p>
//                     <p className="text-[10px] text-[#a89c8a]">PNG, JPG up to 5MB</p>
//                   </>
//                 )}
//               </label>
//             </div>
//           ) : (
//             <input
//               type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange}
//               placeholder="https://..." className={inputClass}
//             />
//           )}

//           {form.imageUrl && (
//             <div className="mt-4 flex items-center gap-4">
//               <img src={form.imageUrl} alt="Preview" className="h-24 w-24 object-contain rounded-xl border border-[#3d2a1a]/10 bg-[#FBF9F2] p-2" onError={(e) => (e.target.style.display = 'none')} />
//               <div>
//                 <p className="text-xs font-semibold text-[#3a8a5a] mb-1.5 flex items-center gap-1">
//                   <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
//                   Image set
//                 </p>
//                 <button type="button" onClick={handleRemoveImage} className="text-[11px] font-semibold text-red-500 hover:text-red-600">
//                   Remove image
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="border-t border-[#3d2a1a]/10 pt-6 flex flex-wrap items-center gap-8">
//           <label className="flex items-center gap-2.5 text-sm text-[#3d2a1a] cursor-pointer">
//             <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 accent-[#D4AF37]" />
//             Featured (show on Home page)
//           </label>
//           {isEditMode && (
//             <span className="text-xs text-[#a89c8a]">
//               To activate/deactivate this product, use the toggle on the Products list.
//             </span>
//           )}
//         </div>

//         <div className="flex items-center gap-3 pt-2">
//           <button type="submit" disabled={loading || uploadingImage} className="bg-[#3d2a1a] text-white text-sm font-bold px-7 py-3 rounded-xl hover:bg-[#2b1d14] hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60">
//             {loading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Product'}
//           </button>
//           <button type="button" onClick={() => navigate('/admin/products')} className="text-sm font-semibold text-[#6b5940] hover:text-[#3d2a1a] transition-colors">
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default AdminProductForm










import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import adminAxios from '../api/adminAxios'
import axiosInstance from '../../api/axiosInstance'

const toastStyle = {
  style: { background: '#3d2a1a', color: '#f8f1e2', fontSize: '13px', fontWeight: 600, borderRadius: '10px' },
}

const WEIGHT_OPTIONS = ['100gm', '200gm', '250gm', '500gm', '1kg', '2kg', '5kg']

const DETAIL_FIELDS = [
  { key: 'healthBenefits', label: 'Health Benefits', placeholder: 'e.g. Rich in antioxidants, supports heart health' },
  { key: 'countryOfOrigin', label: 'Country Of Origin', placeholder: 'e.g. India / USA' },
  { key: 'processingMethod', label: 'Processing Method', placeholder: 'e.g. Sun-dried, hand-sorted' },
  { key: 'shelfLife', label: 'Shelf Life', placeholder: 'e.g. 6 months from packaging' },
  { key: 'manufactured', label: 'Manufactured', placeholder: 'e.g. Manufactured by XYZ Foods Pvt. Ltd.' },
  { key: 'storageInstructions', label: 'Storage Instructions', placeholder: 'e.g. Store in a cool, dry place in an airtight container' },
]

const calculateSellingPrice = (mrp, discountPercent) => {
  const mrpNum = Number(mrp)
  const discNum = Number(discountPercent)
  if (!mrpNum || mrpNum <= 0) return ''
  if (!discNum || discNum <= 0) return mrpNum.toFixed(2)
  const discounted = mrpNum - (mrpNum * discNum) / 100
  return Math.max(0, discounted).toFixed(2)
}

const AdminProductForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const fileInputRef = useRef(null)

  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    name: '', sku: '', slug: '', categoryId: '', subcategoryId: '',
    weight: '',
    headingDescription: '',
    mrpPrice: '', discountPercent: '', price: '',
    stockQty: '',
    imageUrl: '', isActive: true, isFeatured: false, isUpcoming: false,
    productDetails: {
      healthBenefits: '', countryOfOrigin: '', processingMethod: '',
      shelfLife: '', manufactured: '', storageInstructions: '',
    },
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditMode)

  // 'upload' = file picker → backend upload endpoint, 'url' = paste a direct link
  const [imageMode, setImageMode] = useState('upload')
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    axiosInstance
      .get('/categories')
      .then(({ data }) => {
        setCategories(data)
        if (!isEditMode && data.length && !form.categoryId) {
          setForm((prev) => ({ ...prev, categoryId: data[0]._id }))
        }
      })
      .catch(() => {
        setCategories([])
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isEditMode) return
    adminAxios
      .get(`/products/admin/${id}`)
      .then(({ data }) => {
        setForm({
          name: data.name || '',
          sku: data.sku || '',
          slug: data.slug || '',
          categoryId: data.categoryId?._id || '',
          subcategoryId: data.subcategoryId?._id || '',
          weight: data.weight || '',
          headingDescription: data.headingDescription || '',
          mrpPrice: data.mrpPrice ?? '',
          discountPercent: data.discountPercent ?? '',
          price: data.price ?? '',
          stockQty: data.stockQty ?? '',
          imageUrl: data.imageUrl || '',
          isActive: data.isActive,
          isFeatured: data.isFeatured,
          isUpcoming: data.isUpcoming ?? false,
          productDetails: {
            healthBenefits: data.productDetails?.healthBenefits || '',
            countryOfOrigin: data.productDetails?.countryOfOrigin || '',
            processingMethod: data.productDetails?.processingMethod || '',
            shelfLife: data.productDetails?.shelfLife || '',
            manufactured: data.productDetails?.manufactured || '',
            storageInstructions: data.productDetails?.storageInstructions || '',
          },
        })
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'Failed to load product.', toastStyle)
        navigate('/admin/products')
      })
      .finally(() => setFetching(false))
  }, [id, isEditMode, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'categoryId' ? { subcategoryId: '' } : {}),
    }))
  }

  const handlePricingChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => {
      const next = { ...prev, [name]: value }
      if (name === 'mrpPrice' || name === 'discountPercent') {
        next.price = calculateSellingPrice(
          name === 'mrpPrice' ? value : prev.mrpPrice,
          name === 'discountPercent' ? value : prev.discountPercent
        )
      }
      return next
    })
  }

  const handleDetailChange = (key) => (e) => {
    const { value } = e.target
    setForm((prev) => ({
      ...prev,
      productDetails: { ...prev.productDetails, [key]: value },
    }))
  }

  // Uploads the picked file to the backend and stores the returned URL in form.imageUrl.
  // Assumes an admin endpoint POST /products/upload-image accepting multipart 'image'
  // and returning { url }. Swap the field name / response key to match your backend.
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.', toastStyle)
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB.', toastStyle)
      return
    }

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const { data } = await adminAxios.post('/products/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      // data.url is a relative path like /uploads/products/filename.jpg
      // Prepend the backend origin so the image loads correctly on both
      // admin and storefront, regardless of which port Vite is running on.
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      const backendOrigin = apiBase.replace('/api', '')
      const fullUrl = data.url.startsWith('http') ? data.url : `${backendOrigin}${data.url}`
      setForm((prev) => ({ ...prev, imageUrl: fullUrl }))
      toast.success('Image uploaded!', { icon: '🖼️', ...toastStyle })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Image upload failed.', toastStyle)
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, imageUrl: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEditMode) {
        await adminAxios.put(`/products/${id}`, {
          name: form.name,
          categoryId: form.categoryId,
          subcategoryId: form.subcategoryId || null,
          weight: form.weight,
          headingDescription: form.headingDescription,
          productDetails: form.productDetails,
          mrpPrice: Number(form.mrpPrice),
          discountPercent: Number(form.discountPercent) || 0,
          price: Number(form.price),
          stockQty: Number(form.stockQty),
          imageUrl: form.imageUrl,
          isFeatured: form.isFeatured,
          isUpcoming: form.isUpcoming,
        })
        toast.success('Product updated successfully!', { icon: '✅', ...toastStyle })
      } else {
        await adminAxios.post('/products', {
          name: form.name,
          sku: form.sku,
          slug: form.slug,
          categoryId: form.categoryId,
          subcategoryId: form.subcategoryId || null,
          weight: form.weight,
          headingDescription: form.headingDescription,
          productDetails: form.productDetails,
          mrpPrice: Number(form.mrpPrice),
          discountPercent: Number(form.discountPercent) || 0,
          price: Number(form.price),
          stockQty: Number(form.stockQty),
          imageUrl: form.imageUrl,
          isFeatured: form.isFeatured,
          isUpcoming: form.isUpcoming,
        })
        toast.success('Product created successfully!', { icon: '🎉', ...toastStyle })
      }
      navigate('/admin/products')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong.', toastStyle)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-[#3d2a1a]/15 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all"
  const labelClass = "text-xs font-semibold text-[#3d2a1a] mb-1.5 block"
  const selectedCategory = categories.find((category) => category._id === form.categoryId)
  const subcategories = selectedCategory?.subcategories || []

  const savedAmount = form.mrpPrice && form.price
    ? (Number(form.mrpPrice) - Number(form.price)).toFixed(2)
    : null

  if (fetching) {
    return <p className="text-sm text-[#a89c8a]">Loading product...</p>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/admin/products')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b5940] hover:text-[#B8860B] transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Products
      </button>

      <h1 className="font-serif text-2xl md:text-3xl text-[#3d2a1a] mb-1">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h1>
      <p className="text-sm text-[#6b5940] mb-8">
        {isEditMode ? `Editing: ${form.name}` : 'Create a new product for the catalogue.'}
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#3d2a1a]/10 shadow-sm p-6 md:p-8 space-y-6">
        <div>
          <p className="text-xs font-bold text-[#B8860B] uppercase tracking-wide mb-4">Basic Information</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Product Name *</label>
              <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="e.g. California Almonds" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>
                SKU * {isEditMode && <span className="text-[#a89c8a] font-normal">(cannot be changed)</span>}
              </label>
              <input
                type="text" name="sku" required value={form.sku} onChange={handleChange}
                placeholder="e.g. HOT-ALM-500" className={inputClass} disabled={isEditMode}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>
              Slug (URL) * {isEditMode && <span className="text-[#a89c8a] font-normal">(cannot be changed)</span>}
            </label>
            <input
              type="text" name="slug" required value={form.slug} onChange={handleChange}
              placeholder="e.g. california-almonds" className={inputClass} disabled={isEditMode}
            />
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <select name="categoryId" required value={form.categoryId} onChange={handleChange} className={`${inputClass} bg-white`}>
              {categories.length === 0 ? (
                <option value="">No categories available yet</option>
              ) : (
                categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))
              )}
            </select>
            {categories.length === 0 && !isEditMode && (
              <p className="text-[11px] text-[#a89c8a] mt-1.5">Create a category from the dashboard first, then it will appear here automatically.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Subcategory (optional)</label>
            <select
              name="subcategoryId"
              value={form.subcategoryId}
              onChange={handleChange}
              className={`${inputClass} bg-white`}
              disabled={!selectedCategory || subcategories.length === 0}
            >
              <option value="">{subcategories.length === 0 ? 'No subcategories available for this category' : 'Select a subcategory (optional)'}</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
              ))}
            </select>
            <p className="text-[11px] text-[#a89c8a] mt-1.5">Choose a subcategory if this product belongs to a more specific group.</p>
          </div>

          <div>
            <label className={labelClass}>Weight / Pack Size *</label>
            <input
              type="text"
              name="weight"
              required
              value={form.weight}
              onChange={handleChange}
              list="weight-options"
              placeholder="e.g. 250gm, 1 kg, 2 pcs"
              className={`${inputClass} bg-white`}
            />
            <datalist id="weight-options">
              {WEIGHT_OPTIONS.map((w) => (
                <option key={w} value={w} />
              ))}
            </datalist>
            <p className="text-[11px] text-[#a89c8a] mt-1.5">Type any custom weight or choose from suggested pack sizes.</p>
          </div>
        </div>

        <div>
          <label className={labelClass}>Heading Description</label>
          <input
            type="text" name="headingDescription" value={form.headingDescription} onChange={handleChange}
            placeholder="Short line shown as the product heading/tagline" className={inputClass}
          />
        </div>

        <div className="border-t border-[#3d2a1a]/10 pt-6">
          <p className="text-xs font-bold text-[#B8860B] uppercase tracking-wide mb-4">Product Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DETAIL_FIELDS.map(({ key, label, placeholder }) => (
              <div key={key} className="border border-[#3d2a1a]/10 rounded-xl p-4 bg-[#FBF9F2]">
                <label className={labelClass}>{label}</label>
                <textarea
                  rows="2"
                  value={form.productDetails[key]}
                  onChange={handleDetailChange(key)}
                  placeholder={placeholder}
                  className={`${inputClass} bg-white resize-none`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#3d2a1a]/10 pt-6">
          <p className="text-xs font-bold text-[#B8860B] uppercase tracking-wide mb-4">Pricing & Stock</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className={labelClass}>MRP (₹) *</label>
              <input
                type="number" name="mrpPrice" required min="0" step="0.01"
                value={form.mrpPrice} onChange={handlePricingChange}
                placeholder="e.g. 699" className={inputClass}
              />
              <p className="text-[11px] text-[#a89c8a] mt-1">Original listed price before discount.</p>
            </div>
            <div>
              <label className={labelClass}>Discount (%)</label>
              <input
                type="number" name="discountPercent" min="0" max="100" step="0.01"
                value={form.discountPercent} onChange={handlePricingChange}
                placeholder="e.g. 15" className={inputClass}
              />
              <p className="text-[11px] text-[#a89c8a] mt-1">Leave blank or 0 for no discount.</p>
            </div>
          </div>

          <div className="rounded-xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#FBF3DD] to-[#F3E4C8] p-5 mb-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <label className={labelClass}>Actual Selling Price (₹) *</label>
                <input
                  type="number" name="price" required min="0" step="0.01"
                  value={form.price} onChange={handleChange}
                  placeholder="Auto-calculated from MRP & discount"
                  className={`${inputClass} bg-white font-bold text-[#3d2a1a] text-base max-w-[220px]`}
                />
                <p className="text-[11px] text-[#a89c8a] mt-1">Auto-filled — you can still override manually.</p>
              </div>
              {savedAmount && Number(savedAmount) > 0 && (
                <div className="text-right">
                  <p className="text-[11px] text-[#a89c8a] uppercase tracking-wide font-semibold mb-1">Customer Saves</p>
                  <p className="font-serif text-2xl font-bold text-[#3a8a5a]">₹{savedAmount}</p>
                  {form.discountPercent && (
                    <span className="inline-block mt-1 text-[11px] font-bold text-white bg-[#3a8a5a] px-2.5 py-0.5 rounded-full">
                      {form.discountPercent}% OFF
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass}>Stock Quantity *</label>
            <input type="number" name="stockQty" required min="0" value={form.stockQty} onChange={handleChange} placeholder="50" className={inputClass} />
            <p className="text-[11px] text-[#a89c8a] mt-1">Stock cannot be negative (per system rule).</p>
          </div>
        </div>

        {/* ── Product Image: Upload or URL ── */}
        <div className="border-t border-[#3d2a1a]/10 pt-6">
          <p className="text-xs font-bold text-[#B8860B] uppercase tracking-wide mb-4">Product Image</p>

          <div className="flex gap-2 mb-4 bg-[#FBF9F2] rounded-xl p-1.5 w-fit border border-[#3d2a1a]/8">
            <button
              type="button"
              onClick={() => setImageMode('upload')}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${
                imageMode === 'upload' ? 'bg-[#3d2a1a] text-white' : 'text-[#6b5940] hover:bg-white'
              }`}
            >
              Upload Image
            </button>
            <button
              type="button"
              onClick={() => setImageMode('url')}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${
                imageMode === 'url' ? 'bg-[#3d2a1a] text-white' : 'text-[#6b5940] hover:bg-white'
              }`}
            >
              Paste Image URL
            </button>
          </div>

          {imageMode === 'upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="product-image-upload"
              />
              <label
                htmlFor="product-image-upload"
                className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl px-6 py-8 cursor-pointer transition-colors ${
                  uploadingImage
                    ? 'border-[#D4AF37]/40 bg-[#FBF3DD] cursor-wait'
                    : 'border-[#3d2a1a]/20 hover:border-[#D4AF37] hover:bg-[#FBF9F2]'
                }`}
              >
                {uploadingImage ? (
                  <>
                    <div className="w-6 h-6 border-[3px] border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-semibold text-[#B8860B]">Uploading...</p>
                  </>
                ) : (
                  <>
                    <svg className="w-7 h-7 text-[#a89c8a]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><path d="M17 8l-5-5-5 5" /><path d="M12 3v12" />
                    </svg>
                    <p className="text-xs font-semibold text-[#3d2a1a]">Click to upload an image</p>
                    <p className="text-[10px] text-[#a89c8a]">PNG, JPG up to 5MB</p>
                  </>
                )}
              </label>
            </div>
          ) : (
            <input
              type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange}
              placeholder="https://..." className={inputClass}
            />
          )}

          {form.imageUrl && (
            <div className="mt-4 flex items-center gap-4">
              <img src={form.imageUrl} alt="Preview" className="h-24 w-24 object-contain rounded-xl border border-[#3d2a1a]/10 bg-[#FBF9F2] p-2" onError={(e) => (e.target.style.display = 'none')} />
              <div>
                <p className="text-xs font-semibold text-[#3a8a5a] mb-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
                  Image set
                </p>
                <button type="button" onClick={handleRemoveImage} className="text-[11px] font-semibold text-red-500 hover:text-red-600">
                  Remove image
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-[#3d2a1a]/10 pt-6">
          <p className="text-xs font-bold text-[#B8860B] uppercase tracking-wide mb-4">Visibility</p>
          <div className="flex flex-wrap gap-5">
            {/* Featured */}
            <label className="flex items-start gap-3 cursor-pointer bg-[#FBF9F2] border border-[#D4AF37]/30 rounded-xl px-4 py-3 hover:border-[#D4AF37] transition-colors">
              <input
                type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange}
                className="mt-0.5 w-4 h-4 accent-[#D4AF37] shrink-0"
              />
              <div>
                <p className="text-sm font-semibold text-[#3d2a1a]">Featured</p>
                <p className="text-[11px] text-[#a89c8a] mt-0.5">Show on Home page as a bestseller product.</p>
              </div>
            </label>

            {/* Upcoming */}
            <label className="flex items-start gap-3 cursor-pointer bg-[#FBF9F2] border border-[#6b5940]/20 rounded-xl px-4 py-3 hover:border-[#6b5940]/50 transition-colors">
              <input
                type="checkbox" name="isUpcoming" checked={form.isUpcoming} onChange={handleChange}
                className="mt-0.5 w-4 h-4 accent-[#6b5940] shrink-0"
              />
              <div>
                <p className="text-sm font-semibold text-[#3d2a1a]">Upcoming Product</p>
                <p className="text-[11px] text-[#a89c8a] mt-0.5">Display in "Coming Soon" section — shows MRP, brand &amp; description only.</p>
              </div>
            </label>
          </div>
          {isEditMode && (
            <p className="text-[11px] text-[#a89c8a] mt-3">
              To activate/deactivate this product, use the toggle on the Products list.
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={loading || uploadingImage} className="bg-[#3d2a1a] text-white text-sm font-bold px-7 py-3 rounded-xl hover:bg-[#2b1d14] hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60">
            {loading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="text-sm font-semibold text-[#6b5940] hover:text-[#3d2a1a] transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminProductForm