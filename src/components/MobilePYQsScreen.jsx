import React from 'react';
import PYQFilterPortal from './PYQFilterPortal';

// Modern unified MobilePYQsScreen forwarding directly to dynamic database-driven PYQFilterPortal
export default function MobilePYQsScreen(props) {
  return <PYQFilterPortal initialCourse={props.courseKey || 'BTech'} {...props} />;
}
