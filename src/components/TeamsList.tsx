'use client';
import React from 'react';

interface TeamsListProps {
  title: string;
  teams: string[];
}

const TeamsList = ({ title, teams }: TeamsListProps) => {
  return (
    <div style={{
      backgroundColor: 'rgba(31, 41, 55, 0.8)',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      border: '1px solid rgba(55, 65, 81, 0.5)',
      overflow: 'hidden',
      transform: 'translateZ(0)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        backgroundImage: 'linear-gradient(to right, #eab308, #ca8a04)',
        padding: '1rem',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'white',
          margin: 0
        }}>{title}</h2>
      </div>
      
      <ul style={{
        padding: '1.25rem',
        margin: 0,
        listStyle: 'none'
      }}>
        {teams.map((team, index) => (
          <li 
            key={index}
            style={{
              backgroundColor: 'rgba(55, 65, 81, 0.7)',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease',
              cursor: 'default',
              borderLeft: '4px solid #eab308'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateX(5px)';
              e.currentTarget.style.backgroundColor = 'rgba(75, 85, 99, 0.7)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.7)';
            }}
          >
            <div style={{
              backgroundColor: 'linear-gradient(135deg, #eab308, #ca8a04)',
              background: '#eab308',
              color: 'black',
              fontWeight: 'bold',
              width: '2rem',
              height: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '9999px',
              boxShadow: '0 3px 10px rgba(234, 179, 8, 0.3)'
            }}>
              {index + 1}
            </div>
            <span style={{
              fontWeight: '600',
              color: 'white'
            }}>{team}</span>
          </li>
        ))}
      </ul>
      
      <div style={{
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        padding: '0.75rem',
        textAlign: 'center',
        color: '#eab308',
        fontWeight: '500',
        fontSize: '0.875rem'
      }}>
        Total Teams: {teams.length}
      </div>
    </div>
  );
};

export default TeamsList; 