import React from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase';

const sampleClasses = [
  {
    name: 'Morning Yoga',
    date: '2024-06-28',
    time: '07:00',
    region: 'maharashtra',
    createdBy: 'manager@example.com'
  },
  {
    name: 'Zumba Dance',
    date: '2024-06-29',
    time: '18:00',
    region: 'gujarat',
    createdBy: 'admin@example.com'
  },
  {
    name: 'Pilates',
    date: '2024-06-30',
    time: '19:30',
    region: 'rajasthan',
    createdBy: 'manager@example.com'
  }
];

const CreateSampleClasses = () => {
  const handleCreateClasses = async () => {
    try {
      const batchPromises = sampleClasses.map(cls =>
        addDoc(collection(db, 'classes'), {
          ...cls,
          createdAt: new Date().toISOString()
        })
      );
      await Promise.all(batchPromises);
      alert('Sample classes added successfully!');
    } catch (error) {
      console.error('Error adding classes:', error);
      alert('Failed to create sample classes.');
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleCreateClasses}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Create Sample Classes
      </button>
    </div>
  );
};

export default CreateSampleClasses;
