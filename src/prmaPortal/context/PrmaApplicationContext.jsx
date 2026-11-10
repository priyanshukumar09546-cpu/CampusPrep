import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRMA_DOMAINS } from '../data/prmaDomains';
import { PRMA_BATCHES, PRMA_DURATIONS } from '../data/prmaBatches';
import { PRMA_GOODIES } from '../data/prmaGoodies';

const PrmaApplicationContext = createContext(null);

const STORAGE_KEY = 'prma_internship_app_v1';
const AUTH_KEY = 'prma_user_token_v1';
const USER_KEY = 'prma_user_data_v1';

export function PrmaApplicationProvider({ children }) {
  // Load saved state or use defaults
  const [selectedDomainId, setSelectedDomainId] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).domainId || 'ai-ml';
    } catch {}
    return 'ai-ml';
  });

  const [selectedBatchId, setSelectedBatchId] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).batchId || 'nov-14';
    } catch {}
    return 'nov-14';
  });

  const [selectedDurationId, setSelectedDurationId] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).durationId || '6-weeks';
    } catch {}
    return '6-weeks';
  });

  // Selected Goodies: object mapping goodieId -> { selected, quantity, size }
  const [selectedGoodies, setSelectedGoodies] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && JSON.parse(saved).goodies) return JSON.parse(saved).goodies;
    } catch {}
    // Default: 5 popular goodies pre-selected matching reference screenshot (Tshirt, Bottle, Notebook, ID Card, Stickers)
    return {
      tshirt: { selected: true, quantity: 1, size: 'L' },
      bottle: { selected: true, quantity: 1 },
      notebook: { selected: true, quantity: 1 },
      'id-card': { selected: true, quantity: 1 },
      stickers: { selected: true, quantity: 1 }
    };
  });

  const [studentDetails, setStudentDetails] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && JSON.parse(saved).student) return JSON.parse(saved).student;
    } catch {}
    return {
      fullName: '',
      email: '',
      mobile: '',
      educationLevel: 'Undergraduate (B.Tech / BCA / BSc)',
      college: '',
      course: 'B.Tech',
      branch: 'Computer Science & Engineering',
      gradYear: '2026',
      city: '',
      state: '',
      termsAccepted: true
    };
  });

  const [applicationId, setApplicationId] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && JSON.parse(saved).appId) return JSON.parse(saved).appId;
    } catch {}
    return null;
  });

  const [paymentStatus, setPaymentStatus] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && JSON.parse(saved).paymentStatus) return JSON.parse(saved).paymentStatus;
    } catch {}
    return 'pending'; // pending | success | failed
  });

  // Student Auth
  const [authToken, setAuthToken] = useState(() => {
    try {
      return localStorage.getItem(AUTH_KEY) || null;
    } catch {}
    return null;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        domainId: selectedDomainId,
        batchId: selectedBatchId,
        durationId: selectedDurationId,
        goodies: selectedGoodies,
        student: studentDetails,
        appId: applicationId,
        paymentStatus
      }));
    } catch (e) {
      console.warn('[PRMA State Save Error]', e);
    }
  }, [selectedDomainId, selectedBatchId, selectedDurationId, selectedGoodies, studentDetails, applicationId, paymentStatus]);

  // Derived Objects
  const selectedDomain = PRMA_DOMAINS.find(d => d.id === selectedDomainId) || PRMA_DOMAINS[0];
  const selectedBatch = PRMA_BATCHES.find(b => b.id === selectedBatchId) || PRMA_BATCHES[2];
  const selectedDuration = PRMA_DURATIONS.find(d => d.id === selectedDurationId) || PRMA_DURATIONS[2];

  // Actions
  const toggleGoodie = (goodieId) => {
    setSelectedGoodies(prev => {
      const current = prev[goodieId];
      if (current && current.selected) {
        const copy = { ...prev };
        delete copy[goodieId];
        return copy;
      } else {
        return {
          ...prev,
          [goodieId]: { selected: true, quantity: 1, size: 'L' }
        };
      }
    });
  };

  const updateGoodieQuantity = (goodieId, delta) => {
    setSelectedGoodies(prev => {
      const current = prev[goodieId];
      if (!current) return prev;
      const newQty = Math.max(1, (current.quantity || 1) + delta);
      return {
        ...prev,
        [goodieId]: { ...current, quantity: newQty }
      };
    });
  };

  const updateGoodieSize = (goodieId, size) => {
    setSelectedGoodies(prev => {
      const current = prev[goodieId];
      if (!current) return prev;
      return {
        ...prev,
        [goodieId]: { ...current, size }
      };
    });
  };

  const updateStudentDetails = (fields) => {
    setStudentDetails(prev => ({ ...prev, ...fields }));
  };

  // Calculate Totals
  const calculateTotals = () => {
    const packageFee = selectedDuration.price;
    let goodiesSubtotal = 0;
    const goodiesList = [];

    Object.entries(selectedGoodies).forEach(([gId, config]) => {
      if (config && config.selected) {
        const item = PRMA_GOODIES.find(g => g.id === gId);
        if (item) {
          const qty = config.quantity || 1;
          const cost = item.price * qty;
          goodiesSubtotal += cost;
          goodiesList.push({
            ...item,
            quantity: qty,
            size: config.size || null,
            totalPrice: cost
          });
        }
      }
    });

    const totalPayable = packageFee + goodiesSubtotal;

    return {
      packageFee,
      goodiesSubtotal,
      totalPayable,
      goodiesList,
      goodiesCount: goodiesList.length
    };
  };

  // Generate Unique Application ID
  const generateApplicationId = () => {
    if (applicationId) return applicationId;
    const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newId = `PRMA${datePart}${randomDigits}`;
    setApplicationId(newId);
    return newId;
  };

  // Auth Actions
  const loginUser = (token, user) => {
    setAuthToken(token);
    setCurrentUser(user);
    try {
      localStorage.setItem(AUTH_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {}
  };

  const logoutUser = () => {
    setAuthToken(null);
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {}
  };

  return (
    <PrmaApplicationContext.Provider value={{
      selectedDomain,
      selectedDomainId,
      setSelectedDomainId,
      selectedBatch,
      selectedBatchId,
      setSelectedBatchId,
      selectedDuration,
      selectedDurationId,
      setSelectedDurationId,
      selectedGoodies,
      toggleGoodie,
      updateGoodieQuantity,
      updateGoodieSize,
      studentDetails,
      updateStudentDetails,
      calculateTotals,
      applicationId,
      generateApplicationId,
      paymentStatus,
      setPaymentStatus,
      authToken,
      currentUser,
      loginUser,
      logoutUser
    }}>
      {children}
    </PrmaApplicationContext.Provider>
  );
}

export function usePrmaApplication() {
  const context = useContext(PrmaApplicationContext);
  if (!context) {
    return {
      currentUser: null,
      authToken: null,
      logoutUser: () => {},
      loginUser: () => {},
      selectedDomainId: 'ai-ml',
      selectedDomain: PRMA_DOMAINS[0] || null,
      setSelectedDomainId: () => {},
      selectedBatchId: 'nov-14',
      selectedBatch: PRMA_BATCHES[0] || null,
      setSelectedBatchId: () => {},
      selectedDurationId: '6-weeks',
      selectedDuration: PRMA_DURATIONS[1] || null,
      setSelectedDurationId: () => {},
      selectedGoodies: {},
      toggleGoodie: () => {},
      updateGoodieSize: () => {},
      studentDetails: {},
      updateStudentDetails: () => {},
      calculateTotals: () => ({ basePrice: 0, goodiesPrice: 0, total: 0, itemsCount: 0 }),
      applicationId: '',
      generateApplicationId: () => '',
      paymentStatus: 'idle',
      setPaymentStatus: () => {}
    };
  }
  return context;
}
