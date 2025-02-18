import React from 'react';
import Select from 'react-select';

const TabPanel = ({ tabs, selectedTab, onTabChange }) => {
  const options = tabs.map((tab) => ({ value: tab, label: tab }));

  const handleSelectChange = (selectedOption) => {
    onTabChange(selectedOption.value);
  };

  return (
    <div className="bg-white">
      <div className="block md:hidden p-2">
        <Select
          value={options.find(option => option.value === selectedTab)}
          onChange={handleSelectChange}
          options={options}
          className="w-full"
        />
      </div>
      <div className="hidden md:flex border-b">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`p-2 flex-1 ${selectedTab === tab ? 'border-b-2 border-blue-500' : 'border-b-2 border-transparent'} focus:outline-none`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabPanel;
