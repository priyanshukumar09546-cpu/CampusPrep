import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, GripVertical, Check, Plus } from 'lucide-react';
import { SKILLS_MASTER_DATA } from '../data/skillsMasterData';

/**
 * Professional ATS Searchable Multi-Select Skill Component
 * - Searchable dropdown with case-insensitive fast filtering
 * - Multi-select with removable chips
 * - HTML5 drag-and-drop reordering
 * - Keyboard navigation (Up/Down/Enter/Escape)
 * - Click-outside dismissal
 * - No duplicates
 * - Single source of truth: updates resumeData.technicalSkills directly
 */
export default function SearchableSkillsSelector({ technicalSkills = {}, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {Object.entries(SKILLS_MASTER_DATA).map(([catKey, catMeta]) => {
        const selectedList = Array.isArray(technicalSkills[catKey]) ? technicalSkills[catKey] : [];

        const handleCategoryChange = (newList) => {
          onChange(catKey, newList);
        };

        return (
          <SkillCategorySelector
            key={catKey}
            catKey={catKey}
            label={catMeta.label}
            placeholder={catMeta.placeholder}
            masterSkills={catMeta.skills}
            selectedSkills={selectedList}
            onUpdate={handleCategoryChange}
          />
        );
      })}
    </div>
  );
}

function SkillCategorySelector({
  catKey,
  label,
  placeholder,
  masterSkills = [],
  selectedSkills = [],
  onUpdate
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filter skills: case-insensitive match, exclude already selected skills
  const filteredSkills = query.trim()
    ? masterSkills.filter(
        skill =>
          skill.toLowerCase().includes(query.trim().toLowerCase()) &&
          !selectedSkills.includes(skill)
      )
    : masterSkills.filter(skill => !selectedSkills.includes(skill));

  const trimmedQuery = query.trim();
  const canAddCustom =
    trimmedQuery.length > 0 &&
    !selectedSkills.some(s => s.toLowerCase() === trimmedQuery.toLowerCase()) &&
    !filteredSkills.some(s => s.toLowerCase() === trimmedQuery.toLowerCase());

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlight index when query or filtered list changes
  useEffect(() => {
    setHighlightIndex(0);
  }, [query]);

  // Keep highlighted item scrolled into view
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const activeEl = dropdownRef.current.children[highlightIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightIndex, isOpen]);

  // Add skill
  const addSkill = useCallback(
    (skillToAdd) => {
      if (!skillToAdd) return;
      const clean = skillToAdd.trim();
      if (!clean) return;
      if (selectedSkills.some(s => s.toLowerCase() === clean.toLowerCase())) {
        return; // No duplicates
      }
      const updated = [...selectedSkills, clean];
      onUpdate(updated);
      setQuery('');
      setIsOpen(false);
      inputRef.current?.focus();
    },
    [selectedSkills, onUpdate]
  );

  // Remove skill
  const removeSkill = useCallback(
    (indexToRemove) => {
      const updated = selectedSkills.filter((_, idx) => idx !== indexToRemove);
      onUpdate(updated);
      inputRef.current?.focus();
    },
    [selectedSkills, onUpdate]
  );

  // Drag and Drop reordering handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires setting data
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }
    const newItems = [...selectedSkills];
    const [movedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, movedItem);
    setDraggedIndex(null);
    onUpdate(newItems);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    const totalOptions = filteredSkills.length + (canAddCustom ? 1 : 0);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(prev => (prev + 1) % (totalOptions || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(prev => (prev - 1 + totalOptions) % (totalOptions || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex < filteredSkills.length) {
        addSkill(filteredSkills[highlightIndex]);
      } else if (canAddCustom) {
        addSkill(trimmedQuery);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'Backspace' && query === '' && selectedSkills.length > 0) {
      // Remove last skill on backspace in empty search input
      removeSkill(selectedSkills.length - 1);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label
          style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            color: '#4A4036',
            userSelect: 'none'
          }}
        >
          {label}
        </label>
        {selectedSkills.length > 0 && (
          <span style={{ fontSize: '0.68rem', color: '#8C7E72', fontWeight: 600 }}>
            {selectedSkills.length} selected {selectedSkills.length > 1 ? '(drag to reorder)' : ''}
          </span>
        )}
      </div>

      {/* Selected Chips */}
      {selectedSkills.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.35rem',
            marginBottom: '0.15rem',
            alignItems: 'center'
          }}
        >
          {selectedSkills.map((skill, idx) => {
            const isDragging = draggedIndex === idx;
            return (
              <div
                key={`${skill}-${idx}`}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.22rem 0.45rem',
                  backgroundColor: isDragging ? '#EFE9DE' : '#FAF8F5',
                  border: isDragging ? '1px dashed #8B6534' : '1px solid #D8CFC4',
                  borderRadius: '5px',
                  fontSize: '0.73rem',
                  color: '#1C1814',
                  fontWeight: 600,
                  cursor: 'grab',
                  userSelect: 'none',
                  transition: 'all 0.15s ease',
                  opacity: isDragging ? 0.6 : 1,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}
                title="Drag to reorder"
              >
                <GripVertical size={11} color="#A89A8C" style={{ cursor: 'grab' }} />
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSkill(idx);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'none',
                    border: 'none',
                    padding: '1px',
                    marginLeft: '2px',
                    cursor: 'pointer',
                    color: '#8C7E72',
                    borderRadius: '50%',
                    transition: 'color 0.15s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#DC2626')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8C7E72')}
                  title={`Remove ${skill}`}
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            border: isOpen ? '1px solid #8B6534' : '1px solid #DDD3C3',
            borderRadius: '6px',
            padding: '0.42rem 0.6rem',
            boxShadow: isOpen ? '0 0 0 2px rgba(139, 101, 52, 0.12)' : 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s'
          }}
        >
          <Search size={14} color="#8C7E72" style={{ marginRight: '0.45rem', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder={placeholder}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '0.78rem',
              color: '#1C1814',
              backgroundColor: 'transparent',
              padding: 0
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                cursor: 'pointer',
                color: '#8C7E72',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              zIndex: 50,
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8CFC4',
              borderRadius: '6px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
              maxHeight: '190px',
              overflowY: 'auto',
              padding: '0.25rem 0'
            }}
          >
            {filteredSkills.length === 0 && !canAddCustom ? (
              <div
                style={{
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.74rem',
                  color: '#8C7E72',
                  textAlign: 'center'
                }}
              >
                No skills found
              </div>
            ) : (
              <>
                {filteredSkills.map((skill, idx) => {
                  const isHighlighted = idx === highlightIndex;
                  return (
                    <div
                      key={skill}
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent input blur before click
                        addSkill(skill);
                      }}
                      onMouseEnter={() => setHighlightIndex(idx)}
                      style={{
                        padding: '0.38rem 0.75rem',
                        fontSize: '0.76rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: isHighlighted ? '#F5F1EB' : 'transparent',
                        color: isHighlighted ? '#8B6534' : '#1C1814',
                        fontWeight: isHighlighted ? 700 : 500,
                        transition: 'background-color 0.1s'
                      }}
                    >
                      <span>{skill}</span>
                      {isHighlighted && <Check size={12} color="#8B6534" />}
                    </div>
                  );
                })}

                {/* Option to add custom typed skill */}
                {canAddCustom && (
                  <div
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addSkill(trimmedQuery);
                    }}
                    onMouseEnter={() => setHighlightIndex(filteredSkills.length)}
                    style={{
                      padding: '0.38rem 0.75rem',
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      borderTop: filteredSkills.length > 0 ? '1px solid #EFEAE3' : 'none',
                      backgroundColor:
                        highlightIndex === filteredSkills.length ? '#F5F1EB' : '#FCFAF7',
                      color: '#8B6534',
                      fontWeight: 700
                    }}
                  >
                    <Plus size={12} color="#8B6534" />
                    <span>Add custom skill &quot;{trimmedQuery}&quot;</span>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
