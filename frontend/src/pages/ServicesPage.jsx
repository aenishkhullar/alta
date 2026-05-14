import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import styles from './ServicesPage.module.css';

const SERVICES = [
  {
    id: 'website',
    icon: '🌐',
    name: 'Website',
    badges: ['hot'],
    desc: 'Pixel-perfect marketing site with stunning design, smooth animations, and a contact form. Ideal for agencies, personal brands, and businesses.',
    includes: ['4 Sections per page','Contact Form','Mobile Responsive','GSAP Animations','SEO Ready'],
    basePrice: 35000,
    basePagesIncluded: 2,
    extraPagePrice: 5000,
    hasPages: true,
    defaultPages: 2,
    addons: []
  },
  {
    id: 'webapp',
    icon: '⚡',
    name: 'Web App',
    badges: ['pop', 'hot'],
    desc: 'Full-stack MERN application with authentication, dashboard, and scalable backend. Built for startups and SaaS products.',
    includes: ['4 Pages','Contact Form','JWT Authentication','Statistics dashboard + admin control system','Basic Animations','MERN Stack','REST API'],
    basePrice: 150000,
    basePagesIncluded: 4,
    extraPagePrice: 7500,
    hasPages: true,
    defaultPages: 4,
    addons: [
      { id: 'motion', name: '3D & Motion (GSAP / Three.js / Anime.js)', price: 10000 },
      { id: 'nextjs', name: 'Next.js + SSR', price: 10000 },
      { id: 'api', name: 'Scalable APIs & Microservices', price: 5000 }
    ]
  },
  {
    id: 'ai',
    icon: '🤖',
    name: 'AI Integration',
    badges: ['new'],
    desc: 'Smart AI features that make your product future-ready — from support chatbots to intelligent search and RAG pipelines.',
    includes: ['AI Chatbot','OpenAI / Gemini API','Custom Prompts','Integration in Existing App'],
    basePrice: 5000,
    hasPages: false,
    addons: [
      { id: 'rag', name: 'RAG-Based Knowledge System', price: 12000 },
      { id: 'voice', name: 'Voice Interface', price: 8000 }
    ]
  },
  {
    id: 'uiux',
    icon: '🎨',
    name: 'UI/UX Design',
    badges: [],
    desc: 'Figma-first design covering wireframes, components, and pixel-perfect mockups ready for developer handoff.',
    includes: ['7 Page Designs','Component Library','Mobile + Desktop','Figma File Handoff'],
    basePrice: 5000,
    basePagesIncluded: 7,
    extraPagePrice: 1000,
    hasPages: true,
    defaultPages: 7,
    addons: [
      { id: 'proto', name: 'Interactive Prototype', price: 3000 },
      { id: 'brand', name: 'Brand Identity Kit', price: 5000 }
    ]
  },
  {
    id: 'seo',
    icon: '🚀',
    name: 'Performance & SEO',
    badges: [],
    desc: 'Audit, fix, and optimize your existing site for Core Web Vitals, Google ranking, and blazing-fast load times.',
    includes: ['Full Site Audit','Core Web Vitals Fix','On-Page SEO','Image & Bundle Optimization','Monthly Report'],
    basePrice: 2500,
    hasPages: false,
    addons: [
      { id: 'monthly', name: 'Monthly Retainer (per month)', price: 2000 },
      { id: 'ads', name: 'Google Ads Setup', price: 3500 }
    ]
  }
];

const COUPONS = {
  'WELCOME10': { pct: 10, label: '10% off your first project' },
  'LOYALTY15': { pct: 15, label: '15% off any second project' }
};

const GST_RATE = 0.18;

const BADGE_CONFIG = {
  hot:  { label: '🔥 Trending',  bg: 'rgba(255,80,0,0.2)',      color: '#ff6030', border: 'rgba(255,80,0,0.3)' },
  new:  { label: '✦ New',        bg: 'rgba(68,200,68,0.15)',    color: '#44c844', border: 'rgba(68,200,68,0.25)' },
  pop:  { label: '★ Popular',    bg: 'rgba(180,30,30,0.2)',     color: '#cc3333', border: 'rgba(180,30,30,0.3)' }
};

function calcPrice(svc, pages, addons) {
  let price = svc.basePrice;
  if (svc.hasPages && pages > svc.basePagesIncluded) {
    price += (pages - svc.basePagesIncluded) * svc.extraPagePrice;
  }
  addons.forEach(aid => {
    const a = svc.addons.find(x => x.id === aid);
    if (a) price += a.price;
  });
  return price;
}

function fmt(n) {
  return '₹' + n.toLocaleString('en-IN');
}

const ServicesPage = () => {
  const [cardStates, setCardStates] = useState(() =>
    Object.fromEntries(SERVICES.map(s => [
      s.id,
      { pages: s.defaultPages || 1, addons: [] }
    ]))
  );
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [promoStatus, setPromoStatus] = useState(null);
  const [quotationNumber, setQuotationNumber] = useState(null);
  const [quotationLoading, setQuotationLoading] = useState(false);
  const [quotationError, setQuotationError] = useState(null);
  const [copied, setCopied] = useState(false);

  function toggleCartItem(svc) {
    const inCart = cart.find(c => c.id === svc.id);
    if (inCart) {
      setCart(prev => prev.filter(c => c.id !== svc.id));
    } else {
      const state = cardStates[svc.id];
      setCart(prev => [...prev, {
        id: svc.id,
        name: svc.name,
        icon: svc.icon,
        price: calcPrice(svc, state.pages, state.addons),
        pages: state.pages,
        addons: [...state.addons],
        hasPages: svc.hasPages
      }]);
    }
  }

  function updateCartItem(id) {
    const svc = SERVICES.find(s => s.id === id);
    const state = cardStates[id];
    setCart(prev => prev.map(c =>
      c.id === id
        ? { ...c, price: calcPrice(svc, state.pages, state.addons), pages: state.pages, addons: [...state.addons] }
        : c
    ));
  }

  function changePage(svcId, val) {
    const svc = SERVICES.find(s => s.id === svcId);
    const min = svc.basePagesIncluded || 1;
    const clamped = Math.max(min, Math.min(30, val));
    setCardStates(prev => ({ ...prev, [svcId]: { ...prev[svcId], pages: clamped } }));
    if (cart.find(c => c.id === svcId)) {
      setTimeout(() => updateCartItem(svcId), 0);
    }
  }

  function toggleAddon(svcId, addonId, checked) {
    setCardStates(prev => {
      const cur = prev[svcId].addons;
      const next = checked ? [...cur, addonId] : cur.filter(a => a !== addonId);
      return { ...prev, [svcId]: { ...prev[svcId], addons: next } };
    });
    if (cart.find(c => c.id === svcId)) {
      setTimeout(() => updateCartItem(svcId), 0);
    }
  }

  function applyPromo() {
    const code = promoCode.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon({ code, ...COUPONS[code] });
      setPromoStatus({ ok: true, msg: '✓ ' + COUPONS[code].label + ' applied!' });
    } else {
      setAppliedCoupon(null);
      setPromoStatus({ ok: false, msg: code ? '✗ Invalid promo code' : '✗ Enter a promo code' });
    }
  }

  const subtotal = cart.reduce((s, c) => s + c.price, 0);
  const discount = appliedCoupon ? Math.round(subtotal * appliedCoupon.pct / 100) : 0;
  const gst = Math.round((subtotal - discount) * GST_RATE);
  const grandTotal = subtotal - discount + gst;

  const handleCheckout = async () => {
    if (!cart.length) return;
    setQuotationLoading(true);
    setQuotationError(null);

    try {
      const res = await api.post('/enquiry/generate-quotation', {
        cartItems: cart.map(c => {
          const svc = SERVICES.find(s => s.id === c.id);
          let addonPrice = 0;
          c.addons.forEach(aid => {
            const a = svc.addons.find(x => x.id === aid);
            if (a) addonPrice += a.price;
          });
          let pagePrice = 0;
          if (c.hasPages && c.pages > svc.basePagesIncluded) {
            pagePrice = (c.pages - svc.basePagesIncluded) * svc.extraPagePrice;
          }
          return {
            serviceId: c.id,
            serviceName: c.name,
            pages: c.pages || 0,
            addons: c.addons || [],
            basePrice: svc.basePrice,
            addonPrice: addonPrice,
            pagePrice: pagePrice,
            lineTotal: svc.basePrice + addonPrice + pagePrice
          };
        }),
        subtotal,
        discount,
        coupon: appliedCoupon?.code || '',
        gst,
        total: grandTotal
      });

      setQuotationNumber(res.data.quotationNumber);
      // Also store in localStorage so contact form can prefill
      localStorage.setItem('alta_quotation', res.data.quotationNumber);

    } catch (err) {
      setQuotationError('Failed to generate quotation. Please try again.');
    } finally {
      setQuotationLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.hero}>
          <p className={styles.heroLabel}>Service Configurator</p>
          <h1 className={styles.heroTitle}>BUILD YOUR<br/><span>PROJECT</span></h1>
          <p className={styles.heroSub}>
            Transparent pricing. Customizable add-ons. 
            Select exactly what you need and get an instant quote.
          </p>
        </div>

        <div className={styles.grid}>
          {SERVICES.map(svc => {
            const inCart = cart.find(c => c.id === svc.id);
            const state = cardStates[svc.id];
            const currentPrice = calcPrice(svc, state.pages, state.addons);

            return (
              <div key={svc.id} className={`${styles.card} ${inCart ? styles.cardInCart : ''}`}>
                <div className={styles.badgeRow}>
                  {svc.badges.map(b => {
                    const cfg = BADGE_CONFIG[b];
                    return (
                      <span key={b} className={styles.badge} style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}>
                        {cfg.label}
                      </span>
                    );
                  })}
                </div>
                <div className={styles.cardIcon}>{svc.icon}</div>
                <h3 className={styles.cardName}>{svc.name}</h3>
                <p className={styles.cardDesc}>{svc.desc}</p>
                
                <div className={styles.includesTitle}>Included</div>
                {svc.includes.map((inc, i) => (
                  <div key={i} className={styles.includeItem}>
                    <div className={styles.includeDot} />
                    {inc}
                  </div>
                ))}

                {svc.addons && svc.addons.length > 0 && (
                  <div className={styles.addonsSection}>
                    <div className={styles.includesTitle} style={{marginTop: '16px'}}>Optional Add-ons</div>
                    {svc.addons.map(addon => (
                      <div key={addon.id} className={styles.addonRow}>
                        <div className={styles.addonLeft}>
                          <input 
                            type="checkbox" 
                            className={styles.addonCheck}
                            checked={state.addons.includes(addon.id)}
                            onChange={(e) => toggleAddon(svc.id, addon.id, e.target.checked)}
                          />
                          <span className={styles.addonName}>{addon.name}</span>
                        </div>
                        <span className={styles.addonPrice}>+{fmt(addon.price)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {svc.hasPages && (
                  <div className={styles.qtyRow}>
                    <span className={styles.qtyLabel}>Number of Pages</span>
                    <div className={styles.qtyCtrl}>
                      <button className={styles.qtyBtn} onClick={() => changePage(svc.id, state.pages - 1)}>-</button>
                      <span className={styles.qtyVal}>{state.pages}</span>
                      <button className={styles.qtyBtn} onClick={() => changePage(svc.id, state.pages + 1)}>+</button>
                    </div>
                  </div>
                )}

                {svc.hasPages && svc.extraPagePrice > 0 && (
                  <div className={styles.extraInfo}>
                    Includes {svc.basePagesIncluded} pages. Extra pages at {fmt(svc.extraPagePrice)} each.
                  </div>
                )}

                <div className={styles.priceRow}>
                  <div>
                    <div className={styles.priceLabel}>Estimated Total</div>
                    <div className={styles.priceVal} style={{ color: inCart ? '#cc3333' : '#fff' }}>
                      {fmt(currentPrice)}
                    </div>
                  </div>
                </div>

                <button 
                  className={`${styles.addBtn} ${inCart ? styles.addBtnActive : ''}`}
                  onClick={() => toggleCartItem(svc)}
                >
                  <span className={styles.addBtnFill} />
                  <span className={styles.addBtnText}>
                    {inCart ? 'Remove from Cart' : 'Add to Cart'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`${styles.cartBar} ${cartOpen || cart.length > 0 ? styles.cartBarVisible : ''}`}>
        <div className={styles.cartHeader} onClick={() => setCartOpen(!cartOpen)}>
          <div className={styles.cartTitle}>
            Your Quote 
            {cart.length > 0 && <span className={styles.cartCount}>{cart.length}</span>}
          </div>
          <div className={styles.cartToggleLabel}>
            {cartOpen ? 'Hide Details ▲' : 'View Details ▼'}
          </div>
        </div>
        
        <div className={`${styles.cartBody} ${cartOpen ? styles.cartBodyOpen : ''}`}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>No services added yet</div>
          ) : (
            <div className={styles.cartItems}>
              {cart.map(c => (
                <div key={c.id} className={styles.cartItem}>
                  <div className={styles.ciInfo}>
                    <div className={styles.ciName}>{c.icon} {c.name}</div>
                    {c.hasPages && <div className={styles.ciDetail}>{c.pages} Pages</div>}
                    {c.addons.length > 0 && <div className={styles.ciDetail}>{c.addons.length} Add-ons</div>}
                  </div>
                  <div className={styles.ciPrice}>{fmt(c.price)}</div>
                  <button className={styles.ciRemove} onClick={() => toggleCartItem(c)}>&times;</button>
                </div>
              ))}
              
              <div className={styles.promoRow}>
                <input 
                  type="text" 
                  className={styles.promoInput} 
                  placeholder="Promo Code" 
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                />
                <button className={styles.promoBtn} onClick={applyPromo}>Apply</button>
              </div>
              {promoStatus && (
                <div className={styles.promoMsg} style={{ color: promoStatus.ok ? '#44c844' : '#cc3333' }}>
                  {promoStatus.msg}
                </div>
              )}

              <div className={styles.totalsSection}>
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Subtotal</span>
                  <span className={styles.totalVal}>{fmt(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className={styles.totalRow}>
                    <span className={styles.totalLabel}>Discount ({appliedCoupon.pct}%)</span>
                    <span className={styles.totalVal} style={{color: '#44c844'}}>-{fmt(discount)}</span>
                  </div>
                )}
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>GST (18%)</span>
                  <span className={styles.totalVal}>{fmt(gst)}</span>
                </div>
                <div className={styles.grandRow}>
                  <span className={styles.grandLabel}>Total Quote</span>
                  <span className={styles.grandVal}>{fmt(grandTotal)}</span>
                </div>
              </div>
              
              {quotationNumber ? (
                // SUCCESS STATE — show quotation number
                <div style={{
                  background: 'rgba(30,180,80,0.08)',
                  border: '1px solid rgba(30,180,80,0.25)',
                  borderRadius: '10px',
                  padding: '20px',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  <p style={{
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginBottom: '8px'
                  }}>
                    Your Quotation Number
                  </p>
                  <p style={{
                    fontSize: '24px',
                    fontWeight: 900,
                    color: '#fff',
                    letterSpacing: '0.05em',
                    marginBottom: '12px'
                  }}>
                    {quotationNumber}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(quotationNumber);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '6px',
                      color: copied ? '#44c844' : 'rgba(255,255,255,0.5)',
                      fontSize: '11px',
                      padding: '6px 16px',
                      cursor: 'pointer',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: '12px',
                      fontFamily: 'inherit',
                      transition: 'color 0.2s'
                    }}
                  >
                    {copied ? 'Copied!' : 'Copy Number'}
                  </button>
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.35)',
                    lineHeight: 1.6,
                    marginBottom: '16px'
                  }}>
                    Save this number. It has been auto-filled in the form.
                  </p>
                  <a
                    href="/#contact"
                    className={styles.checkoutBtn}
                    style={{ display: 'block', textDecoration: 'none', background: '#cc3333' }}
                  >
                    GO TO CONTACT →
                  </a>
                </div>
              ) : (
                <button
                  className={styles.checkoutBtn}
                  onClick={handleCheckout}
                  disabled={quotationLoading}
                  style={{ opacity: quotationLoading ? 0.6 : 1, pointerEvents: quotationLoading ? 'none' : 'auto' }}
                >
                  {quotationLoading
                    ? 'GENERATING...'
                    : 'GET A QUOTE — ALTA ↗'
                  }
                </button>
              )}

              {quotationError && (
                <p style={{
                  fontSize: '12px',
                  color: '#cc3333',
                  textAlign: 'center',
                  marginTop: '8px'
                }}>
                  {quotationError}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ServicesPage;
