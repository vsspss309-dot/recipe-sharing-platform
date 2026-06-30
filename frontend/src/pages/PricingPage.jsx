import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes } from 'react-icons/fa';
import api from '../utils/api';

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for home cooks starting their culinary journey.',
      price: '$0',
      period: 'forever',
      features: [
        { name: 'Browse all recipes', included: true },
        { name: 'Save up to 10 recipes', included: true },
        { name: 'Basic search filters', included: true },
        { name: 'Meal planning calendar', included: false },
        { name: 'Smart grocery lists', included: false },
        { name: 'Nutritional insights', included: false },
      ],
      buttonText: 'Current Plan',
      buttonVariant: 'outline',
      priceId: null,
    },
    {
      name: 'Pro',
      description: 'Unlock advanced features for a seamless cooking experience.',
      price: isAnnual ? '$5.99' : '$7.99',
      period: 'per month',
      features: [
        { name: 'Browse all recipes', included: true },
        { name: 'Unlimited saved recipes', included: true },
        { name: 'Advanced dietary filters', included: true },
        { name: 'Meal planning calendar', included: true },
        { name: 'Smart grocery lists', included: true },
        { name: 'Nutritional insights', included: false },
      ],
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'primary',
      priceId: isAnnual ? 'price_pro_annual' : 'price_pro_monthly', // Replace with real Stripe IDs
      popular: true,
    },
    {
      name: 'Chef',
      description: 'For culinary professionals looking to monetize their audience.',
      price: isAnnual ? '$14.99' : '$19.99',
      period: 'per month',
      features: [
        { name: 'All Pro features', included: true },
        { name: 'Nutritional insights', included: true },
        { name: 'Publish premium recipes', included: true },
        { name: 'Creator analytics dashboard', included: true },
        { name: 'Custom branded profile', included: true },
        { name: 'Priority support', included: true },
      ],
      buttonText: 'Become a Chef',
      buttonVariant: 'primary',
      priceId: isAnnual ? 'price_chef_annual' : 'price_chef_monthly', // Replace with real Stripe IDs
    },
  ];

  const handleSubscribe = async (priceId) => {
    if (!priceId) return; // Free plan
    try {
      setLoading(true);
      const { data } = await api.post('/stripe/create-checkout-session', { priceId });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session', error);
      alert('Failed to initiate checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Choose the plan that best fits your culinary needs. Upgrade, downgrade, or cancel anytime.
          </motion.p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-12 flex justify-center">
          <div className="relative flex items-center p-1 bg-gray-200 rounded-xl">
            <button
              onClick={() => setIsAnnual(false)}
              className={`relative w-32 py-2 text-sm font-medium rounded-lg transition-colors z-10 ${
                !isAnnual ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`relative w-32 py-2 text-sm font-medium rounded-lg transition-colors z-10 ${
                isAnnual ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Annual billing
            </button>
            <motion.div
              className="absolute w-32 h-8 bg-white rounded-lg shadow-sm"
              initial={false}
              animate={{ x: isAnnual ? '100%' : '0%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
          {isAnnual && (
             <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
               Save up to 25%
             </span>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-12 max-w-lg mx-auto lg:max-w-none">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={`relative flex flex-col rounded-2xl border ${
                plan.popular ? 'border-orange-500 shadow-xl scale-105 z-10 bg-white' : 'border-gray-200 bg-white shadow-sm'
              } p-8`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold tracking-wider uppercase bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-4 text-gray-500 text-sm h-10">{plan.description}</p>
                <div className="mt-6 flex items-baseline text-5xl font-extrabold text-gray-900">
                  {plan.price}
                  <span className="ml-1 text-xl font-medium text-gray-500">/{plan.period}</span>
                </div>
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      {feature.included ? (
                        <FaCheck className="h-4 w-4 text-green-500" />
                      ) : (
                        <FaTimes className="h-4 w-4 text-gray-300" />
                      )}
                    </div>
                    <p className={`ml-3 text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                      {feature.name}
                    </p>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.priceId)}
                disabled={loading || !plan.priceId}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                  plan.buttonVariant === 'primary'
                    ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg'
                    : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading && plan.priceId ? 'Loading...' : plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
