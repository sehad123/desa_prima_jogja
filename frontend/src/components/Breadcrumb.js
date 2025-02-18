import React from "react";
import { useNavigate } from "react-router-dom";

const Breadcrumb = ({ items = [] }) => {
  const navigate = useNavigate();

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex flex-wrap items-center space-x-2 md:space-x-3 rtl:space-x-reverse w-full">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {/* Separator */}
            {index > 0 && (
              <svg
                className="rtl:rotate-180 w-3 h-3 text-black mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            )}
            {/* Breadcrumb Item */}
            {item.path ? (
              <button
                onClick={() => navigate(item.path)}
                className={`inline-flex items-center text-xs sm:text-sm md:text-base ${
                  index === 0 ? "font-bold" : "font-medium"
                } text-black hover:text-gray-400`}
                aria-current={index === items.length - 1 ? "page" : undefined}
              >
                {index === 0 && (
                  <svg
                    className="w-3 h-3 mr-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0L0 10h3v10h4V14h6v6h4V10h3L10 0z" />
                  </svg>
                )}
                {item.label}
              </button>
            ) : (
              <span
                className="inline-flex items-center text-xs sm:text-sm md:text-base font-medium text-black"
                aria-current={index === items.length - 1 ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
