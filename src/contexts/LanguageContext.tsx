"use client";

import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations object
const translations = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.menu': 'Menu',
    'nav.service': 'Service',
    'nav.order': 'Order',
    'nav.orderNow': 'Order Now',
    
    // Hero
    'hero.badge': "Bali's Authentic Pisang Sale Experience",
    'hero.title1': 'Bali Pisang',
    'hero.title2': 'Sale',
    'hero.subtitle1': 'The',
    'hero.subtitle2': '#1 Leading',
    'hero.subtitle3': 'Pisang Sale Producer in Bali',
    'hero.stats.years': 'Years',
    'hero.stats.customers': 'Happy Customers',
    'hero.stats.natural': 'Natural',
    'hero.viewMenu': 'View Menu',
    'hero.watchStory': 'Watch Story',
    'hero.badge1': '#1 in Bali',
    'hero.badge2': 'Made with Love',
    'hero.badge3': '100% Local',
    
    // About
    'about.badge': 'About Our Quality',
    'about.title1': 'Pure & Natural',
    'about.title2': 'Pisang Sale',
    'about.feature1': '100% Hygienic',
    'about.feature2': 'No Preservatives',
    'about.feature3': 'Unsweetened',
    'about.description': 'We guarantee our products to be hygienic with no preservatives and additional sweeteners.',
    'about.descriptionHighlight': 'Pure quality, authentic taste.',
    'about.learnMore': 'Learn More',
    
    // AboutPage
    'aboutPage.backToHome': 'Back to Home',
    'aboutPage.aboutUs': 'About Us',
    'aboutPage.heroTitle': "The Story Behind Bali's Finest Pisang Sale",
    'aboutPage.heroDescription': "For seven years, we've been perfecting the art of creating Bali's most beloved Pisang Sale. What started as a family recipe from Pekalongan has found new life in Bali, where we've become a leading producer of this traditional delicacy, bringing authentic flavors to thousands of satisfied customers.",
    'aboutPage.stats.experience': 'Years Experience',
    'aboutPage.stats.customers': 'Happy Customers',
    'aboutPage.stats.natural': 'Natural Ingredients',
    'aboutPage.stats.rank': 'In Bali',
    'aboutPage.journey': 'Our Journey',
    'aboutPage.journeyTitle': "From Pekalongan Heritage to Bali's Favorite",
    'aboutPage.story1': 'Our story begins with deep family roots in Pekalongan, where traditional Pisang Sale recipes were passed down through generations. My father grew up immersed in this craft, learning from his parents who were also dedicated Sale producers. From childhood, he witnessed the time-honored techniques and secret spice blends that would later inspire our journey.',
    'aboutPage.story2': 'Though we honor our Pekalongan heritage, we have established our own independent path here in Bali. We believe that the best flavors come from the finest ingredients and traditional methods. That\'s why we work directly with local Balinese banana farmers, selecting only the ripest, most flavorful bananas that capture the essence of Bali\'s tropical climate.',
    'aboutPage.story3': 'Today, we\'re proud to serve thousands of customers who trust us to deliver the authentic taste of traditional Pisang Sale in Bali. Every batch is made with the same love, care, and attention to detail that has defined our family\'s approach for generations, now adapted to our beautiful island home.',
    'aboutPage.values': 'What We Stand For',
    'aboutPage.valuesTitle': 'Our Core Values',
    'aboutPage.value1.title': 'Made with Love',
    'aboutPage.value1.description': 'Every batch of our Pisang Sale is crafted with passion and care, using traditional recipes rooted in our family\'s Pekalongan heritage.',
    'aboutPage.value2.title': 'Premium Quality',
    'aboutPage.value2.description': 'We source only the finest bananas from local Balinese farms, ensuring every bite delivers exceptional taste and quality.',
    'aboutPage.value3.title': 'Heritage & Innovation',
    'aboutPage.value3.description': 'Honoring our Pekalongan roots while embracing Bali\'s tropical abundance, we create Pisang Sale that bridges tradition with local excellence.',
    'aboutPage.ctaTitle': 'Ready to Taste Tradition?',
    'aboutPage.ctaDescription': 'Experience the authentic flavors of traditional Pisang Sale with our premium products. Made with love, crafted with heritage.',
    'aboutPage.viewMenu': 'View Our Menu',
    'aboutPage.contactUs': 'Contact Us',

    // Menu
    'menu.sectionSubtitle': 'Variety of Options to Choose From',

    // Service
    'service.sectionTitle': 'How It Works',
    'service.sectionSubtitle': 'Our Pre-Order Process Made Simple',
    'service.step1.title': 'Place Pre-Order',
    'service.step1.description': 'Submit your order details with estimated shipping costs. No payment required yet!',
    'service.step2.title': 'Order Confirmation',
    'service.step2.description': 'We confirm product availability & final shipping costs, then email you a secure payment link within 24 hours.',
    'service.step3.title': 'Safe Delivery',
    'service.step3.description': 'Once payment is completed, we carefully package and ship your fresh Pisang Sale to your doorstep.',
    'service.learnMore': 'Learn more about our process',

    // How It Works Page
    'howItWorks.backToHome': 'Back to Home',
    'howItWorks.sectionTitle': 'How It Works',
    'howItWorks.heroTitle': 'Our Simple Pre-Order Process',
    'howItWorks.heroDescription': 'We\'ve designed a transparent and secure pre-order system that puts your trust first. Here\'s exactly how it works from start to finish.',
    
    // Benefits
    'howItWorks.benefit1.title': 'No Upfront Payment',
    'howItWorks.benefit1.description': 'Place your order first, pay only after confirmation',
    'howItWorks.benefit2.title': 'Stock Guaranteed',
    'howItWorks.benefit2.description': 'We confirm availability before asking for payment',
    'howItWorks.benefit3.title': '24 Hour Response',
    'howItWorks.benefit3.description': 'Quick confirmation and transparent pricing',
    'howItWorks.benefit4.title': 'Safe Delivery',
    'howItWorks.benefit4.description': 'Carefully packaged and shipped for freshness',
    
    // Steps
    'howItWorks.step1.title': 'Place Your Pre-Order',
    'howItWorks.step1.description': 'Fill out your details and select your favorite Pisang Sale products. Our system will calculate estimated shipping costs based on your location.',
    'howItWorks.step1.detail1': 'Add products to your cart',
    'howItWorks.step1.detail2': 'Enter your delivery information',
    'howItWorks.step1.detail3': 'Get instant shipping estimates',
    'howItWorks.step1.detail4': 'Submit your pre-order (no payment yet!)',
    'howItWorks.step1.timeframe': 'Takes 2-3 minutes',
    
    'howItWorks.step2.title': 'We Confirm Your Order',
    'howItWorks.step2.description': 'Our team verifies product availability and calculates the exact shipping cost by consulting with courier services for the best rates.',
    'howItWorks.step2.detail1': 'Check product availability',
    'howItWorks.step2.detail2': 'Calculate precise shipping costs',
    'howItWorks.step2.detail3': 'Confirm courier options',
    'howItWorks.step2.detail4': 'Send payment link via email',
    'howItWorks.step2.timeframe': 'Within 24 hours',
    
    'howItWorks.step3.title': 'Secure Payment',
    'howItWorks.step3.description': 'Receive a secure payment link in your email with final pricing. Pay only when you\'re ready and your order is confirmed.',
    'howItWorks.step3.detail1': 'Secure payment gateway',
    'howItWorks.step3.detail2': 'Multiple payment options',
    'howItWorks.step3.detail3': 'Final pricing transparency',
    'howItWorks.step3.detail4': 'Order confirmation receipt',
    'howItWorks.step3.timeframe': 'Pay at your convenience',
    
    'howItWorks.step4.title': 'Safe & Fresh Delivery',
    'howItWorks.step4.description': 'Once payment is confirmed, we carefully package your fresh Pisang Sale with protective materials and ship it directly to your doorstep.',
    'howItWorks.step4.detail1': 'Careful packaging for freshness',
    'howItWorks.step4.detail2': 'Email for order status updates',
    'howItWorks.step4.detail3': 'Safe delivery to your door',
    'howItWorks.step4.detail4': 'Fresh product guaranteed',
    'howItWorks.step4.timeframe': '2-4 business days',
    
    // FAQ
    'howItWorks.faqTitle': 'Frequently Asked Questions',
    'howItWorks.faqSubtitle': 'Common questions about our pre-order system',
    'howItWorks.faq1.question': 'Why don\'t I pay immediately when placing an order?',
    'howItWorks.faq1.answer': 'We want to confirm product availability and provide accurate shipping costs first. This ensures transparency and prevents any surprises.',
    'howItWorks.faq2.question': 'How long does it take to receive the payment link?',
    'howItWorks.faq2.answer': 'You\'ll receive your payment link via email within 24 hours of placing your pre-order. We work quickly to confirm everything for you.',
    'howItWorks.faq3.question': 'What if the products are out of stock?',
    'howItWorks.faq3.answer': 'If any items are unavailable, we\'ll contact you immediately to discuss alternatives or adjust your order before requesting payment.',
    'howItWorks.faq4.question': 'Can I change my order after placing it?',
    'howItWorks.faq4.answer': 'Yes! You can modify your order before paying. Please contact us through our socials if you need any changes.',
    'howItWorks.faq5.question': 'How is my Pisang Sale kept fresh during shipping?',
    'howItWorks.faq5.answer': 'We use special protective packaging and work with reliable couriers to ensure your Pisang Sale arrives fresh and in perfect condition.',
    
    // CTA
    'howItWorks.ctaTitle': 'Ready to Try Our Pre-Order System?',
    'howItWorks.ctaDescription': 'Experience the convenience of our transparent pre-order process. Fresh Pisang Sale, delivered safely to your door.',
    'howItWorks.startPreOrder': 'Start Pre-Order Now',
    'howItWorks.viewMenuFirst': 'View Menu First',
    
    // Connect
    'connect.title': 'Ready to Order?',
    'connect.subtitle': 'Choose your preferred way to get your delicious Pisang Sale',
    'connect.preOrder': 'Pre-Order Online',
    'connect.preOrderDesc': 'Secure pre-order system with email confirmation',
    'connect.directOrder': 'Direct Order',
    'connect.directOrderDesc': 'Instant chat via WhatsApp',
    'connect.alsoAvailable': 'Also Available At',
    'connect.availableAt': 'Find our products at these retail partners across Bali',

    // Order Form
    'order.title': 'Pre-Order Checkout',
    'order.backToHome': 'Back to Home',
    'order.infoTitle': 'How Our Pre-Order System Works',
    'order.step1': 'Place Pre-Order: Fill out your details below (shipping costs shown are estimates)',
    'order.step2': 'We Confirm: We\'ll verify product availability & calculate final shipping costs',
    'order.step3': 'Payment Link: You\'ll receive a secure payment link via email within 24 hours',
    'order.step4': 'Safe Delivery: After payment, we\'ll carefully package and ship your order',
    'order.noPaymentNote': 'No payment required now - you\'ll only pay after we confirm your order details!',
    'order.customerInfo': 'Customer & Shipping Information',
    'order.firstName': 'First Name',
    'order.lastName': 'Last Name',
    'order.email': 'Email',
    'order.phone': 'Phone Number',
    'order.phonePlaceholder': 'e.g., 081234567890',
    'order.streetAddress': 'Street Address',
    'order.streetPlaceholder': 'e.g., Jalan Pantai Kuta No. 123',
    'order.province': 'Province',
    'order.chooseProvince': 'Choose Province',
    'order.city': 'City',
    'order.chooseCity': 'Choose City',
    'order.subdistrict': 'Subdistrict (Kecamatan)',
    'order.chooseSubdistrict': 'Choose Subdistrict',
    'order.shippingEstimate': 'Shipping Estimate',
    'order.calculateShipping': 'Calculate Estimated Shipping',
    'order.calculating': 'Calculating...',
    'order.totalWeight': 'Total Weight',
    'order.minWeightNote': 'Shipping is calculated with a minimum weight of 1kg (1000g), per courier policy.',
    'order.avgShippingCost': 'Average shipping cost estimate:',
    'order.yourOrder': 'Your Order',
    'order.addProduct': 'Add a Product',
    'order.selectProduct': '-- Select a product to add --',
    'order.cartEmpty': 'Your cart is empty.',
    'order.subtotal': 'Subtotal',
    'order.serviceFee': 'Service Fee',
    'order.shippingEst': 'Shipping (est.)',
    'order.grandTotal': 'Grand Total (est.)',
    'order.placePreOrder': 'Place Pre-Order',
    'order.placingPreOrder': 'Placing Pre-Order...',
    
    // Form validation
    'validation.firstNameRequired': 'First name is required.',
    'validation.lastNameRequired': 'Last name is required.',
    'validation.emailRequired': 'Email is required.',
    'validation.emailInvalid': 'Please enter a valid email address.',
    'validation.phoneRequired': 'Phone number is required.',
    'validation.addressRequired': 'Street address is required.',
    'validation.destinationRequired': 'Please select a complete shipping destination.',
    'validation.cartEmpty': 'Your cart is empty.',
    'validation.calculateShippingRequired': 'Please calculate a shipping cost estimate.',
    'validation.destinationAndCartRequired': 'Please select a complete destination and add items to your cart.',

    // Success page translations
    'success.orderDetails': 'Order Details',
    'success.orderReceived': 'Pre-Order Received!',
    'success.paymentOrderDetails': 'Order Details',
    'success.paymentRequired': 'Payment Required',
    'success.paymentConfirmed': 'Payment Confirmed!',
    'success.orderCancelled': 'Order Cancelled',
    'success.paymentRequiredDesc': 'Your order is ready. The final total is',
    'success.payNow': 'Pay Now',
    'success.paymentConfirmedDesc': 'We have received your payment. Your order is now being processed.',
    'success.orderCancelledDesc': 'This order has been cancelled and cannot be paid.',
    'success.backToHomepage': '→ Back to Homepage',
    'success.quantity': 'Quantity',
    'success.orderId': 'Order ID',
    'success.OrderDetail': 'Order Details',
    'success.itemsInOrder': 'Items in Order',
    'success.subtotal': 'Subtotal',
    'success.serviceFee': 'Service Fee',
    'success.shippingFee': 'Shipping Fee',
    'success.grandTotal': 'Grand Total',
    'success.grandTotalEst': 'Grand Total (est.)',
    'success.shippingEst': 'Shipping (est.)',
    
    // Pre-order success page
    'preorderSuccess.title': 'Pre-Order Received!',
    'preorderSuccess.thankYou': 'Thank you for your pre-order.',
    'preorderSuccess.preOrderSystem': 'This is a Pre-Order (PO) system.',
    'preorderSuccess.adminConfirm': 'Our admin will confirm stock availability and the final shipping fee. You will receive a payment link via email once your order is confirmed.',
    'preorderSuccess.customerInfo': 'Customer Information',
    'preorderSuccess.name': 'Name:',
    'preorderSuccess.email': 'Email:',
    'preorderSuccess.phone': 'Phone:',
    'preorderSuccess.address': 'Address:',
    'preorderSuccess.orderDetails': 'Order Details',
    'preorderSuccess.continueShopping': '← Continue Shopping',

        // Status page translations
    'status.title': 'Order Status',
    'status.thankYou': 'Thank you for your order',
    'status.orderId': 'Order ID',
    'status.date': 'Date',
    'status.orderDetails': 'Order Details',
    'status.subtotal': 'Subtotal',
    'status.serviceFee': 'Service Fee',
    'status.shippingFee': 'Shipping Fee',
    'status.grandTotal': 'Grand Total',
    'status.continueShopping': '← Continue Shopping',
    'status.quantity': 'Quantity',
    
    // Order status labels
    'status.pending': 'Awaiting Payment',
    'status.awaitingPayment': 'Awaiting Payment',
    'status.paid': 'Payment Successful',
    'status.fulfilled': 'Order Being Prepared',
    'status.shipped': 'Order Shipped',
    'status.cancelled': 'Order Cancelled',

    // Contact
    'contact.connect': 'Connect with us',
    'contact.contactDetail': 'Contact',
    'contact.MenuLink': 'Menu Link',
  },
  id: {
    // Navbar
    'nav.home': 'Beranda',
    'nav.about': 'Tentang',
    'nav.menu': 'Menu',
    'nav.service': 'Layanan',
    'nav.order': 'Pesan',
    'nav.orderNow': 'Pesan Sekarang',
    
    // Hero
    'hero.badge': 'Pengalaman Pisang Sale Autentik dari Bali',
    'hero.title1': 'Bali Pisang',
    'hero.title2': 'Sale',
    'hero.subtitle1': 'Produsen',
    'hero.subtitle2': '#1',
    'hero.subtitle3': 'Pisang Sale di Bali',
    'hero.stats.years': 'Tahun',
    'hero.stats.customers': 'Pelanggan Puas',
    'hero.stats.natural': 'Alami',
    'hero.viewMenu': 'Lihat Menu',
    'hero.watchStory': 'Tonton Cerita',
    'hero.badge1': '#1 di Bali',
    'hero.badge2': 'Dibuat dengan Cinta',
    'hero.badge3': '100% Lokal',
    
    // About
    'about.badge': 'Tentang Kualitas Kami',
    'about.title1': 'Pisang Sale',
    'about.title2': 'Murni & Alami',
    'about.feature1': '100% Higienis',
    'about.feature2': 'Tanpa Pengawet',
    'about.feature3': 'Tanpa Pemanis',
    'about.description': 'Kami menjamin produk kami higienis tanpa pengawet dan pemanis tambahan.',
    'about.descriptionHighlight': 'Kualitas murni, rasa autentik.',
    'about.learnMore': 'Pelajari Lebih Lanjut',
    
    // AboutPage
    'aboutPage.backToHome': 'Kembali ke Beranda',
    'aboutPage.aboutUs': 'Tentang Kami',
    'aboutPage.heroTitle': 'Cerita di Balik Pisang Sale Terbaik di Bali',
    'aboutPage.heroDescription': 'Selama tujuh tahun, kami telah menyempurnakan seni menciptakan Pisang Sale paling dicintai di Bali. Yang dimulai sebagai resep keluarga dari Pekalongan telah menemukan kehidupan baru di Bali, di mana kami telah menjadi produsen terdepan makanan tradisional ini, membawa cita rasa autentik kepada ribuan pelanggan yang puas.',
    'aboutPage.stats.experience': 'Tahun Pengalaman',
    'aboutPage.stats.customers': 'Pelanggan Puas',
    'aboutPage.stats.natural': 'Bahan Alami',
    'aboutPage.stats.rank': 'Di Bali',
    'aboutPage.journey': 'Perjalanan Kami',
    'aboutPage.journeyTitle': 'Dari Warisan Pekalongan ke Favorit Bali',
    'aboutPage.story1': 'Cerita kami dimulai dengan akar keluarga yang mendalam di Pekalongan, di mana resep tradisional Pisang Sale diwariskan turun-temurun. Ayah saya tumbuh dengan menyelami keahlian ini, belajar dari orang tuanya yang juga merupakan produsen Sale berpengalaman. Sejak kecil, beliau menyaksikan teknik-teknik yang dihormati waktu dan campuran rempah rahasia yang kemudian menginspirasi perjalanan kami.',
    'aboutPage.story2': 'Meskipun kami menghormati warisan Pekalongan kami, kami telah membangun jalan independen sendiri di Bali. Kami percaya bahwa cita rasa terbaik berasal dari bahan-bahan terbaik dan metode tradisional. Itulah mengapa kami bekerja langsung dengan petani pisang lokal Bali, memilih hanya pisang termatang dan paling beraroma yang menangkap esensi iklim tropis Bali.',
    'aboutPage.story3': 'Hari ini, kami bangga melayani ribuan pelanggan yang mempercayai kami untuk menghadirkan cita rasa autentik Pisang Sale tradisional di Bali. Setiap batch dibuat dengan cinta, perhatian, dan detail yang sama yang telah mendefinisikan pendekatan keluarga kami selama generasi, kini disesuaikan dengan rumah pulau indah kami.',
    'aboutPage.values': 'Apa yang Kami Perjuangkan',
    'aboutPage.valuesTitle': 'Nilai-Nilai Inti Kami',
    'aboutPage.value1.title': 'Dibuat dengan Cinta',
    'aboutPage.value1.description': 'Setiap batch Pisang Sale kami dibuat dengan penuh semangat dan perhatian, menggunakan resep tradisional yang berakar dari warisan keluarga Pekalongan kami.',
    'aboutPage.value2.title': 'Kualitas Premium',
    'aboutPage.value2.description': 'Kami hanya menggunakan pisang terbaik dari petani lokal Bali, memastikan setiap gigitan memberikan rasa dan kualitas yang luar biasa.',
    'aboutPage.value3.title': 'Warisan & Inovasi',
    'aboutPage.value3.description': 'Menghormati akar Pekalongan kami sambil merangkul kelimpahan tropis Bali, kami menciptakan Pisang Sale yang menghubungkan tradisi dengan keunggulan lokal.',
    'aboutPage.ctaTitle': 'Siap Merasakan Tradisi?',
    'aboutPage.ctaDescription': 'Rasakan cita rasa autentik Pisang Sale tradisional dengan produk premium kami. Dibuat dengan cinta, dibuat dengan warisan.',
    'aboutPage.viewMenu': 'Lihat Menu Kami',
    'aboutPage.contactUs': 'Hubungi Kami',

    // Menu
    'menu.sectionSubtitle': 'Beragam Pilihan untuk Anda',

    // Service
    'service.sectionTitle': 'Cara Kerja',
    'service.sectionSubtitle': 'Proses Pre-Order Kami Sangat Mudah',
    'service.step1.title': 'Buat Pre-Order',
    'service.step1.description': 'Kirim detail pesanan Anda dengan estimasi biaya pengiriman. Belum perlu membayar!',
    'service.step2.title': 'Konfirmasi Pesanan',
    'service.step2.description': 'Kami konfirmasi ketersediaan produk & biaya pengiriman final, lalu kirim link pembayaran aman via email dalam 24 jam.',
    'service.step3.title': 'Pengiriman Aman',
    'service.step3.description': 'Setelah pembayaran selesai, kami kemas dan kirim Pisang Sale segar ke alamat Anda.',
    'service.learnMore': 'Pelajari lebih lanjut tentang proses kami',

    // How It Works Page
    'howItWorks.backToHome': 'Kembali ke Beranda',
    'howItWorks.sectionTitle': 'Cara Kerja',
    'howItWorks.heroTitle': 'Proses Pre-Order Kami yang Sederhana',
    'howItWorks.heroDescription': 'Kami telah merancang sistem pre-order yang transparan dan aman yang mengutamakan kepercayaan Anda. Berikut cara kerjanya dari awal hingga akhir.',
    
    // Benefits
    'howItWorks.benefit1.title': 'Tanpa Pembayaran Dimuka',
    'howItWorks.benefit1.description': 'Buat pesanan dulu, bayar hanya setelah konfirmasi',
    'howItWorks.benefit2.title': 'Stok Terjamin',
    'howItWorks.benefit2.description': 'Kami konfirmasi ketersediaan sebelum meminta pembayaran',
    'howItWorks.benefit3.title': 'Respon 24 Jam',
    'howItWorks.benefit3.description': 'Konfirmasi cepat dan harga transparan',
    'howItWorks.benefit4.title': 'Pengiriman Aman',
    'howItWorks.benefit4.description': 'Dikemas dan dikirim dengan hati-hati untuk kesegaran',
    
    // Steps
    'howItWorks.step1.title': 'Buat Pre-Order Anda',
    'howItWorks.step1.description': 'Isi detail Anda dan pilih produk Pisang Sale favorit. Sistem kami akan menghitung estimasi biaya pengiriman berdasarkan lokasi Anda.',
    'howItWorks.step1.detail1': 'Tambahkan produk ke keranjang',
    'howItWorks.step1.detail2': 'Masukkan informasi pengiriman',
    'howItWorks.step1.detail3': 'Dapatkan estimasi pengiriman instan',
    'howItWorks.step1.detail4': 'Kirim pre-order (belum perlu bayar!)',
    'howItWorks.step1.timeframe': 'Butuh 2-3 menit',
    
    'howItWorks.step2.title': 'Kami Konfirmasi Pesanan Anda',
    'howItWorks.step2.description': 'Tim kami memverifikasi ketersediaan produk dan menghitung biaya pengiriman yang tepat dengan berkonsultasi dengan layanan kurir untuk mendapatkan tarif terbaik.',
    'howItWorks.step2.detail1': 'Cek ketersediaan produk',
    'howItWorks.step2.detail2': 'Hitung biaya pengiriman yang tepat',
    'howItWorks.step2.detail3': 'Konfirmasi opsi kurir',
    'howItWorks.step2.detail4': 'Kirim link pembayaran via email',
    'howItWorks.step2.timeframe': 'Dalam 24 jam',
    
    'howItWorks.step3.title': 'Pembayaran Aman',
    'howItWorks.step3.description': 'Terima link pembayaran aman di email Anda dengan harga final. Bayar hanya ketika Anda siap dan pesanan dikonfirmasi.',
    'howItWorks.step3.detail1': 'Gateway pembayaran aman',
    'howItWorks.step3.detail2': 'Beberapa opsi pembayaran',
    'howItWorks.step3.detail3': 'Transparansi harga final',
    'howItWorks.step3.detail4': 'Struk konfirmasi pesanan',
    'howItWorks.step3.timeframe': 'Bayar sesuai kenyamanan Anda',
    
    'howItWorks.step4.title': 'Pengiriman Aman & Segar',
    'howItWorks.step4.description': 'Setelah pembayaran dikonfirmasi, kami mengemas Pisang Sale segar Anda dengan hati-hati menggunakan bahan pelindung dan mengirimnya langsung ke pintu Anda.',
    'howItWorks.step4.detail1': 'Pengemasan hati-hati untuk kesegaran',
    'howItWorks.step4.detail2': 'Email status pesanan disediakan',
    'howItWorks.step4.detail3': 'Pengiriman aman ke pintu Anda',
    'howItWorks.step4.detail4': 'Produk segar terjamin',
    'howItWorks.step4.timeframe': '2-4 hari kerja',
    
    // FAQ
    'howItWorks.faqTitle': 'Pertanyaan yang Sering Diajukan',
    'howItWorks.faqSubtitle': 'Pertanyaan umum tentang sistem pre-order kami',
    'howItWorks.faq1.question': 'Mengapa saya tidak langsung membayar saat memesan?',
    'howItWorks.faq1.answer': 'Kami ingin mengkonfirmasi ketersediaan produk dan memberikan biaya pengiriman yang akurat terlebih dahulu, memastikan transparansi dan proses yang lancar.',
    'howItWorks.faq2.question': 'Berapa lama untuk menerima link pembayaran?',
    'howItWorks.faq2.answer': 'Anda akan menerima link pembayaran via email dalam 24 jam setelah membuat pre-order. Kami bekerja cepat untuk mengkonfirmasi semuanya untuk Anda.',
    'howItWorks.faq3.question': 'Bagaimana jika produknya tidak tersedia?',
    'howItWorks.faq3.answer': 'Jika ada barang yang tidak tersedia, kami akan segera menghubungi Anda untuk mendiskusikan alternatif atau menyesuaikan pesanan sebelum meminta pembayaran.',
    'howItWorks.faq4.question': 'Bisakah saya mengubah pesanan setelah memesannya?',
    'howItWorks.faq4.answer': 'Ya! Anda dapat memodifikasi pesanan sebelum membayar. Hubungi kami melalui kontak yang tersedia jika Anda perlu perubahan.',
    'howItWorks.faq5.question': 'Bagaimana Pisang Sale saya tetap segar selama pengiriman?',
    'howItWorks.faq5.answer': 'Kami menggunakan kemasan pelindung khusus dan bekerja dengan kurir yang dapat diandalkan untuk memastikan Pisang Sale Anda tiba dalam kondisi segar dan sempurna.',
    
    // CTA
    'howItWorks.ctaTitle': 'Siap Mencoba Sistem Pre-Order Kami?',
    'howItWorks.ctaDescription': 'Rasakan kenyamanan proses pre-order transparan kami. Pisang Sale segar, dikirim dengan aman ke pintu Anda.',
    'howItWorks.startPreOrder': 'Mulai Pre-Order Sekarang',
    'howItWorks.viewMenuFirst': 'Lihat Menu Dulu',
    
    // Connect
    'connect.title': 'Siap untuk Memesan?',
    'connect.subtitle': 'Pilih cara yang Anda sukai untuk mendapatkan Pisang Sale lezat',
    'connect.preOrder': 'Pre-Order Online',
    'connect.preOrderDesc': 'Sistem pre-order aman dengan konfirmasi email',
    'connect.directOrder': 'Pesan Langsung',
    'connect.directOrderDesc': 'Chat instan via WhatsApp',
    'connect.alsoAvailable': 'Juga Tersedia Di',
    'connect.availableAt': 'Temukan produk kami di mitra retail ini di seluruh Bali',
    
    // Order Form
    'order.title': 'Checkout Pre-Order',
    'order.backToHome': 'Kembali ke Beranda',
    'order.infoTitle': 'Cara Kerja Sistem Pre-Order Kami',
    'order.step1': 'Buat Pre-Order: Isi detail Anda di bawah (biaya pengiriman yang ditampilkan adalah perkiraan)',
    'order.step2': 'Kami Konfirmasi: Kami akan memverifikasi ketersediaan produk & menghitung biaya pengiriman final',
    'order.step3': 'Link Pembayaran: Anda akan menerima link pembayaran aman via email dalam 24 jam',
    'order.step4': 'Pengiriman Aman: Setelah pembayaran, kami akan mengemas dengan hati-hati dan mengirim pesanan Anda',
    'order.noPaymentNote': 'Tidak perlu bayar sekarang - Anda hanya akan bayar setelah kami konfirmasi detail pesanan Anda!',
    'order.customerInfo': 'Informasi Pelanggan & Pengiriman',
    'order.firstName': 'Nama Depan',
    'order.lastName': 'Nama Belakang',
    'order.email': 'Email',
    'order.phone': 'Nomor Telepon',
    'order.phonePlaceholder': 'contoh, 081234567890',
    'order.streetAddress': 'Alamat Jalan',
    'order.streetPlaceholder': 'contoh, Jalan Pantai Kuta No. 123',
    'order.province': 'Provinsi',
    'order.chooseProvince': 'Pilih Provinsi',
    'order.city': 'Kota',
    'order.chooseCity': 'Pilih Kota',
    'order.subdistrict': 'Kecamatan',
    'order.chooseSubdistrict': 'Pilih Kecamatan',
    'order.shippingEstimate': 'Estimasi Pengiriman',
    'order.calculateShipping': 'Hitung Estimasi Pengiriman',
    'order.calculating': 'Menghitung...',
    'order.totalWeight': 'Total Berat',
    'order.minWeightNote': 'Pengiriman dihitung dengan berat minimum 1kg (1000g), sesuai kebijakan kurir.',
    'order.avgShippingCost': 'Estimasi rata-rata biaya pengiriman:',
    'order.yourOrder': 'Pesanan Anda',
    'order.addProduct': 'Tambah Produk',
    'order.selectProduct': '-- Pilih produk untuk ditambahkan --',
    'order.cartEmpty': 'Keranjang Anda kosong.',
    'order.subtotal': 'Subtotal',
    'order.serviceFee': 'Biaya Layanan',
    'order.shippingEst': 'Pengiriman (est.)',
    'order.grandTotal': 'Total Keseluruhan (est.)',
    'order.placePreOrder': 'Buat Pre-Order',
    'order.placingPreOrder': 'Membuat Pre-Order...',
    
    // Form validation
    'validation.firstNameRequired': 'Nama depan diperlukan.',
    'validation.lastNameRequired': 'Nama belakang diperlukan.',
    'validation.emailRequired': 'Email diperlukan.',
    'validation.emailInvalid': 'Masukkan alamat email yang valid.',
    'validation.phoneRequired': 'Nomor telepon diperlukan.',
    'validation.addressRequired': 'Alamat jalan diperlukan.',
    'validation.destinationRequired': 'Pilih tujuan pengiriman lengkap.',
    'validation.cartEmpty': 'Keranjang Anda kosong.',
    'validation.calculateShippingRequired': 'Silakan hitung estimasi biaya pengiriman.',
    'validation.destinationAndCartRequired': 'Pilih tujuan lengkap dan tambahkan item ke keranjang Anda.',

    // Success page translations
    'success.orderDetails': 'Detail Pesanan',
    'success.orderReceived': 'Pre-Order Diterima!',
    'success.paymentOrderDetails': 'Detail Pesanan',
    'success.paymentRequired': 'Pembayaran Diperlukan',
    'success.paymentConfirmed': 'Pembayaran Dikonfirmasi!',
    'success.orderCancelled': 'Pesanan Dibatalkan',
    'success.paymentRequiredDesc': 'Pesanan Anda siap. Total akhir adalah',
    'success.payNow': 'Bayar Sekarang',
    'success.paymentConfirmedDesc': 'Kami telah menerima pembayaran Anda. Pesanan Anda sekarang sedang diproses.',
    'success.orderCancelledDesc': 'Pesanan ini telah dibatalkan dan tidak dapat dibayar.',
    'success.backToHomepage': '→ Kembali ke Beranda',
    'success.quantity': 'Jumlah',
    'success.orderId': 'ID Pesanan',
    'success.orderDetail': 'Detail Pesanan',
    'success.itemsInOrder': 'Item dalam Pesanan',
    'success.subtotal': 'Subtotal',
    'success.serviceFee': 'Biaya Layanan',
    'success.shippingFee': 'Biaya Pengiriman',
    'success.grandTotal': 'Total Keseluruhan',
    'success.grandTotalEst': 'Total Keseluruhan (est.)',
    'success.shippingEst': 'Pengiriman (est.)',
    
    // Pre-order success page
    'preorderSuccess.title': 'Pre-Order Diterima!',
    'preorderSuccess.thankYou': 'Terima kasih atas pre-order Anda.',
    'preorderSuccess.preOrderSystem': 'Ini adalah sistem Pre-Order (PO).',
    'preorderSuccess.adminConfirm': 'Admin kami akan mengonfirmasi ketersediaan stok dan biaya pengiriman final. Anda akan menerima link pembayaran via email setelah pesanan dikonfirmasi.',
    'preorderSuccess.customerInfo': 'Informasi Pelanggan',
    'preorderSuccess.name': 'Nama:',
    'preorderSuccess.email': 'Email:',
    'preorderSuccess.phone': 'Telepon:',
    'preorderSuccess.address': 'Alamat:',
    'preorderSuccess.orderDetails': 'Detail Pesanan',
    'preorderSuccess.continueShopping': '← Lanjut Belanja',

    // Status page translations
    'status.title': 'Status Pesanan',
    'status.thankYou': 'Terima kasih atas pesanan Anda',
    'status.orderId': 'ID Pesanan',
    'status.date': 'Tanggal',
    'status.orderDetails': 'Detail Pesanan',
    'status.subtotal': 'Subtotal',
    'status.serviceFee': 'Biaya Layanan',
    'status.shippingFee': 'Biaya Pengiriman',
    'status.grandTotal': 'Total Keseluruhan',
    'status.continueShopping': '← Lanjut Belanja',
    'status.quantity': 'Jumlah',
    
    // Order status labels
    'status.pending': 'Menunggu Pembayaran',
    'status.awaitingPayment': 'Menunggu Pembayaran',
    'status.paid': 'Pembayaran Berhasil',
    'status.fulfilled': 'Pesanan Sedang Disiapkan',
    'status.shipped': 'Pesanan Dikirim',
    'status.cancelled': 'Pesanan Dibatalkan',

    // Contact
    'contact.connect': 'Hubungi kami',
    'contact.contactDetail': 'Kontak',
    'contact.MenuLink': 'Link Menu',
  }
};

export const LanguageProvider: React.FC<{ 
  children: React.ReactNode;
  initialLanguage?: Language; // Accept initial language from server
}> = ({ children, initialLanguage = 'en' }) => {
  const [language, setLanguage] = useState<Language>(initialLanguage); // Use initial language

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    // Set both localStorage AND cookie
    localStorage.setItem('language', lang);
    document.cookie = `language=${lang}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Strict`;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};