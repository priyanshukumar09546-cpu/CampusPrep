import React from 'react';
import AuthScreen from './AuthScreen';

/**
 * Professional Desktop/Laptop Sign In Page for ProfessorVirus / CampusPrep
 * Replaces old mobile-style screen with a responsive two-column layout.
 */
export default function SignIn({ onNavigate }) {
  return <AuthScreen initialMode="signin" onNavigate={onNavigate} />;
}
