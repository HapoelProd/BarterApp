import React, { useState } from 'react';

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  children,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div style={{ 
      border: '2px solid #dc2626', 
      borderRadius: '8px', 
      marginBottom: '16px' 
    }}>
      <div
        onClick={toggleExpansion}
        style={{
          padding: '16px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'transparent',
          borderBottom: isExpanded ? '1px solid #dc2626' : 'none'
        }}
      >
        <h3 style={{ 
          color: '#dc2626', 
          margin: 0, 
          fontSize: '1.2rem' 
        }}>
          {title}
        </h3>
        <div style={{
          color: '#dc2626',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          transition: 'transform 0.2s ease'
        }}>
          {isExpanded ? '▲' : '▼'}
        </div>
      </div>
      
      {isExpanded && (
        <div style={{ 
          padding: '24px',
          backgroundColor: 'transparent'
        }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;