import React from "react";

const Breadcrumb = ({ paths }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {paths.map((path, index) => (
          <li key={index} className="inline-flex items-center">
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
            {index === 0 ? (
              <a
                href={path.href}
                className="inline-flex items-center text-sm font-bold text-black hover:text-gray-400"
              >
                <svg
                  className="w-3 h-3 mr-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0L0 10h3v10h4V14h6v6h4V10h3L10 0z" />
                </svg>
                Home
              </a>
            ) : index < paths.length - 1 ? (
              <a
                href={path.href}
                className="inline-flex items-center text-sm font-bold text-black hover:text-gray-400"
              >
                {path.name}
              </a>
            ) : (
              <span className="inline-flex items-center text-sm text-black">
                {path.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
