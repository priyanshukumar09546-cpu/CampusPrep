import React from 'react';
import PYQFilterPortal from './PYQFilterPortal';

// Modern unified CoursePyqsView forwarding directly to dynamic database-driven PYQFilterPortal
export default function CoursePyqsView(props) {
  return <PYQFilterPortal initialCourse={props.courseKey || 'BTech'} {...props} />;
}
