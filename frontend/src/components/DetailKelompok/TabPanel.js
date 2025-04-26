import React from 'react';
import Select from 'react-select';

const TabPanel = ({ tabs, selectedTab, onTabChange }) => {
  const options = tabs.map((tab) => ({ 
    value: tab, 
    label: tab 
  }));

  const handleSelectChange = (selectedOption) => {
    onTabChange(selectedOption.value);
  };

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: state.isFocused ? '0 0 0 2px #e9d8fd' : 'none',
      '&:hover': {
        borderColor: '#9f7aea'
      },
      minHeight: '40px',
      backgroundColor: 'white',
      width: '100%'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#9f7aea' : 'white',
      color: state.isSelected ? 'white' : '#4a5568',
      '&:hover': {
        backgroundColor: '#f5f3ff',
        color: '#6b46c1'
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#4a5568',
      fontWeight: '500'
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999 // Memastikan dropdown muncul di atas elemen lain
    })
  };

  return (
    <div className="bg-white rounded-t-lg overflow-hidden">
      {/* Mobile Select Dropdown */}
      <div className="block md:hidden p-4">
        <Select
          value={options.find(option => option.value === selectedTab)}
          onChange={handleSelectChange}
          options={options}
          styles={customStyles}
          className="text-sm"
          classNamePrefix="select"
          isSearchable={false}
          menuPortalTarget={document.body} // Ini akan membuat dropdown muncul di luar container
          menuPosition="fixed" // Memastikan posisi dropdown tetap baik
        />
      </div>

      {/* Desktop Tab Bar */}
      <div className="hidden md:flex border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`relative px-6 py-3 text-sm transition-all duration-200 focus:outline-none ${
              selectedTab === tab
                ? 'text-black font-medium bg-purple-50 rounded-md border-t-2 border-r-2 border-l-2 border-purple-300 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
            {selectedTab === tab && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabPanel;