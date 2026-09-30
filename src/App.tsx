/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  X, 
  MapPin, 
  Phone, 
  Clock, 
  ChevronRight,
  Star,
  Pizza as PizzaIcon,
  Flame,
  Leaf,
  Zap,
  ChevronDown,
  Gift,
  Calendar,
  Image as ImageIcon,
  Truck,
  CreditCard,
  CheckCircle2,
  Menu as MenuIcon,
  Facebook,
  Instagram,
  Twitter
} from 'lucide-react';
import { PIZZAS } from './constants';
import { Pizza, CartItem } from './types';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [scrolled, setScrolled] = useState(false);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  
  // Checkout form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    house: '',
    apartment: '',
    floor: '',
    code: '',
    paymentMethod: 'cash',
    deliveryTime: 'asap',
    comments: ''
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (pizza: Pizza) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === pizza.id);
      if (existing) {
        return prev.map(item => 
          item.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...pizza, quantity: 1 }];
    });
    if (!isCartOpen) setIsCartOpen(true);
    setCheckoutStep('cart');
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('success');
    // In a real app, we would send the data to the server here
  };

  const resetCart = () => {
    setCart([]);
    setIsCartOpen(false);
    setCheckoutStep('cart');
    setFormData({
      name: '',
      phone: '',
      street: '',
      house: '',
      apartment: '',
      floor: '',
      code: '',
      paymentMethod: 'cash',
      deliveryTime: 'asap',
      comments: ''
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const categories = ['All', 'Classic', 'Special', 'Vegetarian', 'Spicy'];
  const filteredPizzas = activeCategory === 'All' 
    ? PIZZAS 
    : PIZZAS.filter(p => p.category === activeCategory);

  const navItems = [
    { name: 'Promocje', icon: <Gift className="w-4 h-4" /> },
    { name: 'Menu', icon: <PizzaIcon className="w-4 h-4" /> },
    { name: 'Dostawa', icon: <Truck className="w-4 h-4" /> },
    { name: 'Rezerwacja', icon: <Calendar className="w-4 h-4" /> },
    { name: 'Galeria', icon: <ImageIcon className="w-4 h-4" /> },
    { name: 'Kontakt', icon: <Phone className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-primary p-2 rounded-xl">
              <PizzaIcon className="text-white w-6 h-6" />
            </div>
            <span className={`text-2xl font-display font-extrabold tracking-tight text-stone-900`}>
              PIZZA<span className="text-brand-primary">FAST</span>
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            <div className="relative">
              <button 
                onMouseEnter={() => setIsStartOpen(true)}
                onMouseLeave={() => setIsStartOpen(false)}
                className="flex items-center gap-1 font-bold text-stone-800 hover:text-brand-primary transition-colors py-2"
              >
                Start <ChevronDown className={`w-4 h-4 transition-transform ${isStartOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isStartOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseEnter={() => setIsStartOpen(true)}
                    onMouseLeave={() => setIsStartOpen(false)}
                    className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-2xl p-2 border border-stone-100"
                  >
                    <a href="#" className="block px-4 py-2 rounded-xl hover:bg-stone-50 font-medium text-stone-600 hover:text-brand-primary">O nas</a>
                    <a href="#" className="block px-4 py-2 rounded-xl hover:bg-stone-50 font-medium text-stone-600 hover:text-brand-primary">Nasza historia</a>
                    <a href="#" className="block px-4 py-2 rounded-xl hover:bg-stone-50 font-medium text-stone-600 hover:text-brand-primary">Zespół</a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {navItems.map(item => (
              <a 
                key={item.name} 
                href={`#${item.name.toLowerCase()}`} 
                className="font-bold text-stone-800 hover:text-brand-primary transition-colors flex items-center gap-2"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
            >
              <ShoppingBag className="w-6 h-6 text-stone-800" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
            >
              <MenuIcon className="w-6 h-6 text-stone-800" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-[300px] bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-brand-primary p-2 rounded-xl">
                    <PizzaIcon className="text-white w-5 h-5" />
                  </div>
                  <span className="text-xl font-display font-extrabold tracking-tight text-stone-900">
                    PIZZA<span className="text-brand-primary">FAST</span>
                  </span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-stone-500" />
                </button>
              </div>
              <div className="flex-grow overflow-y-auto p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Nawigacja</p>
                  {navItems.map(item => (
                    <a 
                      key={item.name} 
                      href={`#${item.name.toLowerCase()}`} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-stone-50 font-bold text-stone-800 transition-colors"
                    >
                      <span className="bg-stone-100 p-2 rounded-xl text-brand-primary">{item.icon}</span>
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
              <div className="p-6 border-t border-stone-100">
                <p className="text-sm text-stone-400 text-center">© 2026 Pizza Fast</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 overflow-hidden">
          <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-brand-secondary/10 rounded-l-[100px] hidden lg:block" />
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-full font-bold text-sm mb-6">
                <Zap className="w-4 h-4" />
                NAJSZYBSZA DOSTAWA W MIEŚCIE
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-stone-900 leading-tight mb-6">
                Świeża Pizza <br />
                <span className="text-brand-primary">Dostarczona Szybko</span> <br />
                Do Twoich Drzwi.
              </h1>
              <p className="text-base md:text-lg text-stone-600 mb-8 max-w-lg mx-auto lg:mx-0">
                Ręcznie wyrabiane ciasto, świeże składniki i najszybszy zespół dostawczy w mieście. 
                Zamów teraz i otrzymaj pizzę w mniej niż 30 minut!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a href="#menu" className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2">
                  Zamów Teraz <ChevronRight className="w-5 h-5" />
                </a>
                <div className="flex items-center gap-4 px-6 py-4">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <img 
                        key={i}
                        src={`https://i.pravatar.cc/100?img=${i+10}`} 
                        className="w-10 h-10 rounded-full border-2 border-white" 
                        alt="User"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="flex text-brand-secondary">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-stone-800">500+ Zadowolonych Klientów</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative max-w-md mx-auto lg:max-w-none"
            >
              <img 
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000" 
                alt="Delicious Pizza" 
                className="rounded-[30px] md:rounded-[40px] shadow-2xl rotate-2 md:rotate-3 hover:rotate-0 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl flex items-center gap-3 md:gap-4 animate-bounce">
                <div className="bg-green-100 p-2 md:p-3 rounded-xl md:rounded-2xl">
                  <Clock className="text-green-600 w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-stone-500 font-bold uppercase tracking-wider">Czas Dostawy</p>
                  <p className="text-lg md:text-xl font-display font-extrabold text-stone-900">25-30 Min</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Promocje Section */}
        <section id="promocje" className="py-16 md:py-20 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-stone-900 mb-4">Gorące Promocje</h2>
              <p className="text-stone-500 max-w-2xl mx-auto">Sprawdź nasze aktualne okazje i oszczędzaj na każdym zamówieniu.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-brand-primary rounded-[30px] md:rounded-[40px] p-6 md:p-8 text-white flex flex-col sm:flex-row items-center gap-6 md:gap-8 overflow-hidden relative">
                <div className="relative z-10 text-center sm:text-left">
                  <span className="bg-white/20 px-4 py-1 rounded-full text-xs font-bold mb-4 inline-block uppercase tracking-wider">WEEKENDOWA OKAZJA</span>
                  <h3 className="text-2xl md:text-3xl font-display font-extrabold mb-4">Druga Pizza -50%</h3>
                  <p className="text-white/80 mb-6 text-sm md:text-base">Zamów dowolną dużą pizzę, a drugą otrzymasz za połowę ceny!</p>
                  <button className="bg-white text-brand-primary px-6 py-3 rounded-xl font-bold hover:bg-stone-100 transition-colors w-full sm:w-auto">Skorzystaj</button>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=400" 
                  alt="Promo" 
                  className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-2xl md:rounded-3xl rotate-6 md:rotate-12 shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="bg-brand-secondary rounded-[30px] md:rounded-[40px] p-6 md:p-8 text-stone-900 flex flex-col sm:flex-row items-center gap-6 md:gap-8 overflow-hidden relative">
                <div className="relative z-10 text-center sm:text-left">
                  <span className="bg-black/10 px-4 py-1 rounded-full text-xs font-bold mb-4 inline-block uppercase tracking-wider">DLA RODZINY</span>
                  <h3 className="text-2xl md:text-3xl font-display font-extrabold mb-4">Zestaw Rodzinny</h3>
                  <p className="text-stone-700 mb-6 text-sm md:text-base">3x Pizza 32cm + Napój 1.5L w super cenie 99zł!</p>
                  <button className="bg-stone-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-stone-800 transition-colors w-full sm:w-auto">Zamów Zestaw</button>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&q=80&w=400" 
                  alt="Promo" 
                  className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-2xl md:rounded-3xl -rotate-6 md:-rotate-12 shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section id="menu" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-extrabold text-stone-900 mb-4">Nasze Menu</h2>
              <p className="text-stone-500 max-w-2xl mx-auto">
                Wybieraj spośród szerokiej gamy naszych pizz, przygotowanych z najlepszych składników i wypiekanych do perfekcji.
              </p>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                    activeCategory === cat 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Pizza Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredPizzas.map((pizza) => (
                  <motion.div
                    layout
                    key={pizza.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group bg-stone-50 rounded-[32px] p-4 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-stone-100"
                  >
                    <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square">
                      <img 
                        src={pizza.image} 
                        alt={pizza.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {pizza.category === 'Spicy' && (
                          <div className="bg-red-500 text-white p-2 rounded-full shadow-lg">
                            <Flame className="w-4 h-4" />
                          </div>
                        )}
                        {pizza.category === 'Vegetarian' && (
                          <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                            <Leaf className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="px-2">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-display font-extrabold text-stone-900">{pizza.name}</h3>
                        <span className="text-brand-primary font-display font-extrabold text-xl">${pizza.price}</span>
                      </div>
                      <p className="text-stone-500 text-sm mb-6 line-clamp-2">{pizza.description}</p>
                      <button 
                        onClick={() => addToCart(pizza)}
                        className="w-full bg-white border-2 border-stone-200 hover:border-brand-primary hover:bg-brand-primary hover:text-white text-stone-900 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-5 h-5" /> Dodaj do Koszyka
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Dostawa Section */}
        <section id="dostawa" className="py-16 md:py-24 bg-stone-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-extrabold mb-4">Szybka i Prosta Dostawa</h2>
              <p className="text-stone-400 max-w-2xl mx-auto">Twoje zamówienie w 3 prostych krokach. Zobacz jak to działa!</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {[
                { 
                  icon: <ShoppingBag className="w-6 h-6 md:w-8 md:h-8" />, 
                  title: "Złóż Zamówienie", 
                  desc: "Wybierz swoje ulubione pizze z naszego menu i dodaj je do koszyka." 
                },
                { 
                  icon: <CreditCard className="w-6 h-6 md:w-8 md:h-8" />, 
                  title: "Zapłać Wygodnie", 
                  desc: "Wybierz płatność online lub gotówką/kartą przy odbiorze u kuriera." 
                },
                { 
                  icon: <Truck className="w-6 h-6 md:w-8 md:h-8" />, 
                  title: "Odbierz Pizzę", 
                  desc: "Nasz kurier dostarczy gorącą pizzę pod Twoje drzwi w mniej niż 30 minut!" 
                }
              ].map((step, idx) => (
                <div key={idx} className="relative flex flex-col items-center text-center group">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-brand-primary transition-colors duration-500">
                    {step.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-display font-bold mb-4">{step.title}</h3>
                  <p className="text-sm md:text-base text-stone-400 leading-relaxed">{step.desc}</p>
                  {idx < 2 && (
                    <div className="hidden lg:block absolute top-10 left-[calc(50%+60px)] w-full h-px bg-white/10" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-16 md:mt-20 bg-white/5 rounded-[30px] md:rounded-[40px] p-6 md:p-12 border border-white/10">
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl md:text-3xl font-display font-extrabold mb-6">Strefa Dostawy</h3>
                  <p className="text-sm md:text-base text-stone-400 mb-8">Dostarczamy na terenie całego miasta. Sprawdź czy Twój adres znajduje się w naszej strefie darmowej dostawy!</p>
                  <div className="space-y-4 inline-block lg:block text-left">
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className="text-green-500 w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                      <span className="text-sm md:text-base">Darmowa dostawa od 50zł</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className="text-green-500 w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                      <span className="text-sm md:text-base">Średni czas dostawy: 28 minut</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className="text-green-500 w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                      <span className="text-sm md:text-base">Możliwość śledzenia zamówienia</span>
                    </div>
                  </div>
                </div>
                <div className="bg-stone-800 rounded-2xl md:rounded-3xl h-48 md:h-64 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
                    alt="Map" 
                    className="w-full h-full object-cover opacity-50"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-primary/20 flex items-center justify-center">
                    <MapPin className="w-10 h-10 md:w-12 md:h-12 text-white animate-bounce" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rezerwacja Section */}
        <section id="rezerwacja" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-stone-50 rounded-[40px] overflow-hidden shadow-xl flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-12">
                <h2 className="text-4xl font-display font-extrabold text-stone-900 mb-6">Zarezerwuj Stolik</h2>
                <p className="text-stone-500 mb-8">Planujesz spotkanie z przyjaciółmi lub rodzinny obiad? Zarezerwuj miejsce u nas!</p>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Imię i Nazwisko" className="w-full px-6 py-4 rounded-xl bg-white border border-stone-200 focus:border-brand-primary outline-none transition-all" />
                    <input type="tel" placeholder="Numer Telefonu" className="w-full px-6 py-4 rounded-xl bg-white border border-stone-200 focus:border-brand-primary outline-none transition-all" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="date" className="w-full px-6 py-4 rounded-xl bg-white border border-stone-200 focus:border-brand-primary outline-none transition-all" />
                    <input type="time" className="w-full px-6 py-4 rounded-xl bg-white border border-stone-200 focus:border-brand-primary outline-none transition-all" />
                  </div>
                  <select className="w-full px-6 py-4 rounded-xl bg-white border border-stone-200 focus:border-brand-primary outline-none transition-all">
                    <option>Liczba osób</option>
                    <option>1-2 osoby</option>
                    <option>3-4 osoby</option>
                    <option>5-8 osób</option>
                    <option>Więcej (kontakt telefoniczny)</option>
                  </select>
                  <button className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-primary/90 transition-all">Potwierdź Rezerwację</button>
                </form>
              </div>
              <div className="lg:w-1/2 relative min-h-[400px]">
                <img 
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800" 
                  alt="Restaurant" 
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Galeria Section */}
        <section id="galeria" className="py-16 md:py-20 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-stone-900 mb-4">Nasza Galeria</h2>
              <p className="text-stone-500 max-w-2xl mx-auto">Zobacz jak powstaje nasza pizza i jak wygląda nasza restauracja.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {[
                "https://images.unsplash.com/photo-1574129624864-3870513a5d61?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1511688855354-1261f4794c44?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1571997478779-2adcbbe9bb2f?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1593504049359-74330189a355?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=400"
              ].map((img, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="aspect-square rounded-xl md:rounded-2xl overflow-hidden shadow-md"
                >
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Kontakt Section */}
        <section id="kontakt" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-5xl font-display font-extrabold text-stone-900 mb-8 md:mb-12">Skontaktuj się z nami</h2>
                <div className="space-y-6 md:space-y-8 inline-block lg:block text-left">
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="bg-brand-primary/10 p-3 md:p-4 rounded-xl md:rounded-2xl">
                      <MapPin className="text-brand-primary w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-base md:text-lg mb-1">Nasza Lokalizacja</h4>
                      <p className="text-sm md:text-base text-stone-500">ul. Pizza 123, 00-001 Warszawa</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="bg-brand-primary/10 p-3 md:p-4 rounded-xl md:rounded-2xl">
                      <Phone className="text-brand-primary w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-base md:text-lg mb-1">Telefon</h4>
                      <p className="text-sm md:text-base text-stone-500">+48 123 456 789</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="bg-brand-primary/10 p-3 md:p-4 rounded-xl md:rounded-2xl">
                      <Clock className="text-brand-primary w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-base md:text-lg mb-1">Godziny Otwarcia</h4>
                      <p className="text-sm md:text-base text-stone-500">Pon - Nd: 10:00 - 23:00</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-stone-50 p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-sm">
                <h3 className="text-xl md:text-2xl font-display font-bold text-stone-900 mb-6">Wyślij wiadomość</h3>
                <form className="space-y-4">
                  <input type="text" placeholder="Imię" className="w-full px-5 py-3 md:px-6 md:py-4 rounded-xl bg-white border border-stone-200 focus:border-brand-primary outline-none transition-all text-sm md:text-base" />
                  <input type="email" placeholder="Email" className="w-full px-5 py-3 md:px-6 md:py-4 rounded-xl bg-white border border-stone-200 focus:border-brand-primary outline-none transition-all text-sm md:text-base" />
                  <textarea placeholder="Wiadomość" rows={4} className="w-full px-5 py-3 md:px-6 md:py-4 rounded-xl bg-white border border-stone-200 focus:border-brand-primary outline-none transition-all resize-none text-sm md:text-base"></textarea>
                  <button className="w-full bg-stone-900 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/10">Wyślij</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-white pt-16 md:pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-16">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2 mb-6 justify-center sm:justify-start">
                <div className="bg-brand-primary p-2 rounded-xl">
                  <PizzaIcon className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-display font-extrabold tracking-tight">
                  PIZZA<span className="text-brand-primary">FAST</span>
                </span>
              </div>
              <p className="text-stone-400 max-w-sm mb-8 text-center sm:text-left mx-auto sm:mx-0">
                Najlepsza pizza w mieście z dostawą w 30 minut. Poczuj smak prawdziwej Italii w swoim domu.
              </p>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-display font-bold mb-6">Szybkie Linki</h4>
              <ul className="space-y-4 text-stone-400">
                <li><a href="#" className="hover:text-brand-primary transition-colors">Start</a></li>
                <li><a href="#promocje" className="hover:text-brand-primary transition-colors">Promocje</a></li>
                <li><a href="#menu" className="hover:text-brand-primary transition-colors">Menu</a></li>
                <li><a href="#dostawa" className="hover:text-brand-primary transition-colors">Dostawa</a></li>
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-display font-bold mb-6">Informacje</h4>
              <ul className="space-y-4 text-stone-400">
                <li><a href="#rezerwacja" className="hover:text-brand-primary transition-colors">Rezerwacja</a></li>
                <li><a href="#galeria" className="hover:text-brand-primary transition-colors">Galeria</a></li>
                <li><a href="#kontakt" className="hover:text-brand-primary transition-colors">Kontakt</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Polityka Prywatności</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-stone-500 text-sm text-center md:text-left">© 2026 Pizza Fast. Wszystkie prawa zastrzeżone.</p>
            <div className="flex gap-6">
              <a href="#" className="text-stone-500 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-stone-500 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-stone-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <h2 className="text-2xl font-display font-extrabold text-stone-900 flex items-center gap-2">
                  {checkoutStep === 'cart' && <>Twoje Zamówienie <span className="text-stone-400 text-lg font-medium">({totalItems})</span></>}
                  {checkoutStep === 'checkout' && <>Dane do Dostawy</>}
                  {checkoutStep === 'success' && <>Dziękujemy!</>}
                </h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-stone-500" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6">
                {checkoutStep === 'cart' && (
                  <div className="space-y-6">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center py-20">
                        <div className="bg-stone-100 p-8 rounded-full mb-6">
                          <ShoppingBag className="w-12 h-12 text-stone-300" />
                        </div>
                        <h3 className="text-xl font-display font-bold text-stone-900 mb-2">Twój koszyk jest pusty</h3>
                        <p className="text-stone-500 mb-8">Wygląda na to, że nie dodałeś jeszcze żadnej pizzy.</p>
                        <button 
                          onClick={() => setIsCartOpen(false)}
                          className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold"
                        >
                          Zacznij Zamawiać
                        </button>
                      </div>
                    ) : (
                      cart.map(item => (
                        <div key={item.id} className="flex gap-4">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-20 h-20 rounded-2xl object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-grow">
                            <div className="flex justify-between mb-1">
                              <h4 className="font-bold text-stone-900">{item.name}</h4>
                              <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-red-500">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-brand-primary font-bold mb-3">${item.price}</p>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                              >
                                <Minus className="w-4 h-4 text-stone-600" />
                              </button>
                              <span className="font-bold text-stone-900 min-w-[20px] text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                              >
                                <Plus className="w-4 h-4 text-stone-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {checkoutStep === 'checkout' && (
                  <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-display font-bold text-stone-900 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-brand-primary" /> Dane Kontaktowe
                      </h3>
                      <input 
                        required
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Imię i Nazwisko" 
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-brand-primary outline-none transition-all" 
                      />
                      <input 
                        required
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Numer Telefonu" 
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-brand-primary outline-none transition-all" 
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-display font-bold text-stone-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-primary" /> Adres Dostawy
                      </h3>
                      <input 
                        required
                        type="text" 
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        placeholder="Ulica" 
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-brand-primary outline-none transition-all" 
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          required
                          type="text" 
                          name="house"
                          value={formData.house}
                          onChange={handleInputChange}
                          placeholder="Nr Domu" 
                          className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-brand-primary outline-none transition-all" 
                        />
                        <input 
                          type="text" 
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleInputChange}
                          placeholder="Nr Mieszkania" 
                          className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-brand-primary outline-none transition-all" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          type="text" 
                          name="floor"
                          value={formData.floor}
                          onChange={handleInputChange}
                          placeholder="Piętro" 
                          className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-brand-primary outline-none transition-all" 
                        />
                        <input 
                          type="text" 
                          name="code"
                          value={formData.code}
                          onChange={handleInputChange}
                          placeholder="Kod do domofonu" 
                          className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-brand-primary outline-none transition-all" 
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-display font-bold text-stone-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-brand-primary" /> Metoda Płatności
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { id: 'cash', label: 'Gotówka u kuriera' },
                          { id: 'card', label: 'Karta u kuriera' },
                          { id: 'online', label: 'Płatność online (BLIK/Karta)' }
                        ].map(method => (
                          <label key={method.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === method.id ? 'border-brand-primary bg-brand-primary/5' : 'border-stone-100 hover:border-stone-200'}`}>
                            <input 
                              type="radio" 
                              name="paymentMethod" 
                              value={method.id}
                              checked={formData.paymentMethod === method.id}
                              onChange={handleInputChange}
                              className="w-4 h-4 accent-brand-primary"
                            />
                            <span className="font-medium text-stone-800">{method.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-display font-bold text-stone-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-brand-primary" /> Czas Dostawy
                      </h3>
                      <select 
                        name="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-brand-primary outline-none transition-all appearance-none"
                      >
                        <option value="asap">Jak najszybciej (ok. 30 min)</option>
                        <option value="45min">Za 45 minut</option>
                        <option value="60min">Za 1 godzinę</option>
                        <option value="90min">Za 1.5 godziny</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-display font-bold text-stone-900">Uwagi do zamówienia</h3>
                      <textarea 
                        name="comments"
                        value={formData.comments}
                        onChange={handleInputChange}
                        placeholder="Np. proszę nie używać dzwonka, dziecko śpi..." 
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-brand-primary outline-none transition-all resize-none"
                      ></textarea>
                    </div>
                  </form>
                )}

                {checkoutStep === 'success' && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-green-100 p-8 rounded-full mb-8"
                    >
                      <CheckCircle2 className="w-16 h-16 text-green-600" />
                    </motion.div>
                    <h3 className="text-3xl font-display font-extrabold text-stone-900 mb-4">Zamówienie Przyjęte!</h3>
                    <p className="text-stone-500 mb-8 max-w-xs mx-auto">
                      Twoja pizza już się piecze. Kurier dostarczy ją pod adres: <br />
                      <span className="font-bold text-stone-800">{formData.street} {formData.house}{formData.apartment ? `/${formData.apartment}` : ''}</span>
                    </p>
                    <div className="bg-stone-50 rounded-3xl p-6 w-full mb-8 text-left">
                      <div className="flex justify-between mb-2">
                        <span className="text-stone-500">Numer zamówienia:</span>
                        <span className="font-bold">#PF-{Math.floor(Math.random() * 10000)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-stone-500">Czas dostawy:</span>
                        <span className="font-bold">ok. 30 min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Do zapłaty:</span>
                        <span className="font-bold text-brand-primary">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    <button 
                      onClick={resetCart}
                      className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold text-lg"
                    >
                      Wróć do Menu
                    </button>
                  </div>
                )}
              </div>

              {checkoutStep !== 'success' && cart.length > 0 && (
                <div className="p-6 border-t border-stone-100 bg-stone-50">
                  <div className="flex justify-between mb-2">
                    <span className="text-stone-500">Suma częściowa</span>
                    <span className="font-bold text-stone-900">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-6">
                    <span className="text-stone-500">Dostawa</span>
                    <span className="text-green-600 font-bold">GRATIS</span>
                  </div>
                  <div className="flex justify-between mb-8 pt-4 border-t border-stone-200">
                    <span className="text-xl font-display font-bold text-stone-900">Razem</span>
                    <span className="text-2xl font-display font-extrabold text-brand-primary">${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  {checkoutStep === 'cart' ? (
                    <button 
                      onClick={() => setCheckoutStep('checkout')}
                      className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-brand-primary/20 transition-all"
                    >
                      Przejdź do Płatności
                    </button>
                  ) : (
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setCheckoutStep('cart')}
                        className="flex-1 bg-white border-2 border-stone-200 text-stone-600 py-4 rounded-2xl font-bold"
                      >
                        Wróć
                      </button>
                      <button 
                        form="checkout-form"
                        type="submit"
                        className="flex-[2] bg-brand-primary hover:bg-brand-primary/90 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-brand-primary/20 transition-all"
                      >
                        Zamawiam i Płacę
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
