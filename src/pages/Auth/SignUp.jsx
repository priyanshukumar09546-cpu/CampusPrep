import React from 'react';
import AuthScreen from './AuthScreen';

/**
 * Professional Desktop/Laptop Sign Up Page for ProfessorVirus / CampusPrep
 * Replaces old mobile-style screen with a responsive two-column layout.
 */
export default function SignUp({ onNavigate }) {
  return <AuthScreen initialMode="signup" onNavigate={onNavigate} />;
}
